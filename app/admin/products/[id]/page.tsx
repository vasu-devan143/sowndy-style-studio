"use client";

import { useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { useStore } from "@/lib/store";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const { products, ready } = useStore();
  const product = products.find((p) => p.id === id);
  if (!ready) return <p>Loading…</p>;
  if (!product) return <p>Product not found.</p>;
  return (
    <div className="grid gap-3">
      <h2 className="text-2xl">Edit product</h2>
      <ProductForm product={product} />
    </div>
  );
}
