"use client";

import { useState } from "react";
import { inr } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { CheckoutPayMethod } from "@/lib/checkout";
import { SafeImage } from "./SafeImage";

const METHODS: { id: CheckoutPayMethod; label: string }[] = [
  { id: "upi", label: "UPI transaction" },
  { id: "rupay", label: "RuPay card" },
  { id: "visa", label: "Visa card" },
  { id: "gpay", label: "GPay" },
  { id: "phonepe", label: "PhonePe" },
];

export function CheckoutPay({
  amount,
  method,
  onMethod,
}: {
  amount: number;
  note?: string;
  method: CheckoutPayMethod;
  onMethod: (next: CheckoutPayMethod) => void;
}) {
  const { settings } = useStore();
  const [copied, setCopied] = useState(false);
  const cardBrand = method === "rupay" ? "RuPay" : "Visa";

  const copy = async () => {
    await navigator.clipboard.writeText(settings.upi_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <section className="grid gap-3 rounded-2xl border border-gold/30 bg-cream p-4">
      <h2 className="text-2xl">Payment</h2>
      <p className="text-sm text-muted">Tap one option to pay. This is only shown at checkout.</p>
      <div className="grid grid-cols-2 gap-2">
        {METHODS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onMethod(item.id)}
            className={`rounded-xl border px-3 py-3 text-sm font-semibold ${
              method === item.id ? "border-rose bg-rose text-white" : "border-black/10 bg-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {(method === "upi" || method === "gpay" || method === "phonepe") && (
        <>
          {settings.upi_qr_url ? (
            <SafeImage src={settings.upi_qr_url} alt="UPI QR code" className="mx-auto h-40 w-40 object-contain" />
          ) : (
            <p className="rounded-xl bg-white p-3 text-sm text-muted">
              UPI QR will appear here after it is uploaded in Owner Control.
            </p>
          )}
          <div className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2">
            <span className="text-sm">
              UPI ID: <strong>{settings.upi_id || "Not set yet"}</strong>
            </span>
            <button type="button" onClick={copy} className="rounded-full bg-cream px-3 py-1 text-sm font-semibold text-rose">
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </>
      )}

      {method === "upi" && (
        <p className="text-sm text-muted">Tap Pay Now to complete this UPI transaction.</p>
      )}
      {method === "gpay" && (
        <p className="text-sm text-muted">Tap Pay Now to open GPay for {inr(amount)}.</p>
      )}
      {method === "phonepe" && (
        <p className="text-sm text-muted">Tap Pay Now to open PhonePe for {inr(amount)}.</p>
      )}

      {(method === "rupay" || method === "visa") && (
        <div className="grid gap-2">
          <p className="text-sm text-muted">
            {cardBrand} details stay on this phone. A card gateway is still needed to actually charge the card. Tap Pay Now to place the order.
          </p>
          <input className="rounded-xl border bg-white px-3 py-2" placeholder="Name on card" autoComplete="cc-name" />
          <input
            className="rounded-xl border bg-white px-3 py-2"
            placeholder={`${cardBrand} card number`}
            inputMode="numeric"
            autoComplete="cc-number"
          />
          <div className="grid grid-cols-2 gap-2">
            <input className="rounded-xl border bg-white px-3 py-2" placeholder="MM/YY" autoComplete="cc-exp" />
            <input className="rounded-xl border bg-white px-3 py-2" placeholder="CVV" inputMode="numeric" autoComplete="cc-csc" />
          </div>
        </div>
      )}
    </section>
  );
}
