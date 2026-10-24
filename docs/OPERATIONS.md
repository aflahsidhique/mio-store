# Store operations

## Daily queue

1. Review new custom requests. Open only private signed file links, check rights/safety/manufacturability and keep internal notes separate from customer messages.
2. Prepare quotes with design, print, finish, shipping, discount and approved tax lines. Add an expiry and a clear customer note.
3. Review paid orders. Confirm provider capture and any webhook warnings before production.
4. Move work through processing/production, quality check and packed using legal state transitions. Record reasons for holds or overrides.
5. Create a Shiprocket shipment only once; otherwise enter courier, AWB and tracking through the manual fallback. Verify package weight/dimensions first.
6. Watch shipment exceptions and reconcile provider events that arrive late or out of order.
7. For cancellation/refund requests, record the reason, follow the approved policy, confirm provider state and never mark a refund complete early.
8. Review failed webhooks and email delivery records. Retrying must not duplicate stock, status changes or messages.

## Incident rules

- Payment captured but inventory unavailable: keep order `on_hold`, contact the customer and resolve/refund under approved policy.
- Provider timeout after checkout: do not create another charge blindly; inspect the internal order and Razorpay order/payment first.
- Shiprocket unavailable: use manual fulfillment with audited AWB/tracking fields.
- Email unavailable: keep the order/request persisted, show an admin warning and contact manually without claiming an email was sent.
- Suspected token/file exposure: rotate the token, revoke signed URLs, review logs and follow the approved incident/privacy process.

Back up the database and private storage before risky migrations. Test restore steps in staging, not for the first time during an incident.
