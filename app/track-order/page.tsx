import type { Metadata } from "next";
import { TrackingForm } from "@/components/orders/tracking-form";

export const metadata: Metadata = { title: "Track order", robots: { index: false, follow: true } };

export default function TrackOrderPage() {
  return <div className="shell"><header className="page-hero"><p className="eyebrow">Private order tracking</p><h1 className="page-title">Follow the<br />making.</h1><p className="lede">Use the unguessable token from your order confirmation. No address, email or phone data is exposed from an order number alone.</p></header><section className="section-tight" style={{ paddingTop: 0 }}><TrackingForm /></section></div>;
}
