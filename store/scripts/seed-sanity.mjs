// @ts-check
/**
 * Seed สินค้าจริง 3 รุ่นลง Sanity (หมวด + รูป + variants + ตารางไซซ์)
 *
 * วิธีรัน (จากโฟลเดอร์ store/):
 *   SANITY_WRITE_TOKEN=xxxxx node scripts/seed-sanity.mjs
 *
 * - ต้องมี "write token" (Editor) จาก https://sanity.io/manage → โปรเจกต์ Bounce Back → API → Tokens
 * - รันซ้ำได้: รุ่นที่มีอยู่แล้วจะถูก "ข้าม" (ใส่ FORCE=1 ข้างหน้าเพื่อเขียนทับ)
 * - ใช้ _id แบบคงที่ (product-xxx) จะได้ไม่เกิดสินค้าซ้ำเวลารันใหม่
 */
import { createClient } from "@sanity/client";
import { createReadStream } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "..", "public");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "alq2qgu7";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;
const FORCE = process.env.FORCE === "1";

if (!token) {
  console.error(`
❌ ไม่พบ SANITY_WRITE_TOKEN

สร้าง token (ทำครั้งเดียว):
  1. เข้า https://sanity.io/manage → เลือกโปรเจกต์ Bounce Back
  2. เมนู API → Tokens → + Add API token
  3. ตั้งชื่อ "seed" · สิทธิ์ = Editor · กด Save → คัดลอกค่า token
  4. รันใหม่:  SANITY_WRITE_TOKEN=วางtoken node scripts/seed-sanity.mjs
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

// ---- ข้อมูลหมวด ----
const CATEGORY = {
  _id: "category-shirts",
  _type: "category",
  title: "เสื้อ",
  slug: { _type: "slug", current: "shirts" },
  order: 1,
};

// ---- ตารางไซซ์ (ชั่วคราว — แก้เป็นสเปกจริงใน Studio เมื่อได้ตัวอย่าง production) ----
const SIZECHART = [
  { size: "S", chest: 96, length: 68, sleeve: 60 },
  { size: "M", chest: 102, length: 70, sleeve: 62 },
  { size: "L", chest: 108, length: 72, sleeve: 64 },
  { size: "XL", chest: 114, length: 74, sleeve: 66 },
];

// ---- สินค้า 3 รุ่น (stock เป็นตัวเลขเริ่มต้น ปรับจริงใน Studio ได้) ----
const PRODUCTS = [
  {
    _id: "product-on-your-track-ls",
    title: "ON YOUR TRACK LONG SLEEVE",
    slug: "on-your-track-long-sleeve",
    price: 990,
    description:
      "เสื้อแขนยาว performance รุ่น On Your Track เนื้อผ้าเบา ระบายอากาศดี ทรงพอดีตัว พร้อมกราฟิกด้านหลังที่เป็นเอกลักษณ์",
    images: [
      "/products/on-your-track-front.jpg",
      "/products/on-your-track-back.jpg",
      "/products/on-your-track-worn.jpg",
      "/products/on-your-track-detail.jpg",
    ],
    sizeChart: SIZECHART,
    variants: [
      { size: "S", color: "Onyx", sku: "BB-TRACK-BLK-S", stock: 8 },
      { size: "M", color: "Onyx", sku: "BB-TRACK-BLK-M", stock: 12 },
      { size: "L", color: "Onyx", sku: "BB-TRACK-BLK-L", stock: 6 },
      { size: "XL", color: "Onyx", sku: "BB-TRACK-BLK-XL", stock: 4 },
    ],
  },
  {
    _id: "product-bounce-arc-ls",
    title: "BOUNCE BACK ARC LONG SLEEVE",
    slug: "bounce-back-arc-long-sleeve",
    price: 990,
    description:
      "เสื้อแขนยาวสีดำดีไซน์โลโก้โค้งด้านหลัง ใส่ซ้อม วิ่ง และใช้งานประจำวันได้ในตัวเดียว",
    images: [
      "/products/bounce-arc-front.jpg",
      "/products/bounce-arc-back.jpg",
      "/products/bounce-arc-worn.jpg",
      "/products/bounce-arc-detail.jpg",
    ],
    sizeChart: SIZECHART,
    variants: [
      { size: "S", color: "Obsidian", sku: "BB-ARC-BLK-S", stock: 6 },
      { size: "M", color: "Obsidian", sku: "BB-ARC-BLK-M", stock: 8 },
      { size: "L", color: "Obsidian", sku: "BB-ARC-BLK-L", stock: 6 },
      { size: "XL", color: "Obsidian", sku: "BB-ARC-BLK-XL", stock: 0 },
    ],
  },
  {
    _id: "product-grey-halftone-ls",
    title: "GREY HALFTONE LONG SLEEVE",
    slug: "grey-halftone-long-sleeve",
    price: 990,
    description:
      "เสื้อแขนยาวสีเทา Halftone น้ำหนักเบา แห้งไว พร้อมกราฟิก Bounce Back ที่สะท้อนการกลับมาในทุกจังหวะ",
    images: [
      "/products/grey-halftone-front.jpg",
      "/products/grey-halftone-back.jpg",
      "/products/grey-halftone-worn.jpg",
      "/products/grey-halftone-detail.jpg",
    ],
    sizeChart: SIZECHART,
    variants: [
      { size: "S", color: "Light Grey", sku: "BB-HALF-GRY-S", stock: 6 },
      { size: "M", color: "Light Grey", sku: "BB-HALF-GRY-M", stock: 8 },
      { size: "L", color: "Light Grey", sku: "BB-HALF-GRY-L", stock: 6 },
      { size: "XL", color: "Light Grey", sku: "BB-HALF-GRY-XL", stock: 0 },
    ],
  },
];

async function ensureCategory() {
  const existing = await client.getDocument(CATEGORY._id).catch(() => null);
  if (existing) {
    console.log(`✓ หมวด "${CATEGORY.title}" มีอยู่แล้ว`);
    return;
  }
  await client.createOrReplace(CATEGORY);
  console.log(`＋ สร้างหมวด "${CATEGORY.title}"`);
}

async function uploadImage(relPath) {
  const abs = path.join(PUBLIC_DIR, relPath.replace(/^\//, ""));
  await access(abs); // โยน error ถ้าไฟล์ไม่มี
  const asset = await client.assets.upload("image", createReadStream(abs), {
    filename: path.basename(abs),
  });
  return {
    _type: "image",
    _key: path.basename(abs).replace(/\W+/g, "-"),
    asset: { _type: "reference", _ref: asset._id },
  };
}

async function seedProduct(p) {
  const existing = await client.getDocument(p._id).catch(() => null);
  if (existing && !FORCE) {
    console.log(`• ข้าม "${p.title}" (มีอยู่แล้ว — ใส่ FORCE=1 เพื่อเขียนทับ)`);
    return;
  }

  console.log(`⬆️  อัปโหลดรูป ${p.images.length} รูป: ${p.title}`);
  const images = [];
  for (const img of p.images) images.push(await uploadImage(img));

  const doc = {
    _id: p._id,
    _type: "product",
    title: p.title,
    slug: { _type: "slug", current: p.slug },
    price: p.price,
    description: p.description,
    category: { _type: "reference", _ref: CATEGORY._id },
    images,
    variants: p.variants.map((v) => ({
      _type: "variant",
      _key: v.sku,
      size: v.size,
      color: v.color,
      sku: v.sku,
      stock: v.stock,
    })),
    sizeChart: p.sizeChart.map((r) => ({
      _type: "sizeRow",
      _key: `size-${r.size}`,
      size: r.size,
      chest: r.chest,
      length: r.length,
      sleeve: r.sleeve,
    })),
    featured: true,
    active: true,
  };

  await client.createOrReplace(doc);
  console.log(`✅ ${existing ? "อัปเดต" : "สร้าง"} "${p.title}"`);
}

async function main() {
  console.log(`\n🌱 Seed Sanity — project ${projectId} / dataset ${dataset}\n`);
  await ensureCategory();
  for (const p of PRODUCTS) await seedProduct(p);
  console.log(`\n🎉 เสร็จแล้ว! เปิดดูที่ /studio หรือหน้าร้านได้เลย\n`);
}

main().catch((err) => {
  console.error("\n❌ เกิดข้อผิดพลาด:", err.message || err);
  process.exit(1);
});
