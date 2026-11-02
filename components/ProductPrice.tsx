import { inr } from "@/lib/format";

export function ProductPrice({
  price,
  originalPrice,
  className = "flex flex-wrap items-baseline gap-2",
}: {
  price: number;
  originalPrice: number;
  className?: string;
}) {
  const showOld = originalPrice > 0 && originalPrice > price;
  return (
    <p className={className}>
      {showOld ? <span className="text-muted line-through">{inr(originalPrice)}</span> : null}
      <span className="font-semibold text-rose">{inr(price)}</span>
    </p>
  );
}
