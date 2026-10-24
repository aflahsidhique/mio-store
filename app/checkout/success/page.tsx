import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Payment status", robots: { index: false, follow: false } };

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return <div className="shell section"><div className="form-card" style={{ maxWidth: 680, marginInline: "auto", textAlign: "center" }}><p className="eyebrow">Payment received for verification</p><h1 className="section-title" style={{ marginInline: "auto" }}>We’re confirming your order.</h1><p className="lede" style={{ marginInline: "auto" }}>A browser callback alone never marks an order paid. The secure order page reflects the server’s verified payment state, including late webhooks.</p>{token ? <Link className="button button-primary" href={`/order/${encodeURIComponent(token)}`}>View secure order status</Link> : <Link className="button button-secondary" href="/track-order">Track an order</Link>}</div></div>;
}
