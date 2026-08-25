# คู่มือตั้งค่าระบบ Bounce Back ก่อนเปิดขาย

**ผู้จัดทำ:** Manus AI  
**อัปเดต:** 25 สิงหาคม 2026

## 1. ภาพรวมระบบ

เว็บไซต์ใช้ **Shopify เป็นแหล่งข้อมูลหลัก** สำหรับสินค้า ตัวเลือกไซซ์ ราคา สต็อก ตะกร้า คำสั่งซื้อ และ checkout ส่วน Google Sheets เป็นสำเนาข้อมูลเชิงปฏิบัติการสำหรับงานบัญชีและ Telegram ตรวจสต็อก การจัดวางนี้ช่วยลดความเสี่ยงจากลูกค้าหลายคนสั่งซื้อพร้อมกัน เพราะการยืนยันและตัดสต็อกเกิดในระบบร้านค้าก่อน แล้วจึงส่งผลลัพธ์ไปยังชีตผ่าน webhook ซึ่ง Shopify รองรับการส่งเหตุการณ์ไปยัง URL ที่กำหนดเมื่อมีการเปลี่ยนแปลงเกิดขึ้น[1]

| ระบบ | หน้าที่ |
|---|---|
| Shopify | สินค้า ราคา สต็อก ตะกร้า คำสั่งซื้อ checkout และสถานะการชำระเงิน |
| Shopify Theme ใน GitHub | หน้าตาแบรนด์ หน้าแรก สินค้า ตะกร้า บทความ วิธีดูแล และการขอเปลี่ยนสินค้า |
| Webhook Worker | ตรวจลายเซ็น Shopify และส่งข้อมูลไป Google Sheets |
| Google Sheets | สำเนาคำสั่งซื้อ รายการสินค้า สต็อกล่าสุด และ log ป้องกันข้อมูลซ้ำ |
| Telegram | อ่านแท็บ `Inventory` เพื่อแจ้งสต็อกล่าสุดตาม SKU |

## 2. ตั้งค่า Shopify Theme

อัปโหลดโฟลเดอร์ `theme/` ผ่าน Shopify CLI หรือ ZIP จากนั้นเข้า **Online Store → Themes → Customize** และตั้งค่ารายการต่อไปนี้

| รายการ | ตำแหน่งตั้งค่า | ค่าที่ต้องกรอก |
|---|---|---|
| โลโก้จริง | Theme settings → Logo | ไฟล์โลโก้ Bounce Back เวอร์ชันพื้นสว่าง/มืดตามการใช้งาน |
| LINE OA | Theme settings → Bounce Back — ช่องทางขาย | `https://line.me/R/ti/p/@YOUR_BASIC_ID` |
| QR PromptPay | Theme settings → Bounce Back — ช่องทางขาย | รูป QR จริงของกิจการ |
| ชื่อบัญชี | Theme settings → Bounce Back — ช่องทางขาย | ชื่อบุคคลหรือนิติบุคคลที่รับชำระ |
| อีเมลและเวลาทำการ | Theme settings → Bounce Back — ช่องทางขาย | ข้อมูลติดต่อจริง |

สร้างคอลเลกชันให้มี handle `shirts`, `pants` และ `accessories` แล้วสร้างเมนู `main-menu` ให้ครอบคลุมหน้าแรก สินค้า วิธีดูแล ขอเปลี่ยนสินค้า บทความ และติดต่อเรา

สร้าง Pages และเลือก Theme template ดังนี้

| หน้า | Template |
|---|---|
| วิธีดูแลสินค้า | `page.care` |
| ขอเปลี่ยนสินค้า | `page.exchange` |
| ติดต่อเรา | `page.bounce-contact` |

## 3. ตั้งค่า QR Payment

ใน Shopify Admin ให้เพิ่ม **Manual payment method** สำหรับ QR PromptPay/โอนเงิน พร้อมคำแนะนำการชำระเงินจริง เมื่อผู้ซื้อกด checkout ระบบจะสร้างคำสั่งซื้อใน Shopify ก่อนและแสดงขั้นตอนชำระตามวิธีที่ร้านตั้งค่าไว้ ธีมจะแสดงคำอธิบาย QR และช่องทาง LINE ในหน้าตะกร้า แต่ไม่ควรบันทึกเลขบัญชีหรือคีย์ลับไว้ใน GitHub

> การอัปโหลดเพียงรูป QR ในธีมไม่ได้ยืนยันยอดเงินอัตโนมัติ การตรวจยอดอัตโนมัติต้องเชื่อม payment gateway หรือผู้ให้บริการที่มี callback/API ในระยะถัดไป

เมื่อเพิ่มการชำระผ่านบัตรในอนาคต ให้เปิด payment provider ใน Shopify โดยไม่ต้องเปลี่ยนโค้ดตะกร้าหรือหน้าสินค้า

## 4. เตรียม Google Sheets

สร้างหรือเลือก Spreadsheet เดิม แล้วสร้างแท็บตามไฟล์ CSV ใน `integrations/shopify-sheets-sync/google-sheet-template/` ได้แก่ `Orders`, `Order_Items`, `Inventory` และ `Webhook_Log` หากต้องใช้ template เดิมของบริษัท ให้ปรับลำดับคอลัมน์ใน `src/index.ts` ให้ตรงกับชีตจริงก่อน deploy

Google Sheets API รองรับการ append แถวใหม่ต่อท้าย logical table ผ่าน `spreadsheets.values.append`[2] ส่วนสต็อกในแท็บ `Inventory` ใช้วิธีค้นหา `inventory_item_id` แล้ว update แถวเดิม เพื่อให้ Telegram อ่านค่าปัจจุบันได้ทันทีโดยไม่ต้องรวมประวัติเอง

## 5. สร้าง Google Service Account

ใน Google Cloud Console ให้เปิด Google Sheets API สร้าง Service Account และสร้าง private key จากนั้นแชร์ Spreadsheet ให้ email ของ Service Account ด้วยสิทธิ์ Editor ไม่ต้องใส่ไฟล์ JSON ลง repository ให้เก็บค่า email, private key และ spreadsheet ID เป็น deployment secrets เท่านั้น

## 6. Deploy Webhook Worker

เข้าโฟลเดอร์ `integrations/shopify-sheets-sync/` แล้วรันคำสั่งต่อไปนี้

```bash
pnpm install
pnpm approve-builds --all
pnpm check
pnpm test
pnpm wrangler secret put SHOPIFY_WEBHOOK_SECRET
pnpm wrangler secret put SHOPIFY_STORE_DOMAIN
pnpm wrangler secret put SHOPIFY_ADMIN_ACCESS_TOKEN
pnpm wrangler secret put GOOGLE_SERVICE_ACCOUNT_EMAIL
pnpm wrangler secret put GOOGLE_PRIVATE_KEY
pnpm wrangler secret put GOOGLE_SHEET_ID
pnpm deploy
```

Worker ใช้ Shopify HMAC header ตรวจสอบว่า payload มาจาก Shopify ก่อนประมวลผล[3] ห้ามปิดการตรวจลายเซ็น และห้าม log เนื้อหา webhook ที่มีข้อมูลลูกค้าแบบเต็ม

## 7. สร้าง Shopify Webhooks

เข้า **Settings → Notifications → Webhooks** แล้วสร้าง JSON webhooks ให้ชี้ไปที่

```text
https://YOUR-WORKER.workers.dev/webhooks/shopify
```

| เหตุการณ์ | Topic | ผลลัพธ์ |
|---|---|---|
| Order payment | `orders/paid` | เพิ่มข้อมูลใน `Orders` และ `Order_Items` |
| Inventory level update | `inventory_levels/update` | เพิ่มหรืออัปเดตสต็อกล่าสุดใน `Inventory` |

Shopify ระบุว่า webhook ที่ปลายทางตอบกลับสถานะล้มเหลวซ้ำ ๆ อาจถูกลบอัตโนมัติ จึงควรทดสอบ webhook จาก Admin และตรวจ health endpoint ก่อนเปิดขาย[4]

```text
GET https://YOUR-WORKER.workers.dev/health
```

## 8. เชื่อม Telegram ตรวจสต็อก

ให้ workflow ของ Telegram ค้นหาสินค้าด้วย `sku` จากแท็บ `Inventory` และอ่าน `available_quantity` พร้อม `updated_at` อย่าให้ Telegram แก้ตัวเลขสต็อกโดยตรง เพราะ Shopify ต้องเป็นระบบหลัก หากต้องรับสินค้าเข้า/ปรับยอด ให้แก้ใน Shopify แล้วปล่อยให้ webhook ซิงก์กลับชีต

## 9. รายการที่ต้องส่งให้ทีมพัฒนาก่อนทดสอบจริง

| ข้อมูล | สถานะปัจจุบัน |
|---|---|
| Shopify store domain | ยังไม่ได้รับ |
| LINE OA Basic ID/ลิงก์ | ยังใช้ `@basicid` เป็น placeholder |
| รูป QR PromptPay จริง | ยังไม่ได้รับ |
| Google Sheet ID และโครงสร้าง template เดิม | ยังไม่ได้รับ |
| Google Service Account credentials | ยังไม่ได้รับ |
| Shopify webhook secret | สร้างเมื่อ configure webhook/custom app |
| Shopify Admin API token | สร้างจาก custom app พร้อม `read_inventory`, `read_products` |

## References

[1]: https://shopify.dev/docs/api/admin-graphql/latest/objects/WebhookSubscription "Shopify GraphQL Admin API — WebhookSubscription"
[2]: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append "Google Sheets API — spreadsheets.values.append"
[3]: https://shopify.dev/docs/apps/build/webhooks/subscribe/https "Shopify Dev Docs — HTTPS webhooks and HMAC validation"
[4]: https://help.shopify.com/en/manual/fulfillment/setup/notifications/webhooks "Shopify Help Center — Creating webhooks"
