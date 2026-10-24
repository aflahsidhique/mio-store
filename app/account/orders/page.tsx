import type { Metadata } from "next";
import Link from "next/link";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { capabilities } from "@/lib/config";
import { rpc } from "@/lib/db/supabase-rest";
import { formatINR } from "@/lib/commerce/money";

export const metadata: Metadata = { title: "Your orders", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
type AccountOrder = { orderNumber: string; publicToken: string; status: string; totalPaise: number; createdAt: string };

export default async function AccountOrdersPage() {
  const user = await requireChatGPTUser("/account/orders");
  let orders: AccountOrder[] = [];
  if (capabilities.database) { try { orders = await rpc<AccountOrder[]>("get_account_orders", { p_email: user.email.toLowerCase(), p_identity_id: user.userId }); } catch { orders = []; } }
  return <div className="shell"><header className="page-hero"><p className="eyebrow">Private account</p><h1 className="page-title">Your orders.</h1></header><section className="section-tight" style={{ paddingTop: 0 }}>{orders.length ? orders.map((order) => <Link href={`/order/${order.publicToken}`} className="form-card" style={{ display: "flex", justifyContent: "space-between", marginBottom: ".8rem" }} key={order.orderNumber}><span><strong>{order.orderNumber}</strong><br /><span className="muted">{order.status.replaceAll("_", " ")}</span></span><strong>{formatINR(order.totalPaise)}</strong></Link>) : <div className="empty-state"><div><h2>No connected orders.</h2><p className="muted">Orders appear here after Supabase identity mapping is configured.</p><Link className="button button-secondary" href="/shop">Browse the collection</Link></div></div>}</section></div>;
}
