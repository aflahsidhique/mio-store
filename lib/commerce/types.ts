export type ProductStatus = "draft" | "published" | "archived";
export type ProductType = "physical" | "made_to_order" | "quote_only";

export type ProductVariant = {
  id: string;
  sku: string;
  name: string;
  colour: string;
  finish: string;
  pricePaise: number;
  compareAtPaise?: number;
  stock: number;
  madeToOrder?: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  eyebrow: string;
  shortDescription: string;
  description: string;
  type: ProductType;
  status: ProductStatus;
  category: string;
  categorySlug: string;
  featured: boolean;
  material: string;
  dimensions: string;
  leadTime: string;
  care: string;
  included: string;
  limitation: string;
  palette: [string, string, string];
  shape: "wave" | "arch" | "stack" | "loop";
  variants: ProductVariant[];
};

export type CartLine = {
  variantId: string;
  quantity: number;
};

export type PricedLine = {
  variantId: string;
  productId: string;
  productSlug: string;
  title: string;
  variantName: string;
  sku: string;
  unitPricePaise: number;
  quantity: number;
  lineTotalPaise: number;
};

export type OrderTotals = {
  subtotalPaise: number;
  discountPaise: number;
  shippingPaise: number;
  taxPaise: number;
  totalPaise: number;
  currency: "INR";
};

export type OrderStatus =
  | "pending_payment"
  | "payment_failed"
  | "paid"
  | "processing"
  | "production"
  | "quality_check"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "on_hold"
  | "shipment_exception"
  | "cancelled"
  | "refund_pending"
  | "refunded";
