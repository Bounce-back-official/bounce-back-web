import { NextResponse } from "next/server";

import {
  createCardCharge,
  createPromptPayCharge,
  omiseConfigured,
} from "@/lib/omise";
import { buildOrderDraft, type CheckoutItemInput } from "@/lib/orders";
import { generateOrderNumber, postOrderToOps } from "@/lib/ops";

export async function POST(request: Request) {
  let body: {
    items?: CheckoutItemInput[];
    customer?: { name?: string; phone?: string; email?: string; address?: string };
    method?: "promptpay" | "card";
    cardToken?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items : [];
  const customer = body.customer ?? {};
  const method = body.method;

  if (items.length === 0) {
    return NextResponse.json({ ok: false, error: "ตะกร้าว่าง" }, { status: 400 });
  }

  // คำนวณยอดใหม่จากราคาจริงใน Sanity + ตรวจสต็อก
  const draft = await buildOrderDraft(items);
  if (!draft.valid) {
    return NextResponse.json(
      { ok: false, error: draft.errors.join(" · ") || "ตรวจสอบสินค้าไม่ผ่าน" },
      { status: 400 },
    );
  }

  // ยังไม่ได้ตั้งค่า Omise → แจ้งอย่างสุภาพ (frontend จะแสดงข้อความนี้)
  if (!omiseConfigured) {
    return NextResponse.json(
      {
        ok: false,
        code: "OMISE_NOT_CONFIGURED",
        error: "ระบบชำระเงินยังไม่พร้อม — รอตั้งค่า Omise keys",
        subtotal: draft.subtotal,
        shipping: draft.shipping,
        total: draft.total,
      },
      { status: 503 },
    );
  }

  // ฝังข้อมูลออเดอร์แบบกระชับใน metadata ของ charge
  // → webhook จะอ่านกลับมาส่งเข้าชีต/Telegram ตอนจ่ายสำเร็จ
  const orderNumber = generateOrderNumber();
  const metadata = {
    order_number: orderNumber,
    cust_name: (customer.name ?? "").slice(0, 80),
    cust_phone: (customer.phone ?? "").slice(0, 40),
    cust_email: (customer.email ?? "").slice(0, 80),
    address: (customer.address ?? "").slice(0, 300),
    lines: JSON.stringify(
      draft.lines.map((l) => ({
        k: l.sku ?? "",
        q: l.qty,
        p: l.unitPrice,
        t: (l.title ?? "").slice(0, 40),
      })),
    ),
  };

  try {
    if (method === "promptpay") {
      const charge = await createPromptPayCharge(draft.total, metadata);
      return NextResponse.json({ ok: true, method, orderNumber, total: draft.total, ...charge });
    }
    if (method === "card") {
      if (!body.cardToken) {
        return NextResponse.json({ ok: false, error: "ไม่มีข้อมูลบัตร" }, { status: 400 });
      }
      const charge = await createCardCharge(draft.total, body.cardToken, metadata);
      // บัตรจ่ายทันที → ส่งเข้าชีตเลย (webhook ที่มาทีหลังจะถูกกันซ้ำด้วยเลขออเดอร์)
      if (charge.paid) {
        await postOrderToOps({
          orderNumber,
          total: draft.total,
          customerName: customer.name ?? "",
          customerPhone: customer.phone ?? "",
          customerEmail: customer.email ?? "",
          address: customer.address ?? "",
          lines: draft.lines.map((l) => ({
            sku: l.sku,
            qty: l.qty,
            price: l.unitPrice,
            title: l.title,
          })),
        });
      }
      return NextResponse.json({ ok: true, method, orderNumber, total: draft.total, ...charge });
    }
    return NextResponse.json({ ok: false, error: "วิธีชำระเงินไม่ถูกต้อง" }, { status: 400 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "สร้างรายการชำระเงินไม่สำเร็จ";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
