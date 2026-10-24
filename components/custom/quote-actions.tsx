"use client";

import { useState } from "react";

export function QuoteActions({ token, status }: { token: string; status: string }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function act(action: "accept" | "decline") {
    setBusy(true); setMessage("");
    const response = await fetch("/api/quotes/action", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, action }) });
    const data = await response.json() as { message?: string; error?: string };
    setBusy(false); setMessage(data.message ?? data.error ?? "Unable to update quote.");
    if (response.ok) window.location.reload();
  }
  if (status !== "sent") return <p className="status-message">This quote is {status.replaceAll("_", " ")} and cannot be changed here.</p>;
  return <div><div className="hero-actions"><button className="button button-accent" disabled={busy} type="button" onClick={() => act("accept")}>Accept quote</button><button className="button button-secondary" disabled={busy} type="button" onClick={() => act("decline")}>Decline</button></div>{message && <p className="status-message" role="status">{message}</p>}</div>;
}
