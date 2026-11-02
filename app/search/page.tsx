"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ProductGrid } from "@/components/ProductGrid";
import { normalizeCoupon } from "@/lib/format";
import { useStore } from "@/lib/store";

function SearchResults() {
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  const { products, ready } = useStore();
  if (!ready) return <p>Loading…</p>;
  const needle = q.toLowerCase();
  const coupon = normalizeCoupon(q);
  const list = products.filter(
    (p) =>
      p.name.toLowerCase().includes(needle) ||
      (p.coupon_code && normalizeCoupon(p.coupon_code) === coupon),
  );
  return <ProductGrid title={q ? `Search: ${q}` : "Search product"} products={list} />;
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <SearchResults />
    </Suspense>
  );
}
