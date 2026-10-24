import type { Metadata } from "next";
import { QuoteActions } from "@/components/custom/quote-actions";
import { capabilities } from "@/lib/config";
import { formatINR } from "@/lib/commerce/money";
import { rpc } from "@/lib/db/supabase-rest";
import { hashToken } from "@/lib/security/tokens";

export const metadata: Metadata = { title: "Custom quote", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
type Quote = { reference: string; status: string; expiresAt: string | null; totalPaise: number | null; customerNote: string | null; items: Array<{ description: string; amountPaise: number }> };

export default async function QuotePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params; let quote: Quote | null = null;
  if (capabilities.database && /^[a-f0-9]{48}$/i.test(token)) { try { quote = await rpc<Quote | null>("get_public_quote_by_token", { p_token_hash: await hashToken(token) }); } catch { quote = null; } }
  if (!quote) return <div className="shell section"><div className="empty-state"><div><p className="eyebrow">Secure quote</p><h1>Quote unavailable.</h1><p className="muted">This secure link is invalid, expired, or the quote database is not configured.</p></div></div></div>;
  return <div className="shell"><header className="page-hero"><p className="eyebrow">Quote {quote.reference}</p><h1 className="page-title">A plan for<br />your idea.</h1><p className="lede">Status: {quote.status.replaceAll("_", " ")}{quote.expiresAt ? ` · Expires ${new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date(quote.expiresAt))}` : ""}</p></header><div className="checkout-layout section-tight" style={{ paddingTop: 0 }}><section className="form-card"><h2>Studio note</h2><p>{quote.customerNote ?? "No customer-visible note has been added."}</p><QuoteActions token={token} status={quote.status} /></section><aside className="summary-card"><h2>Quote summary</h2>{quote.items.map((item, index) => <div className="summary-row" key={`${item.description}-${index}`}><span>{item.description}</span><span>{formatINR(item.amountPaise)}</span></div>)}<div className="summary-row summary-total"><span>Total</span><span>{quote.totalPaise == null ? "Pending" : formatINR(quote.totalPaise)}</span></div><p className="muted" style={{ fontSize: ".75rem" }}>Acceptance snapshots this amount. Payment begins only after the accepted quote is converted to an order by the secure server workflow.</p></aside></div></div>;
}
