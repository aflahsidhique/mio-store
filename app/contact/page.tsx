import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return <div className="shell"><header className="page-hero"><p className="eyebrow">Contact</p><h1 className="page-title">Let’s talk through it.</h1><p className="lede">For product questions, order support or a project that does not fit the quote form, leave a message here.</p></header><div className="content-grid section-tight" style={{ paddingTop: 0 }}><aside className="prose"><h2>Studio details</h2><p>Kozhikode, Kerala, India</p><p className="policy-todo">Support email, phone/WhatsApp, postal address, hours and map link are intentionally withheld until owner approval.</p></aside><ContactForm /></div></div>;
}
