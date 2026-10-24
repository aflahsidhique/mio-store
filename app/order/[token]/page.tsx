import type { Metadata } from "next";
import { capabilities } from "@/lib/config";
import { rpc } from "@/lib/db/supabase-rest";
import { formatINR } from "@/lib/commerce/money";
import { hashToken } from "@/lib/security/tokens";

export const metadata: Metadata = { title: "Order status", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type PublicOrder = { orderNumber: string; status: string; totalPaise: number; currency: string; createdAt: string; courier: string | null; trackingNumber: string | null; trackingUrl: string | null; items: Array<{ title: string; variantName: string; quantity: number; lineTotalPaise: number }>; events: Array<{ status: string; occurredAt: string }> };

export default async function OrderPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  let order: PublicOrder | null = null;
  if (capabilities.database && /^[a-f0-9]{48}$/i.test(token)) {
    try { order = await rpc<PublicOrder | null>("get_public_order_by_token", { p_token_hash: await hashToken(token) }); } catch { order = null; }
  }
  if (!order) return <div className="shell section"><div className="empty-state"><div><p className="eyebrow">Secure order lookup</p><h1>Order unavailable.</h1><p className="muted">The token is invalid, expired, or the database is not configured in this preview.</p></div></div></div>;
  return <div className="shell"><header className="page-hero"><p className="eyebrow">Order {order.orderNumber}</p><h1 className="page-title">{order.status.replaceAll("_", " ")}.</h1><p className="lede">Created {new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date(order.createdAt))}</p></header><div className="checkout-layout section-tight" style={{ paddingTop: 0 }}><section className="form-card"><h2>Progress</h2>{order.events.map((event, index) => <div className="detail-row" key={`${event.status}-${index}`}><strong>{event.status.replaceAll("_", " ")}</strong><span>{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(event.occurredAt))}</span></div>)}{order.trackingNumber && <div className="status-message"><strong>{order.courier ?? "Courier"}</strong><br />AWB {order.trackingNumber}{order.trackingUrl && <> · <a className="text-link" href={order.trackingUrl} rel="noreferrer" target="_blank">Open courier tracking</a></>}</div>}</section><aside className="summary-card"><h2>Order summary</h2>{order.items.map((item, index) => <div className="summary-row" key={`${item.title}-${index}`}><span>{item.title} · {item.variantName} × {item.quantity}</span><span>{formatINR(item.lineTotalPaise)}</span></div>)}<div className="summary-row summary-total"><span>Total</span><span>{formatINR(order.totalPaise)}</span></div><p className="muted" style={{ fontSize: ".75rem" }}>Personal contact and address details are intentionally omitted from this public-token view.</p></aside></div></div>;
}
