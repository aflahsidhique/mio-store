# Launch checklist

The store remains blocked from live launch until every required item is confirmed.

## Business and catalogue

- [ ] Legal display name, entity/address, support/grievance contacts and approved social links.
- [ ] GST status/GSTIN, invoice format, tax-inclusive/exclusive decision reviewed by a qualified CA.
- [ ] Real products, SKUs, prices, stock policy, variants, weights, package dimensions, materials, care and limitations.
- [ ] Approved logo/mascot and real product photography with alt text.
- [ ] Production lead times, supported regions, courier rules, rates/free threshold and COD decision.
- [ ] Shipping, returns/refunds, cancellation, privacy and terms approved with professional review.

## Platform and security

- [ ] Production Supabase project migrated; RLS/table grants tested for anon, customer and admin roles.
- [ ] Private `custom-models` bucket and signed-access/retention procedure verified.
- [ ] First admin deliberately bootstrapped, MFA/account recovery considered and admin denial tests passed.
- [ ] Rate limiting and spam controls load-tested in the production topology.
- [ ] Dependency audit reviewed; backups, restore and migration rollback tested.

## Payments, shipping and email

- [ ] Razorpay staging flow passes captured, failed, cancelled, timeout and retry cases.
- [ ] Raw-body webhook signature, event ID deduplication and out-of-order delivery tested.
- [ ] Live keys added only after account activation; no secrets in source/client/logs.
- [ ] Shiprocket pickup, serviceability, shipment creation, AWB, tracking, label and webhook tested on the actual account.
- [ ] Manual shipment fallback and duplicate-shipment prevention tested.
- [ ] Resend domain/DNS verified; transactional templates, plain text and duplicate-send prevention tested.

## Release

- [ ] Replace/remove all demo rows, notices and illustrative prices.
- [ ] Configure `miostudio.in`, canonical `www` behavior, HTTPS, redirects and provider callback URLs.
- [ ] Validate sitemap/robots/structured data and ensure private routes are not indexed.
- [ ] Keyboard/mobile/contrast checks and configured Playwright journey pass.
- [ ] Smoke test one real low-risk order end to end, then monitor payments, webhooks, email and fulfillment.
