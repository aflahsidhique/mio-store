import { config } from "@/lib/config";

export type TransactionalMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendTransactionalEmail(message: TransactionalMessage) {
  if (!config.resendApiKey || !config.emailFrom) {
    return { delivered: false as const, reason: "not_configured" as const };
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...message, from: config.emailFrom }),
  });
  if (!response.ok) throw new Error(`Email delivery failed (${response.status}).`);
  const data = (await response.json()) as { id: string };
  return { delivered: true as const, id: data.id };
}
