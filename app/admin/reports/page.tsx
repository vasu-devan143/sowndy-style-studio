"use client";

import { useMemo, useState } from "react";
import { downloadText, inr } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function ReportsPage() {
  const { sales, ready } = useStore();
  const today = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = useState(today.slice(0, 8) + "01");
  const [to, setTo] = useState(today);

  const rows = useMemo(() => {
    const start = new Date(from);
    start.setHours(0, 0, 0, 0);
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    return sales.filter((s) => {
      const t = new Date(s.created_at).getTime();
      return t >= start.getTime() && t <= end.getTime();
    });
  }, [from, sales, to]);

  const total = rows.reduce((n, s) => n + s.total, 0);
  const max = Math.max(1, ...rows.map((s) => s.total));

  const exportCsv = () => {
    const header = "Invoice,Date,Customer,Phone,Payment,Subtotal,Discount,Total";
    const body = rows
      .map(
        (s) =>
          `${s.invoice_number},${s.created_at},${s.customer_name},${s.customer_phone},${s.payment_mode},${s.subtotal},${s.discount},${s.total}`,
      )
      .join("\n");
    downloadText(`sowndy-sales-${from}-to-${to}.csv`, `${header}\n${body}`);
  };

  if (!ready) return <p>Loading…</p>;

  return (
    <div className="grid gap-4">
      <h2 className="text-2xl">Sales report</h2>
      <div className="flex flex-wrap gap-3">
        <label className="text-sm">
          From
          <input type="date" className="ml-2 rounded-xl border bg-white px-3 py-2" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="text-sm">
          To
          <input type="date" className="ml-2 rounded-xl border bg-white px-3 py-2" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
        <button onClick={exportCsv} className="rounded-full bg-rose px-4 py-2 text-sm font-semibold text-white">
          Export Excel/CSV
        </button>
      </div>
      <p className="text-lg">
        {rows.length} bills · Total {inr(total)}
      </p>
      <div className="flex h-40 items-end gap-1 rounded-2xl bg-white p-4">
        {rows.slice(0, 14).map((s) => (
          <div
            key={s.id}
            className="flex-1 rounded-t bg-rose"
            style={{ height: `${Math.max(8, (s.total / max) * 100)}%` }}
            title={`${s.invoice_number} ${inr(s.total)}`}
          />
        ))}
        {rows.length === 0 && <p className="text-sm text-muted">No sales in this date range.</p>}
      </div>
      <div className="grid gap-2">
        {rows.map((s) => (
          <div key={s.id} className="flex justify-between rounded-xl bg-white px-3 py-2 text-sm">
            <span>
              {s.invoice_number} · {s.customer_name}
            </span>
            <span>{inr(s.total)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
