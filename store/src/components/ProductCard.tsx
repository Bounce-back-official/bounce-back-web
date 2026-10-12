import Image from "next/image";
import Link from "next/link";

import { formatBaht } from "@/lib/format";
import type { Product } from "@/lib/products";
import { urlFor } from "@/sanity/lib/image";

export function ProductCard({ product }: { product: Product }) {
  const img =
    product.imageUrls?.[0] ??
    (product.image
      ? urlFor(product.image).width(600).height(750).fit("crop").url()
      : null);

  const onSale =
    product.compareAtPrice != null && product.compareAtPrice > product.price;
  const totalStock = product.variants?.reduce(
    (sum, v) => sum + (v.stock || 0),
    0,
  );
  const lowStock =
    totalStock != null && totalStock > 0 && totalStock <= 5;

  const badge = product.mockup
    ? "MOCKUP"
    : onSale
    ? "SALE"
    : lowStock
      ? "LOW STOCK"
      : product.featured
        ? "NEW"
        : null;

  return (
    <Link href={`/products/${product.slug}`} className="product-card">
      <div className="product-card__media">
        {badge && <span className="product-card__badge">{badge}</span>}
        {img ? (
          <Image
            src={img}
            alt={product.title}
            fill
            sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 25vw"
          />
        ) : (
          <span className="product-card__mark">B</span>
        )}
      </div>
      <div className="product-card__info">
        <div>
          <h3>{product.title}</h3>
          {product.category && <p className="meta">{product.category}</p>}
        </div>
        <strong>{formatBaht(product.price)}</strong>
      </div>
    </Link>
  );
}
