# MIO Studio — Complete Ecommerce Build Prompt for OpenAI Codex

> **How to use:** Open the MIO Studio website repository in OpenAI Codex, place this file in the repository root, and tell Codex: **“Read `MIO_STUDIO_CODEX_BUILD_PROMPT.md` completely and implement the project in this repository. Work in phases, run the checks, and keep going without waiting for me unless a real account credential or business decision is required.”**
>
> This is an implementation brief, not a claim that accounts, payments, shipping or production have already been configured.

---

## 1. Your role and overall mission

Act as a senior full-stack engineer, ecommerce architect, product designer and security-conscious technical lead. Build a real, deployable, full-stack ecommerce website for **MIO Studio**, a 3D-printing and product-design business based in **Kozhikode (Calicut), Kerala, India**. The preferred domain is **`miostudio.in`**.

The primary business goal is to sell ready-made 3D-printed products online and provide a professional custom 3D-printing/product-design service. This is a custom-coded website, not a Shopify theme or a static mockup.

### Non-negotiable outcomes

1. A premium, responsive storefront with product discovery, searchable catalogue, product detail pages, variants, cart and checkout.
2. Secure online payments in INR using **Razorpay** as the initial payment provider, including server-side order creation, signature verification, verified webhooks, retry/failure handling and an order/payment reconciliation path.
3. Real product, inventory, customer, order and payment data persisted in a database; no local-storage-only “fake checkout”.
4. A protected admin dashboard to manage products, variants, stock, orders, custom-print enquiries/quotes, shipping/tracking and basic store settings.
5. Shipping and delivery workflow with **Shiprocket integration** designed behind a server-side service adapter. It must support order creation, shipment/AWB details, label or tracking URL where supported, delivery events/webhooks and manual fallback if the Shiprocket account is not configured.
6. A public order-tracking experience that does not expose another customer's personal data.
7. A professional custom-print request workflow where customers can specify a project and securely upload 3D/model files.
8. Transactional email for order confirmation, payment updates, shipment/tracking updates, quote updates and password/login flows as applicable.
9. Store policies, contact details, SEO, accessibility, mobile usability, security controls, tests and deployment documentation.
10. A clear list of account credentials and business information required before going live. **Never invent credentials, real inventory, shipping charges, tax registration, policies or business contact details.**

Do not stop at a design concept. Inspect the repository, make the changes, install dependencies where possible, implement the working flows, run checks and report truthfully what passes and what is blocked by missing external accounts.

---

## 2. Existing project and migration rule

The starter project may currently be a simple React + Vite frontend with `src/main.jsx`, `src/styles.css`, `index.html`, `package.json` and a README. It may include a visual homepage, sample catalogue and local cart. Those elements are only a **frontend starter**; they do not provide secure payments, persistent orders, inventory or shipping.

### First actions

1. Inspect the entire repository: file tree, existing components, styles, package scripts, README, environment files and Git status. Do not overwrite user work blindly.
2. Preserve useful MIO Studio branding, copy, CSS tokens, layout ideas and components wherever reasonable.
3. Choose an architecture that supports secure server-side commerce. Preferred target is **Next.js App Router + TypeScript** for storefront, API/route handlers and admin in one deployable app. Migrate from Vite if that is the cleanest robust route. If the repo already has a capable full-stack framework, retain it rather than migrating unnecessarily.
4. If you migrate, make sure there is one documented, unambiguous development/build workflow. Remove abandoned Vite-only files and dependencies once migration is verified.
5. Create/update `README.md`, `.env.example`, database migrations, seed data, tests and this implementation's status notes.
6. Do not leave important buttons as decoration. Every visible interactive control must work, be explicitly disabled with a reason, or be removed.

If credentials are unavailable, implement the integration and safe test/development path. Do not falsely report that payment, email or courier services are live.

---

## 3. Reference website analysis and what to learn

Study these websites for functional patterns, not for copying their branding, content, products, layout pixel-for-pixel or images:

- **Keep:** https://keepthis.in/
- **Almost Collectibles:** https://almostcollectibles.com/

### Keep — product discovery and gifting

Observed patterns include a category-first navigation, collections, bestseller grids, campaign/collection entry points, product variations, clear product prices, promotions, customer support/contact, and a dedicated order-tracking entry. Its product page uses a multi-image gallery, a selectable variant, a clear add-to-cart action, product details and shipping/returns information.

**Apply to MIO Studio:** intuitive product categories, featured/bestseller collections, useful filters and sorting, variant selection (e.g. filament colour or size), clear availability, a persistent cart, delivery/returns details and visible order tracking.

### Almost Collectibles — utility and design story

Observed patterns include a focused catalogue, prominent product images, sale/regular pricing, product colour choices, feature lists, materials, dimensions, included components, review snippets, a brand story and an invitation for custom ideas.

**Apply to MIO Studio:** explain what each print is for, the material used, size/dimensions, colour/finish, care instructions, print limitations and what arrives in the package. Tell the story of a design and printing studio, not just a list of objects.

### MIO Studio must have its own identity

The design should feel more curated and editorial than a generic marketplace, but still be fast and easy to shop. Do not copy the reference stores' text, product photography, reviews, brand names, illustrations or source code. Do not hotlink their images. Use original assets, user-provided assets or clearly labelled local placeholders until real product photography is supplied.

---

## 4. Brand system and art direction

### Positioning

**MIO Studio — Designed with intent. Made layer by layer.**

MIO Studio creates functional, expressive and personalised products through 3D printing and product design. The business is located in Kozhikode, Kerala and may serve customers throughout India. Keep claims honest; do not claim certifications, sustainability, print tolerances, delivery guarantees, customer counts or manufacturing capabilities that have not been confirmed.

### Visual direction

- Premium minimal, tactile and editorial.
- Primary canvas: warm white / off-white.
- Typography and key text: charcoal / near-black.
- Accent: a confident red-orange, used selectively for primary actions, active states, small labels and highlights.
- Spacious grid, restrained borders, clear hierarchy, clean alignment and strong product photography.
- Use a refined sans-serif system (e.g. Geist/Inter or a suitable licensed web-safe alternative) and a consistent type scale.
- Subtle motion only: short hover transitions, gentle reveals and tasteful cart feedback. Honour `prefers-reduced-motion`.
- Product artwork should feel dimensional and tactile: close-up details, scale, texture, material/colour variants and considered lighting.
- The brand's cat mascot may appear as a small brand accent **if a real approved asset is available**. Do not invent an official logo or use a random mascot as final brand identity.

Create CSS design tokens rather than scattering raw values. Suggested starting tokens (change only when the existing brand assets justify it):

```css
:root {
  --color-canvas: #F7F6F2;
  --color-surface: #FFFFFF;
  --color-ink: #20211E;
  --color-muted: #73736D;
  --color-line: #E4E1D9;
  --color-accent: #F05432;
  --color-accent-hover: #D94729;
  --radius-card: 16px;
  --radius-control: 10px;
  --content-max: 1280px;
}
```

Contrast must meet WCAG AA for normal interface text. The red-orange accent is not automatically suitable for small text on white; test the actual contrast and use a sufficiently dark treatment where necessary.

### Copy direction

Write clear, human, confident copy. Suggested homepage headline: **“Good ideas, made real.”** Supporting line: “Thoughtful objects, custom 3D prints, and product design from our studio in Kozhikode.” Suggested actions: **Shop the collection** and **Start a custom print**. These are starting copy options; maintain a consistent premium tone throughout.

Avoid overused filler such as “revolutionary”, “game-changing” and “cutting-edge”. Do not claim same-day shipping, free shipping or guaranteed delivery until configured and approved.

---

## 5. Recommended technical architecture

Use stable, compatible package versions and record them in the lockfile. Prefer the existing framework only if it can securely support the requirements without unnecessary complexity.

### Application

- Next.js App Router with TypeScript.
- Server Components for data-driven pages where appropriate; Client Components only for interactive UI.
- Tailwind CSS or well-structured CSS modules/custom CSS. Preserve the MIO design tokens and avoid a visually generic template.
- Zod for server-side input validation; React Hook Form may be used for complex forms.
- Use a maintained icon library such as Lucide if needed.
- Use Playwright for end-to-end tests and Vitest/Jest for unit tests if practical.

### Backend and persistence

- **Supabase Postgres** for persistent product, order, customer, inventory, quote and shipping data.
- **Supabase Auth** for customer/admin authentication (support guest checkout regardless of whether customer account creation is enabled).
- **Supabase Storage** for product media and private custom-print uploads.
- Use server-side Supabase clients and cookie-based sessions suitable for the chosen Next.js version.
- Apply least-privilege access and explicit Row Level Security (RLS). Never expose the Supabase `service_role` key to a browser.
- Keep all sensitive operations server-side: payment order creation, signature verification, price calculation, shipping-provider calls, admin mutations and privileged database writes.

### Commerce integrations

- **Payments:** Razorpay Orders API + Razorpay Checkout.
- **Delivery:** Shiprocket API adapter. Integrate rates/serviceability, order/shipment creation, AWB/courier assignment as supported by the account, label/tracking fields and webhook updates. Design a manual-admin fallback.
- **Email:** Resend (or a clean email-provider interface with Resend as the first implementation) for transactional email. Use a verified sending domain in production.
- **Hosting:** Vercel is the default recommended deployment target for a Next.js app; Supabase is the database/auth/storage provider. Keep deployment portable where possible.
- **Analytics:** optional privacy-aware analytics. Do not block core functionality if analytics credentials are absent.

Use official documentation while implementing integrations; SDK/API behavior can change. Useful starting points:

- Supabase + Next.js: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- Supabase SSR auth: https://supabase.com/docs/guides/auth/server-side
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Razorpay developer docs: https://razorpay.com/docs/
- Razorpay signature verification guide: https://razorpay.com/docs/server-integration/python/test-app/
- Razorpay security checklist: https://razorpay.com/security/checklist
- Shiprocket API docs: https://apidocs.shiprocket.in/
- Vercel deployment docs: https://nextjs.org/docs/app/building-your-application/deploying

Do not hard-code assumptions from memory where current official documentation can be checked.

---

## 6. Site map and customer-facing pages

Build complete, connected routes. Exact route naming may be improved but keep the information architecture coherent.

### Storefront

1. `/` — Homepage with announcement bar (only when a real promotion is configured), header, hero, featured collections, curated products, custom printing/service teaser, process explanation, trust/FAQ strip and footer.
2. `/shop` — All products with pagination or load-more, search, category filter, availability filter, colour/material filter if supported, price range and sort (featured, newest, price low/high, best-selling only if true sales data exists).
3. `/collections/[slug]` — Collection/category detail and product grid.
4. `/products/[slug]` — Full product detail page.
5. `/search?q=` — Search results, empty states and suggestions.
6. `/cart` — Cart with quantities, removals, variant summaries, subtotal, estimated shipping/tax where available and transparent next steps.
7. `/checkout` — Address/contact capture, pincode/serviceability, delivery options, order summary, coupon if applicable, final total and Razorpay payment option.
8. `/checkout/success` or equivalent confirmation page — Show success only after the server has verified payment state; if awaiting webhook verification, show a clear pending confirmation state and refresh/poll safely.
9. `/order/[public-token]` or secure order-detail route — Customer-safe order summary and status.
10. `/track-order` — Order lookup using a secure order reference plus verified email/OTP or an unguessable, time-limited tracking token. Never reveal addresses, emails or phone numbers based only on a sequential order ID.
11. `/custom-3d-printing` — Service landing page with supported file types, constraints, a simple process, quote CTA, material/finish options that are actually available and FAQ.
12. `/custom-3d-printing/request` — Custom quote form and secure model upload.
13. `/custom-3d-printing/quote/[token]` — View a quote securely, accept/reject it and proceed to payment when approved.
14. `/about` — MIO Studio story and product-design philosophy. Do not invent founder bio or credentials.
15. `/contact` — Configurable email, WhatsApp, social links, business location text/map link only when approved; working contact form.
16. `/faq` — Shipping, payment, materials, files, customization, care, returns, delays and support.
17. `/policies/shipping`, `/policies/returns-refunds`, `/policies/cancellation`, `/policies/privacy`, `/policies/terms` — Editable and publishable policies.
18. `/account` and `/account/orders` — Optional customer account/order history for authenticated users. Guest checkout and secure guest tracking must continue to work.

### Navigation

Desktop header: MIO Studio brand/logo, Shop, Custom Printing, About, search, account and cart. Mobile: compact accessible menu and cart. Use a small announcement bar only for a verified promotion or service statement. Footer includes collections, service CTA, contact/support, tracking and all policy links.

---

## 7. Homepage content and conversion flow

The homepage should be a real shop entrance, not only a portfolio.

Suggested sections:

1. **Announcement bar:** configurable, dismissible, hidden when no verified message exists.
2. **Header/navigation:** responsive, sticky only if it improves usability.
3. **Hero:** one strong headline, short explanatory line, primary “Shop products” CTA and secondary “Request a custom print” CTA. Use an original visual or approved photography, not reference-store assets.
4. **Shop by category:** for example keychains & personalised gifts, desk accessories, home objects, organisers/practical parts, collectibles and limited drops. Admin must be able to edit categories; don't make these permanent assumptions.
5. **Featured products / bestsellers:** real database data. Do not label products “bestseller” until there is data or an admin explicitly sets the featured status.
6. **Custom printing section:** upload a 3D model, describe an idea, receive a quote, approve it and pay.
7. **Studio value proposition:** thoughtful design, carefully produced prints, colour/material options that are actually offered, and service from Kozhikode.
8. **Process strip:** Choose or upload → Confirm details/quote → Production → Quality check → Dispatch/tracking.
9. **Reviews:** only show real, approved reviews. If none exist, hide the section or label an empty-state preview in development only.
10. **Newsletter:** only if an actual subscription endpoint/provider, consent capture and unsubscribe handling are implemented. Otherwise omit it.
11. **Footer:** full support and legal navigation.

Avoid infinite animation carousels, overwhelming card density, fake countdowns, fake scarcity, unverified star ratings and invented “trusted by thousands” claims.

---

## 8. Product catalogue, product pages and inventory

### Catalogue model

Products must be database-driven, not hard-coded into page components. Each product should support:

- Name, unique slug, SKU, short description and rich description.
- Product type: physical product, made-to-order product or service/quote-only item.
- Category and collection tags.
- Published/draft/archived state, featured flag and optional new/sale label.
- Media gallery: cover image, alternate angles, details, in-use/context photos and optional video.
- Variants: colour, size, finish, pack/bundle or other options as appropriate. Each purchasable variant has a unique SKU, price, optional compare-at price, stock policy and inventory quantity.
- Material (e.g. PLA/PLA+ only if the studio offers it), dimensions, approximate weight, included parts, care/use instructions, finish, lead-time estimate and known limitations.
- Weight and package dimensions used for shipping calculations.
- SEO title/description, alt text and social image.
- Created/updated timestamps.

Use **integer paise** for monetary amounts in the database and calculations. For example, ₹199.00 is 19900 paise. Avoid floating-point money math. Render amounts consistently as INR, e.g. `₹199.00` or a suitable Indian currency format.

### Product cards

Each card should have consistent image framing, useful alt text, name, price, sale price only when real, colour/variant signal when useful, stock state and an easy route to details. Quick add is allowed only when variant choice is unambiguous; otherwise open the product page/variant picker.

### Product detail page

Include:
- Accessible responsive image gallery with thumbnail selection, keyboard controls and sensible mobile behavior.
- Product name, current price, crossed-out price only for an actual discount, availability and expected production/delivery information only when calculable/configured.
- Required variant selectors and stock-aware quantity control.
- Add to cart and a clear status/error response.
- Product benefits, material, dimensions, inclusions, care, made-to-order note and dispatch expectations.
- Shipping/returns link and delivery pincode check when supported by the courier integration.
- Related products from actual catalogue data.
- Verified-purchase reviews only; moderation and abuse prevention required before public display.

### Inventory safety

- Variant stock must be enforced server-side.
- Reserve inventory during checkout only with an explicit short-lived reservation strategy; release expired reservations.
- Deduct/commit stock at the correct successful-payment/order transition; do not rely on the browser.
- Prevent overselling through transactions or safe atomic database updates.
- Log inventory adjustments and require admin permission.
- Support made-to-order products without pretending there is conventional stock.

Seed a small demo catalogue so the interface is testable. **Clearly mark all seed products, photos and prices as illustrative demo content and replace them before launch.** Never imply the listed prices or products are approved by MIO Studio.

---

## 9. Cart and checkout requirements

### Cart

- Persist a guest cart safely in the browser for convenience, but validate all product/variant IDs and prices with the server at checkout.
- Merge guest cart contents into an authenticated customer's cart only if the behavior is implemented carefully.
- Support change quantity, remove, clear cart, update variant and recovery from unavailable/price-changed items.
- Display item counts, item subtotal and checkout CTA.
- Provide polished empty/loading/error states.

### Checkout form

Collect only necessary data:
- Customer name.
- Email and Indian phone number with appropriate validation.
- Delivery address, address line, locality, city, state and six-digit Indian pincode.
- Optional landmark/delivery note.
- Billing address only if different or required.
- Optional consent checkbox for marketing only; it must not be preselected.
- Explicit policy acknowledgement as legally/operationally appropriate.

Use server validation and normalize phone/pincode input. Do not trust client-side total, coupon discount, tax, stock or shipping fee.

### Server-side order calculation

Before creating a payment order, the server must load current products/variants and compute all monetary values itself:

`items subtotal - valid discount + configured shipping + configured taxes/fees = final total`

Persist the calculation, line-item snapshots, address snapshot, currency and configuration/rates used. The customer must see the final total before initiating payment. No surprise fees after payment starts. Do not invent GST registration or tax rates; make tax configuration explicit and disabled/zero only when an authorised business setting says so. Ask for professional verification of tax/legal configuration before launch.

### Checkout states to handle

- Idle, validating, creating order, opening payment, verifying payment, confirmed.
- User closes payment modal.
- Payment failed or was cancelled.
- Network timeout after payment could have succeeded.
- Duplicate submit or duplicate callback.
- Webhook arrives before or after browser callback.
- Payment pending/authorized but not captured.
- Cart contents became unavailable or price changed.
- Courier quote unavailable.

Never mark an order paid based only on the frontend success callback/redirect. Never dispatch until the configured policy says the payment has been verified/captured, or COD is explicitly supported and selected.

---

## 10. Razorpay payment integration — secure implementation

Implement Razorpay in test mode first. Use the official current Node/REST integration documentation.

### Required flow

1. Customer submits checkout.
2. Server authenticates/rate-limits where appropriate, validates inputs, reloads catalogue/stock, calculates the final total, creates a pending internal order and a Razorpay order using server-held credentials.
3. Client opens Razorpay Checkout using only the public key ID and server-created order ID/amount/currency.
4. Server receives the checkout response and verifies the payment signature using the correct HMAC process and secret. Fetch/confirm gateway status or rely on the required combination of verified callback plus webhook according to current Razorpay guidance.
5. Webhook endpoint validates the Razorpay webhook signature against the **raw request body** with the dedicated webhook secret before processing any event.
6. Payment/order status transitions run idempotently, in a database transaction or equivalent safe pattern.
7. Send the order-confirmation email only after the order state is valid; do not send duplicate confirmations when events are retried.
8. Reconcile cases where browser and webhook messages arrive late, duplicated or out of order.

### Required safety controls

- Secret key and webhook secret exist only on the server and in production secret settings.
- Never send Razorpay secret values to React/client components, HTML, logs or error messages.
- Store gateway order ID, payment ID, amounts, currency, current status, verified timestamp and webhook event IDs.
- Use the expected internal order ID and expected amount to bind the payment to its order.
- Confirm amount/currency match the persisted internal order before marking paid.
- Use idempotent event processing. Store processed webhook identifiers or another robust deduplication key.
- Verify raw-body signature using the current official procedure. Don't parse and reserialize the JSON before signature validation.
- Verify captured/successful payment state before fulfillment.
- Support customer-facing retry after a payment failure without creating duplicate paid orders or duplicate charges.
- Implement safe refund state changes. If using Razorpay's refund API, keep that secret server-side, record the refund response and never claim a refund is completed until verified.
- Log payment event metadata but never log secrets or unnecessary personal/payment data.

### Provider abstraction

Create a small payment service interface so the app is not irreversibly coupled to one gateway. Razorpay should be the working provider; other providers are not required now. If keys are unavailable, provide a clear local/test mode that cannot be mistaken for a real payment and cannot be enabled in production accidentally.

### Admin payment view

Show internal order number, total, provider IDs, paid/pending/failed/refunded state, timestamps and payment events useful for support. Restrict access to authorised admins.

---

## 11. Shipping, delivery, and tracking — Shiprocket

Implement a server-side `ShippingProvider` adapter, initially for Shiprocket. Consult the official API docs: https://apidocs.shiprocket.in/ .

### Customer experience

- Collect delivery pincode and full address.
- Check whether the destination is serviceable where the provider supports it.
- Obtain available shipping rate/delivery estimate from provider data when supported. Show those values with qualification that estimates can change.
- If live rates are unavailable, use a clearly configured fallback (e.g. fixed configured charge or “confirm shipping after enquiry”) rather than fake real-time data.
- Display the final shipping cost before payment.
- After dispatch, show courier, AWB/tracking number, a safe tracking URL, status and timestamp history.
- Send dispatch and meaningful tracking updates by email.

### Admin fulfilment experience

- Paid orders appear in an “Awaiting fulfilment” list.
- Admin can mark production/packing progress, set package weight and dimensions, create a shipment through Shiprocket, assign courier where supported, request pickup, retrieve label/tracking information and mark exceptions.
- Save Shiprocket order ID, shipment ID, AWB, courier, label link, tracking URL, status and sync timestamps where provided.
- Do not expose privileged Shiprocket API credentials or dashboard information to customers.
- Manual shipment creation/tracking fields must remain available if integration credentials are absent or the provider is temporarily unavailable.
- Do not create duplicate shipments for the same order on retries; check existing shipment state and use idempotent logic.

### Webhook integration

- Implement a Shiprocket webhook route for tracking events.
- Validate webhook authentication using the configured secret/token scheme supported by the account. Follow current provider documentation; if the account's configuration does not provide a verifiable signature, use the strongest documented shared-token verification plus payload validation and restrict what an unverified payload can change.
- Return provider-required successful response codes after safe event processing.
- Handle duplicate and out-of-order tracking events.
- Preserve event history and map external courier status labels into a small, documented internal status model.

### Order status model

Use a controlled state machine, not arbitrary status strings entered by the browser. At minimum support:

`pending_payment → paid → processing/production → quality_check → packed → shipped → out_for_delivery → delivered`

Also support `payment_failed`, `cancelled`, `refund_pending`, `refunded`, `shipment_exception` and `on_hold` when appropriate. Some products may not need `production`; some made-to-order products do. Record status history (old status, new status, actor/system source, timestamp and optional note). Validate legal transitions server-side.

Do not assume every courier provides the same states, rates, label flow or delivery estimate. Map provider results through an adapter and provide an admin override with an audit trail.

---

## 12. Custom 3D-printing / product-design quote workflow

This is an important MIO Studio service, not just a contact form.

### Request form fields

- Name, email and phone.
- Request type: print an existing file, modify/design a model, prototype, replacement/functional part, personalised gift, bulk order or “not sure”.
- File uploads for supported formats such as `.stl`, `.3mf`, `.obj`, `.step`, `.stp`, `.iges`/`.igs` when accepted, and reference images such as `.jpg`, `.png`, `.webp` and `.pdf`.
- Maximum file size configurable (start at 50 MB per file unless hosting/account limits require a safer lower cap); display limits clearly.
- Quantity, approximate dimensions, colour/material/finish preference, intended use, deadline, budget range optional, and project description.
- User affirmation that they have the right to submit the files and that unsafe/illegal content will not be manufactured.
- Privacy notice for storing uploaded files and allowing studio review.

### Upload security and privacy

- Store model files in a **private** bucket, not public website storage.
- Validate file size, extension and MIME type on the server; use safe random object names and do not trust the user-supplied filename/path.
- Apply rate limits and spam controls.
- Generate short-lived signed URLs for authorised staff/customer access; never make uploaded models publicly enumerable.
- Do not try to execute or render uploaded files on the server. Treat all uploads as untrusted content.
- Restrict downloadable quote files to authorised staff and the correct customer/secure quote token.
- Configure retention/deletion controls and document the privacy implications.

### Quote workflow

1. Customer submits form and receives a unique quote reference plus email acknowledgement.
2. Admin reviews requirements/files and sets estimated production and delivery details.
3. Admin can ask for more information and record internal notes separate from customer-visible messages.
4. Admin creates a quote with line items, design fee, print fee, finishing, shipping, configured tax/discount, expiration date and final payable amount.
5. Customer opens a secure tokenised quote page and can accept or decline.
6. Accepted quote creates or converts into an order with a snapshot of the approved quote; customer proceeds to Razorpay checkout.
7. After verified payment, order follows the same production/fulfilment/tracking states as product orders.
8. Store quote history and all important state transitions.

No automatic quote calculator is required unless the studio has a verified pricing model. Never claim STL/3MF upload is automatically manufacturable or quote instantly by AI. Mark quotes as manually reviewed until a real pricing/geometry analysis feature exists.

---

## 13. Customer accounts and order lookup

- Allow guest checkout.
- Offer optional customer login/registration using Supabase Auth, preferably email OTP or magic link if it fits the UX and configured mail sending. Support safe logout/session expiry.
- Customers may view their own order history, delivery progress, addresses and quote history only.
- Use RLS plus server-side authorization; hiding a button is not access control.
- For guest tracking, use a cryptographically random, unguessable token or verified email/OTP challenge. Avoid IDOR (insecure direct object reference) risks.
- Do not expose another customer's phone, email, address, quote files or payment data.
- Add rate limits / lockout/backoff for repeated order-lookup attempts.
- Provide account/order empty states and passwordless authentication error handling.

---

## 14. Admin dashboard

Build an actual protected management interface under `/admin`, responsive and usable on a laptop and mobile.

### Admin access

- Admin access must be assigned server-side, using a dedicated `admin_users`/role table or another secure allow-list design. Do not trust a user-editable profile field or client-side metadata to grant admin rights.
- Add a bootstrap method documented in the README (e.g. SQL insert of a verified user ID/email). The first admin must be configured deliberately after Supabase is connected.
- Enforce authorization on every admin page, server action and API route. Add tests for denied access.

### Required modules

1. **Overview:** open orders, paid revenue summary, low-stock variants, unreviewed quote requests, shipments needing attention and recent activity. Label metrics clearly; don't report test payments as real revenue.
2. **Products:** create/edit/archive, publish/draft, category/collection assignment, SEO fields, upload/reorder media, variant management, pricing and inventory.
3. **Orders:** search/filter/order detail, customer/address snapshot, item/variant snapshot, payment history, production status, shipment fields, tracking event history, admin notes and allowed status transitions.
4. **Shipments:** create shipment, enter/update package dimensions, use Shiprocket if configured, save AWB/tracking/label data, manual fallback and exception handling.
5. **Custom requests and quotes:** view files securely, ask customer for details, create/edit quote, send quote email, expire/accept/reject/cancel quote and convert to order.
6. **Customers:** limited necessary data, linked order/quote history, no display of secrets.
7. **Coupons/discounts:** code, fixed/percentage mode, date range, usage limit, minimum order and allowed products/categories if practical. Validate on server.
8. **Reviews:** moderation queue; only verified purchase reviews can be labelled verified. No fabricated reviews.
9. **Store settings:** contact details, currency, announcement bar, shipping free-threshold/flat rates, tax configuration, supported delivery regions, production lead times, COD enable/disable, policies and social links.
10. **Audit log:** record sensitive admin actions and state changes.

### Admin quality

- Destructive actions require confirmation.
- Forms must validate on client and server.
- Provide loading, saved, error and empty states.
- Do not hard-delete financial/order records casually. Archive products; preserve order/payment snapshots and audit history.
- Require confirmation/reason for refunds, cancellations and manual status overrides.

---

## 15. Data model and database migrations

Design a normalized schema and create versioned SQL migrations committed to the repository. Use foreign keys, indexes, timestamps, uniqueness constraints, check constraints and sensible deletion behavior. Document the relationship diagram in the README or `docs/architecture.md`.

Suggested core tables (names can be refined; don't create pointless tables just to match this list):

- `profiles` — user profile basics linked to Supabase Auth where needed.
- `admin_users` or `user_roles` — trusted roles/permissions, not editable by customers.
- `categories` and `collections` — names, slugs, descriptions, image, sort order, publication status.
- `products` — product content, product type, publication state, SEO and fulfillment attributes.
- `product_variants` — SKU, option values, price in paise, compare-at price, weight/dimensions, stock and made-to-order flags.
- `product_media` — image/video path, alt text, ordering.
- `inventory_movements` and optionally `stock_reservations` — adjustment audit and safe reservation expiry.
- `addresses` — optional saved address per authenticated customer.
- `orders` — unique human-readable public order number, nullable user ID for guests, secure lookup token hash or equivalent, contact/address snapshots, status, currency, monetary totals in paise, timestamps and metadata.
- `order_items` — immutable product/variant/title/SKU/options/price/quantity snapshot for each line item.
- `payments` — order relation, provider, provider order/payment/refund IDs, amount, currency, state, verification/capture timestamps.
- `payment_webhook_events` — provider event ID, event type, processing status/timestamp and safe metadata for deduplication/audit.
- `shipments` and `shipment_events` — external identifiers, courier/AWB, tracking/label URL, normalized status and raw safe event history.
- `custom_quotes` and `quote_items` — request fields, secure file paths, quote amount/expiry/status, customer-facing notes and admin-only notes kept separate.
- `quote_messages` — customer/staff communications, author and visibility flag.
- `coupons` and redemption/use records if coupons ship in v1.
- `reviews` — product, customer/order link, rating, content, moderation state, verified purchase flag.
- `site_settings` — only for safe, non-secret business/configuration values. **Never store API secrets in an admin-editable public settings table.**
- `audit_logs` — admin/system actions.

### Data design rules

- Money is integer paise and currency defaults to INR.
- Snapshot product title, variant/options, SKU and unit price at order time so catalog edits do not change past receipts.
- Store final item subtotal, discount, shipping, tax/fees and total separately and validate their arithmetic.
- Add a unique constraint on provider event IDs or use a safe deduplication key.
- Create indexes on order number, customer ID, status, created time, product slug, SKU, tracking/AWB and quote lookup token hash.
- Keep customer PII private, minimise data retention and avoid returning `select *` of sensitive rows in public endpoints.
- Use explicit state constraints where practical.
- Seed only demo data. Clearly distinguish seed rows from production rows, and never seed fake customer reviews.

### Row Level Security (RLS)

Write migrations that explicitly enable and test RLS for every table exposed through Supabase APIs. Policies must ensure:

- Anonymous visitors can read only published public product/category/collection content and safe public settings.
- Authenticated customers can read/update only their permitted profile data and read only their own orders, addresses, quotes and reviews.
- Guest orders/quotes are not accessible using sequential IDs. Use server-validated secure tokens and narrow server methods.
- Customer roles cannot write admin roles, payment state, shipment state, prices, discounts, stock or audit logs directly.
- Admin data access requires server-verified admin authorization.
- `service_role` is server-only, never placed in a client bundle.

Review table grants as well as RLS policies. Do not assume that enabling RLS alone revokes all permissions.

---

## 16. Transactional email and customer communication

Use a provider interface and Resend implementation if credentials are supplied. Provide polished, branded responsive HTML plus plain-text variants. Emails should use the warm-white, charcoal and red-orange visual identity, readable typography and restrained styling.

Required templates:

- Quote request received.
- Quote needs more information.
- Quote ready to review (secure link and expiry).
- Quote accepted/declined confirmation.
- Order received (only at the correct order state).
- Payment failed/pending guidance where appropriate.
- Order in production/processing where useful.
- Shipment dispatched with courier/AWB/tracking link.
- Delivery completion if a trusted courier event supports it.
- Refund requested/processing/completed based on verified state.
- Contact-form receipt and response notification if supported.

Email rules:

- Never include custom model files as public attachments by default; use secured expiring access only if needed.
- Do not email raw payment secrets or full unnecessary PII.
- Make email jobs idempotent or record sent events to prevent webhook retry spam.
- If email is not configured, show a clear warning in admin/dev and persist the request/order; don't silently pretend an email was sent.
- Marketing email requires appropriate consent and unsubscribe handling; transactional email is separate.

---

## 17. Search, SEO, performance and accessibility

### SEO

- Unique page titles and metadata; canonical URLs; meaningful meta descriptions.
- Open Graph/Twitter cards using approved MIO assets.
- Sitemap and robots rules; do not index admin, account-private, quote-token or order-token pages.
- Product structured data (Product/Offer) only when fields such as price, availability and currency are accurate. Include review/rating schema only for real valid reviews.
- Breadcrumbs and sensible internal linking.
- Clean slugs and graceful 404 pages.
- Avoid duplicate collection/query pages being indexed indiscriminately.

### Performance

- Optimise and appropriately size product images; use Next image optimization or equivalent.
- Lazy-load below-the-fold imagery, but do not delay the main hero unnecessarily.
- Reserve image dimensions to avoid layout shift.
- Minimise client JS and avoid unnecessary animation libraries.
- Use pagination or efficient filtering for larger catalogues.
- Avoid exposing a service-role key or privileged API in bundle source maps.

### Accessibility

- Semantic landmarks/headings, skip link and keyboard-accessible navigation.
- Visible focus indicators and sufficient contrast.
- Labels/error messages connected to inputs.
- Accessible variant selectors, image gallery, cart drawer and modal behavior.
- Announce cart status and form outcomes to assistive technologies.
- Respect reduced-motion setting.
- Ensure touch targets and layouts work on narrow Android screens as well as desktop.

---

## 18. Legal, tax and operational setup for an Indian ecommerce store

Create editable policy pages and an admin checklist, but do not invent legal wording, tax details, business identity or terms and claim they have been lawyer/CA approved.

Before launch the owner must confirm:

- Legal/business display name and any registered entity details.
- Business email, support phone/WhatsApp, and postal/contact address required to display.
- Whether GST is registered, GSTIN (if applicable), invoice format and correct tax settings with a qualified CA.
- Product pricing/tax display rules and whether prices are tax-inclusive.
- Real shipping rates, delivery coverage, handling/production lead times, cutoff times, remote-area rules and free-shipping promotion (if any).
- Cancellation, returns, replacement, damaged-item, refund, made-to-order and custom-file policies.
- Customer privacy/retention and grievance/contact details applicable to the business.
- COD decision, eligibility, extra fraud precautions and cancellation terms if offered.
- Whether each product/design can legally be produced and sold; do not knowingly enable unauthorised IP/counterfeit items.

Provide policy templates with conspicuous TODO markers for unconfirmed facts, and a launch gate so the store can't accidentally publish invented contact/tax details. Recommend legal/CA review before live launch. No need to give legal advice as a substitute for a professional.

---

## 19. Security, reliability and abuse prevention

Treat this as a real production business, not a prototype.

- Validate all user input server-side (Zod or equivalent).
- Add rate limits to login/OTP, checkout/order create, coupon validation, contact, tracking lookup, quote request/file uploads, webhook-sensitive routes where appropriate.
- Add anti-spam protection to public forms where needed.
- Verify authorization server-side for every protected read/write.
- Prevent CSRF where applicable and use secure cookies/session practices.
- Prevent XSS: escape/render user content safely; do not render uploaded filenames or rich text unsanitized.
- Guard against SQL injection (parameterized clients) and mass assignment (explicit allow-listed fields).
- Limit upload type/size, require private file storage for customer models, use random storage paths and signed URLs.
- Avoid logging sensitive address/payment/auth data unnecessarily.
- Use generic public errors and structured server logs without leaking secrets.
- Keep dependency versions supported; review dependency audit warnings and explain unresolved critical issues.
- Add webhook signature validation and idempotency.
- Use DB transactions, unique constraints or atomic operations for payment, stock, order and shipment invariants.
- Never mark an order paid based on client input alone.
- Never expose API secret or Supabase service role key via environment variables prefixed as public.
- Keep `.env*` secrets out of Git. Commit `.env.example` with placeholders only.
- Configure appropriate production security headers and Content Security Policy compatible with checkout, images and payment SDKs.
- Create a backup/migration recovery note before launch.

---

## 20. Environment variables and credentials

Create `.env.example` with safe placeholder names and update README with which service each value belongs to. Keep local `.env.local` untracked. Suggested variables (adapt to the implementation and current provider SDKs):

```bash
# Application
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SITE_NAME="MIO Studio"
STORE_CURRENCY=INR

# Supabase — public URL/key may be browser-visible; service role never is
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Razorpay — KEY ID can be public; secret and webhook secret must be server-only
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Shiprocket — server-only
SHIPROCKET_EMAIL=
SHIPROCKET_PASSWORD=
SHIPROCKET_WEBHOOK_TOKEN=
SHIPROCKET_PICKUP_LOCATION=

# Email provider — server-only except a public sender label if required
RESEND_API_KEY=
EMAIL_FROM=
SUPPORT_EMAIL=

# Store contact/configuration — populate only with owner-approved values
NEXT_PUBLIC_SUPPORT_WHATSAPP=
NEXT_PUBLIC_INSTAGRAM_URL=
ADMIN_BOOTSTRAP_EMAIL=

# Optional security/analytics settings
RATE_LIMIT_REDIS_URL=
RATE_LIMIT_REDIS_TOKEN=
NEXT_PUBLIC_ANALYTICS_ID=
```

This is a starting list. Use the currently supported environment variable names in the code and remove unused entries; do not leave misleading unused configuration. If a rate-limiting store is added, choose a compatible hosted service and document setup; otherwise implement a deployment-appropriate rate limiter and clearly describe its limits. Do not use an in-memory-only rate limiter as if it were reliable across serverless instances.

### Secrets and account setup required before live use

1. Supabase project URL and browser-safe publishable/anon key; server-only service role key if required by the design.
2. Razorpay account activation, test key ID/secret first, webhook endpoint and webhook secret; live keys only after verification and policy approval.
3. Shiprocket account/API access, pickup address/location, configured package defaults, supported origin details and webhook configuration.
4. Resend API key, verified sender domain/from address and DNS records.
5. Vercel (or selected host) project and production environment variables.
6. Domain registrar access to configure `miostudio.in` DNS and HTTPS with the selected host.
7. Owner-approved admin identity and a secure bootstrap procedure.
8. Approved logo/mascot, real product images, final products/SKUs/prices/stock/variants, actual material details and package weights/dimensions.
9. Business contact details, shipping/returns/privacy/cancellation policies, tax/invoice decisions, production lead times, shipping rate/free threshold and COD decision.
10. Optional WhatsApp/Instagram links, analytics provider, CAPTCHA provider and automated courier booking policy.

**Never ask the user to paste a production secret into source code or a public chat.** Provide instructions to add secrets through local untracked environment files and hosting dashboard secret settings. When a credential is missing, continue with a test adapter/mock fixture clearly labelled non-production, and explain exactly how to connect the real service.

---

## 21. Deployment and launch readiness

Default deployment target: Vercel for the Next.js app + Supabase for Postgres/Auth/Storage. Document an alternative only if the repository has a reason to use it.

### Required deployment work

- Add production build/start scripts and configure environment variable documentation.
- Add database migrations and a clear safe way to apply them to a new Supabase project.
- Provide demo seeding that can never run unintentionally against production unless explicitly invoked.
- Configure callback/redirect URLs for Supabase Auth and Razorpay as required.
- Configure Razorpay test/live webhooks with the correct URL and secret.
- Configure Shiprocket webhook URL/token and pickup data.
- Configure email domain DNS records.
- Configure `miostudio.in` and `www` behavior, HTTPS and canonical host.
- Add a health/readiness route that never reveals secrets.
- Add a launch checklist in `docs/LAUNCH_CHECKLIST.md`.
- Confirm that build output doesn't require credentials at build time unnecessarily and that missing integration credentials produce safe feature-unavailable states rather than crashes.

### Rollout plan

1. **Local development:** seeded demo products, fake/demo payment adapter or Razorpay test mode, mocked shipping responses; clear labels for all mock behavior.
2. **Staging:** connected Supabase project, Razorpay test credentials, sandbox/test shipping configuration if available, email test recipient and complete end-to-end tests.
3. **Production readiness:** owner fills real products/policies/contact/tax settings, keys are secured, webhooks verified, backup/migration procedure reviewed, smoke test completed.
4. **Launch:** enable production Razorpay keys and Shiprocket booking only when their settings have been checked; monitor new orders, failed payments, webhook errors, email delivery and fulfilment.

Do not declare the site “live” merely because the code deploys or the domain resolves.

---

## 22. Testing plan and acceptance criteria

Write automated tests for business-critical logic and run them. Add Playwright tests for the main storefront-to-order journey where feasible.

### Required automated checks

- TypeScript typecheck, lint and production build.
- Price calculation uses server-loaded prices and integer paise.
- Checkout rejects client-tampered price, shipping, coupon and total values.
- Invalid/unpublished/out-of-stock products cannot be bought.
- Quantity limits and stock constraints work under concurrent attempts.
- Razorpay signature verification rejects invalid signatures.
- Razorpay webhook signature verification rejects tampering and uses raw bytes/body per current docs.
- Duplicate webhook delivery does not duplicate a payment, order status transition, inventory adjustment or email.
- Order is not paid/fulfilled from a client redirect alone.
- Failed/cancelled/pending payment paths render correct states and allow safe retry.
- Customers cannot read another customer's order/address/quote/file.
- Anonymous order tracking cannot be enumerated with sequential IDs.
- Non-admin users are denied all admin operations server-side.
- Upload rejects dangerous/unexpected extensions, oversized files and invalid inputs; files remain private.
- Shiprocket events are validated, deduplicated and mapped into known statuses; manual fallback still works.
- Quote acceptance snapshots the agreed amount and cannot be silently changed after payment.
- Cart works on mobile and desktop, quantities survive page navigation, stale prices are reconciled at checkout.
- Policy, contact, 404, empty catalogue, loading, validation and error states work.

### Manual acceptance checklist

1. Visitor can browse/search/filter products and view a variant accurately.
2. Visitor adds/updates/removes cart items and sees correct totals.
3. Checkout calculates the final total on the server and initiates Razorpay test checkout.
4. Successful test payment becomes paid only after valid verification and produces one order confirmation.
5. Failed/closed payment does not become paid and provides a safe retry path.
6. Admin can manage a product/variant and that change appears in the storefront.
7. Admin can review an order, update production/dispatch state, attach tracking and communicate it.
8. Customer can track status without seeing another customer's private information.
9. Customer can upload a valid 3D model privately and submit a custom request.
10. Admin can review the request, send a quote and customer can accept/pay it.
11. Shipment webhook or manual tracking update appears on the order page.
12. Mobile pages are usable at narrow widths; navigation, search, gallery, variant picker, checkout and admin tables are responsive.
13. Missing credentials are clearly surfaced as configuration tasks, never silently misrepresented as live integrations.

Use a CI-friendly script such as `npm run check` or equivalent to run lint, typecheck and tests. Ensure production build is separate and documented.

---

## 23. Implementation phases and working protocol

Work independently and sequentially. Do not simply return an implementation plan; execute it in the repository.

### Phase 0 — Audit and design system

- Inspect project and current code.
- Write a short `docs/IMPLEMENTATION_STATUS.md` with the current state, key decisions and phases.
- Preserve/rebuild the MIO design system and shared components.
- Confirm framework decision and project scripts.

### Phase 1 — Full storefront

- Build all public navigation/pages and responsive product discovery.
- Create database schema/types/migrations and demo seed data.
- Implement database-driven product/collection/search detail pages.
- Implement cart and server-calculated totals.
- Add loading/error/empty states and SEO/accessibility foundations.

### Phase 2 — Backend security and customer access

- Configure Supabase server/browser clients, Auth and RLS.
- Build the secure admin role model and protected APIs/actions.
- Add schema validation, rate limits, secure file upload and tracking tokens.

### Phase 3 — Payment and order lifecycle

- Implement Razorpay test integration and verification/webhook flow.
- Build order snapshots, idempotency, safe status transitions and payment retry handling.
- Add confirmation pages and payment/order emails.

### Phase 4 — Shipping and tracking

- Implement Shiprocket adapter and configuration diagnostics.
- Add rate/serviceability flow and configured fallback.
- Add admin shipment creation/manual fields, tracking page and webhook processing.

### Phase 5 — Custom-print quoting and admin

- Complete secure file uploads, quote states, quote pricing, tokenised customer approval/payment flow.
- Complete product/order/quote/settings admin modules.

### Phase 6 — Hardening and launch

- Add remaining tests, policies, production SEO, accessibility/performance pass, deployment docs, `.env.example`, migrations and launch checklist.
- Run all checks and fix issues rather than merely listing them.
- Summarize verified features and remaining account/business blockers.

### Working protocol

- Use small, coherent changes and keep the project buildable between phases.
- After meaningful work, run `npm run lint`, typecheck, tests and build as applicable (or the equivalent scripts if the stack differs).
- If a command fails, inspect and fix the failure. If a failure is caused by a missing secret or external account, separate that clearly from code failures.
- Add code comments only when they clarify non-obvious logic or security invariants.
- Do not use generated fake customer data in production. Demo fixtures must be visibly designated and easy to remove.
- Do not leave `TODO` markers for core payment/security/order logic. TODOs are acceptable for owner-supplied factual content/credentials and must be documented.
- Do not claim unexecuted tests passed or claim a real provider integration is verified if credentials were missing.
- If scope is larger than a single run, complete a coherent vertical slice first (catalog → cart → server checkout/order → test payment verification) and continue to the next phase, keeping an exact status log. Do not stop after creating a non-functional wireframe.

---

## 24. Expected repository deliverables

By the end, the repository should contain the equivalent of:

```text
app/ or src/app/                # routes, layouts, pages, API/route handlers
components/                     # storefront, product, cart, checkout, admin components
lib/
  auth/                          # server auth and admin authorization
  db/                            # generated database types and data access
  payments/                      # provider interface and Razorpay integration
  shipping/                      # provider interface and Shiprocket integration
  email/                         # transactional email templates/provider
  validation/                    # shared server input schemas
  orders/                        # totals, state machine and order operations
  security/                      # rate limits, tokens, upload safeguards
supabase/
  migrations/                    # versioned database schema/RLS
  seed.sql or seed script        # demo catalogue only; explicit invocation
public/                          # approved logos/placeholders/local static assets
scripts/                         # safe migrations/check/seed utilities
 tests/                           # unit/integration/E2E tests
docs/
  architecture.md
  IMPLEMENTATION_STATUS.md
  LAUNCH_CHECKLIST.md
  OPERATIONS.md
.env.example
.gitignore
README.md
MIO_STUDIO_CODEX_BUILD_PROMPT.md
package.json
```

This is illustrative rather than a rigid file layout. Keep code organised and avoid overengineering.

`README.md` must explain prerequisites, install/dev commands, environment variables, migrations, demo data, tests, creating the first admin, payment test setup, webhook configuration, shipping setup, deployment, domain DNS and production go-live verification.

`docs/OPERATIONS.md` should explain the daily workflow: review quote requests, approve quotes, check paid orders, handle production and quality check, create shipment, update tracking, handle exceptions/cancellations/refunds, and review webhook/email errors.

---

## 25. Final response required from Codex

When implementation work is complete for the current run, report:

1. What was actually built and which routes/features work.
2. Architecture and major design decisions.
3. Database migrations/seeding created and how to run them.
4. Exact commands run and results of lint/typecheck/tests/build, including any failures.
5. Required environment variables grouped by Supabase, Razorpay, Shiprocket, email, hosting/domain and business content.
6. Anything still blocked by missing accounts, credentials, legal/business information or real product assets.
7. Step-by-step local run and staging test instructions.
8. A truthful deployment status: local-only, staging-ready or production-ready; never say production-ready unless checkout, webhook verification, RLS, shipping/tracking and live configuration were tested.

**Start now:** inspect the repository, document the current condition, then implement the highest-value complete working slice. Keep the MIO Studio visual identity premium and minimal while making every core ecommerce flow real, secure, testable and maintainable.


