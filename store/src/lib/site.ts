/** ค่าคงที่ของแบรนด์ — แก้ลิงก์/อีเมลจริงได้ที่นี่ที่เดียว */
export const site = {
  name: "BOUNCE BACK",
  url: "https://bouncebackofficial.com", // โดเมนหลัก (ใช้กับ SEO/แชร์ลิงก์)
  tagline: "กลับมา ในจังหวะของคุณ",
  lineUrl: "https://lin.ee/5fp1tLc", // LINE OA จริงของ Bounce Back
  lineLabel: "ซื้อสินค้าผ่าน LINE",
  email: "hello@bounceback.co.th",
  freeShippingText: "ส่งฟรีเมื่อช้อปครบ 1,500 บาท",
  exchangeText: "เปลี่ยนไซซ์ได้ภายใน 7 วัน",
} as const;

export const mainNav = [
  { href: "/", label: "หน้าแรก" },
  { href: "/products", label: "สินค้าทั้งหมด" },
  { href: "/products?category=shirts", label: "เสื้อ" },
  { href: "/products?category=pants", label: "กางเกง" },
  { href: "/products?category=accessories", label: "อุปกรณ์" },
  { href: "/knowledge", label: "เกร็ดความรู้" },
] as const;
