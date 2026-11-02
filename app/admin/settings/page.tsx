"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import type { ShopSettings } from "@/lib/types";

export default function SettingsPage() {
  const { settings, saveSettings, uploadPhotos, ready } = useStore();
  const [form, setForm] = useState<ShopSettings>(settings);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setForm(settings), [settings]);

  if (!ready) return <p>Loading…</p>;

  const set = (key: keyof ShopSettings, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <form
      className="grid gap-3 rounded-2xl bg-white p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
          await saveSettings(form);
          setSaved(true);
          setTimeout(() => setSaved(false), 1500);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not save");
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2 className="text-2xl">Shop settings</h2>
      <label className="grid gap-1 text-sm">
        Shop logo
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const [url] = await uploadPhotos([file]);
            set("logo_url", url);
          }}
        />
        <span className="text-xs text-muted">Upload from phone gallery or computer. This replaces the text logo in the header.</span>
      </label>
      {form.logo_url && (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={form.logo_url} alt="Shop logo" className="h-16 w-auto max-w-[200px] object-contain" />
          <button type="button" className="text-sm text-red-700" onClick={() => set("logo_url", "")}>
            Remove logo
          </button>
        </div>
      )}
      {(
        [
          ["brand_name", "Brand name"],
          ["phone", "Phone"],
          ["whatsapp", "WhatsApp number with country code (example: 91XXXXXXXXXX)"],
          ["instagram", "Instagram page link"],
          ["youtube", "YouTube page link"],
          ["upi_id", "UPI ID"],
          ["address", "Address"],
          ["bill_footer", "Text at the bottom of the bill"],
          ["map_embed_url", "Google Maps embed link"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="grid gap-1 text-sm">
          {label}
          {key === "address" || key === "bill_footer" ? (
            <textarea className="rounded-xl border px-3 py-3" value={form[key]} onChange={(e) => set(key, e.target.value)} />
          ) : (
            <input className="rounded-xl border px-3 py-3" value={form[key]} onChange={(e) => set(key, e.target.value)} />
          )}
          {key === "whatsapp" ? (
            <span className="text-xs text-muted">
              Customer Order on WhatsApp buttons use this number. Include country code, without spaces.
            </span>
          ) : null}
          {key === "phone" ? (
            <span className="text-xs text-muted">Shown to visitors. Tapping Phone on the site starts a call.</span>
          ) : null}
          {key === "instagram" || key === "youtube" ? (
            <span className="text-xs text-muted">
              Shown to visitors on phones and computers. Paste the full https link to your page.
            </span>
          ) : null}
        </label>
      ))}
      <label className="grid gap-1 text-sm">
        UPI QR photo
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const [url] = await uploadPhotos([file]);
            set("upi_qr_url", url);
          }}
        />
      </label>
      {form.upi_qr_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={form.upi_qr_url} alt="UPI QR" className="h-40 w-40 object-contain" />
      )}
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button disabled={busy} className="rounded-full bg-rose px-4 py-3 font-semibold text-white">
        {busy ? "Saving…" : saved ? "Saved" : "Save settings"}
      </button>
    </form>
  );
}
