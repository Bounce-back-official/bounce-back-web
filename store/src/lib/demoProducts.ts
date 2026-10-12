import type { Product } from "./products";

/**
 * สินค้าตัวอย่าง (ใช้เมื่อยังไม่มีสินค้าจริงใน Sanity)
 * พอเพิ่มสินค้าใน /studio ระบบจะสลับไปใช้ของจริงอัตโนมัติ
 * รูปอยู่ที่ store/public/products/*
 *   - on-your-track / bounce-arc / grey-halftone = เสื้อ Long Sleeve 3 รุ่นจริง (ภาพชุดใหม่)
 *   - tee / jogger / accessories = รูปตัวอย่าง (ยังไม่มีของจริง)
 */
const ON_YOUR_TRACK = [
  "/products/on-your-track-front.jpg",
  "/products/on-your-track-back.jpg",
  "/products/on-your-track-worn.jpg",
  "/products/on-your-track-detail.jpg",
];
const BOUNCE_ARC = [
  "/products/bounce-arc-front.jpg",
  "/products/bounce-arc-back.jpg",
  "/products/bounce-arc-worn.jpg",
  "/products/bounce-arc-detail.jpg",
];
const GREY_HALFTONE = [
  "/products/grey-halftone-front.jpg",
  "/products/grey-halftone-back.jpg",
  "/products/grey-halftone-worn.jpg",
  "/products/grey-halftone-detail.jpg",
];
const LS_BLACK_FRONT = "/products/ls-black-front.jpg";
const JOGGER = "/products/jogger.jpg";
const ACC = "/products/accessories.jpg";

// ตารางไซซ์เสื้อ Long Sleeve (ซม.) — ตัวอย่าง ปรับตามจริงเมื่อได้สเปก production
const LS_SIZECHART = [
  { size: "S", chest: 96, length: 68, sleeve: 60 },
  { size: "M", chest: 102, length: 70, sleeve: 62 },
  { size: "L", chest: 108, length: 72, sleeve: 64 },
  { size: "XL", chest: 114, length: 74, sleeve: 66 },
];

export const demoProducts: Product[] = [
  {
    _id: "demo-on-your-track-ls",
    title: "ON YOUR TRACK LONG SLEEVE",
    slug: "on-your-track-long-sleeve",
    price: 990,
    category: "เสื้อ",
    featured: true,
    imageUrls: ON_YOUR_TRACK,
    sizeChart: LS_SIZECHART,
    description:
      "เสื้อแขนยาว performance รุ่น On Your Track เนื้อผ้าเบา ระบายอากาศดี ทรงพอดีตัว พร้อมกราฟิกด้านหลังที่เป็นเอกลักษณ์",
    variants: [
      { size: "S", color: "Onyx", sku: "TRK-ONX-S", stock: 8 },
      { size: "M", color: "Onyx", sku: "TRK-ONX-M", stock: 12 },
      { size: "L", color: "Onyx", sku: "TRK-ONX-L", stock: 6 },
      { size: "XL", color: "Onyx", sku: "TRK-ONX-XL", stock: 4 },
    ],
  },
  {
    _id: "demo-bounce-arc-ls",
    title: "BOUNCE BACK ARC LONG SLEEVE",
    slug: "bounce-back-arc-long-sleeve",
    price: 990,
    category: "เสื้อ",
    featured: true,
    imageUrls: BOUNCE_ARC,
    sizeChart: LS_SIZECHART,
    description:
      "เสื้อแขนยาวสีดำดีไซน์โลโก้โค้งด้านหลัง ใส่ซ้อม วิ่ง และใช้งานประจำวันได้ในตัวเดียว",
    variants: [
      { size: "S", color: "Obsidian", sku: "ARC-OB-S", stock: 6 },
      { size: "M", color: "Obsidian", sku: "ARC-OB-M", stock: 8 },
      { size: "L", color: "Obsidian", sku: "ARC-OB-L", stock: 6 },
      { size: "XL", color: "Obsidian", sku: "ARC-OB-XL", stock: 0 },
    ],
  },
  {
    _id: "demo-grey-halftone-ls",
    title: "GREY HALFTONE LONG SLEEVE",
    slug: "grey-halftone-long-sleeve",
    price: 990,
    category: "เสื้อ",
    featured: true,
    imageUrls: GREY_HALFTONE,
    sizeChart: LS_SIZECHART,
    description:
      "เสื้อแขนยาวสีเทา Halftone น้ำหนักเบา แห้งไว พร้อมกราฟิก Bounce Back ที่สะท้อนการกลับมาในทุกจังหวะ",
    variants: [
      { size: "S", color: "Light Grey", sku: "HLF-GR-S", stock: 6 },
      { size: "M", color: "Light Grey", sku: "HLF-GR-M", stock: 8 },
      { size: "L", color: "Light Grey", sku: "HLF-GR-L", stock: 6 },
      { size: "XL", color: "Light Grey", sku: "HLF-GR-XL", stock: 0 },
    ],
  },
  {
    _id: "demo-focus-shorts",
    title: "FOCUS 5” SHORTS",
    slug: "focus-5-shorts",
    price: 1090,
    category: "กางเกง",
    featured: true,
    imageUrls: [JOGGER],
    description: "กางเกงขาสั้น 5 นิ้ว น้ำหนักเบา มีซับใน เคลื่อนไหวคล่องตัว",
    variants: [
      { size: "S", color: "Graphite", sku: "BB-SHORT-GRA-S", stock: 10 },
      { size: "M", color: "Graphite", sku: "BB-SHORT-GRA-M", stock: 9 },
      { size: "L", color: "Graphite", sku: "BB-SHORT-GRA-L", stock: 4 },
    ],
  },
  {
    _id: "demo-adapt-jogger",
    title: "ADAPT DAILY JOGGER",
    slug: "adapt-daily-jogger",
    price: 1490,
    category: "กางเกง",
    featured: true,
    imageUrls: [JOGGER],
    description: "กางเกงจ็อกเกอร์ใส่สบายทุกวัน ทรงเรียว มีกระเป๋าซิป",
    variants: [
      { size: "M", color: "Charcoal", sku: "BB-JOGGER-CHR-M", stock: 7 },
      { size: "L", color: "Charcoal", sku: "BB-JOGGER-CHR-L", stock: 5 },
      { size: "XL", color: "Charcoal", sku: "BB-JOGGER-CHR-XL", stock: 3 },
    ],
  },
  {
    _id: "demo-move-cap",
    title: "MOVE ACCESSORIES SET",
    slug: "move-accessories-set",
    price: 690,
    category: "อุปกรณ์",
    imageUrls: [ACC],
    description: "เซ็ตอุปกรณ์ออกกำลังกาย ผ้าคาดหัว ผ้าเช็ดตัว และริสแบนด์",
    variants: [{ size: "Free", color: "Obsidian", sku: "BB-ACC-BLK-F", stock: 20 }],
  },
  {
    _id: "demo-core-tank",
    title: "CORE TANK",
    slug: "core-tank",
    price: 790,
    category: "เสื้อ",
    imageUrls: [LS_BLACK_FRONT],
    description: "เสื้อกล้ามเนื้อผ้ายืดหยุ่น ระบายเหงื่อไว เหมาะกับเวทเทรนนิ่ง",
    variants: [
      { size: "S", color: "Obsidian", sku: "BB-TANK-BLK-S", stock: 9 },
      { size: "M", color: "Obsidian", sku: "BB-TANK-BLK-M", stock: 11 },
      { size: "L", color: "Obsidian", sku: "BB-TANK-BLK-L", stock: 7 },
    ],
  },
];

export function isDemoId(id: string): boolean {
  return id.startsWith("demo-");
}
