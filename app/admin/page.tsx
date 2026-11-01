"use client";

import { inr, startOfDay } from "@/lib/format";
import { useStore } from "@/lib/store";
import { supabaseSetupHint } from "@/lib/supabase/client";
import { stockStatus } from "@/lib/types";

function sumSales(sales: { created_at: string; total: number }[], from: Date, to = new Date()) {
  return sales
    .filter((s) => {
      const t = new Date(s.created_at).getTime();
      return t >= from.getTime() && t <= to.getTime();
    })
    .reduce((n, s) => n + s.total, 0);
}

export default function AdminHomePage() {
  const { products, sales, ready } = useStore();
  if (!ready) return <p>Loading…</p>;

  const now = new Date();
  const today = sumSales(sales, startOfDay(now));
  const weekFrom = startOfDay(new Date(now.getTime() - 6 * 86400000));
  const week = sumSales(sales, weekFrom);
  const monthFrom = new Date(now.getFullYear(), now.getMonth(), 1);
  const month = sumSales(sales, monthFrom);
  const yearFrom = new Date(now.getFullYear(), 0, 1);
  const year = sumSales(sales, yearFrom);
  const stock = products.reduce((n, p) => n + p.stock_quantity, 0);
  const low = products.filter((p) => stockStatus(p.stock_quantity) !== "available");

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const from = startOfDay(d);
    const to = new Date(from);
    to.setHours(23, 59, 59, 999);
    return { label: from.toLocaleDateString("en-IN", { weekday: "short" }), total: sumSales(sales, from, to) };
  });
  const max = Math.max(1, ...days.map((d) => d.total));

  const setupHint = supabaseSetupHint();

  return (
    <div className="grid gap-4">
      {setupHint && (
        <p className="rounded-2xl border border-gold/40 bg-cream px-4 py-3 text-sm">{setupHint}</p>
      )}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {[
          ["Today", today],
          ["This week", week],
          ["This month", month],
          ["This year", year],
          ["Total bills", sales.length],
          ["Pieces in stock", stock],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl bg-white p-4">
            <p className="text-sm text-muted">{label}</p>
            <p className="text-2xl font-semibold">{typeof value === "number" && String(label) !== "Total bills" && String(label) !== "Pieces in stock" ? inr(value) : value}</p>
          </div>
        ))}
      </div>
      <section className="rounded-2xl bg-white p-4">
        <h2 className="mb-4 text-xl">Last 7 days</h2>
        <div className="flex h-40 items-end gap-2">
          {days.map((d) => (
            <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t-lg bg-rose"
                style={{ height: `${Math.max(8, (d.total / max) * 100)}%` }}
                title={inr(d.total)}
              />
              <span className="text-xs text-muted">{d.label}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-2xl bg-white p-4">
        <h2 className="mb-3 text-xl">Need attention (few left / sold out)</h2>
        {low.length === 0 ? (
          <p className="text-sm text-muted">All items have enough stock.</p>
        ) : (
          <ul className="grid gap-2">
            {low.map((p) => (
              <li key={p.id} className="flex justify-between text-sm">
                <span>{p.name}</span>
                <span>{p.stock_quantity === 0 ? "Sold out" : `${p.stock_quantity} left`}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
