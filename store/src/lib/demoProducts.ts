import type { Product } from "./products";

/**
 * สินค้าตัวอย่าง (ใช้เมื่อยังไม่มีสินค้าจริงใน Sanity)
 * พอเพิ่มสินค้าใน /studio ระบบจะสลับไปใช้ของจริงอัตโนมัติ
 * รูป mockup อยู่ที่ store/public/products/*.jpg (ถ้ายังไม่มีไฟล์จะแสดง watermark "B")
 */
const TEE = "/products/tee.png";
const JOGGER = "/products/jogger.png";
const ACC = "/products/accessories.png";

export const demoProducts: Product[] = [
  {
    _id: "demo-return-arc-tee",
    title: "RETURN ARC TRAINING TEE",
    slug: "return-arc-training-tee",
    price: 890,
    category: "เสื้อ",
    featured: true,
    imageUrls: [TEE],
    description:
      "เสื้อเทรนนิ่งเนื้อผ้าเบา ระบายอากาศดี ทรงพอดีตัว ใส่ได้ทั้งวิ่งและเข้ายิม",
    variants: [
      { size: "S", color: "Obsidian", sku: "TEE-OB-S", stock: 8 },
      { size: "M", color: "Obsidian", sku: "TEE-OB-M", stock: 12 },
      { size: "L", color: "Obsidian", sku: "TEE-OB-L", stock: 6 },
      { size: "M", color: "Sand", sku: "TEE-SA-M", stock: 5 },
      { size: "L", color: "Sand", sku: "TEE-SA-L", stock: 0 },
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
    featured: true,
    imageUrls: [ACC],
    description: "เซ็ตอุปกรณ์ออกกำลังกาย ผ้าคาดหัว ผ้าเช็ดตัว และริสแบนด์",
    variants: [{ size: "Free", color: "Obsidian", sku: "ACC-OB-F", stock: 20 }],
  },
  {
    _id: "demo-reset-longsleeve",
    title: "RESET LONG SLEEVE",
    slug: "reset-long-sleeve",
    price: 1290,
    compareAtPrice: 1590,
    category: "เสื้อ",
    imageUrls: [TEE],
    description: "เสื้อแขนยาวกันแดด UPF50+ เหมาะกับวิ่งเช้า-เย็น",
    variants: [
      { size: "S", color: "Bone", sku: "LS-BO-S", stock: 6 },
      { size: "M", color: "Bone", sku: "LS-BO-M", stock: 8 },
      { size: "L", color: "Bone", sku: "LS-BO-L", stock: 6 },
    ],
  },
  {
    _id: "demo-core-tank",
    title: "CORE TANK",
    slug: "core-tank",
    price: 790,
    category: "เสื้อ",
    imageUrls: [TEE],
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
