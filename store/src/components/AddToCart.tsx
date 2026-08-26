"use client";

import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/lib/cart";

type VariantInput = {
  size?: string;
  color?: string;
  sku?: string;
  stock: number;
};

type Props = {
  productId: string;
  slug: string;
  title: string;
  price: number;
  imageUrl: string | null;
  variants: VariantInput[];
};

export function AddToCart({
  productId,
  slug,
  title,
  price,
  imageUrl,
  variants,
}: Props) {
  const { add } = useCart();
  const hasVariants = variants.length > 0;

  const [selectedIdx, setSelectedIdx] = useState<number | null>(
    hasVariants ? null : 0,
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const selected = selectedIdx != null ? variants[selectedIdx] : null;
  const maxStock = hasVariants ? (selected?.stock ?? 0) : 99;
  const canAdd = hasVariants ? selected != null && maxStock > 0 : true;

  function chooseVariant(idx: number) {
    setSelectedIdx(idx);
    setQty(1);
    setAdded(false);
  }

  function handleAdd() {
    if (!canAdd) return;
    add({
      productId,
      slug,
      title,
      price,
      imageUrl,
      size: selected?.size,
      color: selected?.color,
      qty,
      maxStock,
    });
    setAdded(true);
  }

  return (
    <div>
      {hasVariants && (
        <div style={{ marginBottom: 24 }}>
          <p className="eyebrow" style={{ margin: "0 0 12px" }}>
            เลือกตัวเลือก
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {variants.map((v, i) => {
              const label = [v.color, v.size].filter(Boolean).join(" / ");
              const soldOut = v.stock <= 0;
              const isSelected = selectedIdx === i;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={soldOut}
                  onClick={() => chooseVariant(i)}
                  style={{
                    border: "1px solid",
                    borderColor: isSelected
                      ? "var(--obsidian)"
                      : "rgba(14,14,16,.25)",
                    background: isSelected ? "var(--obsidian)" : "transparent",
                    color: soldOut
                      ? "rgba(14,14,16,.4)"
                      : isSelected
                        ? "var(--bone)"
                        : "var(--obsidian)",
                    textDecoration: soldOut ? "line-through" : "none",
                    padding: "10px 14px",
                    fontSize: 13,
                    cursor: soldOut ? "not-allowed" : "pointer",
                  }}
                >
                  {label || "ตัวเลือก"}
                  {soldOut ? " (หมด)" : ""}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* จำนวน */}
      <div style={{ marginBottom: 24 }}>
        <p className="eyebrow" style={{ margin: "0 0 12px" }}>
          จำนวน
        </p>
        <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid rgba(14,14,16,.25)" }}>
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="ลดจำนวน"
            style={qtyBtnStyle}
          >
            −
          </button>
          <span style={{ minWidth: 44, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(maxStock, q + 1))}
            disabled={!canAdd || qty >= maxStock}
            aria-label="เพิ่มจำนวน"
            style={qtyBtnStyle}
          >
            +
          </button>
        </div>
        {hasVariants && selected && (
          <span style={{ marginLeft: 12, fontSize: 12, color: "rgba(14,14,16,.55)" }}>
            คงเหลือ {maxStock} ชิ้น
          </span>
        )}
      </div>

      <button
        type="button"
        className="button button--dark"
        onClick={handleAdd}
        disabled={!canAdd}
        style={{ width: "100%" }}
      >
        {hasVariants && !selected
          ? "เลือกตัวเลือกก่อน"
          : maxStock <= 0
            ? "สินค้าหมด"
            : "เพิ่มลงตะกร้า"}
      </button>

      {added && (
        <p style={{ marginTop: 14, textAlign: "center", fontSize: 14 }}>
          เพิ่มลงตะกร้าแล้ว ✓{" "}
          <Link href="/cart" style={{ textDecoration: "underline" }}>
            ดูตะกร้า
          </Link>
        </p>
      )}
    </div>
  );
}

const qtyBtnStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  fontSize: 18,
  background: "transparent",
  border: "none",
  cursor: "pointer",
  color: "var(--obsidian)",
};
