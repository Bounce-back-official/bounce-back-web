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
  { _id: "demo-mockup-reset-tee", title: "RESET TEE", slug: "reset-tee", price: 690, category: "เสื้อ", featured: false, mockup: true, imageUrls: ["/products/mockups/reset-tee.svg"], description: "แบบจำลองสำหรับดูแนวทางสินค้า ราคาเป็นตัวอย่าง ยังไม่เปิดจำหน่าย", variants: [] },
  { _id: "demo-mockup-rebuild-tank", title: "REBUILD TANK", slug: "rebuild-tank", price: 690, category: "เสื้อ", featured: false, mockup: true, imageUrls: ["/products/mockups/rebuild-tank.svg"], description: "แบบจำลองสำหรับดูแนวทางสินค้า ราคาเป็นตัวอย่าง ยังไม่เปิดจำหน่าย", variants: [] },
  { _id: "demo-mockup-return-long-sleeve", title: "RETURN LONG SLEEVE", slug: "return-long-sleeve", price: 690, category: "เสื้อ", featured: false, mockup: true, imageUrls: ["/products/mockups/return-long-sleeve.svg"], description: "แบบจำลองสำหรับดูแนวทางสินค้า ราคาเป็นตัวอย่าง ยังไม่เปิดจำหน่าย", variants: [] },
  { _id: "demo-mockup-reset-jogger", title: "RESET JOGGER", slug: "reset-jogger", price: 890, category: "กางเกง", featured: false, mockup: true, imageUrls: ["/products/mockups/reset-jogger.svg"], description: "แบบจำลองสำหรับดูแนวทางสินค้า ราคาเป็นตัวอย่าง ยังไม่เปิดจำหน่าย", variants: [] },
  { _id: "demo-mockup-rebuild-shorts", title: "REBUILD SHORTS", slug: "rebuild-shorts", price: 890, category: "กางเกง", featured: false, mockup: true, imageUrls: ["/products/mockups/rebuild-shorts.svg"], description: "แบบจำลองสำหรับดูแนวทางสินค้า ราคาเป็นตัวอย่าง ยังไม่เปิดจำหน่าย", variants: [] },
  { _id: "demo-mockup-return-track-pants", title: "RETURN TRACK PANTS", slug: "return-track-pants", price: 890, category: "กางเกง", featured: false, mockup: true, imageUrls: ["/products/mockups/return-track-pants.svg"], description: "แบบจำลองสำหรับดูแนวทางสินค้า ราคาเป็นตัวอย่าง ยังไม่เปิดจำหน่าย", variants: [] },
  { _id: "demo-mockup-reset-towel", title: "RESET TOWEL", slug: "reset-towel", price: 290, category: "อุปกรณ์", featured: false, mockup: true, imageUrls: ["/products/mockups/reset-towel.svg"], description: "แบบจำลองสำหรับดูแนวทางสินค้า ราคาเป็นตัวอย่าง ยังไม่เปิดจำหน่าย", variants: [] },
  { _id: "demo-mockup-rebuild-headband", title: "REBUILD HEADBAND", slug: "rebuild-headband", price: 290, category: "อุปกรณ์", featured: false, mockup: true, imageUrls: ["/products/mockups/rebuild-headband.svg"], description: "แบบจำลองสำหรับดูแนวทางสินค้า ราคาเป็นตัวอย่าง ยังไม่เปิดจำหน่าย", variants: [] },
  { _id: "demo-mockup-return-wristbands", title: "RETURN WRISTBANDS", slug: "return-wristbands", price: 290, category: "อุปกรณ์", featured: false, mockup: true, imageUrls: ["/products/mockups/return-wristbands.svg"], description: "แบบจำลองสำหรับดูแนวทางสินค้า ราคาเป็นตัวอย่าง ยังไม่เปิดจำหน่าย", variants: [] },
];

export function isDemoId(id: string): boolean {
  return id.startsWith("demo-");
}
