-- MIO Studio initial commerce schema. Apply to a new Supabase project, then run the demo seed explicitly.
create extension if not exists pgcrypto;

create type public.product_state as enum ('draft','published','archived');
create type public.product_kind as enum ('physical','made_to_order','quote_only');
create type public.order_state as enum ('pending_payment','payment_failed','paid','processing','production','quality_check','packed','shipped','out_for_delivery','delivered','on_hold','shipment_exception','cancelled','refund_pending','refunded');
create type public.payment_state as enum ('created','authorized','captured','failed','refund_pending','refunded');
create type public.quote_state as enum ('new','reviewing','needs_information','draft','sent','accepted','declined','expired','cancelled','converted');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);
create table public.categories (
  id uuid primary key default gen_random_uuid(), slug text not null unique, name text not null,
  description text, image_path text, sort_order integer not null default 0, published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.collections (
  id uuid primary key default gen_random_uuid(), slug text not null unique, name text not null,
  description text, image_path text, sort_order integer not null default 0, published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.products (
  id uuid primary key default gen_random_uuid(), category_id uuid references public.categories(id) on delete set null,
  slug text not null unique, name text not null, sku text not null unique, short_description text not null, description text not null,
  kind public.product_kind not null default 'physical', state public.product_state not null default 'draft', featured boolean not null default false,
  material text, dimensions text, weight_grams integer check (weight_grams is null or weight_grams > 0), package_length_mm integer, package_width_mm integer, package_height_mm integer,
  included text, care text, finish text, lead_time text, limitations text, seo_title text, seo_description text,
  demo boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.product_collections (product_id uuid references public.products(id) on delete cascade, collection_id uuid references public.collections(id) on delete cascade, primary key(product_id, collection_id));
create table public.product_variants (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique, name text not null, options jsonb not null default '{}'::jsonb,
  price_paise integer not null check (price_paise >= 0), compare_at_paise integer check (compare_at_paise is null or compare_at_paise >= price_paise),
  stock_quantity integer not null default 0 check (stock_quantity >= 0), made_to_order boolean not null default false,
  weight_grams integer check (weight_grams is null or weight_grams > 0), active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index product_variants_product_idx on public.product_variants(product_id);
create table public.product_media (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null, media_type text not null check (media_type in ('image','video')), alt_text text not null,
  sort_order integer not null default 0, created_at timestamptz not null default now()
);
create table public.site_settings (
  key text primary key, value jsonb not null, public_readable boolean not null default false, updated_at timestamptz not null default now()
);
create table public.orders (
  id uuid primary key default gen_random_uuid(), order_number text not null unique, user_id uuid references auth.users(id) on delete set null,
  identity_provider_id text, customer_name text not null, customer_email text not null, customer_phone text not null,
  address_snapshot jsonb not null, status public.order_state not null default 'pending_payment', currency text not null default 'INR' check (currency = 'INR'),
  subtotal_paise integer not null check (subtotal_paise >= 0), discount_paise integer not null default 0 check (discount_paise >= 0),
  shipping_paise integer not null default 0 check (shipping_paise >= 0), tax_paise integer not null default 0 check (tax_paise >= 0), total_paise integer not null check (total_paise >= 0),
  client_idempotency_key uuid not null unique, public_token_hash bytea not null unique, payment_provider text, provider_order_id text unique,
  demo boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), paid_at timestamptz,
  constraint order_total_math check (total_paise = subtotal_paise - discount_paise + shipping_paise + tax_paise)
);
create index orders_email_idx on public.orders(lower(customer_email));
create index orders_user_idx on public.orders(user_id);
create index orders_status_created_idx on public.orders(status, created_at desc);
create table public.order_items (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete restrict,
  product_id uuid references public.products(id) on delete set null, variant_id uuid references public.product_variants(id) on delete set null,
  product_title text not null, variant_name text not null, sku text not null, options jsonb not null default '{}'::jsonb,
  unit_price_paise integer not null check (unit_price_paise >= 0), quantity integer not null check (quantity between 1 and 20),
  line_total_paise integer not null check (line_total_paise = unit_price_paise * quantity)
);
create index order_items_order_idx on public.order_items(order_id);
create table public.stock_reservations (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id) on delete cascade, quantity integer not null check (quantity > 0),
  expires_at timestamptz not null, converted_at timestamptz, released_at timestamptz, unique(order_id, variant_id)
);
create index stock_reservations_active_idx on public.stock_reservations(variant_id, expires_at) where converted_at is null and released_at is null;
create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(), variant_id uuid not null references public.product_variants(id) on delete restrict,
  order_id uuid references public.orders(id) on delete restrict, delta integer not null check (delta <> 0), reason text not null,
  actor_user_id uuid references auth.users(id) on delete set null, created_at timestamptz not null default now()
);
create table public.payments (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete restrict,
  provider text not null, provider_order_id text not null unique, provider_payment_id text unique, provider_refund_id text unique,
  amount_paise integer not null check (amount_paise >= 0), currency text not null default 'INR' check (currency = 'INR'), state public.payment_state not null default 'created',
  verified_at timestamptz, captured_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.payment_webhook_events (
  id uuid primary key default gen_random_uuid(), provider text not null, provider_event_id text not null, event_type text not null,
  processed boolean not null default false, processed_at timestamptz, safe_metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(),
  unique(provider, provider_event_id)
);
create table public.order_status_history (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete restrict,
  old_status public.order_state, new_status public.order_state not null, source text not null, actor_user_id uuid references auth.users(id) on delete set null,
  note text, created_at timestamptz not null default now()
);
create table public.shipments (
  id uuid primary key default gen_random_uuid(), order_id uuid not null unique references public.orders(id) on delete restrict,
  provider text not null default 'manual', provider_order_id text, provider_shipment_id text, awb text unique, courier text,
  label_url text, tracking_url text, status public.order_state not null default 'packed', weight_grams integer,
  package_dimensions jsonb, last_synced_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index shipments_provider_idx on public.shipments(provider_shipment_id);
create table public.shipment_events (
  id uuid primary key default gen_random_uuid(), shipment_id uuid not null references public.shipments(id) on delete cascade,
  provider_event_id text not null, external_status text not null, normalized_status public.order_state, safe_payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(), created_at timestamptz not null default now(), unique(shipment_id, provider_event_id)
);
create table public.custom_quotes (
  id uuid primary key default gen_random_uuid(), reference text not null unique, user_id uuid references auth.users(id) on delete set null,
  customer_name text not null, customer_email text not null, customer_phone text not null, request_type text not null,
  request_details jsonb not null, status public.quote_state not null default 'new', customer_note text, admin_note text,
  currency text not null default 'INR' check (currency = 'INR'), subtotal_paise integer, discount_paise integer not null default 0, shipping_paise integer not null default 0,
  tax_paise integer not null default 0, total_paise integer, expires_at timestamptz, public_token_hash bytea not null unique,
  accepted_snapshot jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index custom_quotes_email_idx on public.custom_quotes(lower(customer_email));
create index custom_quotes_status_idx on public.custom_quotes(status, created_at desc);
create table public.quote_files (
  id uuid primary key default gen_random_uuid(), quote_id uuid not null references public.custom_quotes(id) on delete cascade,
  storage_path text not null unique, original_name text not null, size_bytes bigint not null check (size_bytes > 0), mime_type text not null, created_at timestamptz not null default now()
);
create table public.quote_items (
  id uuid primary key default gen_random_uuid(), quote_id uuid not null references public.custom_quotes(id) on delete cascade,
  description text not null, amount_paise integer not null check (amount_paise >= 0), sort_order integer not null default 0
);
create table public.quote_messages (
  id uuid primary key default gen_random_uuid(), quote_id uuid not null references public.custom_quotes(id) on delete cascade,
  author_type text not null check (author_type in ('customer','admin','system')), body text not null, customer_visible boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(), name text not null, email text not null, subject text not null, message text not null,
  state text not null default 'new' check (state in ('new','in_progress','resolved','spam')), created_at timestamptz not null default now()
);
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(), actor_user_id uuid references auth.users(id) on delete set null,
  actor_email text, action text not null, entity_type text not null, entity_id text, old_value jsonb, new_value jsonb, note text, created_at timestamptz not null default now()
);
create table public.rate_limits (key_hash bytea primary key, window_started_at timestamptz not null, attempts integer not null check (attempts >= 0));

-- Explicit RLS: public catalogue reads only; all private commerce access is through narrow SECURITY DEFINER functions called by server-held service credentials.
do $$ declare t text; begin
  foreach t in array array['profiles','admin_users','categories','collections','products','product_collections','product_variants','product_media','site_settings','orders','order_items','stock_reservations','inventory_movements','payments','payment_webhook_events','order_status_history','shipments','shipment_events','custom_quotes','quote_files','quote_items','quote_messages','contact_messages','audit_logs','rate_limits']
  loop execute format('alter table public.%I enable row level security', t); end loop;
end $$;
create policy public_categories on public.categories for select using (published = true);
create policy public_collections on public.collections for select using (published = true);
create policy public_products on public.products for select using (state = 'published');
create policy public_variants on public.product_variants for select using (active and exists (select 1 from public.products p where p.id = product_id and p.state = 'published'));
create policy public_media on public.product_media for select using (exists (select 1 from public.products p where p.id = product_id and p.state = 'published'));
create policy public_product_collections on public.product_collections for select using (exists (select 1 from public.products p where p.id = product_id and p.state = 'published'));
create policy public_safe_settings on public.site_settings for select using (public_readable = true);
create policy own_profile on public.profiles for select to authenticated using (id = auth.uid());
create policy update_own_profile on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy own_orders on public.orders for select to authenticated using (user_id = auth.uid());
create policy own_order_items on public.order_items for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
create policy own_quotes on public.custom_quotes for select to authenticated using (user_id = auth.uid());
create policy own_quote_items on public.quote_items for select to authenticated using (exists (select 1 from public.custom_quotes q where q.id = quote_id and q.user_id = auth.uid()));

grant select on public.categories, public.collections, public.products, public.product_collections, public.product_variants, public.product_media to anon, authenticated;
grant select on public.site_settings to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select on public.orders, public.order_items, public.custom_quotes, public.quote_items to authenticated;
revoke all on public.admin_users, public.payments, public.payment_webhook_events, public.inventory_movements, public.stock_reservations, public.audit_logs, public.quote_files, public.rate_limits from anon, authenticated;

insert into storage.buckets(id, name, public, file_size_limit) values ('custom-models','custom-models',false,52428800) on conflict (id) do update set public = false, file_size_limit = 52428800;

create or replace function public.consume_rate_limit(p_key text, p_limit integer, p_window_seconds integer) returns boolean language plpgsql security definer set search_path = public as $$
declare v_hash bytea := digest(p_key, 'sha256'); v_row public.rate_limits%rowtype;
begin
  if p_limit < 1 or p_window_seconds < 1 then return false; end if;
  select * into v_row from public.rate_limits where key_hash = v_hash for update;
  if not found or v_row.window_started_at < now() - make_interval(secs => p_window_seconds) then
    insert into public.rate_limits(key_hash, window_started_at, attempts) values(v_hash, now(), 1)
      on conflict(key_hash) do update set window_started_at = excluded.window_started_at, attempts = 1;
    return true;
  end if;
  if v_row.attempts >= p_limit then return false; end if;
  update public.rate_limits set attempts = attempts + 1 where key_hash = v_hash;
  return true;
end $$;

create or replace function public.create_checkout_order(p_idempotency_key uuid, p_customer jsonb, p_address jsonb, p_lines jsonb) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_order public.orders%rowtype; v_token text; v_subtotal integer; v_shipping integer; v_tax integer := 0; v_settings jsonb; v_line jsonb; v_variant public.product_variants%rowtype; v_product public.products%rowtype; v_quantity integer; v_reserved integer;
begin
  if jsonb_typeof(p_lines) <> 'array' or jsonb_array_length(p_lines) < 1 or jsonb_array_length(p_lines) > 30 then raise exception 'invalid cart'; end if;
  if coalesce(p_customer->>'name','') = '' or coalesce(p_customer->>'email','') = '' or coalesce(p_customer->>'phone','') = '' then raise exception 'invalid customer'; end if;
  select * into v_order from public.orders where client_idempotency_key = p_idempotency_key for update;
  if found then
    v_token := encode(gen_random_bytes(24),'hex');
    update public.orders set public_token_hash = digest(v_token,'sha256'), updated_at = now() where id = v_order.id returning * into v_order;
    return jsonb_build_object('orderId',v_order.id,'orderNumber',v_order.order_number,'publicToken',v_token,'totalPaise',v_order.total_paise,'currency',v_order.currency,'providerOrderId',v_order.provider_order_id);
  end if;
  select value into v_settings from public.site_settings where key = 'checkout';
  if v_settings is null or v_settings->>'shipping_mode' <> 'flat' or (v_settings->>'flat_shipping_paise') is null then raise exception 'shipping configuration unavailable'; end if;
  v_shipping := (v_settings->>'flat_shipping_paise')::integer;
  v_subtotal := 0;
  delete from public.stock_reservations where converted_at is null and released_at is null and expires_at < now();
  for v_line in select * from jsonb_array_elements(p_lines) loop
    v_quantity := (v_line->>'quantity')::integer;
    if v_quantity < 1 or v_quantity > 20 then raise exception 'invalid quantity'; end if;
    select * into v_variant from public.product_variants where id = (v_line->>'variantId')::uuid and active for update;
    if not found then raise exception 'variant unavailable'; end if;
    select * into v_product from public.products where id = v_variant.product_id and state = 'published';
    if not found then raise exception 'product unavailable'; end if;
    if not v_variant.made_to_order then
      select coalesce(sum(quantity),0) into v_reserved from public.stock_reservations where variant_id = v_variant.id and converted_at is null and released_at is null and expires_at >= now();
      if v_variant.stock_quantity - v_reserved < v_quantity then raise exception 'insufficient stock'; end if;
    end if;
    v_subtotal := v_subtotal + v_variant.price_paise * v_quantity;
  end loop;
  if coalesce((v_settings->>'tax_enabled')::boolean,false) then
    if (v_settings->>'tax_rate_basis_points') is null then raise exception 'tax configuration unavailable'; end if;
    v_tax := round(v_subtotal * (v_settings->>'tax_rate_basis_points')::integer / 10000.0);
  end if;
  v_token := encode(gen_random_bytes(24),'hex');
  insert into public.orders(order_number,customer_name,customer_email,customer_phone,address_snapshot,subtotal_paise,shipping_paise,tax_paise,total_paise,client_idempotency_key,public_token_hash,demo)
  values('MIO-'||to_char(now(),'YYMMDD')||'-'||upper(substr(encode(gen_random_bytes(4),'hex'),1,8)),p_customer->>'name',lower(p_customer->>'email'),p_customer->>'phone',p_address,v_subtotal,v_shipping,v_tax,v_subtotal+v_shipping+v_tax,p_idempotency_key,digest(v_token,'sha256'),false) returning * into v_order;
  for v_line in select * from jsonb_array_elements(p_lines) loop
    v_quantity := (v_line->>'quantity')::integer;
    select * into v_variant from public.product_variants where id = (v_line->>'variantId')::uuid;
    select * into v_product from public.products where id = v_variant.product_id;
    insert into public.order_items(order_id,product_id,variant_id,product_title,variant_name,sku,options,unit_price_paise,quantity,line_total_paise)
    values(v_order.id,v_product.id,v_variant.id,v_product.name,v_variant.name,v_variant.sku,v_variant.options,v_variant.price_paise,v_quantity,v_variant.price_paise*v_quantity);
    if not v_variant.made_to_order then insert into public.stock_reservations(order_id,variant_id,quantity,expires_at) values(v_order.id,v_variant.id,v_quantity,now()+interval '20 minutes'); end if;
  end loop;
  insert into public.order_status_history(order_id,new_status,source,note) values(v_order.id,'pending_payment','checkout','Order created; inventory reserved for 20 minutes.');
  return jsonb_build_object('orderId',v_order.id,'orderNumber',v_order.order_number,'publicToken',v_token,'totalPaise',v_order.total_paise,'currency',v_order.currency,'providerOrderId',null);
end $$;

create or replace function public.attach_payment_order(p_order_id uuid,p_provider_order_id text,p_amount_paise integer,p_currency text) returns void language plpgsql security definer set search_path=public as $$
declare v_order public.orders%rowtype; begin select * into v_order from public.orders where id=p_order_id for update; if not found or v_order.total_paise<>p_amount_paise or v_order.currency<>p_currency then raise exception 'payment order mismatch'; end if;
update public.orders set payment_provider='razorpay',provider_order_id=p_provider_order_id,updated_at=now() where id=p_order_id and provider_order_id is null;
insert into public.payments(order_id,provider,provider_order_id,amount_paise,currency) values(p_order_id,'razorpay',p_provider_order_id,p_amount_paise,p_currency) on conflict(provider_order_id) do nothing; end $$;

create or replace function public.get_order_for_payment_verification(p_token_hash text) returns jsonb language sql security definer set search_path=public as $$
select jsonb_build_object('id',id,'providerOrderId',provider_order_id,'totalPaise',total_paise,'currency',currency) from public.orders where public_token_hash=decode(p_token_hash,'hex') limit 1;
$$;

create or replace function public.confirm_captured_payment(p_order_id uuid,p_provider_payment_id text,p_amount_paise integer,p_currency text,p_source text) returns text language plpgsql security definer set search_path=public as $$
declare v_order public.orders%rowtype; v_item record; v_short boolean:=false;
begin select * into v_order from public.orders where id=p_order_id for update; if not found or v_order.total_paise<>p_amount_paise or v_order.currency<>p_currency then raise exception 'captured payment mismatch'; end if;
update public.payments set provider_payment_id=coalesce(provider_payment_id,p_provider_payment_id),state='captured',verified_at=coalesce(verified_at,now()),captured_at=coalesce(captured_at,now()),updated_at=now() where order_id=p_order_id;
if v_order.status in ('paid','processing','production','quality_check','packed','shipped','out_for_delivery','delivered') then return v_order.status::text; end if;
for v_item in select oi.variant_id,oi.quantity,pv.made_to_order,pv.stock_quantity from public.order_items oi join public.product_variants pv on pv.id=oi.variant_id where oi.order_id=p_order_id for update of pv loop
  if not v_item.made_to_order then
    if v_item.stock_quantity < v_item.quantity then v_short:=true;
    else update public.product_variants set stock_quantity=stock_quantity-v_item.quantity,updated_at=now() where id=v_item.variant_id;
      insert into public.inventory_movements(variant_id,order_id,delta,reason) values(v_item.variant_id,p_order_id,-v_item.quantity,'captured_payment'); end if;
  end if;
end loop;
update public.stock_reservations set converted_at=now() where order_id=p_order_id and converted_at is null;
update public.orders set status=case when v_short then 'on_hold'::public.order_state else 'paid'::public.order_state end,paid_at=coalesce(paid_at,now()),updated_at=now() where id=p_order_id;
insert into public.order_status_history(order_id,old_status,new_status,source,note) values(p_order_id,v_order.status,case when v_short then 'on_hold'::public.order_state else 'paid'::public.order_state end,p_source,case when v_short then 'Captured payment requires manual stock resolution.' else 'Payment captured and inventory committed.' end);
return case when v_short then 'on_hold' else 'paid' end; end $$;

create or replace function public.process_razorpay_event(p_event_id text,p_event_type text,p_provider_order_id text,p_provider_payment_id text,p_amount_paise integer,p_currency text,p_payment_status text,p_captured boolean) returns void language plpgsql security definer set search_path=public as $$
declare v_order public.orders%rowtype; begin
insert into public.payment_webhook_events(provider,provider_event_id,event_type,safe_metadata) values('razorpay',p_event_id,p_event_type,jsonb_build_object('paymentId',p_provider_payment_id,'status',p_payment_status)) on conflict(provider,provider_event_id) do nothing;
if not found then return; end if;
select * into v_order from public.orders where provider_order_id=p_provider_order_id;
if found and p_captured and p_payment_status='captured' then perform public.confirm_captured_payment(v_order.id,p_provider_payment_id,p_amount_paise,p_currency,'razorpay_webhook');
elsif found and p_payment_status='failed' and v_order.status='pending_payment' then update public.orders set status='payment_failed',updated_at=now() where id=v_order.id; insert into public.order_status_history(order_id,old_status,new_status,source) values(v_order.id,'pending_payment','payment_failed','razorpay_webhook'); end if;
update public.payment_webhook_events set processed=true,processed_at=now() where provider='razorpay' and provider_event_id=p_event_id; end $$;

create or replace function public.get_public_order_by_token(p_token_hash text) returns jsonb language sql security definer set search_path=public as $$
select jsonb_build_object('orderNumber',o.order_number,'status',o.status,'totalPaise',o.total_paise,'currency',o.currency,'createdAt',o.created_at,'courier',s.courier,'trackingNumber',s.awb,'trackingUrl',s.tracking_url,
'items',(select coalesce(jsonb_agg(jsonb_build_object('title',i.product_title,'variantName',i.variant_name,'quantity',i.quantity,'lineTotalPaise',i.line_total_paise) order by i.id),'[]'::jsonb) from public.order_items i where i.order_id=o.id),
'events',(select coalesce(jsonb_agg(jsonb_build_object('status',h.new_status,'occurredAt',h.created_at) order by h.created_at),'[]'::jsonb) from public.order_status_history h where h.order_id=o.id))
from public.orders o left join public.shipments s on s.order_id=o.id where o.public_token_hash=decode(p_token_hash,'hex') limit 1;
$$;

create or replace function public.create_custom_quote_request(p_request_id uuid,p_customer jsonb,p_request jsonb,p_files jsonb) returns jsonb language plpgsql security definer set search_path=public as $$
declare v_quote uuid; v_ref text; v_token text:=encode(gen_random_bytes(24),'hex'); v_file jsonb; begin
v_ref:='MIO-Q-'||to_char(now(),'YYMMDD')||'-'||upper(substr(replace(p_request_id::text,'-',''),1,6));
insert into public.custom_quotes(id,reference,customer_name,customer_email,customer_phone,request_type,request_details,public_token_hash)
values(p_request_id,v_ref,p_customer->>'name',lower(p_customer->>'email'),p_customer->>'phone',p_request->>'requestType',p_request,digest(v_token,'sha256')) returning id into v_quote;
for v_file in select * from jsonb_array_elements(p_files) loop insert into public.quote_files(quote_id,storage_path,original_name,size_bytes,mime_type) values(v_quote,v_file->>'path',v_file->>'originalName',(v_file->>'size')::bigint,v_file->>'mime'); end loop;
return jsonb_build_object('reference',v_ref,'secureToken',v_token); end $$;

create or replace function public.get_public_quote_by_token(p_token_hash text) returns jsonb language sql security definer set search_path=public as $$
select jsonb_build_object('reference',q.reference,'status',q.status,'expiresAt',q.expires_at,'totalPaise',q.total_paise,'customerNote',q.customer_note,'items',(select coalesce(jsonb_agg(jsonb_build_object('description',i.description,'amountPaise',i.amount_paise) order by i.sort_order),'[]'::jsonb) from public.quote_items i where i.quote_id=q.id)) from public.custom_quotes q where q.public_token_hash=decode(p_token_hash,'hex') limit 1;
$$;
create or replace function public.act_on_quote(p_token_hash text,p_action text) returns jsonb language plpgsql security definer set search_path=public as $$
declare v_quote public.custom_quotes%rowtype; v_new public.quote_state; begin select * into v_quote from public.custom_quotes where public_token_hash=decode(p_token_hash,'hex') for update; if not found or v_quote.status<>'sent' or (v_quote.expires_at is not null and v_quote.expires_at<now()) then raise exception 'quote unavailable'; end if; v_new:=case when p_action='accept' then 'accepted'::public.quote_state when p_action='decline' then 'declined'::public.quote_state else null end; if v_new is null then raise exception 'invalid action'; end if; update public.custom_quotes set status=v_new,accepted_snapshot=case when v_new='accepted' then jsonb_build_object('items',(select jsonb_agg(to_jsonb(i)) from public.quote_items i where i.quote_id=v_quote.id),'totalPaise',v_quote.total_paise,'acceptedAt',now()) else accepted_snapshot end,updated_at=now() where id=v_quote.id; return jsonb_build_object('status',v_new); end $$;

create or replace function public.create_contact_message(p_name text,p_email text,p_subject text,p_message text) returns void language sql security definer set search_path=public as $$ insert into public.contact_messages(name,email,subject,message) values(p_name,lower(p_email),p_subject,p_message); $$;
create or replace function public.is_admin_email(p_email text) returns boolean language sql security definer set search_path=public as $$ select exists(select 1 from public.admin_users where lower(email)=lower(p_email)); $$;
create or replace function public.admin_dashboard_metrics() returns jsonb language sql security definer set search_path=public as $$ select jsonb_build_object('openOrders',(select count(*) from public.orders where status not in ('delivered','cancelled','refunded')),'paidRevenuePaise',(select coalesce(sum(total_paise),0) from public.orders where paid_at is not null and demo=false),'lowStockVariants',(select count(*) from public.product_variants where active and not made_to_order and stock_quantity<=3),'unreviewedQuotes',(select count(*) from public.custom_quotes where status='new')); $$;
create or replace function public.get_account_orders(p_email text,p_identity_id text) returns jsonb language plpgsql security definer set search_path=public as $$
declare v_result jsonb:='[]'::jsonb; v_order public.orders%rowtype; v_token text; begin
for v_order in select * from public.orders where lower(customer_email)=lower(p_email) order by created_at desc loop v_token:=encode(gen_random_bytes(24),'hex'); update public.orders set public_token_hash=digest(v_token,'sha256'),identity_provider_id=coalesce(identity_provider_id,p_identity_id) where id=v_order.id; v_result:=v_result||jsonb_build_array(jsonb_build_object('orderNumber',v_order.order_number,'publicToken',v_token,'status',v_order.status,'totalPaise',v_order.total_paise,'createdAt',v_order.created_at)); end loop; return v_result; end $$;

create or replace function public.process_shiprocket_event(p_event_id text,p_awb text,p_external_status text,p_occurred_at text,p_safe_payload jsonb) returns void language plpgsql security definer set search_path=public as $$
declare v_shipment public.shipments%rowtype; v_status public.order_state; v_old public.order_state; begin select * into v_shipment from public.shipments where awb=p_awb for update; if not found then raise exception 'shipment not found'; end if;
v_status:=case when lower(p_external_status) like '%delivered%' then 'delivered' when lower(p_external_status) like '%out for delivery%' then 'out_for_delivery' when lower(p_external_status) like '%exception%' or lower(p_external_status) like '%undelivered%' then 'shipment_exception' when lower(p_external_status) like '%shipped%' or lower(p_external_status) like '%transit%' then 'shipped' else null end;
insert into public.shipment_events(shipment_id,provider_event_id,external_status,normalized_status,safe_payload,occurred_at) values(v_shipment.id,p_event_id,p_external_status,v_status,p_safe_payload,coalesce(p_occurred_at::timestamptz,now())) on conflict(shipment_id,provider_event_id) do nothing; if not found or v_status is null then return; end if;
select status into v_old from public.orders where id=v_shipment.order_id for update; if v_old<>v_status then update public.orders set status=v_status,updated_at=now() where id=v_shipment.order_id; update public.shipments set status=v_status,last_synced_at=now(),updated_at=now() where id=v_shipment.id; insert into public.order_status_history(order_id,old_status,new_status,source,note) values(v_shipment.order_id,v_old,v_status,'shiprocket_webhook',p_external_status); end if; end $$;

revoke execute on all functions in schema public from public, anon, authenticated;
grant execute on all functions in schema public to service_role;
