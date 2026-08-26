"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  id: string; // productId::size::color
  productId: string;
  slug: string;
  title: string;
  imageUrl: string | null;
  price: number;
  size?: string;
  color?: string;
  qty: number;
  maxStock: number;
};

type AddInput = Omit<CartItem, "id" | "qty"> & { qty?: number };

type CartContextValue = {
  items: CartItem[];
  add: (item: AddInput) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  ready: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "bb_cart";

function makeId(productId: string, size?: string, color?: string) {
  return `${productId}::${size ?? ""}::${color ?? ""}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  // โหลดตะกร้าจาก localStorage หลัง mount (กัน hydration mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ไม่มีก็ไม่เป็นไร
    }
    setReady(true);
  }, []);

  // บันทึกทุกครั้งที่ตะกร้าเปลี่ยน
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage เต็ม/ปิดอยู่ — ข้าม
    }
  }, [items, ready]);

  const add = useCallback((input: AddInput) => {
    const id = makeId(input.productId, input.size, input.color);
    const addQty = input.qty ?? 1;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id
            ? { ...i, qty: Math.min(i.qty + addQty, i.maxStock) }
            : i,
        );
      }
      return [
        ...prev,
        { ...input, id, qty: Math.min(addQty, input.maxStock) },
      ];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      prev.flatMap((i) => {
        if (i.id !== id) return [i];
        const next = Math.max(0, Math.min(qty, i.maxStock));
        return next <= 0 ? [] : [{ ...i, qty: next }];
      }),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items],
  );
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.qty * i.price, 0),
    [items],
  );

  const value: CartContextValue = {
    items,
    add,
    remove,
    setQty,
    clear,
    count,
    subtotal,
    ready,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart ต้องอยู่ภายใน <CartProvider>");
  return ctx;
}
