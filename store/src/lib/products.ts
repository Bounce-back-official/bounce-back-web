import type { SanityImageSource } from "@sanity/image-url";

import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { demoProducts } from "./demoProducts";

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

export async function getProducts(): Promise<Product[]> {
  if (!isSanityConfigured) return demoProducts;
  const results: Product[] = await client.fetch(
    `*[_type == "product" && active == true]|order(featured desc, _createdAt desc){${listFields}}`,
    {},
    { next: { revalidate: 60 } },
  );
  // ยังไม่มีสินค้าจริง → ใช้สินค้าตัวอย่าง
  return [...results, ...demoProducts.filter((p) => !results.some((real) => real.slug === p.slug))];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const demoFeatured = demoProducts.filter((p) => p.featured);
  if (!isSanityConfigured) return demoFeatured;
  const results: Product[] = await client.fetch(
    `*[_type == "product" && active == true && featured == true]|order(_createdAt desc)[0...8]{${listFields}}`,
    {},
    { next: { revalidate: 60 } },
  );
  return results.length > 0 ? results : demoFeatured;
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
