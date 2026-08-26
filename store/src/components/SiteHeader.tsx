import Link from "next/link";

import { mainNav, site } from "@/lib/site";
import { BrandMark } from "./BrandMark";
import { CartButton } from "./CartButton";

export function SiteHeader() {
  return (
    <>
      <div className="announcement">
        {site.freeShippingText} <span aria-hidden="true">·</span>{" "}
        {site.exchangeText}
      </div>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Bounce Back หน้าแรก">
          <BrandMark className="brand__mark" />
          <span>BOUNCE BACK</span>
        </Link>

        <nav className="primary-nav" aria-label="เมนูหลัก">
          {mainNav.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <CartButton />
          <a
            className="header-action"
            href={site.lineUrl}
            target="_blank"
            rel="noopener"
          >
            LINE OA ↗
          </a>
        </div>
      </header>
    </>
  );
}
