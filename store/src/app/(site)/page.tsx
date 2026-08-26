import Image from "next/image";
import Link from "next/link";

import { ProductCard } from "@/components/ProductCard";
import { isDemoId } from "@/lib/demoProducts";
import { getFeaturedProducts, getProducts } from "@/lib/products";
import { site } from "@/lib/site";

const values = [
  { n: "01", t: "RESILIENT", d: "เด้งกลับ เรียนรู้ และแข็งแรงกว่าเดิม" },
  { n: "02", t: "FOCUS", d: "โฟกัสกับเป้าหมายและสิ่งที่สำคัญ" },
  { n: "03", t: "ADAPT", d: "ปรับตัวกับทุกจังหวะของชีวิต" },
  { n: "04", t: "MOVE FORWARD", d: "ก้าวต่อไปอย่างมั่นใจทุกวัน" },
];

const categories = [
  { label: "เสื้อ", href: "/products?category=shirts", cls: "" },
  { label: "กางเกง", href: "/products?category=pants", cls: "category--pants" },
  { label: "ACCESSORIES", href: "/products?category=accessories", cls: "category--accessories" },
];

const reviews = [
  { q: "ทรงพอดี เคลื่อนไหวง่าย และใส่ได้จริงทั้งวัน", who: "NAT · VERIFIED BUYER" },
  { q: "เนื้อผ้าเบา แต่ดูมีโครง ใส่วิ่งและเข้ายิมได้โดยไม่ต้องเปลี่ยนลุค", who: "TON · VERIFIED BUYER" },
  { q: "ชอบแนวคิดแบรนด์และรายละเอียดที่ไม่เยอะเกินไป ดูพรีเมียมมาก", who: "M · VERIFIED BUYER" },
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
          <h1>NO MATTER HOW HARD YOU FALL, YOU CAN ALWAYS BOUNCE BACK.</h1>
          <p className="hero__lead">
            เสื้อผ้าออกกำลังกายที่ออกแบบให้คุณกลับมาแข็งแกร่งกว่าเดิม
            ทุกการเคลื่อนไหว ทุกเป้าหมาย
          </p>
          <div className="actions">
            <Link className="button button--light" href="/products">
              ช้อปสินค้าใหม่
            </Link>
            <a className="button button--ghost" href="#values">
              รู้จัก Bounce Back
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
          <span className="hero__label">RESILIENT · FOCUSED · READY</span>
        </div>
      </section>

      {/* VALUES */}
      <section className="section values" id="values">
        <div className="section-head">
          <div>
            <p className="eyebrow">WHAT WE STAND FOR</p>
            <h2>สร้างมาเพื่อคนที่ล้มได้ และกลับมาได้เสมอ</h2>
          </div>
          <p>
            เสื้อผ้าที่เรียบพอดี ใช้งานจริง
            และพร้อมไปกับคุณในวันที่ต้องเริ่มอีกครั้ง
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
            <h2>พร้อมสำหรับการกลับมาครั้งต่อไป</h2>
          </div>
          <Link className="text-link" href="/products">
            ดูสินค้าทั้งหมด ↗
          </Link>
        </div>

        <div className="product-grid">
          {products.slice(0, 4).map((product) => (
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
            <h2>เลือกตามการเคลื่อนไหวของคุณ</h2>
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
          <p className="eyebrow">BOUNCE BACK COMMUNITY</p>
          <h2>RUN. RESET. RETURN.</h2>
          <p className="activity__date">กิจกรรมวิ่งครั้งถัดไป · เร็ว ๆ นี้</p>
          <p>
            มาร่วมขยับร่างกาย เรียนรู้การฟื้นตัว
            และกลับไปหาเป้าหมายพร้อมชุมชนที่ไม่ยอมแพ้
          </p>
          <a
            className="button button--dark"
            href={site.lineUrl}
            target="_blank"
            rel="noopener"
          >
            ติดตามกิจกรรมทาง LINE
          </a>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section reviews">
        <div className="section-head">
          <div>
            <p className="eyebrow">REAL MOVEMENT. REAL PEOPLE.</p>
            <h2>เสียงจากคนที่ไม่หยุดกลับมา</h2>
          </div>
        </div>
        <div className="review-grid">
          {reviews.map((r) => (
            <figure className="review" key={r.who}>
              <div className="stars">★★★★★</div>
              <blockquote>“{r.q}”</blockquote>
              <figcaption>{r.who}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
