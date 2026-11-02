"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/brand";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { useStore } from "@/lib/store";
import { Logo } from "./Logo";
import { ProductSearch } from "./ProductSearch";

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
    <header className="relative overflow-visible border-b border-gold/30 bg-cream/95">
      <div className="relative mx-auto max-w-6xl overflow-visible px-3 py-3 md:px-4 md:py-4">
        <div className="relative md:hidden">
          {settings.logo_url ? (
            <span className="brand-beside-logo absolute left-0 top-1/2 z-10 -translate-y-1/2 text-left">
              <span className="logo-type block text-lg font-semibold tracking-[0.14em] text-rose">
                {(settings.brand_name || "SOWNDY STYLE STUDIO").split(" ")[0]}
              </span>
              <span className="block font-sans text-xs font-bold tracking-[0.16em] text-rose">
                {(settings.brand_name || "SOWNDY STYLE STUDIO").split(" ").slice(1).join(" ")}
              </span>
            </span>
          ) : null}
          <div className="-mt-1 flex justify-center">
            <Link href="/" onClick={() => setOpen(false)} aria-label={settings.brand_name}>
              <Logo className="h-[4.5rem] max-w-[165px] text-2xl" />
            </Link>
          </div>
        </div>
        <div className="hidden justify-center md:flex">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            aria-label={settings.brand_name}
            className="flex items-center justify-center gap-4"
          >
            {settings.logo_url ? (
              <span className="brand-beside-logo text-right">
                <span className="logo-type block text-lg font-semibold tracking-[0.14em] text-rose md:text-[2.85rem]">
                  {(settings.brand_name || "SOWNDY STYLE STUDIO").split(" ")[0]}
                </span>
                <span className="block font-sans text-xs font-bold tracking-[0.16em] text-rose md:text-xl">
                  {(settings.brand_name || "SOWNDY STYLE STUDIO").split(" ").slice(1).join(" ")}
                </span>
              </span>
            ) : null}
            <Logo className="h-28 max-w-[380px] text-4xl" />
          </Link>
        </div>
        <div className="absolute right-4 top-3 flex items-center gap-2 md:top-4">
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
            className="relative rounded-full border border-rose/20 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose md:px-3 md:py-2 md:text-sm"
          >
            Bag {count > 0 ? `(${count})` : ""}
          </Link>
          <button
            className="rounded-full border border-ink/15 px-2.5 py-1.5 text-xs md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
          >
            Menu
          </button>
        </div>
        <nav className="mt-2 hidden flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-ink/80 hover:text-rose">
              {link.label}
            </Link>
          ))}
        </nav>
        <ProductSearch />
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
