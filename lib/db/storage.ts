import { config } from "@/lib/config";
import { ConfigurationError } from "./supabase-rest";

export async function uploadPrivateFile(bucket: string, path: string, file: File) {
  if (!config.supabaseUrl || !config.supabaseServiceRoleKey) throw new ConfigurationError("Private storage is not configured.");
  const response = await fetch(`${config.supabaseUrl}/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: { apikey: config.supabaseServiceRoleKey, Authorization: `Bearer ${config.supabaseServiceRoleKey}`, "Content-Type": file.type || "application/octet-stream", "x-upsert": "false" },
    body: file,
  });
  if (!response.ok) throw new Error(`Private upload failed (${response.status}).`);
  return { bucket, path };
}
