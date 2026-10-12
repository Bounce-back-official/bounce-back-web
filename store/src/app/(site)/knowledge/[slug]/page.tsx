import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PortableBody } from "@/components/PortableBody";
import { CATEGORY_LABELS, getArticle } from "@/lib/articles";
import { site } from "@/lib/site";
import { urlFor } from "@/sanity/lib/image";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  return {
    title: article?.title ?? "ไม่พบบทความ",
    description: article?.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const cover =
    article.coverImageUrl ??
    (article.coverImage
      ? urlFor(article.coverImage).width(1400).height(788).fit("crop").url()
      : null);
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <article className="section article-page">
      <Link href="/knowledge" className="article-back">
        ← เกร็ดความรู้ทั้งหมด
      </Link>

      {article.category && (
        <p className="eyebrow" style={{ marginTop: 18 }}>
          {CATEGORY_LABELS[article.category] ?? article.category}
        </p>
      )}
      <h1 className="article-title">{article.title}</h1>
      {date && <p className="article-meta">{date}</p>}

      {cover && (
        <div className="article-cover">
          <Image src={cover} alt={article.title} fill sizes="820px" priority />
        </div>
      )}

      <div className="article-body">
        {article.body && article.body.length > 0 ? (
          <PortableBody value={article.body} />
        ) : (
          article.excerpt && <p>{article.excerpt}</p>
        )}
      </div>

      <div className="article-cta">
        <p>อยากสอบถามเรื่องสินค้าหรือไซซ์? ทักเราได้เลย</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/products" className="btn btn--primary">
            ดูสินค้าทั้งหมด
          </Link>
          <a href={site.lineUrl} target="_blank" rel="noopener" className="btn btn--ghost">
            คุยกับทีมทาง LINE ↗
          </a>
        </div>
      </div>
    </article>
  );
}
