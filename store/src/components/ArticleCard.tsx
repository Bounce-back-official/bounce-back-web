import Image from "next/image";
import Link from "next/link";

import { CATEGORY_LABELS, type Article } from "@/lib/articles";
import { urlFor } from "@/sanity/lib/image";

function coverUrl(article: Article): string | null {
  if (article.coverImageUrl) return article.coverImageUrl;
  if (article.coverImage)
    return urlFor(article.coverImage).width(800).height(500).fit("crop").url();
  return null;
}

export function ArticleCard({ article }: { article: Article }) {
  const cover = coverUrl(article);
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <Link href={`/knowledge/${article.slug}`} className="article-card">
      <div className="article-card__media">
        {cover ? (
          <Image
            src={cover}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <span className="product-card__mark">B</span>
        )}
      </div>
      <div className="article-card__body">
        {article.category && (
          <span className="article-card__cat">
            {CATEGORY_LABELS[article.category] ?? article.category}
          </span>
        )}
        <h3 className="article-card__title">{article.title}</h3>
        {article.excerpt && <p className="article-card__excerpt">{article.excerpt}</p>}
        {date && <span className="article-card__date">{date}</span>}
      </div>
    </Link>
  );
}
