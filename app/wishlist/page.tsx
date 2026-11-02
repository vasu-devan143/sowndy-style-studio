"use client";

import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/lib/store";
import { useWishlist } from "@/lib/wishlist";

export default function WishlistPage() {
  const { products, ready } = useStore();
  const { ids } = useWishlist();
  if (!ready) return <p>Loading…</p>;
  const list = ids.map((id) => products.find((p) => p.id === id)).filter((p) => p != null);

  return (
    <div className="grid gap-4">
      <h1 className="text-3xl md:text-4xl">My Wishlist</h1>
      {list.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-muted">
          No saved items yet. Tap the heart on a product you like.{" "}
          <Link href="/sarees" className="font-semibold text-rose">
            Shop sarees
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
