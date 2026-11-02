"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { NAV_LINKS } from "@/lib/brand";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { Logo } from "./Logo";
import { PublicContactLinks } from "./PublicContactLinks";
import { WeAccept } from "./WeAccept";

export function Footer() {
  const { settings } = useStore();
  const { isAdmin, logout } = useAuth();
  const router = useRouter();
  return (
    <footer className="mt-auto border-t border-gold/30 bg-cream-dark/60">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted">{settings.address}</p>
        </div>
        <div className="grid gap-2 text-sm">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-rose">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="text-sm">
          <PublicContactLinks className="grid gap-2" />
          <WeAccept />
          {isAdmin && (
            <p className="mt-4 text-xs">
              <button
                type="button"
                className="font-semibold text-rose"
                onClick={async () => {
                  await logout();
                  router.replace("/admin/login");
                }}
              >
                வெளியேறு / Log out
              </button>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
