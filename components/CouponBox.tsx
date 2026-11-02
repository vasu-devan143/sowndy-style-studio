"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { normalizeCoupon } from "@/lib/format";
import { useStore } from "@/lib/store";

export function CouponBox() {
  const router = useRouter();
  const { products, ready } = useStore();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const openProduct = () => {
    const wanted = normalizeCoupon(code);
    if (!wanted) {
      setError("Please type the coupon code.");
      return;
    }
    const match = products.find((p) => normalizeCoupon(p.coupon_code) === wanted);
    if (!match) {
      setError("No product found for this code. Check the code and try again.");
      return;
    }
    setError("");
    setCode("");
    router.push(`/product/${match.id}`);
  };

  return (
    <div className="mx-auto mt-3 w-full max-w-xl">
      <form
        className="flex flex-col gap-2 sm:flex-row sm:items-center"
        onSubmit={(e) => {
          e.preventDefault();
          openProduct();
        }}
      >
        <label className="sr-only" htmlFor="product-coupon">
          Product coupon code
        </label>
        <input
          id="product-coupon"
          className="min-w-0 flex-1 rounded-full border border-gold/40 bg-white px-4 py-2.5 text-sm uppercase"
          placeholder="Have a coupon code? Type it here"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError("");
          }}
          disabled={!ready}
          autoComplete="off"
        />
        <button type="submit" className="rounded-full bg-rose px-4 py-2.5 text-sm font-semibold text-white">
          Open product
        </button>
      </form>
      {error ? <p className="mt-1 text-center text-xs text-rose">{error}</p> : null}
    </div>
  );
}
