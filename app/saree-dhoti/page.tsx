"use client";

import { ProductGrid } from "@/components/ProductGrid";
import { useStore } from "@/lib/store";

export default function SareeDhotiPage() {
  const { products, ready } = useStore();
  if (!ready) return <p>Loading…</p>;
  return (
    <ProductGrid title="Saree Dhoti (சுடிதார்)" products={products.filter((p) => p.category === "saree-dhoti")} />
  );
}
