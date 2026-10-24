-- DEMO ONLY. Run manually after the initial migration. Never run automatically against production.
insert into public.categories(id,slug,name,description,sort_order,published) values
('10000000-0000-0000-0000-000000000001','desk-objects','Desk objects','Illustrative seed category',1,true),
('10000000-0000-0000-0000-000000000002','practical-parts','Practical parts','Illustrative seed category',2,true),
('10000000-0000-0000-0000-000000000003','home-objects','Home objects','Illustrative seed category',3,true)
on conflict(slug) do nothing;

insert into public.products(id,category_id,slug,name,sku,short_description,description,kind,state,featured,material,dimensions,included,care,lead_time,limitations,demo) values
('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','arc-desk-tray','Arc desk tray','DEMO-ARC','A calm landing place for small things.','Illustrative seed product; replace before launch.','made_to_order','published',true,'DEMO PLA — confirm before launch','180 × 92 × 24 mm','One illustrative tray','Keep away from high heat.','To be confirmed','Layer lines are natural.',true),
('20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002','orbit-cable-rest','Orbit cable rest','DEMO-ORBIT','A compact cable keeper.','Illustrative seed product; replace before launch.','physical','published',true,'DEMO PLA+ — confirm before launch','54 × 42 × 28 mm','Two illustrative rests','Indoor use only.','To be confirmed','Cable compatibility unverified.',true),
('20000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','nook-phone-stand','Nook phone stand','DEMO-NOOK','A compact folded phone stand.','Illustrative seed product; replace before launch.','physical','published',true,'DEMO PLA — confirm before launch','84 × 76 × 112 mm','One illustrative stand','Use on a level surface.','To be confirmed','Device compatibility unverified.',true),
('20000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000003','stack-mini-planter','Stack mini planter','DEMO-STACK','A layered little vessel.','Illustrative seed product; replace before launch.','made_to_order','published',false,'DEMO PLA — confirm before launch','88 × 88 × 96 mm','One illustrative outer planter','Use a liner.','To be confirmed','Not watertight or food-safe.',true)
on conflict(slug) do nothing;

insert into public.product_variants(id,product_id,sku,name,options,price_paise,stock_quantity,made_to_order) values
('30000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','DEMO-ARC-CLAY','Clay orange','{"colour":"Clay orange","finish":"Matte"}',74900,0,true),
('30000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000001','DEMO-ARC-CHARCOAL','Charcoal','{"colour":"Charcoal","finish":"Matte"}',74900,0,true),
('30000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000002','DEMO-ORB-SAGE','Sage','{"colour":"Sage","finish":"Soft matte"}',29900,12,false),
('30000000-0000-0000-0000-000000000004','20000000-0000-0000-0000-000000000002','DEMO-ORB-SAND','Sand','{"colour":"Sand","finish":"Soft matte"}',29900,8,false),
('30000000-0000-0000-0000-000000000005','20000000-0000-0000-0000-000000000003','DEMO-NOOK-MUS','Mustard','{"colour":"Mustard","finish":"Matte"}',54900,5,false),
('30000000-0000-0000-0000-000000000006','20000000-0000-0000-0000-000000000003','DEMO-NOOK-COR','Coral','{"colour":"Coral","finish":"Matte"}',54900,4,false),
('30000000-0000-0000-0000-000000000007','20000000-0000-0000-0000-000000000004','DEMO-STK-PLM','Dusty plum','{"colour":"Dusty plum","finish":"Layered matte"}',64900,0,true)
on conflict(sku) do nothing;

-- Checkout remains deliberately disabled until the owner approves a rate and tax posture.
insert into public.site_settings(key,value,public_readable) values ('checkout','{"shipping_mode":"disabled","flat_shipping_paise":null,"tax_enabled":false}',false) on conflict(key) do nothing;
