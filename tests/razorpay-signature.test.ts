import { describe, expect, it } from "vitest";
import { hmacSha256Hex, timingSafeEqualHex } from "@/lib/security/hmac";

describe("signature verification primitives", () => {
  it("produces the known HMAC-SHA256 vector", async () => { expect(await hmacSha256Hex("order_1|pay_1", "secret")).toBe("52115a0d3400de9e86aade1f1b6eba9e8974604f4e267a9e9a16633a4c8dd2cb"); });
  it("rejects altered and different-length signatures", async () => { const expected = await hmacSha256Hex("raw-body", "webhook-secret"); expect(timingSafeEqualHex(expected, expected)).toBe(true); expect(timingSafeEqualHex(expected, `${expected.slice(0,-1)}0`)).toBe(false); expect(timingSafeEqualHex(expected, "bad")).toBe(false); });
});
