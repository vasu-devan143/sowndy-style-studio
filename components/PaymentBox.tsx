"use client";

import { useState } from "react";
import { inr, upiLink } from "@/lib/format";
import { useStore } from "@/lib/store";
import { SafeImage } from "./SafeImage";

export function PaymentBox({ amount, note }: { amount: number; note: string }) {
  const { settings } = useStore();
  const [copied, setCopied] = useState(false);
  const payHref = upiLink(settings.upi_id, settings.brand_name, amount, note);

  const copy = async () => {
    await navigator.clipboard.writeText(settings.upi_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-2xl">Pay with UPI</h2>
      {settings.upi_qr_url ? (
        <SafeImage src={settings.upi_qr_url} alt="UPI QR code" className="mx-auto mb-3 h-44 w-44 object-contain" />
      ) : (
        <p className="mb-3 rounded-xl bg-cream-dark p-3 text-sm text-muted">
          QR code will appear here after the owner uploads it in Settings.
        </p>
      )}
      <div className="flex items-center justify-between gap-2 rounded-xl bg-cream px-3 py-2">
        <span className="text-sm">
          UPI ID: <strong>{settings.upi_id}</strong>
        </span>
        <button onClick={copy} className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-rose">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <a
        href={payHref}
        className="mt-3 block rounded-full bg-rose px-4 py-3 text-center font-semibold text-white"
      >
        Pay {inr(amount)} with GPay / PhonePe / Paytm
      </a>
      <p className="mt-3 text-sm text-muted">After payment, send the screenshot on WhatsApp.</p>
    </section>
  );
}
