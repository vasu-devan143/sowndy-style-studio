"use client";

import { ProductGrid } from "@/components/ProductGrid";
import { useStore } from "@/lib/store";

export default function JewelryPage() {
  const { products, ready } = useStore();
  if (!ready) return <p>Loading…</p>;
  return (
    <div className="grid gap-4">
      <p className="rounded-2xl bg-white p-4 text-sm text-muted">
        Jewellery pieces from the boutique. Open a piece for photos, price, and WhatsApp order.
      </p>
      <ProductGrid title="Jewelry" products={products.filter((p) => p.category === "jewelry")} />
    </div>
  );
}
