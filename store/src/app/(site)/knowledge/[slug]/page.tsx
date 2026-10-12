import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PortableBody } from "@/components/PortableBody";
import { CATEGORY_LABELS, getArticle, type Article } from "@/lib/articles";
import { site } from "@/lib/site";
import { urlFor } from "@/sanity/lib/image";

type Params = { slug: string };

function resolveCover(article: Article, w: number, h: number): string | null {
  if (article.coverImageUrl) return article.coverImageUrl;
  if (article.coverImage)
    return urlFor(article.coverImage).width(w).height(h).fit("crop").url();
  return null;
}

function absoluteUrl(path: string | null): string | undefined {
  if (!path) return undefined;
  return path.startsWith("http") ? path : `${site.url}${path}`;
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "ไม่พบบทความ" };

  const ogImage = absoluteUrl(resolveCover(article, 1200, 630));
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `${site.url}/knowledge/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      url: `${site.url}/knowledge/${article.slug}`,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const cover = resolveCover(article, 1400, 788);
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  // ---- SEO: structured data (JSON-LD) ----
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: absoluteUrl(cover),
    datePublished: article.publishedAt,
    mainEntityOfPage: `${site.url}/knowledge/${article.slug}`,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
  };
  const faqLd =
    article.faq && article.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: article.faq.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <article className="section article-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

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

      {article.faq && article.faq.length > 0 && (
        <section className="article-faq">
          <h2>คำถามที่พบบ่อย (FAQ)</h2>
          {article.faq.map((f, i) => (
            <details key={i} className="faq-item">
              <summary>{f.question}</summary>
              <p>{f.answer}</p>
            </details>
          ))}
        </section>
      )}

      <div className="article-cta">
        <p>อยากสอบถามเรื่องสินค้าหรือไซซ์? ทักเราได้เลย</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/products" className="btn btn--primary">
            ดูสินค้าทั้งหมด
          </Link>
          <a href={site.lineUrl} target="_blank" rel="noopener" className="btn btn--ghost">
            ซื้อสินค้าผ่าน LINE ↗
          </a>
        </div>
      </div>
    </article>
  );
}
