import { stockStatus } from "@/lib/types";

export function StockBadge({ qty }: { qty: number }) {
  const status = stockStatus(qty);
  const map = {
    available: { label: "Available", className: "bg-emerald-100 text-emerald-800" },
    few_left: { label: "Few Left", className: "bg-orange-100 text-orange-800" },
    sold_out: { label: "Sold Out", className: "bg-red-100 text-red-800" },
  } as const;
  const item = map[status];
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.className}`}>
      {item.label}
    </span>
  );
}
