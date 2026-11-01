"use client";

import { useMemo, useState } from "react";
import { InvoiceView } from "@/components/InvoiceView";
import { SafeImage } from "@/components/SafeImage";
import { inr } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { PaymentMode, Sale } from "@/lib/types";

type Line = { productId: string; name: string; price: number; quantity: number; image: string };

export default function AdminBillingPage() {
  const { products, recordSale, settings, ready } = useStore();
  const [q, setQ] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [discount, setDiscount] = useState(0);
  const [mode, setMode] = useState<PaymentMode>("UPI");
  const [notes, setNotes] = useState("");
  const [bill, setBill] = useState<Sale | null>(null);
  const [layout, setLayout] = useState<"a4" | "thermal">("a4");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const list = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  const subtotal = lines.reduce((n, l) => n + l.price * l.quantity, 0);
  const total = Math.max(0, subtotal - discount);

  const add = (productId: string) => {
    const p = products.find((x) => x.id === productId);
    if (!p || p.stock_quantity <= 0) return;
    setLines((prev) => {
      const found = prev.find((l) => l.productId === p.id);
      if (found) {
        if (found.quantity >= p.stock_quantity) return prev;
        return prev.map((l) => (l.productId === p.id ? { ...l, quantity: l.quantity + 1 } : l));
      }
      return [...prev, { productId: p.id, name: p.name, price: p.price, quantity: 1, image: p.images[0] ?? "" }];
    });
  };

  const save = async () => {
    setError("");
    if (!lines.length) {
      setError("Tap a product to add it to the bill first.");
      return;
    }
    setBusy(true);
    try {
      const sale = await recordSale({
        customer_name: name || "Walk-in",
        customer_phone: phone,
        discount,
        payment_mode: mode,
        notes,
        items: lines.map((l) => ({ product_id: l.productId, quantity: l.quantity })),
      });
      setBill(sale);
      setLines([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save bill");
    } finally {
      setBusy(false);
    }
  };

  const preview: Sale | null = useMemo(() => {
    if (bill || !lines.length) return bill;
    return {
      id: "preview",
      invoice_number: "PREVIEW",
      customer_name: name || "Walk-in",
      customer_phone: phone,
      discount,
      payment_mode: mode,
      subtotal,
      total,
      notes,
      created_at: new Date().toISOString(),
      items: lines.map((l, i) => ({
        id: String(i),
        sale_id: "preview",
        product_id: l.productId,
        product_name: l.name,
        quantity: l.quantity,
        unit_price: l.price,
        line_total: l.price * l.quantity,
      })),
    };
  }, [bill, discount, lines, mode, name, notes, phone, subtotal, total]);

  if (!ready) return <p>Loading…</p>;

  if (bill) {
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
          <button onClick={() => setBill(null)} className="rounded-full border px-4 py-2 text-sm font-semibold">
            New bill
          </button>
        </div>
        <InvoiceView sale={bill} settings={settings} layout={layout} />
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section>
        <h2 className="mb-2 text-2xl">Tap an item to add it to the bill</h2>
        <input
          className="mb-3 w-full rounded-xl border bg-white px-3 py-3"
          placeholder="Search products"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-2">
          {list.map((p) => (
            <button
              key={p.id}
              onClick={() => add(p.id)}
              disabled={p.stock_quantity <= 0}
              className="overflow-hidden rounded-2xl bg-white text-left disabled:opacity-40"
            >
              <SafeImage src={p.images[0]} alt="" className="aspect-[4/5] w-full object-cover" />
              <div className="p-2">
                <p className="line-clamp-2 text-sm font-medium">{p.name}</p>
                <p className="text-sm text-rose">{inr(p.price)}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
      <section className="grid h-fit gap-3 rounded-2xl bg-white p-4">
        <h2 className="text-2xl">This bill</h2>
        {lines.map((l) => (
          <div key={l.productId} className="flex items-center justify-between gap-2 text-sm">
            <span className="flex-1">
              {l.name} × {l.quantity}
            </span>
            <span>{inr(l.price * l.quantity)}</span>
            <button className="text-red-700" onClick={() => setLines((prev) => prev.filter((x) => x.productId !== l.productId))}>
              Remove
            </button>
          </div>
        ))}
        <label className="grid gap-1 text-sm">
          Customer name
          <input className="rounded-xl border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          Phone
          <input className="rounded-xl border px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          Discount (₹)
          <input type="number" className="rounded-xl border px-3 py-2" value={discount} onChange={(e) => setDiscount(Number(e.target.value) || 0)} />
        </label>
        <label className="grid gap-1 text-sm">
          Payment
          <select className="rounded-xl border px-3 py-2" value={mode} onChange={(e) => setMode(e.target.value as PaymentMode)}>
            <option>UPI</option>
            <option>Cash</option>
            <option>Card</option>
            <option>Bank Transfer</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Note
          <input className="rounded-xl border px-3 py-2" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
        <p className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span className="text-rose">{inr(total)}</span>
        </p>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button disabled={busy} onClick={save} className="rounded-full bg-rose px-4 py-3 font-semibold text-white">
          {busy ? "Saving…" : "Save bill & reduce stock"}
        </button>
        {preview && (
          <div className="hidden md:block">
            <p className="mb-2 text-sm text-muted">Preview</p>
            <InvoiceView sale={preview} settings={settings} layout="thermal" />
          </div>
        )}
      </section>
    </div>
  );
}
