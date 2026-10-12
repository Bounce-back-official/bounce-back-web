import { ArticleCard } from "@/components/ArticleCard";
import { getArticles, isDemoArticleId } from "@/lib/articles";

export const metadata = {
  title: "เกร็ดความรู้",
  description: "ความรู้เรื่องผ้า การดูแลรักษา และเคล็ดลับการใช้งานเสื้อผ้าออกกำลังกาย",
};

export default async function KnowledgePage() {
  const articles = await getArticles();
  const isDemo = articles.some((a) => isDemoArticleId(a._id));

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <p className="eyebrow">KNOWLEDGE</p>
          <h2>เกร็ดความรู้</h2>
          <p style={{ marginTop: 10, color: "rgba(14,14,16,.6)", maxWidth: 520, lineHeight: 1.7 }}>
            เรื่องผ้า การดูแลรักษา และเคล็ดลับการใช้งาน — ให้คุณเลือกและดูแลเสื้อผ้าได้อย่างคุ้มค่า
          </p>
        </div>
      </div>

      {articles.length === 0 ? (
        <p style={{ color: "rgba(14,14,16,.55)" }}>ยังไม่มีบทความ</p>
      ) : (
        <div className="article-grid">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}

      {isDemo && (
        <p className="demo-note" style={{ color: "rgba(14,14,16,.55)" }}>
          บทความเหล่านี้เป็นตัวอย่าง — เพิ่มบทความจริงได้ที่ /studio แล้วจะแสดงของจริงแทน
        </p>
      )}
    </section>
  );
}
