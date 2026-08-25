# Bounce Back E-commerce

เว็บไซต์ E-commerce สำหรับแบรนด์เสื้อผ้าออกกำลังกาย **Bounce Back** พัฒนาบนสถาปัตยกรรม Shopify + GitHub โดยใช้โครงสร้าง Shopify Theme มาตรฐานสำหรับหน้าร้าน[1] และให้ Shopify ดูแลสินค้า สต็อก ตะกร้า คำสั่งซื้อ checkout และช่องทางชำระเงิน ส่วน repository นี้เก็บธีม หน้า campaign landing ระบบซิงก์ Google Sheets และคู่มือการตั้งค่า

## Project structure

| Path | Purpose |
|---|---|
| `theme/` | Shopify Online Store 2.0 theme ที่ปรับจาก Dawn ตาม CI ของ Bounce Back |
| `landing/` | Static campaign/preview site สำหรับ GitHub Pages |
| `integrations/shopify-sheets-sync/` | Webhook worker สำหรับซิงก์คำสั่งซื้อและสต็อกไป Google Sheets |
| `docs/IMPLEMENTATION_SPEC.md` | UX, design system, information architecture และ data model |
| `docs/SETUP_TH.md` | คู่มือตั้งค่าจริง Shopify, LINE OA, QR, Google Sheets และ webhooks |
| `docs/VISUAL_QA_NOTES.md` | ผลตรวจ Responsive, Theme Check, tests และ Lighthouse |

## Included storefront experience

หน้าแรกประกอบด้วยสินค้าเปิดตัวใหม่ กิจกรรมของแบรนด์ หมวดเสื้อ กางเกง Accessories รีวิว และบทความความรู้ พร้อมหน้า product, cart, blog, search และ checkout flow ของ Shopify ธีมเพิ่มสต็อกคงเหลือบนหน้าสินค้า ปุ่ม LINE OA แบบลอย คำแนะนำ QR Payment ในตะกร้า หน้าแนะนำการดูแลสินค้า หน้าขอเปลี่ยนสินค้า และหน้าติดต่อเรา

## Quick start

### Preview landing locally

```bash
cd landing
python3 -m http.server 4173
```

### Upload Shopify theme

```bash
shopify theme push --path theme
```

หรือบีบอัดไฟล์ภายใน `theme/` เป็น ZIP แล้วอัปโหลดผ่าน Shopify Admin

### Test integration

```bash
cd integrations/shopify-sheets-sync
pnpm install
pnpm approve-builds --all
pnpm check
pnpm test
```

อ่านขั้นตอน deploy และ secrets ที่ `docs/SETUP_TH.md`

## Required configuration before launch

| Item | Current value |
|---|---|
| LINE OA URL | Placeholder `https://line.me/R/ti/p/@basicid` |
| PromptPay QR | ต้องอัปโหลดรูปจริงใน Shopify Theme Editor |
| Shopify store domain | ต้องตั้งค่าใน deployment secret |
| Google Sheet ID | ต้องตั้งค่าใน deployment secret |
| Existing Google Sheet template | ต้องตรวจ mapping ให้ตรงกับคอลัมน์จริง |
| Product and campaign photography | ต้องอัปโหลดภาพสินค้าจริงใน Shopify |

## Architecture decision

Shopify เป็นระบบหลักของสต็อกและคำสั่งซื้อ Google Sheets เป็น operational mirror สำหรับงานบัญชีและ Telegram การซิงก์ใช้ `orders/paid` และ `inventory_levels/update` webhooks[2] พร้อม HMAC verification และ event deduplication ตามแนวทางการตรวจ webhook delivery ของ Shopify[4] ส่วนการบันทึกคำสั่งซื้อใหม่ใช้ความสามารถ append ของ Google Sheets API[3]

## Quality status

| Check | Result |
|---|---|
| Shopify Theme Check | 0 errors; 11 warnings inherited from Dawn |
| Integration TypeScript | Passed |
| Integration unit tests | 4/4 passed |
| Landing HTML / JavaScript | Passed |
| Lighthouse Performance | 90 |
| Lighthouse Accessibility | 100 |
| Lighthouse Best Practices | 100 |
| Lighthouse SEO | 100 |

## References

[1]: https://shopify.dev/docs/storefronts/themes/architecture "Shopify Dev Docs — Theme architecture"
[2]: https://shopify.dev/docs/api/admin-graphql/latest/objects/WebhookSubscription "Shopify GraphQL Admin API — WebhookSubscription"
[3]: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append "Google Sheets API — spreadsheets.values.append"
[4]: https://shopify.dev/docs/apps/build/webhooks/verify-deliveries "Shopify Dev Docs — Verify webhook deliveries"
