"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine } from "@/lib/commerce/types";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  hydrated: boolean;
  add: (variantId: string, quantity?: number) => void;
  update: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "mio-studio-demo-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    let restored: CartLine[] = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) restored = JSON.parse(saved) as CartLine[];
    } catch { localStorage.removeItem(STORAGE_KEY); }
    const task = window.setTimeout(() => { setLines(restored); setHydrated(true); }, 0);
    return () => window.clearTimeout(task);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines)); }, [hydrated, lines]);
  const add = useCallback((variantId: string, quantity = 1) => setLines((current) => {
    const existing = current.find((line) => line.variantId === variantId);
    if (existing) return current.map((line) => line.variantId === variantId ? { ...line, quantity: Math.min(20, line.quantity + quantity) } : line);
    return [...current, { variantId, quantity: Math.min(20, quantity) }];
  }), []);
  const update = useCallback((variantId: string, quantity: number) => {
    if (quantity <= 0) setLines((current) => current.filter((line) => line.variantId !== variantId));
    else setLines((current) => current.map((line) => line.variantId === variantId ? { ...line, quantity: Math.min(20, quantity) } : line));
  }, []);
  const remove = useCallback((variantId: string) => setLines((current) => current.filter((line) => line.variantId !== variantId)), []);
  const clear = useCallback(() => setLines([]), []);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const value = useMemo(() => ({ lines, count, hydrated, add, update, remove, clear }), [lines, count, hydrated, add, update, remove, clear]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
