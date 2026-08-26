/**
 * เชื่อมกับระบบหลังบ้าน (bounce-back-ops) ผ่าน Apps Script Web App
 * ส่งออเดอร์ที่จ่ายเงินแล้ว → บันทึกรายรับ + ตัดสต๊อก + แจ้ง Telegram (ในชีต Google)
 */

const OPS_URL = process.env.OPS_WEBHOOK_URL;
const OPS_SECRET = process.env.OPS_WEBHOOK_SECRET;

/** true เมื่อกรอก URL ของ Apps Script Web App แล้ว */
export const opsConfigured = Boolean(OPS_URL);

export type OpsOrderLine = {
  sku?: string;
  qty: number;
  price: number;
  title: string;
};

export type OpsOrder = {
  orderNumber: string;
  total: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  lines: OpsOrderLine[];
};

export function generateOrderNumber(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BB-${ymd}-${rand}`;
}

/** ส่งออเดอร์ที่จ่ายแล้วไปยัง Apps Script (ชีต + Telegram) */
export async function postOrderToOps(order: OpsOrder): Promise<void> {
  if (!OPS_URL) {
    console.log("[ops] ข้าม (ยังไม่ได้ตั้งค่า OPS_WEBHOOK_URL)", order.orderNumber);
    return;
  }
  try {
    const res = await fetch(OPS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: OPS_SECRET ?? "", type: "order", ...order }),
      redirect: "follow", // Apps Script Web App ตอบ 302 ไป googleusercontent
    });
    if (!res.ok) console.error("[ops] ส่งออเดอร์ไม่สำเร็จ HTTP", res.status);
  } catch (e) {
    console.error("[ops] error", e);
  }
}

export type ClaimInput = {
  orderNumber?: string;
  phone: string;
  reason: string;
};

/** ส่งคำขอเคลมไปยัง Apps Script (อัปเดตสถานะเป็น Claim + Telegram) */
export async function postClaimToOps(
  claim: ClaimInput,
): Promise<{ ok: boolean; error?: string }> {
  if (!OPS_URL) {
    return { ok: false, error: "ระบบรับเรื่องยังไม่พร้อม กรุณาติดต่อทาง LINE" };
  }
  try {
    const res = await fetch(OPS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: OPS_SECRET ?? "", type: "claim", ...claim }),
      redirect: "follow",
    });
    if (!res.ok) return { ok: false, error: "ส่งเรื่องไม่สำเร็จ ลองใหม่อีกครั้ง" };
    return { ok: true };
  } catch {
    return { ok: false, error: "เกิดข้อผิดพลาด ลองใหม่อีกครั้ง" };
  }
}
