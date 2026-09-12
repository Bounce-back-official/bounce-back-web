import Link from "next/link";

import { site } from "@/lib/site";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer__top">
        <div>
          <Link href="/" className="brand brand--footer">
            <Logo height={52} variant="white" />
          </Link>
          <p>{site.tagline}</p>
        </div>
        <div className="footer__col">
          <p className="footer__label">SUPPORT</p>
          <a href={site.lineUrl} target="_blank" rel="noopener">
            LINE Official Account
          </a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>
        <div className="footer__col">
          <p className="footer__label">INFORMATION</p>
          <Link href="/products">สินค้าทั้งหมด</Link>
          <Link href="/cart">ตะกร้า</Link>
          <Link href="/claim">เคลม / เปลี่ยนสินค้า</Link>
          <a href={site.lineUrl} target="_blank" rel="noopener">
            วิธีดูแลสินค้า
          </a>
        </div>
      </div>
      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} BOUNCE BACK</span>
        <span>RESILIENT · FOCUSED · READY</span>
      </div>
    </footer>
  );
}
