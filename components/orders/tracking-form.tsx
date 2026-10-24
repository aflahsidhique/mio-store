"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function TrackingForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const value = new FormData(event.currentTarget).get("token")?.toString().trim() ?? "";
    const token = value.includes("/order/") ? value.split("/order/").pop()?.split(/[?#]/)[0] ?? "" : value;
    if (!/^[a-f0-9]{48}$/i.test(token)) { setError("Enter the secure 48-character tracking token from your order link."); return; }
    router.push(`/order/${encodeURIComponent(token)}`);
  }
  return <form className="form-card" onSubmit={submit} style={{ maxWidth: 680 }}><label className="field"><span>Secure tracking token or full order link</span><input className="input" name="token" required autoComplete="off" placeholder="Paste the secure token sent with your order" /></label><p className="muted" style={{ fontSize: ".8rem" }}>Sequential order numbers alone are never enough to reveal an order or customer details.</p><button className="button button-primary" type="submit">View order status</button>{error && <p className="status-message error" role="alert">{error}</p>}</form>;
}
