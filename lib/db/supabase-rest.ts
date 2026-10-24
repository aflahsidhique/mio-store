import { config } from "@/lib/config";

type Access = "public" | "service";

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigurationError";
  }
}

export async function supabaseRequest<T>(
  path: string,
  init: RequestInit = {},
  access: Access = "service",
): Promise<T> {
  const key = access === "service" ? config.supabaseServiceRoleKey : config.supabaseAnonKey;
  if (!config.supabaseUrl || !key) {
    throw new ConfigurationError(`Supabase ${access} access is not configured.`);
  }

  const headers = new Headers(init.headers);
  headers.set("apikey", key);
  headers.set("Authorization", `Bearer ${key}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const response = await fetch(`${config.supabaseUrl}${path}`, {
    ...init,
    headers,
    cache: init.cache ?? "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${detail.slice(0, 300)}`);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function rpc<T>(name: string, body: unknown) {
  return supabaseRequest<T>(`/rest/v1/rpc/${name}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
