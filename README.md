# Bounce Back — เว็บขายของ

เว็บ E-commerce ของแบรนด์เสื้อผ้าออกกำลังกาย **Bounce Back** — เว็บ **custom สร้างเอง** (ไม่ใช้ Shopify แล้ว) คุมดีไซน์/ต้นทุน/โค้ดเองได้ 100%

🌐 **Live:** https://bounce-back-web.vercel.app

## Stack

| ส่วน | เทคโนโลยี |
|---|---|
| หน้าร้าน | **Next.js** (App Router, TypeScript, Tailwind) |
| จัดการสินค้า/สต็อก/รูป | **Sanity CMS** (Studio ที่ `/studio`) |
| ชำระเงิน | **Omise / Opn** — QR PromptPay + บัตรเครดิต (auto-confirm) |
| โฮสต์ | **Vercel** |
| ออเดอร์/บัญชี/สต๊อก/แจ้งเตือน | เชื่อม **Google Sheet + Telegram** ผ่าน repo `bounce-back-ops` |

## โครงสร้าง repo

| Path | คืออะไร |
|---|---|
| `store/` | ⭐ เว็บจริง (Next.js app) — ดู [store/README.md](store/README.md) |
| `landing/` | หน้า static preview ดีไซน์ (อ้างอิง/teaser) |

## เริ่มพัฒนา

```bash
cd store
npm install
cp .env.local.example .env.local   # ใส่ค่า Sanity / Omise / OPS_WEBHOOK_URL
npm run dev
```

## Flow เมื่อมีคนสั่งซื้อ

```
ลูกค้า → เลือกสินค้า → ตะกร้า → checkout → จ่าย (Omise: QR/บัตร)
   จ่ายสำเร็จ → Omise webhook → เว็บยิงออเดอร์เข้า Apps Script (bounce-back-ops)
   → บันทึก รายรับ + ตัดสต๊อก + แท็บลูกค้า + แจ้ง Telegram
```

## หมายเหตุ

- เดิมวางแผนใช้ Shopify แต่**เปลี่ยนเป็นเว็บ custom** (เหตุผลในบันทึกการตัดสินใจ `bounce-back-hq/docs/DECISIONS.md`) — โค้ด Shopify เก่า (theme/, integrations/, docs/) ถูกลบออกแล้ว
- ตอนนี้ยังใช้ **Omise test keys** — เปิดรับเงินจริงต้องสมัคร Omise live + ใส่ live keys (บุคคลธรรมดาก็สมัครได้)
- สินค้าตัวอย่าง (mockup) จะสลับเป็นของจริงอัตโนมัติเมื่อเพิ่มสินค้าใน `/studio`
