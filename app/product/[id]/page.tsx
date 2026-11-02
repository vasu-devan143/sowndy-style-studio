"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { HeartButton } from "@/components/HeartButton";
import { ProductPrice } from "@/components/ProductPrice";
import { PaymentBox } from "@/components/PaymentBox";
import { SafeImage } from "@/components/SafeImage";
import { StockBadge } from "@/components/StockBadge";
import { WhatsAppOrderButton } from "@/components/WhatsAppOrderButton";
import { useCart } from "@/lib/cart";
import { waLink } from "@/lib/format";
import { useStore } from "@/lib/store";
import { stockStatus } from "@/lib/types";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { products, settings, ready } = useStore();
  const { add } = useCart();
  const [photo, setPhoto] = useState(0);

  const product = useMemo(() => products.find((p) => p.id === id), [id, products]);

  if (!ready) return <p>Loading…</p>;
  if (!product) return <p>This item is not in the shop anymore.</p>;

  const sold = stockStatus(product.stock_quantity) === "sold_out";
  const notifyMsg = `Hi ${settings.brand_name}, please notify me when this is back: ${product.name}\n${typeof window !== "undefined" ? `${window.location.origin}/product/${product.id}` : ""}`;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <div className={`overflow-hidden rounded-3xl bg-white ${sold ? "opacity-50" : ""}`}>
          <SafeImage
            src={product.images[photo] ?? product.images[0]}
            alt={product.name}
            className="aspect-[3/4] w-full object-cover"
            controls
          />
        </div>
        {product.images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {product.images.map((src, i) => (
              <button key={src + i} onClick={() => setPhoto(i)} className="h-20 w-16 shrink-0 overflow-hidden rounded-xl">
                <SafeImage src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="grid gap-4">
        <StockBadge qty={product.stock_quantity} />
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-4xl">{product.name}</h1>
          <HeartButton productId={product.id} className="mt-1 text-2xl text-rose" />
        </div>
        <ProductPrice
          price={product.price}
          originalPrice={product.original_price}
          className="flex flex-wrap items-baseline gap-3 text-2xl"
        />
        <p className="text-muted">{product.description}</p>
        <ul className="text-sm">
          <li>Fabric: {product.fabric}</li>
          <li>Colour: {product.color}</li>
          <li>Sizes: {product.sizes}</li>
        </ul>
        {sold ? (
          <a
            href={waLink(settings.whatsapp, notifyMsg)}
            className="rounded-full bg-rose px-5 py-3 text-center font-semibold text-white"
            target="_blank"
            rel="noreferrer"
          >
            Notify me on WhatsApp
          </a>
        ) : (
          <>
            <Link
              href="/cart"
              onClick={() => add(product)}
              className="rounded-full bg-rose px-5 py-3 text-center font-semibold text-white"
            >
              Add to bag & bill
            </Link>
            <WhatsAppOrderButton product={product} settings={settings} />
            {settings.instagram && (
              <a
                href={settings.instagram}
                className="rounded-full border px-5 py-3 text-center font-semibold"
                target="_blank"
                rel="noreferrer"
              >
                Message us on Instagram
              </a>
            )}
            {settings.youtube && (
              <a
                href={settings.youtube}
                className="rounded-full border px-5 py-3 text-center font-semibold"
                target="_blank"
                rel="noreferrer"
              >
                Watch on YouTube
              </a>
            )}
            <PaymentBox amount={product.price} note={product.name} />
          </>
        )}
      </div>
    </div>
  );
}
