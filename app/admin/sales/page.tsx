"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { inr, prettyDate } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function SalesPage() {
  const { sales, ready } = useStore();
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const needle = q.toLowerCase();
    return sales.filter(
      (s) =>
        s.customer_name.toLowerCase().includes(needle) ||
        s.customer_phone.includes(q) ||
        s.invoice_number.toLowerCase().includes(needle),
    );
  }, [q, sales]);

  if (!ready) return <p>Loading…</p>;

  return (
    <div className="grid gap-3">
      <h2 className="text-2xl">Sales & bill history</h2>
      <input
        className="rounded-xl border bg-white px-3 py-3"
        placeholder="Search name, phone or bill number"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {list.map((s) => (
        <Link key={s.id} href={`/admin/sales/${s.id}`} className="rounded-2xl bg-white p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold">{s.invoice_number}</p>
              <p className="text-sm text-muted">
                {s.customer_name} · {s.customer_phone}
              </p>
              <p className="text-xs text-muted">{prettyDate(s.created_at)}</p>
            </div>
            <p className="font-semibold text-rose">{inr(s.total)}</p>
          </div>
        </Link>
      ))}
      {list.length === 0 && <p className="text-muted">No bills yet.</p>}
    </div>
  );
}
