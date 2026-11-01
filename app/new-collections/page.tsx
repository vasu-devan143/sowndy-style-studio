"use client";

import { ProductGrid } from "@/components/ProductGrid";
import { useStore } from "@/lib/store";

export default function NewCollectionsPage() {
  const { products, ready } = useStore();
  if (!ready) return <p>Loading…</p>;
  return <ProductGrid title="New Collections" products={products.filter((p) => p.is_new)} />;
}
