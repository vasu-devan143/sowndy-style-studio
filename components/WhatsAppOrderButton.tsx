"use client";

import { inr, waLink } from "@/lib/format";
import type { Product, ShopSettings } from "@/lib/types";

export function productWhatsAppMessage(product: Product, brandName: string, productUrl: string) {
  return [
    `Hi ${brandName}, I want to order this product.`,
    "",
    `Name: ${product.name}`,
    `Price: ${inr(product.price)}`,
    productUrl ? `Link: ${productUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function WhatsAppOrderButton({
  product,
  settings,
}: {
  product: Product;
  settings: ShopSettings;
}) {
  if (!settings.whatsapp.replace(/\D/g, "")) return null;

  const productUrl =
    typeof window !== "undefined" ? `${window.location.origin}/product/${product.id}` : `/product/${product.id}`;

  return (
    <a
      href={waLink(settings.whatsapp, productWhatsAppMessage(product, settings.brand_name, productUrl))}
      className="text-center text-sm font-medium text-muted"
      target="_blank"
      rel="noreferrer"
    >
      Order on WhatsApp
    </a>
  );
}
