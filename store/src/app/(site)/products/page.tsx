import { ProductCard } from "@/components/ProductCard";
import { CATEGORY_SLUG_TO_TITLE, getProducts } from "@/lib/products";

export const metadata = { title: "สินค้าทั้งหมด" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { category } = await searchParams;
  const slug = typeof category === "string" ? category : undefined;
  const selected = slug ? CATEGORY_SLUG_TO_TITLE[slug] : undefined;
  const products = await getProducts(slug);

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <p className="eyebrow">{selected ? "CATEGORY" : "ALL PRODUCTS"}</p>
          <h2>{selected ?? "สินค้าทั้งหมด"}</h2>
          <p className="meta">{products.length} แบบ</p>
        </div>
      </div>

      {products.length === 0 ? (
        <p style={{ color: "rgba(14,14,16,.55)" }}>ยังไม่มีสินค้าในหมวดนี้</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
