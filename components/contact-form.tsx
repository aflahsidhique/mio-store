"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage("Sending…"); setError(false);
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const result = await response.json() as { message?: string; error?: string };
    setError(!response.ok); setMessage(result.message ?? result.error ?? "Something went wrong.");
    if (response.ok) event.currentTarget.reset();
  }
  return <form className="form-card" onSubmit={submit}><div className="form-grid"><label className="field"><span>Name</span><input className="input" name="name" minLength={2} required /></label><label className="field"><span>Email</span><input className="input" name="email" type="email" required /></label><label className="field field-full"><span>Subject</span><input className="input" name="subject" minLength={3} maxLength={160} required /></label><label className="field field-full"><span>Message</span><textarea className="textarea" name="message" minLength={20} maxLength={4000} required /></label><label className="field" style={{ display: "none" }} aria-hidden="true"><span>Website</span><input className="input" name="website" tabIndex={-1} autoComplete="off" /></label><div className="field-full"><button className="button button-primary" type="submit">Send message</button></div>{message && <p className={`status-message field-full ${error ? "error" : ""}`} role="status">{message}</p>}</div></form>;
}
