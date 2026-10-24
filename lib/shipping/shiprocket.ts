import { config } from "@/lib/config";

type ShiprocketAuth = { token: string };

export type ShippingQuote = {
  serviceable: boolean;
  shippingPaise: number | null;
  courierName: string | null;
  estimatedDays: number | null;
  source: "shiprocket" | "unavailable";
};

export interface ShippingProvider {
  serviceability(input: {
    pickupPincode: string;
    deliveryPincode: string;
    weightKg: number;
    cod?: boolean;
  }): Promise<ShippingQuote>;
}

export class ShiprocketProvider implements ShippingProvider {
  private async token() {
    if (!config.shiprocketEmail || !config.shiprocketPassword) {
      throw new Error("Shiprocket credentials are not configured.");
    }
    const response = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: config.shiprocketEmail, password: config.shiprocketPassword }),
    });
    if (!response.ok) throw new Error(`Shiprocket authentication failed (${response.status}).`);
    const data = (await response.json()) as ShiprocketAuth;
    return data.token;
  }

  async serviceability(input: {
    pickupPincode: string;
    deliveryPincode: string;
    weightKg: number;
    cod?: boolean;
  }): Promise<ShippingQuote> {
    const token = await this.token();
    const params = new URLSearchParams({
      pickup_postcode: input.pickupPincode,
      delivery_postcode: input.deliveryPincode,
      weight: input.weightKg.toFixed(3),
      cod: input.cod ? "1" : "0",
    });
    const response = await fetch(
      `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?${params}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!response.ok) throw new Error(`Shiprocket serviceability failed (${response.status}).`);
    const data = (await response.json()) as {
      data?: { available_courier_companies?: Array<{ rate?: number; courier_name?: string; estimated_delivery_days?: number }> };
    };
    const courier = data.data?.available_courier_companies?.[0];
    return {
      serviceable: Boolean(courier),
      shippingPaise: typeof courier?.rate === "number" ? Math.round(courier.rate * 100) : null,
      courierName: courier?.courier_name ?? null,
      estimatedDays: courier?.estimated_delivery_days ?? null,
      source: "shiprocket",
    };
  }
}
