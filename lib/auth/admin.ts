import { getChatGPTUser } from "@/app/chatgpt-auth";
import { capabilities, config } from "@/lib/config";
import { rpc } from "@/lib/db/supabase-rest";

export async function getAdminIdentity() {
  const user = await getChatGPTUser();
  if (!user) return null;
  const email = user.email.trim().toLowerCase();
  if (config.adminBootstrapEmail && email === config.adminBootstrapEmail.trim().toLowerCase()) return user;
  if (capabilities.database) {
    try { if (await rpc<boolean>("is_admin_email", { p_email: email })) return user; } catch { return null; }
  }
  return null;
}
