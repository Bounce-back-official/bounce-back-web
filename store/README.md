# Bounce Back — เว็บร้านค้า (store)

เว็บขายของแบรนด์ Bounce Back สร้างด้วย **Next.js + Sanity CMS + Omise/Opn Payments**
ดีไซน์ปัจจุบันพอร์ตมาจากงานออกแบบของ **Manus** (โทน obsidian/bone/sand, ฟอนต์ Montserrat + Noto Sans Thai)

## Stack

| ส่วน | เทคโนโลยี |
|---|---|
| หน้าร้าน (โครงสร้าง) | Next.js 16 (App Router, TypeScript) |
| ดีไซน์ / ธีม | CSS + ฟอนต์ (พอร์ตจาก Manus) — ดูหัวข้อ "เปลี่ยน Theme" |
| จัดการสินค้า/สต็อก/รูป | Sanity CMS (Studio ฝังที่ `/studio`) |
| จ่ายเงิน | Omise / Opn Payments — QR PromptPay + บัตรเครดิต *(Phase 2)* |
| โฮสต์ | Vercel (ฟรี) |

## เริ่มใช้งาน

```bash
cd store
npm install
cp .env.local.example .env.local   # กรอกค่าตามด้านล่าง
npm run dev
```

เปิด http://localhost:3000 (หน้าร้าน) และ http://localhost:3000/studio (จัดการสินค้า)

## การตั้งค่า (.env.local)

| ตัวแปร | ค่า | หมายเหตุ |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `alq2qgu7` | Project ID ของ Sanity |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | |
| `OMISE_PUBLIC_KEY` / `OMISE_SECRET_KEY` | *(Phase 2)* | จาก opn.ooo |

> ⚠️ ต้องไปเพิ่ม **CORS origin** `http://localhost:3000` ใน Sanity (manage.sanity.io → API → CORS) เพื่อให้ Studio ที่ `/studio` ล็อกอินได้

> 🧪 **สินค้าตัวอย่าง:** ถ้ายังไม่มีสินค้าใน Sanity เว็บจะใช้สินค้าตัวอย่างจาก `src/lib/demoProducts.ts` (6 ชิ้น) เพื่อให้ทดลอง เลือกดู → ใส่ตะกร้า → checkout ได้เลย พอเพิ่มสินค้าจริงใน `/studio` ระบบจะสลับมาใช้ของจริงอัตโนมัติ

---

## 🎨 เปลี่ยน Theme / ใช้ดีไซน์จาก Manus (สำคัญ)

**หลักการ:** ดีไซน์กับโครงสร้างแยกกันคนละชั้น เปลี่ยนหน้าตาได้โดยไม่แตะระบบหลังบ้าน

| ชั้น | คืออะไร | ไฟล์ | เปลี่ยน Manus แล้วแตะไหม |
|---|---|---|---|
| **ดีไซน์ (เปลี่ยนได้อิสระ)** | สี ฟอนต์ layout | `src/app/globals.css`, `src/components/*`, หน้าใน `src/app/(site)/` | ✅ แก้ตรงนี้ |
| **โครงสร้าง (คงไว้)** | ดึงข้อมูล ตะกร้า จ่ายเงิน routes | `src/lib/*`, `src/sanity/*`, `src/app/api/*` | ❌ ไม่ต้องแตะ |

### วิธีนำดีไซน์ใหม่จาก Manus มาใช้

1. **สี** → แก้ตัวแปรใน `src/app/globals.css` ที่บล็อก `:root` (เช่น `--obsidian`, `--sand`, `--bone`)
2. **ฟอนต์** → แก้ที่ `src/app/layout.tsx` (ใช้ `next/font/google`)
3. **หน้าตา/layout** → Manus ให้ HTML/CSS มา → ก๊อป CSS มาไว้ใน `globals.css` แล้วแปลง HTML เป็น JSX ในคอมโพเนนต์ (`SiteHeader`, `SiteFooter`, `ProductCard`) และหน้าใน `(site)/`
4. **ห้ามแก้** ส่วนที่ดึงข้อมูล เช่น `getProducts()` ใน `src/lib/products.ts` และการ์ดสินค้าจริงที่ map จาก Sanity — แค่เปลี่ยน "เปลือก" CSS/JSX รอบๆ

> ดีไซน์ปัจจุบันพอร์ตจาก `landing/styles.css` + `landing/index.html` ของ Manus (ดู commit "web draft 1")
> ครั้งหน้าถ้า Manus ส่งดีไซน์ใหม่มา ให้ทำซ้ำ 4 ขั้นตอนนี้ — โครง Sanity/Omise/Vercel เดิมใช้ต่อได้ทันที

---

## โครงสร้างไฟล์

```
store/
├─ sanity.config.ts              # ตั้งค่า Sanity Studio
├─ src/
│  ├─ app/
│  │  ├─ (site)/                 # หน้าร้าน (มี header/footer/LINE float)
│  │  │  ├─ page.tsx             # หน้าแรก (hero, values, สินค้า, หมวด, community, reviews)
│  │  │  ├─ products/            # รายการ + หน้าสินค้า
│  │  │  └─ cart/                # ตะกร้า (Phase 2)
│  │  ├─ studio/[[...tool]]/     # Sanity Studio ที่ /studio
│  │  ├─ globals.css             # 🎨 ดีไซน์ทั้งหมด (tokens + คลาสแบรนด์)
│  │  └─ layout.tsx              # ฟอนต์ + metadata
│  ├─ components/                # SiteHeader, SiteFooter, ProductCard, LineFloat, BrandMark
│  ├─ lib/                       # products (GROQ), omise, format, site (ลิงก์แบรนด์)
│  └─ sanity/                    # client, image, schema (product, category)
```

## แผนงานเป็นเฟส

- **Phase 0 — วางโครง** ✅
- **Theme — พอร์ตดีไซน์ Manus** ✅
- **Phase 1 — ตะกร้า** ✅ client cart (localStorage) + เลือกไซซ์/สี/จำนวน + badge ใน header + หน้าตะกร้า (แคตตาล็อกจะเต็มเมื่อเพิ่มสินค้าใน Sanity)
- **Phase 2 — จ่ายเงิน** ✅ โครงพร้อม: checkout form + QR PromptPay + บัตรเครดิต + webhook — **รอเสียบ Omise keys เพื่อรับเงินจริง**
- **Phase 3 — ออเดอร์ + สต๊อก + แจ้งเตือน** ✅ เชื่อมระบบหลังบ้านเดิม (bounce-back-ops): Google Sheet + Telegram ผ่าน Apps Script — **รอ deploy Apps Script + ใส่ URL**
- **Phase 4 — ขึ้นจริง** SEO + deploy Vercel + โดเมน

### เชื่อมระบบหลังบ้าน (Phase 3)
เมื่อจ่ายเงินสำเร็จ → Omise webhook → เว็บ POST ออเดอร์ไป **Apps Script Web App** ใน `bounce-back-ops` →
บันทึกแท็บ `รายรับ` + ตัด `สต๊อก` ตาม SKU + แจ้ง Telegram (ใช้บอท/ชีตเดิมทั้งหมด)
- `src/lib/ops.ts` — ส่งออเดอร์ไป Apps Script · webhook อยู่ที่ `api/webhooks/omise`
- ข้อมูลออเดอร์ฝังใน Omise charge metadata (order_number, ลูกค้า, lines+sku)

**เปิดใช้:** ที่ `bounce-back-ops/apps-script/Code.gs` (มี `doPost` แล้ว) → Deploy เป็น Web App → เอา URL /exec + ตั้ง `WEBHOOK_SECRET` → ใส่ `OPS_WEBHOOK_URL` + `OPS_WEBHOOK_SECRET` ใน `.env.local`

> ⚠️ **SKU ต้องตรง** กับแท็บ "สต๊อก" ในชีต (เช่น `BB-TEE-BLK-M`) ไม่งั้นระบบบันทึกรายรับ+แจ้งเตือนได้ แต่ข้ามการตัดสต๊อก

### ระบบชำระเงิน (Phase 2)
- `src/app/(site)/checkout/page.tsx` — ฟอร์มจัดส่ง + เลือก PromptPay/บัตร + สรุปยอด
- `src/app/(site)/checkout/success/page.tsx` — หน้าขอบคุณ (เคลียร์ตะกร้า)
- `src/app/api/checkout/route.ts` — **คำนวณราคาใหม่ฝั่ง server จาก Sanity** แล้วสร้าง Omise charge
- `src/app/api/checkout/status/route.ts` — ให้หน้า QR poll ว่าจ่ายหรือยัง
- `src/app/api/webhooks/omise/route.ts` — รับผลจาก Omise (ตั้ง URL นี้ใน Omise Dashboard)
- `src/lib/omise.ts` — สร้าง charge (PromptPay/บัตร), `src/lib/orders.ts` — คำนวณ+ตรวจสต็อก

**เปิดใช้จ่ายเงินจริง:** ใส่ 3 ค่านี้ใน `.env.local` (จาก opn.ooo, เริ่ม test key ได้)
`OMISE_SECRET_KEY`, `OMISE_PUBLIC_KEY`, `NEXT_PUBLIC_OMISE_PUBLIC_KEY`
แล้วตั้ง webhook ที่ Omise → `https://<โดเมน>/api/webhooks/omise`

> ตอนนี้ยังไม่ใส่ key → ปุ่มชำระเงินจะแจ้ง "ระบบชำระเงินยังไม่พร้อม" และบัตรเครดิตถูกล็อกไว้ ทุกอย่างอื่นทำงานปกติ

### ระบบตะกร้า (Phase 1)
- `src/lib/cart.tsx` — CartProvider + `useCart()` เก็บใน localStorage (`bb_cart`)
- `src/components/AddToCart.tsx` — เลือกตัวเลือก/จำนวน แล้วเพิ่มลงตะกร้า (อยู่ในหน้าสินค้า)
- `src/components/CartButton.tsx` — ปุ่มตะกร้า + ตัวเลขใน header
- `src/app/(site)/cart/page.tsx` — หน้าตะกร้า (แก้จำนวน/ลบ/ยอดรวม/ส่งฟรี ≥1,500)
- ปุ่ม "ดำเนินการชำระเงิน" ปิดไว้ก่อน จะต่อ Omise ใน Phase 2
