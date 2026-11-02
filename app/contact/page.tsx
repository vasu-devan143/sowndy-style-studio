"use client";

import { PublicContactLinks } from "@/components/PublicContactLinks";
import { useStore } from "@/lib/store";

export default function ContactPage() {
  const { settings } = useStore();
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="mb-4 text-3xl">Contact</h1>
        <p className="mb-2">{settings.address}</p>
        <div className="mt-4">
          <PublicContactLinks className="grid gap-3" />
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
