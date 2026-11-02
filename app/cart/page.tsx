"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckoutPay } from "@/components/CheckoutPay";
import { InvoiceView } from "@/components/InvoiceView";
import { SafeImage } from "@/components/SafeImage";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import {
  emptyDelivery,
  formatDeliveryNotes,
  loadDelivery,
  payMethodToMode,
  saveDelivery,
  validateDelivery,
  type CheckoutPayMethod,
  type DeliveryDetails,
} from "@/lib/checkout";
import { gpayLink, inr, nextInvoiceNumber, phonepeLink, upiLink, waLink } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Sale } from "@/lib/types";

export default function CartPage() {
  const { lines, setQty, remove, subtotal, clear } = useCart();
  const { settings, recordSale, products, sales } = useStore();
  const { isAdmin } = useAuth();
  const [delivery, setDelivery] = useState<DeliveryDetails>(emptyDelivery);
  const [method, setMethod] = useState<CheckoutPayMethod>("upi");
  const [bill, setBill] = useState<Sale | null>(null);
  const [layout, setLayout] = useState<"a4" | "thermal">("a4");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setDelivery(loadDelivery());
  }, []);

  const total = subtotal;
  const mode = payMethodToMode(method);
  const notes = formatDeliveryNotes(delivery, method);
  const payNote = `Order ${settings.brand_name}`;

  const setField = <K extends keyof DeliveryDetails>(key: K, value: DeliveryDetails[K]) => {
    setDelivery((prev) => {
      const next = { ...prev, [key]: value };
      saveDelivery(next);
      return next;
    });
  };

  const orderText = useMemo(() => {
    const items = lines.map((l) => `• ${l.name} x${l.quantity} = ${inr(l.price * l.quantity)}`).join("\n");
    return `Hi ${settings.brand_name}, I want to order:\n${items}\nTotal: ${inr(total)}\n\n${notes}`;
  }, [lines, notes, settings.brand_name, total]);

  const localBill = (): Sale => ({
    id: crypto.randomUUID(),
    invoice_number: nextInvoiceNumber(sales.map((s) => s.invoice_number)),
    customer_name: delivery.name.trim() || "Website order",
    customer_phone: delivery.phone.trim(),
    discount: 0,
    payment_mode: mode,
    subtotal,
    total,
    notes,
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
    const problem = validateDelivery(delivery);
    if (problem) {
      setError(problem);
      return false;
    }
    if (!lines.length) return false;
    setSaving(true);
    try {
      if (isAdmin) {
        const sale = await recordSale({
          customer_name: delivery.name.trim() || "Website order",
          customer_phone: delivery.phone.trim(),
          discount: 0,
          payment_mode: mode,
          notes,
          items: lines.map((l) => ({ product_id: l.productId, quantity: l.quantity })),
        });
        setBill(sale);
      } else {
        setBill(localBill());
      }
      clear();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save bill");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const payNow = async () => {
    const amountToPay = total;
    const ok = await makeBill();
    if (!ok) return;
    const href =
      method === "gpay"
        ? gpayLink(settings.upi_id, settings.brand_name, amountToPay, payNote)
        : method === "phonepe"
          ? phonepeLink(settings.upi_id, settings.brand_name, amountToPay, payNote)
          : method === "upi"
            ? upiLink(settings.upi_id, settings.brand_name, amountToPay, payNote)
            : "";
    if (href && settings.upi_id) {
      try {
        window.open(href, "_blank", "noopener,noreferrer");
      } catch {
        /* Stay on the order confirmation if the payment app cannot open here. */
      }
    }
  };

  if (bill) {
    return (
      <div className="grid gap-6">
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
        <div className="no-print grid gap-3">
          <CheckoutPay amount={bill.total} note={payNote} method={method} onMethod={setMethod} />
          <a
            href={waLink(
              settings.whatsapp,
              `Paid / placed order ${bill.invoice_number}\nTotal: ${inr(bill.total)}\n\n${bill.notes}`,
            )}
            className="rounded-full bg-[#25D366] px-4 py-3 text-center font-semibold text-white"
            target="_blank"
            rel="noreferrer"
          >
            Send this order on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  if (!lines.length) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center">
        <h1 className="mb-2 text-3xl">Your bag is empty</h1>
        <p className="mb-4 text-muted">Tap Add to bag on any item, then come back to checkout.</p>
        <Link href="/sarees" className="font-semibold text-rose">
          Browse sarees
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
      <section className="grid gap-3">
        <h1 className="text-3xl">Checkout</h1>
        {lines.map((line) => {
          const product = products.find((p) => p.id === line.productId);
          const max = product ? Math.max(1, product.stock_quantity) : 99;
          return (
            <div key={line.productId} className="flex gap-3 rounded-2xl bg-white p-3">
              <SafeImage src={line.image} alt="" className="h-24 w-20 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-medium">{line.name}</p>
                <p className="text-sm text-muted">
                  {inr(line.price)} × {line.quantity}
                </p>
                <p className="text-rose font-semibold">{inr(line.price * line.quantity)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button className="h-8 w-8 rounded-full bg-cream-dark" onClick={() => setQty(line.productId, line.quantity - 1)}>
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={max}
                    className="h-8 w-16 rounded-lg border px-2 text-center"
                    value={line.quantity}
                    onChange={(e) => {
                      const next = Number(e.target.value);
                      if (!Number.isFinite(next)) return;
                      setQty(line.productId, Math.min(max, Math.max(1, Math.round(next))));
                    }}
                  />
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
        <h2 className="text-2xl">Delivery details</h2>
        <label className="grid gap-1 text-sm">
          Country
          <input className="rounded-xl border px-3 py-2" value={delivery.country} onChange={(e) => setField("country", e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          Your name
          <input className="rounded-xl border px-3 py-2" value={delivery.name} onChange={(e) => setField("name", e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          Full address
          <textarea
            className="rounded-xl border px-3 py-2"
            rows={3}
            value={delivery.address}
            onChange={(e) => setField("address", e.target.value)}
          />
        </label>
        <fieldset className="grid gap-2 text-sm">
          <legend>This address is</legend>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="dwelling"
              checked={delivery.dwelling === "home"}
              onChange={() => setField("dwelling", "home")}
            />
            Home
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="dwelling"
              checked={delivery.dwelling === "apartment"}
              onChange={() => setField("dwelling", "apartment")}
            />
            Apartment
          </label>
        </fieldset>
        <label className="grid gap-1 text-sm">
          City
          <input className="rounded-xl border px-3 py-2" value={delivery.city} onChange={(e) => setField("city", e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          State
          <input className="rounded-xl border px-3 py-2" value={delivery.state} onChange={(e) => setField("state", e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          PIN code
          <input
            className="rounded-xl border px-3 py-2"
            inputMode="numeric"
            maxLength={6}
            value={delivery.pincode}
            onChange={(e) => setField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
          />
        </label>
        <label className="grid gap-1 text-sm">
          Phone number
          <input
            className="rounded-xl border px-3 py-2"
            inputMode="tel"
            value={delivery.phone}
            onChange={(e) => setField("phone", e.target.value)}
          />
        </label>
        <div className="rounded-2xl bg-cream px-4 py-3">
          <p className="text-sm text-muted">Amount you will pay</p>
          <p className="text-3xl font-semibold text-rose">{inr(total)}</p>
          <p className="text-sm text-muted">Updates automatically when you change quantity.</p>
        </div>
        <p className="flex justify-between">
          <span>Subtotal (qty × price)</span>
          <strong>{inr(subtotal)}</strong>
        </p>
        <CheckoutPay amount={total} note={payNote} method={method} onMethod={setMethod} />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          onClick={payNow}
          disabled={saving}
          className="rounded-full bg-rose px-4 py-3 text-lg font-semibold text-white"
        >
          {saving ? "Paying…" : `Pay Now · ${inr(total)}`}
        </button>
        <a
          href={validateDelivery(delivery) ? undefined : waLink(settings.whatsapp, orderText)}
          onClick={(e) => {
            const problem = validateDelivery(delivery);
            if (problem) {
              e.preventDefault();
              setError(problem);
            }
          }}
          className="rounded-full bg-[#25D366] px-4 py-3 text-center font-semibold text-white"
          target="_blank"
          rel="noreferrer"
        >
          Send this order on WhatsApp
        </a>
      </aside>
    </div>
  );
}
