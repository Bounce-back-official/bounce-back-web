/** ค่าคงที่ของแบรนด์ — แก้ลิงก์/อีเมลจริงได้ที่นี่ที่เดียว */
export const site = {
  name: "BOUNCE BACK",
  tagline: "กลับมา ในจังหวะของคุณ",
  lineUrl: "https://lin.ee/5fp1tLc", // LINE OA จริงของ Bounce Back
  lineLabel: "คุยกับทีมขายทาง LINE",
  email: "hello@bounceback.co.th",
  freeShippingText: "ส่งฟรีเมื่อช้อปครบ 1,500 บาท",
  exchangeText: "เปลี่ยนไซซ์ได้ภายใน 7 วัน",
} as const;

export const mainNav = [
  { href: "/products", label: "สินค้าใหม่" },
  { href: "/products?category=shirts", label: "เสื้อ" },
  { href: "/products?category=pants", label: "กางเกง" },
  { href: "/products?category=accessories", label: "อุปกรณ์" },
  { href: "/knowledge", label: "เกร็ดความรู้" },
] as const;
