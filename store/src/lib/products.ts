import type { SanityImageSource } from "@sanity/image-url";

import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { demoProducts } from "./demoProducts";

/** map slug ในเมนู/URL → ชื่อหมวดใน Sanity (ใช้กรองสินค้าตามหมวด) */
export const CATEGORY_SLUG_TO_TITLE: Record<string, string> = {
  shirts: "เสื้อ",
  pants: "กางเกง",
  accessories: "อุปกรณ์",
};

export type ProductVariant = {
  size?: string;
  color?: string;
  sku?: string;
  stock: number;
};

export type SizeRow = {
  size: string;
  chest?: number; // รอบอก (ซม.)
  length?: number; // ความยาวเสื้อ (ซม.)
  sleeve?: number; // ความยาวแขน (ซม.)
};

export type Product = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  category?: string;
  description?: string;
  image?: SanityImageSource;
  images?: SanityImageSource[];
  imageUrls?: string[]; // รูปแบบ URL ตรง (ใช้กับสินค้าตัวอย่าง/รูป local)
  variants?: ProductVariant[];
  sizeChart?: SizeRow[];
  featured?: boolean;
  mockup?: boolean;
};

const listFields = `
  _id,
  title,
  "slug": slug.current,
  price,
  compareAtPrice,
  "category": category->title,
  "image": images[0],
  featured
`;

const detailFields = `
  _id,
  title,
  "slug": slug.current,
  price,
  compareAtPrice,
  "category": category->title,
  description,
  images,
  variants,
  sizeChart,
  featured
`;

/** ดึงสินค้า — ใส่ categorySlug (shirts/pants/accessories) เพื่อกรองเฉพาะหมวด */
export async function getProducts(categorySlug?: string): Promise<Product[]> {
  if (!isSanityConfigured) return [];
  const title = categorySlug ? CATEGORY_SLUG_TO_TITLE[categorySlug] : undefined;
  const filter = title ? ` && category->title == $title` : "";
  return client.fetch(
    `*[_type == "product" && active == true${filter}]|order(featured desc, _createdAt desc){${listFields}}`,
    title ? { title } : {},
    { next: { revalidate: 60 } },
  );
}

/** สินค้าที่เพิ่มล่าสุด — ใช้โชว์ "New Collection" หน้าแรก */
export async function getLatestProducts(limit = 4): Promise<Product[]> {
  if (!isSanityConfigured) return [];
  return client.fetch(
    `*[_type == "product" && active == true]|order(_createdAt desc)[0...${limit}]{${listFields}}`,
    {},
    { next: { revalidate: 60 } },
  );
}

/** รูปตัวแทน 1 รูปต่อหมวด — ใช้ในการ์ด "เลือกประเภทสินค้า" หน้าแรก */
export async function getCategoryShowcase(): Promise<{
  shirts: string | null;
  pants: string | null;
  accessories: string | null;
}> {
  const empty = { shirts: null, pants: null, accessories: null };
  if (!isSanityConfigured) return empty;
  const q = `{
    "shirts": *[_type=="product" && active==true && category->title=="เสื้อ" && count(images)>0]|order(featured desc, _createdAt desc)[0].images[0],
    "pants": *[_type=="product" && active==true && category->title=="กางเกง" && count(images)>0]|order(featured desc, _createdAt desc)[0].images[0],
    "accessories": *[_type=="product" && active==true && category->title=="อุปกรณ์" && count(images)>0]|order(featured desc, _createdAt desc)[0].images[0]
  }`;
  const res = await client.fetch<{
    shirts: SanityImageSource | null;
    pants: SanityImageSource | null;
    accessories: SanityImageSource | null;
  }>(q, {}, { next: { revalidate: 60 } });
  const toUrl = (img: SanityImageSource | null) =>
    img ? urlFor(img).width(800).height(1000).fit("crop").url() : null;
  return {
    shirts: toUrl(res.shirts),
    pants: toUrl(res.pants),
    accessories: toUrl(res.accessories),
  };
}

export async function getProduct(slug: string): Promise<Product | null> {
  if (isSanityConfigured) {
    const p: Product | null = await client.fetch(
      `*[_type == "product" && slug.current == $slug && active == true][0]{${detailFields}}`,
      { slug },
      { next: { revalidate: 60 } },
    );
    if (p) return p;
  }
  // ไม่พบใน Sanity → ลองหาในสินค้าตัวอย่าง
  return demoProducts.find((p) => p.slug === slug) ?? null;
}

/** ดึงสินค้าตาม id หลายตัว — ใช้ตอน checkout เพื่อคำนวณราคาใหม่ฝั่ง server */
export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const found: Product[] = [];
  if (isSanityConfigured) {
    const results: Product[] = await client.fetch(
      `*[_type == "product" && _id in $ids]{${detailFields}}`,
      { ids },
      { cache: "no-store" },
    );
    found.push(...results);
  }
  // เติมสินค้าตัวอย่างสำหรับ id ที่ยังไม่พบใน Sanity
  const missing = ids.filter((id) => !found.some((p) => p._id === id));
  if (missing.length > 0) {
    found.push(...demoProducts.filter((p) => missing.includes(p._id)));
  }
  return found;
}

export type Category = {
  _id: string;
  title: string;
  slug: string;
};

export async function getCategories(): Promise<Category[]> {
  if (!isSanityConfigured) return [];
  return client.fetch(
    `*[_type == "category"]|order(order asc){_id, title, "slug": slug.current}`,
    {},
    { next: { revalidate: 300 } },
  );
}
