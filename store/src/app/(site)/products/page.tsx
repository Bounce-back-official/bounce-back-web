import { ProductCard } from "@/components/ProductCard";
import { isDemoId } from "@/lib/demoProducts";
import { getProducts } from "@/lib/products";

export const metadata = { title: "สินค้าทั้งหมด" };

const categoryLabels: Record<string, string> = {
  shirts: "เสื้อ",
  pants: "กางเกง",
  accessories: "อุปกรณ์",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { category } = await searchParams;
  const selected = typeof category === "string" ? categoryLabels[category] : undefined;
  const allProducts = await getProducts();
  const products = selected ? allProducts.filter((p) => p.category === selected) : allProducts;
  const isDemo = products.some((p) => isDemoId(p._id));

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <p className="eyebrow">ALL PRODUCTS</p>
          <h2>{selected ?? "สินค้าทั้งหมด"}</h2>
          <p className="meta">{products.length} แบบ</p>
        </div>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {isDemo && (
        <p className="demo-note" style={{ color: "rgba(14,14,16,.55)" }}>
          รายการที่มีป้าย MOCKUP เป็นแบบจำลองสินค้า ราคาเป็นตัวอย่าง ยังไม่เปิดจำหน่าย
        </p>
      )}
    </section>
  );
}
