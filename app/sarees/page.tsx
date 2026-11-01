"use client";

import { ProductGrid } from "@/components/ProductGrid";
import { useStore } from "@/lib/store";

export default function SareesPage() {
  const { products, ready } = useStore();
  if (!ready) return <p>Loading…</p>;
  return <ProductGrid title="Sarees" products={products.filter((p) => p.category === "saree")} />;
}
