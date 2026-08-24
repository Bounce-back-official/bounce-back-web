# bounce-back-web — เว็บไซต์ขายของ (ไฮบริด)

## แนวทาง
- **Shopify** = ดูแลตะกร้า จ่ายเงิน สต๊อกหน้าร้าน (เปิดขายได้เร็ว ปลอดภัย)
- **repo นี้** = เก็บโค้ดที่ custom เอง: ธีม + หน้า landing แคมเปญ
- **LINE OA** = ปุ่ม/วิดเจ็ต "แอดไลน์" บนเว็บ ให้ลูกค้าคุยกับร้านโดยตรง
- Deploy landing ฟรีผ่าน **GitHub Pages** (Settings → Pages → main → /landing)

## โครงสร้าง
- `landing/` — หน้า landing / แคมเปญ (static HTML) เผยแพร่ผ่าน GitHub Pages
- `theme/`   — ไฟล์ธีม Shopify ที่ custom (Liquid/CSS)

## เชื่อม LINE OA (คุยกับลูกค้า)
1. สมัคร **LINE Official Account** (เจ้าเดียวกับที่ใช้ทำบอทแจ้งเตือนใน bounce-back-ops)
2. เอา **Basic ID** (เช่น @bounceback) มาทำลิงก์แอดเพื่อน: `https://line.me/R/ti/p/@basicid`
3. ใส่ปุ่ม/วิดเจ็ตบนเว็บ (ตัวอย่างในไฟล์ landing/index.html มีจุดวางปุ่มไว้)

## เปิด landing บน GitHub Pages
1. Settings → Pages → Source = `main`, โฟลเดอร์ `/landing`
2. เว็บจะขึ้นที่ `https://bounce-back.github.io/bounce-back-web/`
3. ผูกโดเมนจริงในช่อง Custom domain ได้ (มี HTTPS ฟรี)
