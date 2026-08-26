import { NextResponse } from "next/server";

import { getChargeDetail, omiseConfigured } from "@/lib/omise";
import { postOrderToOps, type OpsOrderLine } from "@/lib/ops";

/**
 * รับ webhook จาก Omise เมื่อสถานะการชำระเงินเปลี่ยน
 * ตั้งค่า endpoint นี้ใน Omise Dashboard → Webhooks:
 *   https://<โดเมน>/api/webhooks/omise
 *
 * เมื่อจ่ายสำเร็จ → ยืนยัน charge กับ Omise อีกครั้ง (กัน webhook ปลอม)
 * แล้วส่งออเดอร์เข้าระบบหลังบ้าน (Apps Script → ชีต + Telegram)
 */
export async function POST(request: Request) {
  let event: { key?: string; data?: { id?: string } };
  try {
    event = await request.json();
  } catch {
    return NextResponse.json({ received: false }, { status: 400 });
  }

  if (event.key === "charge.complete" && event.data?.id && omiseConfigured) {
    try {
      const charge = await getChargeDetail(event.data.id);
      if (charge.paid) {
        const md = charge.metadata ?? {};

        let lines: OpsOrderLine[] = [];
        try {
          const raw = JSON.parse(md.lines || "[]") as {
            k: string;
            q: number;
            p: number;
            t: string;
          }[];
          lines = raw.map((x) => ({
            sku: x.k || undefined,
            qty: x.q,
            price: x.p,
            title: x.t,
          }));
        } catch {
          // metadata ผิดรูป — ยังส่งออเดอร์ต่อได้ (แค่ไม่มีรายการสินค้า)
        }

        await postOrderToOps({
          orderNumber: md.order_number || event.data.id,
          total: charge.amountThb,
          customerName: md.cust_name || "",
          customerPhone: md.cust_phone || "",
          customerEmail: md.cust_email || "",
          address: md.address || "",
          lines,
        });
      }
    } catch (e) {
      console.error("[webhook] ", e);
    }
  }

  return NextResponse.json({ received: true });
}
