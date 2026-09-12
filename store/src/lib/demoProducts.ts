import type { Product } from "./products";

/**
 * สินค้าตัวอย่าง (ใช้เมื่อยังไม่มีสินค้าจริงใน Sanity)
 * พอเพิ่มสินค้าใน /studio ระบบจะสลับไปใช้ของจริงอัตโนมัติ
 * รูปอยู่ที่ store/public/products/*
 *   - ls-black / ls-grey / ls-black-front = เสื้อ Long Sleeve จริง (mockup แรก)
 *   - tee / jogger / accessories = รูปตัวอย่าง (ยังไม่มีของจริง)
 */
const LS_BLACK = "/products/ls-black.jpg";
const LS_GREY = "/products/ls-grey.jpg";
const LS_BLACK_FRONT = "/products/ls-black-front.jpg";
const JOGGER = "/products/jogger.png";
const ACC = "/products/accessories.png";

export const demoProducts: Product[] = [
  {
    _id: "demo-return-arc-ls",
    title: "RETURN ARC LONG SLEEVE",
    slug: "return-arc-long-sleeve",
    price: 990,
    category: "เสื้อ",
    featured: true,
    imageUrls: [LS_BLACK, LS_BLACK_FRONT],
    description:
      "เสื้อแขนยาวออกกำลังกาย เนื้อผ้าเบา ระบายอากาศดี ทรงพอดีตัว โลโก้ Bounce Back ที่อก",
    variants: [
      { size: "S", color: "Obsidian", sku: "LS-OB-S", stock: 8 },
      { size: "M", color: "Obsidian", sku: "LS-OB-M", stock: 12 },
      { size: "L", color: "Obsidian", sku: "LS-OB-L", stock: 6 },
      { size: "XL", color: "Obsidian", sku: "LS-OB-XL", stock: 4 },
    ],
  },
  {
    _id: "demo-reset-longsleeve",
    title: "RESET LONG SLEEVE",
    slug: "reset-long-sleeve",
    price: 990,
    category: "เสื้อ",
    featured: true,
    imageUrls: [LS_GREY],
    description:
      "เสื้อแขนยาวสีเทาอ่อน ใส่สบาย กันแดด UPF50+ เหมาะกับวิ่งเช้า-เย็น",
    variants: [
      { size: "S", color: "Light Grey", sku: "LS-GR-S", stock: 6 },
      { size: "M", color: "Light Grey", sku: "LS-GR-M", stock: 8 },
      { size: "L", color: "Light Grey", sku: "LS-GR-L", stock: 6 },
      { size: "XL", color: "Light Grey", sku: "LS-GR-XL", stock: 0 },
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
      { size: "S", color: "Graphite", sku: "SHT-GR-S", stock: 10 },
      { size: "M", color: "Graphite", sku: "SHT-GR-M", stock: 9 },
      { size: "L", color: "Graphite", sku: "SHT-GR-L", stock: 4 },
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
      { size: "M", color: "Charcoal", sku: "JOG-CH-M", stock: 7 },
      { size: "L", color: "Charcoal", sku: "JOG-CH-L", stock: 5 },
      { size: "XL", color: "Charcoal", sku: "JOG-CH-XL", stock: 3 },
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
    variants: [{ size: "Free", color: "Obsidian", sku: "ACC-OB-F", stock: 20 }],
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
      { size: "S", color: "Obsidian", sku: "TNK-OB-S", stock: 9 },
      { size: "M", color: "Obsidian", sku: "TNK-OB-M", stock: 11 },
      { size: "L", color: "Obsidian", sku: "TNK-OB-L", stock: 7 },
    ],
  },
];

export function isDemoId(id: string): boolean {
  return id.startsWith("demo-");
}
