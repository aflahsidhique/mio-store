import type { Metadata } from "next";
import { QuoteRequestForm } from "@/components/custom/quote-request-form";

export const metadata: Metadata = { title: "Request a custom print", robots: { index: false, follow: true } };

export default function QuoteRequestPage() {
  return <div className="shell"><header className="page-hero"><p className="eyebrow">Start a project</p><h1 className="page-title">Tell us what<br />you want to make.</h1><p className="lede">No instant AI quote and no false promises—your request is saved privately for a manual studio review.</p></header><section className="section-tight" style={{ paddingTop: 0, maxWidth: 900 }}><QuoteRequestForm /></section></div>;
}
