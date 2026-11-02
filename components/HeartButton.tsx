"use client";

import { useWishlist } from "@/lib/wishlist";

export function HeartButton({ productId, className = "" }: { productId: string; className?: string }) {
  const { has, toggle } = useWishlist();
  const on = has(productId);

  return (
    <button
      type="button"
      aria-label={on ? "Remove from My Wishlist" : "Add to My Wishlist"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      className={`rounded-full bg-white/90 px-2 py-1 text-lg leading-none shadow-sm ${className}`}
    >
      {on ? "♥" : "♡"}
    </button>
  );
}
