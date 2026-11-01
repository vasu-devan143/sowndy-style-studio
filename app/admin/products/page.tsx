"use client";

import Link from "next/link";
import { useState } from "react";
import { SafeImage } from "@/components/SafeImage";
import { StockBadge } from "@/components/StockBadge";
import { inr } from "@/lib/format";
import { useStore } from "@/lib/store";
import { categoryLabel } from "@/lib/types";

export default function AdminProductsPage() {
  const { products, deleteProduct, setStock, ready } = useStore();
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState("");

  if (!ready) return <p>Loading…</p>;
  const list = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl">Products</h2>
        <Link href="/admin/products/new" className="rounded-full bg-rose px-4 py-2 font-semibold text-white">
          Add product
        </Link>
      </div>
      <input
        placeholder="Search by name"
        className="rounded-xl border bg-white px-3 py-3"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="grid gap-3">
        {list.map((p) => (
          <article key={p.id} className="flex gap-3 rounded-2xl bg-white p-3">
            <SafeImage src={p.images[0]} alt="" className="h-24 w-20 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-muted">
                {categoryLabel(p.category)} · {inr(p.price)} · stock {p.stock_quantity}
              </p>
              <StockBadge qty={p.stock_quantity} />
              <div className="mt-2 flex flex-wrap gap-2">
                <Link href={`/admin/products/${p.id}`} className="rounded-full bg-cream-dark px-3 py-1 text-sm font-semibold">
                  Edit
                </Link>
                <button
                  className="rounded-full bg-cream-dark px-3 py-1 text-sm font-semibold"
                  disabled={busyId === p.id}
                  onClick={async () => {
                    setBusyId(p.id);
                    await setStock(p.id, 0);
                    setBusyId("");
                  }}
                >
                  Mark sold out
                </button>
                <button
                  className="rounded-full bg-cream-dark px-3 py-1 text-sm font-semibold"
                  disabled={busyId === p.id}
                  onClick={async () => {
                    setBusyId(p.id);
                    await setStock(p.id, Math.max(1, p.stock_quantity));
                    setBusyId("");
                  }}
                >
                  Mark available
                </button>
                <button
                  className="rounded-full px-3 py-1 text-sm text-red-700"
                  onClick={async () => {
                    if (!confirm(`Delete ${p.name}? This cannot be undone.`)) return;
                    await deleteProduct(p.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
