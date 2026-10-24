import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminIdentity } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminIdentity();
  if (!admin) return <div className="shell section"><div className="empty-state"><div><p className="eyebrow">Protected administration</p><h1>Admin access denied.</h1><p className="muted">Access requires authenticated Site identity plus an approved admin_users record or ADMIN_BOOTSTRAP_EMAIL match.</p></div></div></div>;
  return <AdminShell>{children}</AdminShell>;
}
