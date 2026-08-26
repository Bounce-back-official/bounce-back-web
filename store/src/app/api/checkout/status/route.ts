import { NextResponse } from "next/server";

import { getCharge, omiseConfigured } from "@/lib/omise";

// ให้หน้า QR เรียกเช็คว่าจ่ายเงินสำเร็จหรือยัง
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chargeId = searchParams.get("chargeId");

  if (!chargeId) {
    return NextResponse.json({ ok: false, error: "missing chargeId" }, { status: 400 });
  }
  if (!omiseConfigured) {
    return NextResponse.json({ ok: false, code: "OMISE_NOT_CONFIGURED" }, { status: 503 });
  }

  try {
    const charge = await getCharge(chargeId);
    return NextResponse.json({ ok: true, ...charge });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
