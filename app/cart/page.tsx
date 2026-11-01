"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { InvoiceView } from "@/components/InvoiceView";
import { PaymentBox } from "@/components/PaymentBox";
import { SafeImage } from "@/components/SafeImage";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { inr, nextInvoiceNumber, waLink } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { PaymentMode, Sale } from "@/lib/types";

export default function CartPage() {
  const { lines, setQty, remove, subtotal, clear } = useCart();
  const { settings, recordSale, products, sales } = useStore();
  const { isAdmin } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [discount, setDiscount] = useState(0);
  const [mode, setMode] = useState<PaymentMode>("UPI");
  const [bill, setBill] = useState<Sale | null>(null);
  const [layout, setLayout] = useState<"a4" | "thermal">("a4");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const total = Math.max(0, subtotal - discount);
  const orderText = useMemo(() => {
    const items = lines.map((l) => `• ${l.name} x${l.quantity} = ${inr(l.price * l.quantity)}`).join("\n");
    return `Hi ${settings.brand_name}, I want to order:\n${items}\nTotal: ${inr(total)}\nName: ${name || "-"}\nPhone: ${phone || "-"}`;
  }, [lines, name, phone, settings.brand_name, total]);

  const localBill = (): Sale => ({
    id: crypto.randomUUID(),
    invoice_number: nextInvoiceNumber(sales.map((s) => s.invoice_number)),
    customer_name: name || "Walk-in",
    customer_phone: phone,
    discount,
    payment_mode: mode,
    subtotal,
    total,
    notes: "From website bag",
    created_at: new Date().toISOString(),
    items: lines.map((l) => ({
      id: crypto.randomUUID(),
      sale_id: "bag",
      product_id: l.productId,
      product_name: l.name,
      quantity: l.quantity,
      unit_price: l.price,
      line_total: l.price * l.quantity,
    })),
  });

  const makeBill = async () => {
    setError("");
    if (!lines.length) return;
    setSaving(true);
    try {
      if (isAdmin) {
        const sale = await recordSale({
          customer_name: name || "Walk-in",
          customer_phone: phone,
          discount,
          payment_mode: mode,
          notes: "From website bag",
          items: lines.map((l) => ({ product_id: l.productId, quantity: l.quantity })),
        });
        setBill(sale);
      } else {
        setBill(localBill());
      }
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save bill");
    } finally {
      setSaving(false);
    }
  };

  if (bill) {
    return (
      <div className={layout === "a4" ? "bill-a4-only" : "bill-thermal-only"}>
        <div className="no-print mb-4 flex flex-wrap gap-2">
          <button onClick={() => setLayout("a4")} className="rounded-full bg-white px-4 py-2 text-sm font-semibold">
            A4 bill
          </button>
          <button onClick={() => setLayout("thermal")} className="rounded-full bg-white px-4 py-2 text-sm font-semibold">
            Small receipt
          </button>
          <button onClick={() => window.print()} className="rounded-full bg-rose px-4 py-2 text-sm font-semibold text-white">
            Print / Download PDF
          </button>
          <Link href="/sarees" className="rounded-full border px-4 py-2 text-sm font-semibold">
            Continue shopping
          </Link>
        </div>
        <InvoiceView sale={bill} settings={settings} layout={layout} />
      </div>
    );
  }

  if (!lines.length) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center">
        <h1 className="mb-2 text-3xl">Your bag is empty</h1>
        <p className="mb-4 text-muted">Tap Add to bag on any item, then come back to make the bill.</p>
        <Link href="/sarees" className="font-semibold text-rose">
          Browse sarees
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
      <section className="grid gap-3">
        <h1 className="text-3xl">Your bag</h1>
        {lines.map((line) => {
          const product = products.find((p) => p.id === line.productId);
          const max = product?.stock_quantity ?? line.quantity;
          return (
            <div key={line.productId} className="flex gap-3 rounded-2xl bg-white p-3">
              <SafeImage src={line.image} alt="" className="h-24 w-20 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-medium">{line.name}</p>
                <p className="text-rose">{inr(line.price)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button className="h-8 w-8 rounded-full bg-cream-dark" onClick={() => setQty(line.productId, line.quantity - 1)}>
                    −
                  </button>
                  <span>{line.quantity}</span>
                  <button
                    className="h-8 w-8 rounded-full bg-cream-dark"
                    onClick={() => setQty(line.productId, Math.min(max, line.quantity + 1))}
                  >
                    +
                  </button>
                  <button className="ml-auto text-sm text-red-700" onClick={() => remove(line.productId)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>
      <aside className="grid h-fit gap-4 rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="text-2xl">Bill details</h2>
        <label className="grid gap-1 text-sm">
          Your name
          <input className="rounded-xl border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          Phone
          <input className="rounded-xl border px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          Discount (₹)
          <input
            type="number"
            className="rounded-xl border px-3 py-2"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value) || 0)}
          />
        </label>
        <label className="grid gap-1 text-sm">
          Payment mode
          <select className="rounded-xl border px-3 py-2" value={mode} onChange={(e) => setMode(e.target.value as PaymentMode)}>
            <option>UPI</option>
            <option>Cash</option>
            <option>Card</option>
            <option>Bank Transfer</option>
          </select>
        </label>
        <p className="flex justify-between">
          <span>Subtotal</span>
          <strong>{inr(subtotal)}</strong>
        </p>
        <p className="flex justify-between text-lg">
          <span>Total</span>
          <strong className="text-rose">{inr(total)}</strong>
        </p>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          onClick={makeBill}
          disabled={saving}
          className="rounded-full bg-rose px-4 py-3 font-semibold text-white"
        >
          {saving ? "Saving bill…" : "Create bill"}
        </button>
        <a
          href={waLink(settings.whatsapp, orderText)}
          className="rounded-full bg-[#25D366] px-4 py-3 text-center font-semibold text-white"
          target="_blank"
          rel="noreferrer"
        >
          Order this bag on WhatsApp
        </a>
        <PaymentBox amount={total} note={`Bag order ${settings.brand_name}`} />
      </aside>
    </div>
  );
}
