"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { InvoiceView } from "@/components/InvoiceView";
import { useStore } from "@/lib/store";

export default function SaleBillPage() {
  const { id } = useParams<{ id: string }>();
  const { sales, settings, ready } = useStore();
  const [layout, setLayout] = useState<"a4" | "thermal">("a4");
  const sale = sales.find((s) => s.id === id);
  if (!ready) return <p>Loading…</p>;
  if (!sale) return <p>Bill not found.</p>;

  return (
    <div className={layout === "a4" ? "bill-a4-only" : "bill-thermal-only"}>
      <div className="no-print mb-4 flex flex-wrap gap-2">
        <button onClick={() => setLayout("a4")} className="rounded-full bg-white px-4 py-2 text-sm font-semibold">
          A4
        </button>
        <button onClick={() => setLayout("thermal")} className="rounded-full bg-white px-4 py-2 text-sm font-semibold">
          Small receipt
        </button>
        <button onClick={() => window.print()} className="rounded-full bg-rose px-4 py-2 text-sm font-semibold text-white">
          Print / Download PDF
        </button>
      </div>
      <InvoiceView sale={sale} settings={settings} layout={layout} />
    </div>
  );
}
