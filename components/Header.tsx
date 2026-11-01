"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/brand";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { useStore } from "@/lib/store";
import { Logo } from "./Logo";

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
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" onClick={() => setOpen(false)} aria-label={settings.brand_name}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-ink/80 hover:text-rose">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
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
