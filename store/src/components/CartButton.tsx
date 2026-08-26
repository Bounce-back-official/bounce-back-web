"use client";

import Link from "next/link";

import { useCart } from "@/lib/cart";

export function CartButton() {
  const { count, ready } = useCart();
  return (
    <Link href="/cart" className="cart-button" aria-label="ตะกร้าสินค้า">
      ตะกร้า
      {ready && count > 0 && <span className="cart-button__badge">{count}</span>}
    </Link>
  );
}
