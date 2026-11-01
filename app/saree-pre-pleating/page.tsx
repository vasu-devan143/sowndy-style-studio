"use client";

import { ProductGrid } from "@/components/ProductGrid";
import { useStore } from "@/lib/store";

export default function PrePleatingPage() {
  const { products, ready } = useStore();
  if (!ready) return <p>Loading…</p>;
  return (
    <div className="grid gap-4">
      <p className="rounded-2xl bg-white p-4 text-sm text-muted">
        Ready-to-wear sarees with pleats already stitched. Wear it like a pre-draped saree — no
        extra pleating needed.
      </p>
      <ProductGrid
        title="Saree Pre-Pleating"
        products={products.filter((p) => p.category === "saree-pre-pleating")}
      />
    </div>
  );
}
