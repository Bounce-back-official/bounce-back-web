import type { Product } from "./products";

/**
 * ไม่มีสินค้าตัวอย่าง/mockup แล้ว
 * สินค้าจริงทั้งหมดจัดการผ่าน Sanity (/studio)
 */
export const demoProducts: Product[] = [];

export function isDemoId(id: string): boolean {
  return id.startsWith("demo-");
}
