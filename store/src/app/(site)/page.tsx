import Image from "next/image";
import Link from "next/link";

import { ProductCard } from "@/components/ProductCard";
import { isDemoId } from "@/lib/demoProducts";
import { getFeaturedProducts, getProducts } from "@/lib/products";
import { site } from "@/lib/site";

const values = [
  { n: "01", t: "RESET", d: "พัก ตั้งหลัก แล้วค่อยเริ่มใหม่" },
  { n: "02", t: "REBUILD", d: "สร้างกิจวัตรที่เข้ากับชีวิตตอนนี้" },
  { n: "03", t: "RETURN", d: "กลับมาทำสิ่งที่อยากทำอีกครั้ง" },
  { n: "04", t: "EVERYDAY ATHLETIC", d: "ให้การขยับเป็นส่วนหนึ่งของวัน" },
];

const categories = [
  { label: "เสื้อ", href: "/products?category=shirts", cls: "" },
  { label: "กางเกง", href: "/products?category=pants", cls: "category--pants" },
  { label: "ACCESSORIES", href: "/products?category=accessories", cls: "category--accessories" },
];

const collectionNotes = [
  { title: "RETURN ARC", description: "คอลเลกชันแรกของ Bounce Back กับแนวคิด Reset / Rebuild / Return" },
  { title: "ดีไซน์ในคอลเลกชัน", description: "ดูกราฟิกและรายละเอียดของแต่ละรุ่นได้จากภาพในหน้าสินค้า" },
  { title: "เลือกไซซ์ของคุณ", description: "เทียบขนาดเสื้อกับตารางไซซ์ก่อนเลือก หากไม่แน่ใจ คุยกับเราทาง LINE ได้" },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts();
  const products = featured.length > 0 ? featured : await getProducts();
  const isDemo = products.some((p) => isDemoId(p._id));

  return (
    <>
      {/* HERO */}
      <section className="hero" id="top">
        <div className="hero__copy">
          <p className="eyebrow">RETURN ARC / COLLECTION 01</p>
          <p className="eyebrow">RESET. REBUILD. RETURN.</p>
          <h1>หลังเลิกงาน ยังมีเวลาของเรา</h1>
          <p className="hero__lead">
            เสื้อผ้ากีฬาและไลฟ์สไตล์สำหรับคนที่แบ่งเวลาให้ทั้งงาน ชีวิต
            และการดูแลตัวเอง
          </p>
          <div className="actions">
            <Link className="button button--light" href="/products">
              ดูคอลเลกชันแรก
            </Link>
            <a className="button button--ghost" href="#values">
              เรื่องของ Bounce Back
            </a>
          </div>
        </div>
        <div className="hero__visual">
          <Image
            src="/hero-athlete.webp"
            alt="นักกีฬากำลังวิ่งในบรรยากาศมืด"
            fill
            sizes="(max-width: 1100px) 100vw, 50vw"
            priority
          />
          <span className="hero__arc" aria-hidden="true" />
          <span className="hero__label">RESET · REBUILD · RETURN</span>
        </div>
      </section>

      {/* VALUES */}
      <section className="section values" id="values">
        <div className="section-head">
          <div>
            <p className="eyebrow">WHAT WE STAND FOR</p>
            <h2>ชีวิตไม่ได้มีแค่เวลาซ้อม</h2>
          </div>
          <p>
            มีงานที่ต้องทำ มีคนที่ต้องดูแล และมีวันที่ตารางไม่เป็นใจ
            Bounce Back เชื่อว่าการดูแลตัวเองมีที่อยู่ในชีวิตแบบนี้ได้
            จะเป็นการซ้อมเต็มชั่วโมง หรือเดินสั้น ๆ หลังเลิกงาน
          </p>
        </div>
        <div className="value-grid">
          {values.map((v) => (
            <article className="value" key={v.n}>
              <span>{v.n}</span>
              <h3>{v.t}</h3>
              <p>{v.d}</p>
            </article>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="section section--dark" id="new">
        <div className="section-head section-head--light">
          <div>
            <p className="eyebrow">NEW ARRIVALS</p>
            <h2>คอลเลกชันแรกของ Bounce Back</h2>
          </div>
          <Link className="text-link" href="/products">
            ดูสินค้าทั้งหมด ↗
          </Link>
        </div>

        <div className="product-grid">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        {isDemo && (
          <p className="demo-note">
            สินค้าด้านบนเป็นตัวอย่าง — เพิ่มสินค้าจริง (ภาพ ราคา ไซซ์ สต็อก) ได้ที่{" "}
            <Link href="/studio" style={{ textDecoration: "underline" }}>
              /studio
            </Link>{" "}
            แล้วระบบจะสลับมาแสดงของจริงอัตโนมัติ
          </p>
        )}
      </section>

      {/* CATEGORIES */}
      <section className="section section--dark" style={{ paddingTop: 0 }} id="categories">
        <div className="section-head section-head--light">
          <div>
            <p className="eyebrow">SHOP BY CATEGORY</p>
            <h2>เลือกประเภทสินค้า</h2>
          </div>
        </div>
        <div className="category-grid">
          {categories.map((c) => (
            <Link className={`category ${c.cls}`} href={c.href} key={c.label}>
              <span>{c.label}</span>
              <b>↗</b>
            </Link>
          ))}
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="section section--sand activity" id="activity">
        <div className="activity__visual" aria-hidden="true">
          <span>RETURN ARC</span>
        </div>
        <div className="activity__copy">
          <p className="eyebrow">STAY IN TOUCH</p>
          <h2>ติดตามก้าวต่อไปของ Bounce Back</h2>
          <p>
            ข่าวคอลเลกชันใหม่ วันเปิดขาย และเบื้องหลังแบรนด์
            อยู่ที่ LINE ของเรา
          </p>
          <a
            className="button button--dark"
            href={site.lineUrl}
            target="_blank"
            rel="noopener"
          >
            เพิ่มเพื่อนทาง LINE
          </a>
        </div>
      </section>

      {/* COLLECTION NOTES — replace with real stories when available */}
      <section className="section reviews">
        <div className="section-head">
          <div>
            <p className="eyebrow">COLLECTION NOTES</p>
            <h2>รู้จักคอลเลกชันแรก</h2>
          </div>
        </div>
        <div className="review-grid">
          {collectionNotes.map((note) => (
            <article className="review" key={note.title}>
              <h3>{note.title}</h3>
              <p>{note.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
