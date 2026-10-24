export const config = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  siteName: process.env.SITE_NAME ?? "MIO Studio",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET ?? "",
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET ?? "",
  shiprocketEmail: process.env.SHIPROCKET_EMAIL ?? "",
  shiprocketPassword: process.env.SHIPROCKET_PASSWORD ?? "",
  shiprocketWebhookToken: process.env.SHIPROCKET_WEBHOOK_TOKEN ?? "",
  shiprocketPickupLocation: process.env.SHIPROCKET_PICKUP_LOCATION ?? "",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  emailFrom: process.env.EMAIL_FROM ?? "",
  supportEmail: process.env.SUPPORT_EMAIL ?? "",
  adminBootstrapEmail: process.env.ADMIN_BOOTSTRAP_EMAIL ?? "",
};

export const capabilities = {
  database: Boolean(config.supabaseUrl && config.supabaseServiceRoleKey),
  publicCatalog: Boolean(config.supabaseUrl && config.supabaseAnonKey),
  payments: Boolean(config.razorpayKeyId && config.razorpayKeySecret),
  paymentWebhooks: Boolean(config.razorpayWebhookSecret),
  shipping: Boolean(config.shiprocketEmail && config.shiprocketPassword),
  shippingWebhooks: Boolean(config.shiprocketWebhookToken),
  email: Boolean(config.resendApiKey && config.emailFrom),
};
