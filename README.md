# MIO Studio commerce

A responsive, security-first ecommerce foundation for MIO Studio, a 3D-printing and product-design business in Kozhikode. The app uses the Next.js App Router API through Vinext so the same source runs in OpenAI Sites/Cloudflare Workers, while Supabase remains the production data, auth and private-file platform described by the brief.

The repository is staging-oriented, not production-ready. Without service credentials it renders a clearly labelled demo catalogue and refuses checkout, contact persistence and file upload instead of simulating a live store.

## What is implemented

- Storefront: home, catalogue search/filter/sort, collections, product details, variants, persistent guest cart and responsive layouts.
- Secure commerce slice: server-loaded prices, Postgres checkout transaction, inventory reservations, Razorpay order creation, callback signature verification, gateway status confirmation and raw-body webhook verification/idempotency.
- Delivery: Shiprocket serviceability adapter, authenticated tracking webhook, normalized shipment events and manual shipment schema/fallback.
- Custom work: private upload validation/storage, quote records, secure quote tokens and accept/decline state.
- Customer safety: unguessable order links, redacted public order view, account-bound order lookup, private admin gate and RLS migrations.
- Operations: admin module shells and diagnostics, policy templates, health endpoint, sitemap/robots, CSP/security headers, tests and launch documentation.

The demo product art, prices, stock and details are illustrative. Replace them before launch.

## Local setup

Requirements: Node.js 22.13+ and npm.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open the local URL printed by the development server. The catalogue works without credentials. Database writes and payment are intentionally unavailable until the corresponding environment variables are supplied.

Run verification:

```bash
npm run check
npm run build
```

## Supabase setup

1. Create a non-production Supabase project.
2. Apply `supabase/migrations/202610240001_initial_commerce.sql` in the SQL editor or through the Supabase CLI.
3. Optionally run `supabase/seed.sql` manually in staging. It is demo-only and never runs from an app/build script.
4. Add the project URL, publishable key and server-only service-role key to local or hosted secrets.
5. Create the first Supabase Auth user, then insert its ID/email into `public.admin_users`. On OpenAI Sites, also set `ADMIN_BOOTSTRAP_EMAIL` to the authenticated Site owner email for the initial server-side gate.
6. Review RLS and grants with Supabase's advisors before staging acceptance.

The checkout setting is seeded as disabled. After the owner approves shipping and tax decisions, update `site_settings.checkout`, for example with an approved flat shipping amount in paise. Never enable a guessed rate.

## Razorpay test setup

1. Use Razorpay **test mode** credentials in secret settings.
2. Configure `POST /api/webhooks/razorpay` as the webhook URL with a dedicated webhook secret.
3. Subscribe at minimum to captured/failed payment events relevant to the account configuration.
4. Run a staging transaction and verify: internal order remains pending on modal close; invalid signatures fail; captured payment produces one inventory movement and one paid transition; duplicate webhook delivery is idempotent.
5. Switch to live credentials only after account activation and the complete launch checklist.

The code follows Razorpay's current requirement to build the callback HMAC from the server-stored order ID plus payment ID, inspect captured status, and verify webhooks against the unparsed request body.

## Shiprocket setup

Add server-only credentials, approved pickup location and origin pincode. Configure `POST /api/webhooks/shiprocket` with the shared token in `SHIPROCKET_WEBHOOK_TOKEN`. Confirm the exact webhook header/token mechanism in the account before enabling automated fulfillment. Manual AWB/courier/tracking fields remain in the schema for fallback.

## Email setup

Create a Resend API key, verify the production sender domain, and set `EMAIL_FROM` plus `SUPPORT_EMAIL`. The provider adapter returns `not_configured` when absent and never claims delivery. Complete template/outbox delivery testing before launch.

## Environment variables

See `.env.example` for the canonical list.

- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- Razorpay: `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`.
- Shiprocket: `SHIPROCKET_EMAIL`, `SHIPROCKET_PASSWORD`, `SHIPROCKET_WEBHOOK_TOKEN`, `SHIPROCKET_PICKUP_LOCATION`, `SHIPROCKET_ORIGIN_PINCODE`.
- Email: `RESEND_API_KEY`, `EMAIL_FROM`, `SUPPORT_EMAIL`.
- App/business: `NEXT_PUBLIC_SITE_URL`, `SITE_NAME`, `STORE_CURRENCY`, approved WhatsApp/Instagram values and `ADMIN_BOOTSTRAP_EMAIL`.

Never commit `.env.local`, service-role keys or provider secrets. For OpenAI Sites, add runtime values through the Sites environment-variable settings. For Vercel, use encrypted project environment variables.

## Deployment

The included `.openai/hosting.json` supports the private OpenAI Sites preview. The same App Router source is portable; the business brief's default production target remains Vercel with Supabase. Before adding `miostudio.in`, confirm the canonical host, `www` redirect, HTTPS, all provider callbacks and the live launch gate.

See [architecture](docs/architecture.md), [implementation status](docs/IMPLEMENTATION_STATUS.md), [operations](docs/OPERATIONS.md), and [launch checklist](docs/LAUNCH_CHECKLIST.md).
