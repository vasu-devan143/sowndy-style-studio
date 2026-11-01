"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/brand";
import { waLink } from "@/lib/format";
import { useStore } from "@/lib/store";
import { supabaseSetupHint } from "@/lib/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { SafeImage } from "@/components/SafeImage";

export default function HomePage() {
  const { products, settings, ready } = useStore();
  const latest = [...products]
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
    .slice(0, 4);
  const hero = products[0];

  if (!ready) return <p className="text-muted">Loading shop…</p>;
  const setupHint = supabaseSetupHint();

  return (
    <div className="grid gap-10">
      {setupHint && (
        <p className="rounded-2xl border border-gold/40 bg-white px-4 py-3 text-sm text-muted">{setupHint}</p>
      )}
      <section className="overflow-hidden rounded-3xl bg-white shadow-sm md:grid md:grid-cols-2">
        <div className="aspect-[4/5] md:aspect-auto">
          <SafeImage
            src={hero?.images[0] ?? ""}
            alt={hero?.name ?? settings.brand_name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
          <p className="text-sm tracking-[0.25em] text-gold uppercase">Women&apos;s ethnic wear</p>
          <h1 className="text-4xl leading-tight md:text-5xl">{settings.brand_name}</h1>
          <p className="text-muted">
            Sarees, chudidar and ready-to-wear pre-pleated sarees. See a piece you love? Add it to
            your bag and order on WhatsApp.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/sarees" className="rounded-full bg-rose px-5 py-3 text-center font-semibold text-white">
              Shop sarees
            </Link>
            <a
              href={waLink(settings.whatsapp, `Hi ${settings.brand_name}, I want to place an order.`)}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-rose px-5 py-3 text-center font-semibold text-rose"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-3xl">Shop by category</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const cover = products.find((p) => p.category === cat.slug);
            return (
              <Link key={cat.slug} href={cat.href} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="aspect-[5/4]">
                  <SafeImage
                    src={cover?.images[0] ?? ""}
                    alt={cat.label}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="p-4 text-xl font-medium">{cat.label}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-3xl">Latest arrivals</h2>
          <Link href="/new-collections" className="text-sm font-semibold text-rose">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {latest.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
