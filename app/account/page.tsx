import type { Metadata } from "next";
import Link from "next/link";
import { chatGPTSignInPath, getChatGPTUser } from "@/app/chatgpt-auth";

export const metadata: Metadata = { title: "Account", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getChatGPTUser();
  return <div className="shell section"><div className="form-card" style={{ maxWidth: 700, marginInline: "auto" }}><p className="eyebrow">Your account</p><h1>{user ? `Hello, ${user.displayName}.` : "Sign in to your account."}</h1><p className="muted">Guest checkout remains available. Signed-in customers can access only their own order and quote history after the database is connected.</p>{user ? <Link className="button button-primary" href="/account/orders">View your orders</Link> : <a className="button button-primary" href={chatGPTSignInPath("/account")} target="_top">Sign in securely</a>}</div></div>;
}
