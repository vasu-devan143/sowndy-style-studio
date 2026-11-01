import { BRAND } from "@/lib/brand";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`logo-type leading-tight ${className}`}>
      <span className="block text-[1.15em] font-semibold tracking-[0.28em] text-rose">
        {BRAND.name.split(" ")[0]}
      </span>
      <span className="block text-[0.58em] font-medium tracking-[0.42em] text-ink/80">
        STYLE STUDIO
      </span>
    </span>
  );
}
