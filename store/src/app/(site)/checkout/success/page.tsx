"use client";

import Link from "next/link";
import { useEffect } from "react";

import { useCart } from "@/lib/cart";

export default function CheckoutSuccessPage() {
  const { clear } = useCart();

  // เคลียร์ตะกร้าเมื่อชำระเงินสำเร็จ
  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <section className="section" style={{ textAlign: "center", maxWidth: 520, marginInline: "auto" }}>
      <p className="eyebrow">THANK YOU</p>
      <h2 style={{ fontSize: "clamp(30px,5vw,52px)", margin: "0 0 14px" }}>
        ขอบคุณสำหรับคำสั่งซื้อ
      </h2>
      <p style={{ color: "rgba(14,14,16,.65)", lineHeight: 1.8 }}>
        เราได้รับการชำระเงินเรียบร้อยแล้ว ทีมงานจะเตรียมจัดส่งสินค้า
        และติดต่อกลับทาง LINE / อีเมลของคุณ
      </p>
      <Link className="button button--dark" href="/products" style={{ marginTop: 26 }}>
        เลือกซื้อสินค้าต่อ
      </Link>
    </section>
  );
}
