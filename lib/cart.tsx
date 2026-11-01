"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine, Product } from "./types";

const KEY = "sowndy-cart-v1";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (product: Product, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify(lines));
  }, [hydrated, lines]);

  const add = (product: Product, qty = 1) => {
    if (product.stock_quantity <= 0) return;
    setLines((prev) => {
      const found = prev.find((l) => l.productId === product.id);
      if (found) {
        const nextQty = Math.min(product.stock_quantity, found.quantity + qty);
        return prev.map((l) => (l.productId === product.id ? { ...l, quantity: nextQty } : l));
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0] ?? "",
          quantity: Math.min(product.stock_quantity, qty),
        },
      ];
    });
  };

  const setQty = (productId: string, qty: number) => {
    setLines((prev) =>
      prev
        .map((l) => (l.productId === productId ? { ...l, quantity: qty } : l))
        .filter((l) => l.quantity > 0),
    );
  };

  const remove = (productId: string) => setLines((prev) => prev.filter((l) => l.productId !== productId));
  const clear = () => setLines([]);

  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const subtotal = lines.reduce((n, l) => n + l.price * l.quantity, 0);

  const value = useMemo(
    () => ({ lines, count, subtotal, add, setQty, remove, clear }),
    [lines, count, subtotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
