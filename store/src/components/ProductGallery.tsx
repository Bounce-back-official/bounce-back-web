"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * แกลเลอรีรูปสินค้า — กดรูปย่อยเพื่อเปลี่ยนรูปหลักได้
 * รับ images เป็น URL พร้อมใช้ (resolve มาแล้วจากหน้า product)
 */
export function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div
        className="product-card__media"
        style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden" }}
      >
        <span className="product-card__mark">B</span>
      </div>
    );
  }

  const current = images[Math.min(active, images.length - 1)];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* รูปหลัก */}
      <div
        className="product-card__media"
        style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden" }}
      >
        <Image
          src={current}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* รูปย่อย — กดเปลี่ยนรูปหลัก */}
      {images.length > 1 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(images.length, 4)}, 1fr)`,
            gap: "12px",
          }}
        >
          {images.map((img, i) => {
            const isActive = i === active;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`ดูรูปที่ ${i + 1} ของ ${title}`}
                aria-pressed={isActive}
                className="product-card__media"
                style={{
                  position: "relative",
                  aspectRatio: "1",
                  overflow: "hidden",
                  padding: 0,
                  border: "none",
                  cursor: "pointer",
                  outline: isActive
                    ? "2px solid #0e0e10"
                    : "2px solid transparent",
                  outlineOffset: "2px",
                  opacity: isActive ? 1 : 0.55,
                  transition: "opacity .2s ease",
                }}
              >
                <Image src={img} alt={`${title} รูปที่ ${i + 1}`} fill sizes="120px" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
