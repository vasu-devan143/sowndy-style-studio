"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

const LINKS = [
  { href: "/admin", label: "Home numbers" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/billing", label: "New bill" },
  { href: "/admin/sales", label: "Sales & bills" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { ready, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (ready && !isAdmin) router.replace("/admin/login");
  }, [isAdmin, ready, router]);

  if (!ready) return <p>Loading…</p>;
  if (!isAdmin) return null;

  return (
    <div className="grid gap-4">
      <div className="no-print flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl">Shop desk</h1>
        <button
          type="button"
          className="rounded-full bg-rose px-4 py-2 text-sm font-semibold text-white"
          onClick={async () => {
            await logout();
            router.replace("/admin/login");
          }}
        >
          வெளியேறு / Log out
        </button>
      </div>
      <nav className="no-print flex gap-2 overflow-x-auto pb-1">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap ${
              pathname === link.href ? "bg-rose text-white" : "bg-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
