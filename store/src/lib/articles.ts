import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url";

import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { demoArticles } from "./demoArticles";

export type Article = {
  _id: string;
  title: string;
  slug: string;
  category?: string;
  excerpt?: string;
  coverImage?: SanityImageSource;
  coverImageUrl?: string; // ใช้กับบทความตัวอย่าง (รูป local)
  body?: PortableTextBlock[];
  publishedAt?: string;
  featured?: boolean;
};

/** ป้ายหมวดหมู่ภาษาไทย */
export const CATEGORY_LABELS: Record<string, string> = {
  fabric: "ความรู้เรื่องผ้า",
  care: "การดูแลรักษา",
  general: "ทั่วไป",
};

const listFields = `
  _id,
  title,
  "slug": slug.current,
  category,
  excerpt,
  coverImage,
  publishedAt,
  featured
`;

const detailFields = `
  _id,
  title,
  "slug": slug.current,
  category,
  excerpt,
  coverImage,
  body,
  publishedAt,
  featured
`;

export async function getArticles(): Promise<Article[]> {
  if (!isSanityConfigured) return demoArticles;
  const results: Article[] = await client.fetch(
    `*[_type == "article" && active == true]|order(featured desc, publishedAt desc){${listFields}}`,
    {},
    { next: { revalidate: 60 } },
  );
  return results.length > 0 ? results : demoArticles;
}

export async function getArticle(slug: string): Promise<Article | null> {
  if (isSanityConfigured) {
    const a: Article | null = await client.fetch(
      `*[_type == "article" && slug.current == $slug && active == true][0]{${detailFields}}`,
      { slug },
      { next: { revalidate: 60 } },
    );
    if (a) return a;
  }
  return demoArticles.find((a) => a.slug === slug) ?? null;
}

export function isDemoArticleId(id: string): boolean {
  return id.startsWith("demo-");
}
