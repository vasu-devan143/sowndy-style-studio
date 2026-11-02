"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/brand";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { useStore } from "@/lib/store";
import { CouponBox } from "./CouponBox";
import { Logo } from "./Logo";
import { PublicSocialLinks } from "./PublicSocialLinks";

export function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { settings } = useStore();
  const { isAdmin, logout, ready } = useAuth();
  const router = useRouter();

  const logOut = async () => {
    setOpen(false);
    await logout();
    router.replace("/admin/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gold/30 bg-cream/95 backdrop-blur">
      <div className="relative mx-auto max-w-6xl px-4 py-4">
        <div className="flex justify-center">
          <Link href="/" onClick={() => setOpen(false)} aria-label={settings.brand_name} className="relative block">
            <Logo className="h-16 max-w-[240px] text-2xl md:h-24 md:max-w-[340px] md:text-4xl" />
            {settings.logo_url ? (
              <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 text-right md:mr-5">
                <span className="logo-type block text-lg font-semibold tracking-[0.18em] text-rose md:text-3xl">
                  {(settings.brand_name || "SOWNDY STYLE STUDIO").split(" ")[0]}
                </span>
                <span className="logo-type block text-[11px] font-medium tracking-[0.28em] text-ink/80 md:text-base">
                  {(settings.brand_name || "SOWNDY STYLE STUDIO").split(" ").slice(1).join(" ")}
                </span>
              </span>
            ) : null}
          </Link>
        </div>
        <div className="absolute right-4 top-4 flex items-center gap-2">
          {ready && isAdmin && (
            <button
              type="button"
              onClick={logOut}
              className="rounded-full bg-rose px-3 py-2 text-sm font-semibold text-white"
            >
              வெளியேறு
            </button>
          )}
          <Link
            href="/cart"
            className="relative rounded-full border border-rose/20 bg-white px-3 py-2 text-sm font-semibold text-rose"
          >
            Bag & bill {count > 0 ? `(${count})` : ""}
          </Link>
          <button
            className="rounded-full border border-ink/15 px-3 py-2 text-sm md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
          >
            Menu
          </button>
        </div>
        <nav className="mt-3 hidden flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-ink/80 hover:text-rose">
              {link.label}
            </Link>
          ))}
        </nav>
        <CouponBox />
      </div>
      {open && (
        <nav className="grid gap-1 border-t border-gold/20 bg-cream px-4 py-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-3 text-base font-medium hover:bg-cream-dark"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <PublicSocialLinks
            className="mt-2 grid gap-2"
            linkClassName="rounded-xl px-3 py-3 text-base font-semibold text-rose hover:bg-cream-dark"
          />
          {isAdmin && (
            <>
              <Link href="/admin" className="rounded-xl px-3 py-3 text-sm font-semibold text-rose" onClick={() => setOpen(false)}>
                Shop desk
              </Link>
              <button type="button" className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-rose" onClick={logOut}>
                வெளியேறு / Log out
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
