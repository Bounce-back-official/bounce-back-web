import { NextResponse } from "next/server";

import { postClaimToOps } from "@/lib/ops";

export async function POST(request: Request) {
  let body: { orderNumber?: string; phone?: string; reason?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  const phone = String(body.phone ?? "").trim();
  const reason = String(body.reason ?? "").trim();
  const orderNumber = String(body.orderNumber ?? "").trim();

  if (!phone || !reason) {
    return NextResponse.json(
      { ok: false, error: "กรุณากรอกเบอร์โทรและรายละเอียดการเคลม" },
      { status: 400 },
    );
  }

  const result = await postClaimToOps({ phone, reason, orderNumber });
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
