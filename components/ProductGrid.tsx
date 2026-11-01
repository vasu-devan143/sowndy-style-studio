"use client";

import { useMemo, useState } from "react";
import type { Product, StockStatus } from "@/lib/types";
import { stockStatus } from "@/lib/types";
import { ProductCard } from "./ProductCard";

const FILTERS: { id: "all" | StockStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "available", label: "Available" },
  { id: "sold_out", label: "Sold Out" },
];

export function ProductGrid({ products, title }: { products: Product[]; title?: string }) {
  const [filter, setFilter] = useState<"all" | StockStatus>("all");
  const list = useMemo(() => {
    if (filter === "all") return products;
    if (filter === "available") {
      return products.filter((p) => stockStatus(p.stock_quantity) !== "sold_out");
    }
    return products.filter((p) => stockStatus(p.stock_quantity) === filter);
  }, [filter, products]);

  return (
    <div>
      {title && <h1 className="mb-4 text-3xl md:text-4xl">{title}</h1>}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap ${
              filter === tab.id ? "bg-rose text-white" : "bg-white text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-muted">No items in this list yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
