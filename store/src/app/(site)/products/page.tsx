import { ProductCard } from "@/components/ProductCard";
import { isDemoId } from "@/lib/demoProducts";
import { getProducts } from "@/lib/products";

export const metadata = { title: "สินค้าทั้งหมด" };

export default async function ProductsPage() {
  const products = await getProducts();
  const isDemo = products.some((p) => isDemoId(p._id));

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <p className="eyebrow">ALL PRODUCTS</p>
          <h2>สินค้าทั้งหมด</h2>
        </div>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {isDemo && (
        <p className="demo-note" style={{ color: "rgba(14,14,16,.55)" }}>
          สินค้าเหล่านี้เป็นตัวอย่าง — เพิ่มสินค้าจริงได้ที่ /studio แล้วจะแสดงของจริงแทน
        </p>
      )}
    </section>
  );
}
