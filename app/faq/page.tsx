import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Frequently asked questions" };
const faqs = [
  ["Are these products available now?", "The current catalogue is explicitly demo content. Products, pricing, stock, materials and lead times require owner approval before public launch."],
  ["How does custom printing work?", "Submit a model or project description. The studio reviews it manually, may request details, then prepares a time-limited quote. Uploading a file is not a promise that it can be manufactured."],
  ["Which files can I send?", "The request form accepts STL, 3MF, OBJ, STEP/STP, IGES/IGS and common image/PDF references, up to 50 MB per file and five files per request."],
  ["How is payment confirmed?", "Razorpay creates the payment order. MIO Studio verifies the server signature and captured status; a browser redirect alone never marks an order paid."],
  ["Can I track delivery?", "After dispatch, the secure order page can show courier, AWB, status history and a tracking link. A private token prevents other customers from viewing the order."],
  ["What about returns or cancellations?", "Those rules depend on whether an item is ready-made, personalised or custom-produced. Final terms are awaiting owner and legal review; see the policy templates for open decisions."],
];

export default function FaqPage() {
  return <div className="shell"><header className="page-hero"><p className="eyebrow">Support</p><h1 className="page-title">Questions, answered plainly.</h1></header><section className="section-tight prose" style={{ paddingTop: 0 }}>{faqs.map(([question, answer]) => <details className="form-card" key={question} style={{ marginBottom: ".8rem" }}><summary style={{ cursor: "pointer", fontWeight: 750 }}>{question}</summary><p>{answer}</p></details>)}<p>Still unsure? <Link className="text-link" href="/contact">Contact the studio</Link>.</p></section></div>;
}
