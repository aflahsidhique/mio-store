import type { Metadata } from "next";
import { capabilities } from "@/lib/config";
import { rpc } from "@/lib/db/supabase-rest";

export const metadata: Metadata = { title: "Admin overview", robots: { index: false, follow: false } };
type Metrics = { openOrders: number; paidRevenuePaise: number; lowStockVariants: number; unreviewedQuotes: number };

export default async function AdminPage() {
  let metrics: Metrics | null = null;
  if (capabilities.database) { try { metrics = await rpc<Metrics>("admin_dashboard_metrics", {}); } catch { metrics = null; } }
  return <><p className="eyebrow">Overview</p><h1 className="page-title" style={{ fontSize: "clamp(2.6rem,5vw,5rem)" }}>What needs attention.</h1><p className="lede">Test payments are excluded from real revenue by design.</p><div className="metric-grid section-tight"><article className="metric-card"><span>Open orders</span><strong>{metrics?.openOrders ?? "—"}</strong></article><article className="metric-card"><span>Verified paid revenue</span><strong>{metrics ? `₹${(metrics.paidRevenuePaise / 100).toLocaleString("en-IN")}` : "—"}</strong></article><article className="metric-card"><span>Low-stock variants</span><strong>{metrics?.lowStockVariants ?? "—"}</strong></article><article className="metric-card"><span>Unreviewed quotes</span><strong>{metrics?.unreviewedQuotes ?? "—"}</strong></article></div><section className="form-card"><h2>Integration diagnostics</h2><div className="config-grid">{Object.entries(capabilities).map(([name, enabled]) => <div className="config-item" key={name}><span className={`dot ${enabled ? "ok" : ""}`} /><span>{name}: {enabled ? "configured" : "action required"}</span></div>)}</div></section><section className="form-card" style={{ marginTop: "1rem" }}><h2>Launch gate</h2><p className="status-message error">Live selling must remain disabled until real products, policies, contact/tax settings, Supabase RLS, Razorpay test webhooks, Shiprocket, and email have been configured and tested.</p></section></>;
}
