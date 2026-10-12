/**
 * Seed บทความ 3 เรื่อง (เกร็ดความรู้) ลง Sanity
 *
 * วิธีรัน (จากโฟลเดอร์ store/):
 *   SANITY_WRITE_TOKEN=xxxxx npm run seed:articles
 *
 * - ใช้ write token (Editor) ตัวเดิมกับตอนลงสินค้า
 * - รันซ้ำได้: บทความที่มีอยู่แล้วจะถูกข้าม (ใส่ FORCE=1 ข้างหน้าเพื่อเขียนทับ)
 * - เนื้อหา/FAQ ดึงจาก src/lib/demoArticles.ts (ที่เขียนไว้แล้ว)
 */
import { createClient } from "@sanity/client";
import { createReadStream } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { demoArticles } from "../src/lib/demoArticles";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "..", "public");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "alq2qgu7";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;
const FORCE = process.env.FORCE === "1";

if (!token) {
  console.error(`
❌ ไม่พบ SANITY_WRITE_TOKEN

ใช้ token ตัวเดิมกับตอนลงสินค้า (จาก sanity.io/manage → API → Tokens, สิทธิ์ Editor)
แล้วรัน:  SANITY_WRITE_TOKEN=วางtoken npm run seed:articles
`);
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-10-01",
  token,
  useCdn: false,
});

async function uploadImage(relPath: string) {
  const abs = path.join(PUBLIC_DIR, relPath.replace(/^\//, ""));
  await access(abs);
  const asset = await client.assets.upload("image", createReadStream(abs), {
    filename: path.basename(abs),
  });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

async function main() {
  console.log(`\n🌱 Seed บทความ → project ${projectId} / dataset ${dataset}\n`);

  for (const a of demoArticles) {
    const _id = `article-${a.slug}`;
    const existing = await client.getDocument(_id).catch(() => null);
    if (existing && !FORCE) {
      console.log(`• ข้าม "${a.title}" (มีอยู่แล้ว — ใส่ FORCE=1 เพื่อเขียนทับ)`);
      continue;
    }

    let coverImage: Awaited<ReturnType<typeof uploadImage>> | undefined;
    if (a.coverImageUrl) {
      console.log(`⬆️  อัปโหลดรูปปก: ${a.title}`);
      coverImage = await uploadImage(a.coverImageUrl);
    }

    const doc = {
      _id,
      _type: "article",
      title: a.title,
      slug: { _type: "slug", current: a.slug },
      category: a.category,
      excerpt: a.excerpt,
      coverImage,
      body: a.body,
      faq: (a.faq ?? []).map((f, i) => ({
        _type: "faqItem",
        _key: `faq-${i}`,
        question: f.question,
        answer: f.answer,
      })),
      publishedAt: a.publishedAt,
      featured: !!a.featured,
      active: true,
    };

    await client.createOrReplace(doc);
    console.log(`✅ ${existing ? "อัปเดต" : "สร้าง"} "${a.title}"`);
  }

  console.log(`\n🎉 เสร็จแล้ว! บทความอยู่ใน Sanity แล้ว แก้/เพิ่มได้ที่ /studio\n`);
}

main().catch((err) => {
  console.error("\n❌ เกิดข้อผิดพลาด:", err?.message || err);
  process.exit(1);
});
