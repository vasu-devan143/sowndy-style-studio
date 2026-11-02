import type { CategorySlug } from "./brand";

export type { CategorySlug };

export type StockStatus = "available" | "few_left" | "sold_out";

export type PaymentMode = "UPI" | "Cash" | "Card" | "Bank Transfer";

export type Product = {
  id: string;
  name: string;
  category: CategorySlug;
  price: number;
  original_price: number;
  description: string;
  fabric: string;
  color: string;
  sizes: string;
  stock_quantity: number;
  is_new: boolean;
  coupon_code: string;
  created_at: string;
  images: string[];
};

export type SaleItem = {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

export type Sale = {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_phone: string;
  discount: number;
  payment_mode: PaymentMode;
  subtotal: number;
  total: number;
  notes: string;
  created_at: string;
  items: SaleItem[];
};

export type ShopSettings = {
  brand_name: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  youtube: string;
  upi_id: string;
  upi_qr_url: string;
  logo_url: string;
  address: string;
  bill_footer: string;
  map_embed_url: string;
};

export type CartLine = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export function stockStatus(qty: number): StockStatus {
  if (qty <= 0) return "sold_out";
  if (qty <= 3) return "few_left";
  return "available";
}

export function categoryLabel(slug: CategorySlug) {
  if (slug === "saree") return "Sarees";
  if (slug === "chudidar") return "Chudithar";
  if (slug === "jewelry") return "Jewelry";
  return "Saree Pre-Pleating";
}
