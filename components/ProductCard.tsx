"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/format";
import type { Product } from "@/lib/types";
import { stockStatus } from "@/lib/types";
import { SafeImage } from "./SafeImage";
import { StockBadge } from "./StockBadge";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const sold = stockStatus(product.stock_quantity) === "sold_out";

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm">
      {sold ? (
        <div className="relative aspect-[3/4] overflow-hidden opacity-50">
          <SafeImage src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
        </div>
      ) : (
        <Link href="/cart" onClick={() => add(product)} className="block">
          <div className="relative aspect-[3/4] overflow-hidden">
            <SafeImage src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
            {product.is_new && (
              <span className="absolute left-3 top-3 rounded-full bg-rose px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                New
              </span>
            )}
          </div>
        </Link>
      )}
      <div className="grid gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          {sold ? (
            <p className="font-medium leading-snug">{product.name}</p>
          ) : (
            <Link href="/cart" onClick={() => add(product)} className="text-left font-medium leading-snug">
              {product.name}
            </Link>
          )}
          <StockBadge qty={product.stock_quantity} />
        </div>
        <p className="text-lg font-semibold text-rose">{inr(product.price)}</p>
        {sold ? (
          <Link
            href={`/product/${product.id}`}
            className="rounded-full border border-rose/30 px-3 py-2 text-center text-sm font-semibold text-rose"
          >
            Notify me
          </Link>
        ) : (
          <>
            <Link
              href="/cart"
              onClick={() => add(product)}
              className="rounded-full bg-rose px-3 py-2.5 text-center text-sm font-semibold text-white"
            >
              Add to bag & bill
            </Link>
            <Link href={`/product/${product.id}`} className="text-center text-xs font-medium text-muted">
              See photos & details
            </Link>
          </>
        )}
      </div>
    </article>
  );
}
