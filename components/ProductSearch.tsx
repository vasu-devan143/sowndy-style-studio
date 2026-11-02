"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { normalizeCoupon } from "@/lib/format";
import { useStore } from "@/lib/store";

export function ProductSearch() {
  const router = useRouter();
  const { products, ready } = useStore();
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  const search = () => {
    const raw = q.trim();
    if (!raw) {
      setError("Type a product name or coupon code.");
      return;
    }
    const coupon = normalizeCoupon(raw);
    const byCoupon = products.find((p) => p.coupon_code && normalizeCoupon(p.coupon_code) === coupon);
    if (byCoupon) {
      setError("");
      setQ("");
      router.push(`/product/${byCoupon.id}`);
      return;
    }
    const needle = raw.toLowerCase();
    const byName = products.filter((p) => p.name.toLowerCase().includes(needle));
    if (byName.length === 1) {
      setError("");
      setQ("");
      router.push(`/product/${byName[0].id}`);
      return;
    }
    if (byName.length > 1) {
      setError("");
      setQ("");
      router.push(`/search?q=${encodeURIComponent(raw)}`);
      return;
    }
    setError("No product found. Try another name or coupon.");
  };

  return (
    <div className="mx-auto mt-2 w-full max-w-md px-1">
      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
      >
        <label htmlFor="product-search" className="shrink-0 text-[11px] font-medium text-ink/80 md:text-sm">
          Search product
        </label>
        <input
          id="product-search"
          className="h-8 min-w-0 flex-1 rounded-full border border-gold/40 bg-white px-3 text-xs md:h-9 md:text-sm"
          placeholder="Name or coupon"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setError("");
          }}
          disabled={!ready}
          autoComplete="off"
        />
        <button type="submit" className="h-8 shrink-0 rounded-full bg-rose px-3 text-xs font-semibold text-white md:h-9 md:px-4 md:text-sm">
          Go
        </button>
      </form>
      {error ? <p className="mt-1 text-center text-[11px] text-rose">{error}</p> : null}
    </div>
  );
}
