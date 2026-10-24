import Link from "next/link";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const links = [["Overview",""],["Products","products"],["Orders","orders"],["Shipments","shipments"],["Custom requests","quotes"],["Customers","customers"],["Coupons","coupons"],["Reviews","reviews"],["Store settings","settings"],["Audit log","audit"]];
  return <div className="admin-shell"><aside className="admin-sidebar"><p className="eyebrow">MIO control room</p><nav aria-label="Admin">{links.map(([label, slug]) => <Link key={slug} href={`/admin${slug ? `/${slug}` : ""}`}>{label}</Link>)}</nav></aside><section className="admin-main">{children}</section></div>;
}
