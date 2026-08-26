import Omise from "omise";

/** true เมื่อกรอก secret key ของ Omise แล้ว */
export const omiseConfigured = Boolean(process.env.OMISE_SECRET_KEY);

// ตั้งค่า client เฉพาะเมื่อมี key จริง (กันไม่ให้พังตอนยังไม่ตั้งค่า)
export const omise = omiseConfigured
  ? Omise({
      publicKey: process.env.OMISE_PUBLIC_KEY ?? "",
      secretKey: process.env.OMISE_SECRET_KEY ?? "",
    })
  : null;

export const OMISE_NOT_CONFIGURED = "OMISE_NOT_CONFIGURED";

/** Omise คิดเงินเป็นสตางค์ (บาท × 100) */
function toSatang(thb: number): number {
  return Math.round(thb * 100);
}

export type ChargeResult = {
  chargeId: string;
  status: string; // 'successful' | 'pending' | 'failed' | 'expired'
  paid: boolean;
  qrImageUri?: string; // สำหรับ PromptPay
  authorizeUri?: string; // สำหรับบัตร (3-D Secure)
};

/** สร้าง charge แบบ PromptPay → ได้ QR ให้ลูกค้าสแกนจ่าย */
export async function createPromptPayCharge(
  amountThb: number,
  metadata: Record<string, unknown>,
): Promise<ChargeResult> {
  if (!omise) throw new Error(OMISE_NOT_CONFIGURED);
  const amount = toSatang(amountThb);
  const source = await omise.sources.create({
    type: "promptpay",
    amount,
    currency: "thb",
  });
  const charge = await omise.charges.create({
    amount,
    currency: "thb",
    source: source.id,
    metadata,
  });
  return {
    chargeId: charge.id,
    status: charge.status,
    paid: charge.paid === true,
    qrImageUri: charge?.source?.scannable_code?.image?.download_uri,
  };
}

/** สร้าง charge ด้วย card token (token สร้างฝั่ง client ด้วย Omise.js) */
export async function createCardCharge(
  amountThb: number,
  token: string,
  metadata: Record<string, unknown>,
): Promise<ChargeResult> {
  if (!omise) throw new Error(OMISE_NOT_CONFIGURED);
  const amount = toSatang(amountThb);
  const charge = await omise.charges.create({
    amount,
    currency: "thb",
    card: token,
    metadata,
  });
  return {
    chargeId: charge.id,
    status: charge.status,
    paid: charge.paid === true,
    authorizeUri: charge.authorize_uri ?? undefined,
  };
}

/** เช็คสถานะ charge (ใช้ให้หน้า QR poll ว่าจ่ายหรือยัง) — ไม่คืน metadata */
export async function getCharge(chargeId: string): Promise<ChargeResult> {
  if (!omise) throw new Error(OMISE_NOT_CONFIGURED);
  const charge = await omise.charges.retrieve(chargeId);
  return {
    chargeId: charge.id,
    status: charge.status,
    paid: charge.paid === true,
  };
}

export type ChargeDetail = {
  paid: boolean;
  status: string;
  amountThb: number;
  metadata: Record<string, string>;
};

/** อ่าน charge พร้อม metadata + ยอดเงิน — ใช้ฝั่ง server (webhook) เท่านั้น */
export async function getChargeDetail(chargeId: string): Promise<ChargeDetail> {
  if (!omise) throw new Error(OMISE_NOT_CONFIGURED);
  const charge = await omise.charges.retrieve(chargeId);
  return {
    paid: charge.paid === true,
    status: charge.status,
    amountThb: (Number(charge.amount) || 0) / 100,
    metadata: charge.metadata || {},
  };
}
