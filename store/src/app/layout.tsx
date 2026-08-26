import type { Metadata } from "next";
import { Montserrat, Noto_Sans_Thai } from "next/font/google";

import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const notoThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bounce Back — Return Stronger",
    template: "%s | Bounce Back",
  },
  description:
    "Bounce Back — เสื้อผ้าออกกำลังกายสำหรับคนที่พร้อมกลับมาแข็งแกร่งกว่าเดิม รองรับชำระเงินผ่าน QR PromptPay และบัตรเครดิต",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${montserrat.variable} ${notoThai.variable} h-full`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
