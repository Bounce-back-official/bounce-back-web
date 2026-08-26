import { getProductsByIds } from "./products";

export const FREE_SHIPPING_THRESHOLD = 1500;
export const SHIPPING_FEE = 50;

export function computeShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD || subtotal <= 0 ? 0 : SHIPPING_FEE;
}

/** สิ่งที่ client ส่งมา (ราคาไม่เชื่อถือ — คำนวณใหม่จาก Sanity เสมอ) */
export type CheckoutItemInput = {
  productId: string;
  size?: string;
  color?: string;
  qty: number;
};

export type OrderLine = {
  productId: string;
  title: string;
  sku?: string;
  size?: string;
  color?: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderDraft = {
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
  valid: boolean;
  errors: string[];
};

/**
 * คำนวณคำสั่งซื้อใหม่ฝั่ง server จากราคาจริงใน Sanity + ตรวจสต็อก
 * ห้ามใช้ราคาที่ client ส่งมาในการคิดเงินเด็ดขาด
 */
export async function buildOrderDraft(
  items: CheckoutItemInput[],
): Promise<OrderDraft> {
  const errors: string[] = [];
  const ids = [...new Set(items.map((i) => i.productId))];
  const products = await getProductsByIds(ids);
  const byId = new Map(products.map((p) => [p._id, p]));

  const lines: OrderLine[] = [];
  for (const item of items) {
    const p = byId.get(item.productId);
    if (!p) {
      errors.push(`ไม่พบสินค้า (${item.productId})`);
      continue;
    }
    const qty = Math.max(1, Math.floor(item.qty));

    let sku: string | undefined;
    if (p.variants && p.variants.length > 0) {
      const v = p.variants.find(
        (x) =>
          (x.size ?? "") === (item.size ?? "") &&
          (x.color ?? "") === (item.color ?? ""),
      );
      if (!v) {
        errors.push(`ไม่พบตัวเลือกของ ${p.title}`);
        continue;
      }
      if (v.stock < qty) {
        errors.push(`${p.title} มีสินค้าไม่พอ (เหลือ ${v.stock})`);
        continue;
      }
      sku = v.sku;
    }

    lines.push({
      productId: p._id,
      title: p.title,
      sku,
      size: item.size,
      color: item.color,
      qty,
      unitPrice: p.price,
      lineTotal: p.price * qty,
    });
  }

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const itemCount = lines.reduce((s, l) => s + l.qty, 0);
  const shipping = computeShipping(subtotal);
  const total = subtotal + shipping;
  const valid = errors.length === 0 && lines.length > 0;

  return { lines, subtotal, shipping, total, itemCount, valid, errors };
}
