# Architecture

## Runtime boundaries

The App Router UI and route handlers run through Vinext on Cloudflare Workers for the private Sites preview. Only Web-standard APIs are used in commerce adapters, keeping the app portable to a conventional Next.js/Vercel deployment.

Supabase Postgres is the durable source of truth. Public catalogue reads use the publishable key and RLS. Checkout, payment, tracking, private files and admin work use narrow server-only calls with the service-role key; that key never enters browser code. Critical multi-row operations are database functions with transactions, row locks, uniqueness constraints and explicit grants.

Razorpay, Shiprocket and Resend sit behind small server-only modules. Missing credentials produce an unavailable state rather than a fake success.

## Core checkout sequence

1. Browser sends variant IDs, quantities, contact/address and an idempotency UUID—never trusted prices.
2. `create_checkout_order` locks variants, checks publication/stock, reads approved store settings, calculates integer-paise totals, snapshots line items and creates 20-minute stock reservations.
3. Server creates a Razorpay order for the persisted amount and atomically attaches its ID.
4. Checkout callback HMAC is verified with the server-stored provider order ID. The payment is fetched from Razorpay and must be captured with the expected amount/currency.
5. `confirm_captured_payment` is idempotent, commits stock, records the payment and appends order history. Insufficient stock after an expired reservation moves a captured order to `on_hold` instead of overselling.
6. The webhook repeats the same safe transition using its unique event ID and raw-body signature.

## Data relationship summary

`categories → products → product_variants/product_media`; `orders → order_items/payments/shipments/order_status_history`; variants link to `stock_reservations` and `inventory_movements`; `custom_quotes → quote_files/quote_items/quote_messages`; `admin_users` and `audit_logs` protect operational changes.

Guest order and quote access uses 192-bit random tokens; only SHA-256 hashes are stored. Account order links rotate their token when requested by trusted, authenticated server identity.

## Security invariants

- No client-controlled amount, status, stock, discount, tax or shipping field is authoritative.
- A checkout redirect cannot mark an order paid.
- Provider events are signature-checked and deduplicated.
- Uploaded files are allow-listed, bounded, randomly named and kept in a private bucket.
- Public token views omit contact and address details.
- Admin identity is verified server-side against the bootstrap allow-list or `admin_users`.
- RLS is enabled on every table; grants are explicit.
