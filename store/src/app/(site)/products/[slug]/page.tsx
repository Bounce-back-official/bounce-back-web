import { notFound } from "next/navigation";

import { AddToCart } from "@/components/AddToCart";
import { ProductGallery } from "@/components/ProductGallery";
import { formatBaht } from "@/lib/format";
import { getProduct } from "@/lib/products";
import { urlFor } from "@/sanity/lib/image";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  return { title: product?.title ?? "ไม่พบสินค้า" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const displayImages: string[] =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls
      : (product.images ?? []).map((im) =>
          urlFor(im).width(1000).height(1000).fit("crop").url(),
        );
  const imageUrl = displayImages[0] ?? null;
  const onSale =
    product.compareAtPrice != null && product.compareAtPrice > product.price;

  return (
    <section className="section">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "48px",
          alignItems: "start",
        }}
      >
        {/* Gallery */}
        <ProductGallery images={displayImages} title={product.title} />

        {/* Info */}
        <div>
          {product.category && (
            <p className="eyebrow" style={{ marginBottom: "12px" }}>
              {product.category}
            </p>
          )}
          <h1 style={{ fontSize: "clamp(30px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.03em", margin: 0 }}>
            {product.title}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "18px 0 24px" }}>
            <span style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: "24px", fontWeight: 700 }}>
              {formatBaht(product.price)}
            </span>
            {onSale && (
              <span style={{ color: "rgba(14,14,16,.45)", textDecoration: "line-through" }}>
                {formatBaht(product.compareAtPrice!)}
              </span>
            )}
          </div>

          {product.description && (
            <p style={{ marginBottom: "28px", color: "rgba(14,14,16,.7)", lineHeight: 1.8, whiteSpace: "pre-line" }}>
              {product.description}
            </p>
          )}

          {product.sizeChart && product.sizeChart.length > 0 && (
            <details
              style={{
                marginBottom: 28,
                borderTop: "1px solid rgba(14,14,16,.14)",
                borderBottom: "1px solid rgba(14,14,16,.14)",
                padding: "14px 0",
              }}
            >
              <summary style={{ cursor: "pointer", fontSize: 13, fontWeight: 600, letterSpacing: "0.04em" }}>
                📏 ตารางไซซ์ (ซม.)
              </summary>
              <div style={{ overflowX: "auto", marginTop: 14 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 320 }}>
                  <thead>
                    <tr>
                      {["ไซซ์", "รอบอก", "ความยาว", "แขน"].map((h) => (
                        <th
                          key={h}
                          style={{
                            textAlign: "left",
                            padding: "8px 10px",
                            borderBottom: "1px solid rgba(14,14,16,.2)",
                            color: "rgba(14,14,16,.55)",
                            fontWeight: 600,
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {product.sizeChart.map((r) => (
                      <tr key={r.size}>
                        <td style={{ padding: "8px 10px", borderBottom: "1px solid rgba(14,14,16,.08)" }}>
                          <strong>{r.size}</strong>
                        </td>
                        <td style={{ padding: "8px 10px", borderBottom: "1px solid rgba(14,14,16,.08)", fontVariantNumeric: "tabular-nums" }}>
                          {r.chest ?? "-"}
                        </td>
                        <td style={{ padding: "8px 10px", borderBottom: "1px solid rgba(14,14,16,.08)", fontVariantNumeric: "tabular-nums" }}>
                          {r.length ?? "-"}
                        </td>
                        <td style={{ padding: "8px 10px", borderBottom: "1px solid rgba(14,14,16,.08)", fontVariantNumeric: "tabular-nums" }}>
                          {r.sleeve ?? "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p style={{ marginTop: 10, fontSize: 11, color: "rgba(14,14,16,.5)" }}>
                  * วัดแบบวางราบ อาจคลาดเคลื่อน ±1-2 ซม.
                </p>
              </div>
            </details>
          )}

          <AddToCart
            productId={product._id}
            slug={product.slug}
            title={product.title}
            price={product.price}
            imageUrl={imageUrl}
            variants={product.variants ?? []}
          />
        </div>
      </div>
    </section>
  );
}
