"use client";

import { BRAND } from "@/lib/brand";
import { useStore } from "@/lib/store";

export function Logo({ className = "" }: { className?: string }) {
  const { settings } = useStore();
  const name = settings.brand_name || BRAND.name;
  const first = name.split(" ")[0] || "SOWNDY";
  const rest = name.split(" ").slice(1).join(" ") || "STYLE STUDIO";

  if (settings.logo_url?.length) {
    return (
      <span className="logo-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={settings.logo_url}
          alt={name}
          className={`logo-photo w-auto object-contain ${className || "h-8 max-w-[140px]"}`}
        />
      </span>
    );
  }

  return (
    <span className={`logo-type leading-tight ${className || "text-base"}`}>
      <span className="block text-[1.15em] font-semibold tracking-[0.28em] text-rose">{first}</span>
      <span className="block text-[0.58em] font-medium tracking-[0.42em] text-ink/80">{rest}</span>
    </span>
  );
}
