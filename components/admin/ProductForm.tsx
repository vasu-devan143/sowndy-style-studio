"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SafeImage } from "@/components/SafeImage";
import { CATEGORIES } from "@/lib/brand";
import { isVideoFile, videoDurationSeconds } from "@/lib/media";
import { useStore } from "@/lib/store";
import type { CategorySlug, Product } from "@/lib/types";

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const { saveProduct, uploadPhotos } = useStore();
  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState<CategorySlug>(product?.category ?? "saree");
  const [price, setPrice] = useState(product?.price ?? 0);
  const [description, setDescription] = useState(product?.description ?? "");
  const [fabric, setFabric] = useState(product?.fabric ?? "");
  const [color, setColor] = useState(product?.color ?? "");
  const [sizes, setSizes] = useState(product?.sizes ?? "Free size");
  const [stock, setStock] = useState(product?.stock_quantity ?? 1);
  const [isNew, setIsNew] = useState(product?.is_new ?? false);
  const [coupon, setCoupon] = useState(product?.coupon_code ?? "");
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    try {
      const list = Array.from(files);
      for (const file of list) {
        if (isVideoFile(file)) {
          if (file.size > 40 * 1024 * 1024) {
            throw new Error("Video is too large. Please use a clip under about 40 MB.");
          }
          const seconds = await videoDurationSeconds(file);
          if (seconds > 12) {
            throw new Error("Please use a short video, about 10 seconds or less.");
          }
        }
      }
      const urls = await uploadPhotos(list);
      setImages((prev) => [...prev, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Photo upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      className="grid gap-3 rounded-2xl bg-white p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
          await saveProduct(
            {
              name,
              category,
              price: Number(price),
              description,
              fabric,
              color,
              sizes,
              stock_quantity: Number(stock),
              is_new: isNew,
              coupon_code: coupon,
              images,
            },
            product?.id,
          );
          router.push("/admin/products");
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not save");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className="grid gap-1 text-sm">
        Product name
        <input required className="rounded-xl border px-3 py-3" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label className="grid gap-1 text-sm">
        Category
        <select className="rounded-xl border px-3 py-3" value={category} onChange={(e) => setCategory(e.target.value as CategorySlug)}>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        Price (₹)
        <input type="number" min={0} className="rounded-xl border px-3 py-3" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
      </label>
      <label className="grid gap-1 text-sm">
        Coupon code for this product
        <input
          className="rounded-xl border px-3 py-3 uppercase"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          placeholder="Example: SS204"
          autoComplete="off"
        />
        <span className="text-xs text-muted">
          Optional. Share this on Instagram or WhatsApp. The customer types it on the website to open this
          product. Each product needs its own code.
        </span>
      </label>
      <label className="grid gap-1 text-sm">
        About this item
        <textarea className="rounded-xl border px-3 py-3" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <label className="grid gap-1 text-sm">
        Fabric
        <input className="rounded-xl border px-3 py-3" value={fabric} onChange={(e) => setFabric(e.target.value)} />
      </label>
      <label className="grid gap-1 text-sm">
        Colour
        <input className="rounded-xl border px-3 py-3" value={color} onChange={(e) => setColor(e.target.value)} />
      </label>
      <label className="grid gap-1 text-sm">
        Sizes
        <input className="rounded-xl border px-3 py-3" value={sizes} onChange={(e) => setSizes(e.target.value)} />
      </label>
      <label className="grid gap-1 text-sm">
        How many in stock
        <input type="number" min={0} className="rounded-xl border px-3 py-3" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
        Show in New Collections
      </label>
      <div>
        <p className="mb-2 text-sm">Photos and short videos (about 10 seconds)</p>
        {/* Android treats accept="image/*" as camera-only. File extensions open the gallery. */}
        <input
          id="product-photos-gallery"
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.heic,.heif,.gif,.mp4,.mov,.webm,.m4v"
          multiple
          className="sr-only"
          onChange={(e) => {
            void onFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <input
          id="product-photos-camera"
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={(e) => {
            void onFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <input
          id="product-photos-video"
          type="file"
          accept=".mp4,.mov,.webm,.m4v"
          className="sr-only"
          onChange={(e) => {
            void onFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <label
            htmlFor="product-photos-gallery"
            className="rounded-full bg-rose px-4 py-3 text-center text-sm font-semibold text-white"
          >
            Pick from gallery
          </label>
          <label
            htmlFor="product-photos-camera"
            className="rounded-full border border-rose px-4 py-3 text-center text-sm font-semibold text-rose"
          >
            Take photo
          </label>
          <label
            htmlFor="product-photos-video"
            className="rounded-full border border-rose px-4 py-3 text-center text-sm font-semibold text-rose"
          >
            Add video
          </label>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((src) => (
            <div key={src.slice(0, 40)} className="relative">
              <SafeImage src={src} alt="" className="h-24 w-20 rounded-xl object-cover" />
              <button
                type="button"
                className="absolute right-1 top-1 rounded-full bg-white px-2 text-xs"
                onClick={() => setImages((prev) => prev.filter((x) => x !== src))}
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button disabled={busy} className="rounded-full bg-rose px-4 py-3 font-semibold text-white">
        {busy ? "Saving…" : "Save product"}
      </button>
    </form>
  );
}
