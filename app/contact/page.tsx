"use client";

import { waLink } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function ContactPage() {
  const { settings } = useStore();
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="mb-4 text-3xl">Contact</h1>
        <p className="mb-2">{settings.address}</p>
        <p className="mb-2">Phone: {settings.phone}</p>
        <div className="mt-4 grid gap-3">
          <a
            href={waLink(settings.whatsapp, `Hi ${settings.brand_name}, I have a question.`)}
            className="rounded-full bg-[#25D366] px-4 py-3 text-center font-semibold text-white"
            target="_blank"
            rel="noreferrer"
          >
            Message on WhatsApp
          </a>
          <a href={`tel:${settings.phone}`} className="rounded-full border border-rose px-4 py-3 text-center font-semibold text-rose">
            Call us
          </a>
          <a
            href={settings.instagram}
            className="rounded-full border px-4 py-3 text-center font-semibold"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        </div>
      </section>
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <iframe
          title="Shop map"
          src={settings.map_embed_url}
          className="h-80 w-full border-0"
          loading="lazy"
        />
      </section>
    </div>
  );
}
