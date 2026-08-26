"use client";

import Image from "next/image";
import Link from "next/link";

import { formatBaht } from "@/lib/format";
import { useCart } from "@/lib/cart";

const FREE_SHIPPING = 1500;

export default function CartPage() {
  const { items, setQty, remove, subtotal, ready, count } = useCart();

  if (ready && count === 0) {
    return (
      <section className="section" style={{ textAlign: "center" }}>
        <p className="eyebrow">YOUR BAG</p>
        <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", margin: "0 0 16px" }}>
          ตะกร้าว่างอยู่
        </h2>
        <p style={{ color: "rgba(14,14,16,.65)" }}>
          ยังไม่มีสินค้าในตะกร้า ลองเลือกดูสินค้าของเราดูสิ
        </p>
        <Link className="button button--dark" href="/products" style={{ marginTop: 28 }}>
          เลือกดูสินค้า
        </Link>
      </section>
    );
  }

  const remaining = FREE_SHIPPING - subtotal;

  return (
    <section className="section">
      <div className="section-head" style={{ marginBottom: 24 }}>
        <div>
          <p className="eyebrow">YOUR BAG</p>
          <h2>ตะกร้าสินค้า</h2>
        </div>
      </div>

      <div style={{ maxWidth: 760 }}>
        {items.map((item) => {
          const meta = [item.color, item.size].filter(Boolean).join(" / ");
          return (
            <div className="cart-line" key={item.id}>
              <div className="cart-line__media">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.title} fill sizes="84px" />
                ) : (
                  <span className="product-card__mark" style={{ fontSize: 90 }}>
                    B
                  </span>
                )}
              </div>

              <div>
                <p className="cart-line__title">{item.title}</p>
                {meta && <p className="cart-line__meta">{meta}</p>}
                <p className="cart-line__meta">{formatBaht(item.price)}</p>
              </div>

              <div className="cart-line__right">
                <div className="cart-stepper">
                  <button
                    type="button"
                    aria-label="ลดจำนวน"
                    onClick={() => setQty(item.id, item.qty - 1)}
                  >
                    −
                  </button>
                  <span>{item.qty}</span>
                  <button
                    type="button"
                    aria-label="เพิ่มจำนวน"
                    disabled={item.qty >= item.maxStock}
                    onClick={() => setQty(item.id, item.qty + 1)}
                  >
                    +
                  </button>
                </div>
                <strong style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                  {formatBaht(item.price * item.qty)}
                </strong>
                <button
                  type="button"
                  className="cart-remove"
                  onClick={() => remove(item.id)}
                >
                  ลบ
                </button>
              </div>
            </div>
          );
        })}

        <div className="cart-summary">
          {remaining > 0 ? (
            <p style={{ fontSize: 13, color: "rgba(14,14,16,.6)", marginBottom: 6 }}>
              ซื้อเพิ่มอีก {formatBaht(remaining)} เพื่อรับ{" "}
              <strong>ส่งฟรี</strong>
            </p>
          ) : (
            <p style={{ fontSize: 13, color: "var(--line)", marginBottom: 6 }}>
              ✓ ได้รับสิทธิ์ส่งฟรีแล้ว
            </p>
          )}
          <div className="cart-summary__row cart-summary__total">
            <span>ยอดรวม</span>
            <span>{formatBaht(subtotal)}</span>
          </div>
          <p style={{ fontSize: 12, color: "rgba(14,14,16,.5)" }}>
            ค่าจัดส่งคำนวณในขั้นตอนชำระเงิน
          </p>

          <Link
            href="/checkout"
            className="button button--dark"
            style={{ width: "100%", marginTop: 16 }}
          >
            ดำเนินการชำระเงิน
          </Link>
          <p style={{ fontSize: 12, color: "rgba(14,14,16,.5)", textAlign: "center", marginTop: 8 }}>
            รองรับ QR PromptPay + บัตรเครดิต (เปิดใช้จริงเมื่อตั้งค่า Omise keys)
          </p>
          <Link
            href="/products"
            style={{ display: "block", textAlign: "center", fontSize: 13, textDecoration: "underline", marginTop: 4 }}
          >
            เลือกซื้อสินค้าต่อ
          </Link>
        </div>
      </div>
    </section>
  );
}
