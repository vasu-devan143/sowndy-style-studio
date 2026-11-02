"use client";

import { ProductGrid } from "@/components/ProductGrid";
import { useStore } from "@/lib/store";

export default function ChudidarPage() {
  const { products, ready } = useStore();
  if (!ready) return <p>Loading…</p>;
  return (
    <ProductGrid title="Chudithar" products={products.filter((p) => p.category === "chudidar")} />
  );
}
