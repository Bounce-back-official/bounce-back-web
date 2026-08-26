"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { formatBaht } from "@/lib/format";
import { useCart } from "@/lib/cart";

type OmiseJs = {
  setPublicKey: (key: string) => void;
  createToken: (
    type: "card",
    data: Record<string, unknown>,
    cb: (status: number, response: { id?: string; message?: string }) => void,
  ) => void;
};
declare global {
  interface Window {
    Omise?: OmiseJs;
  }
}

const OMISE_PK = process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY ?? "";
const FREE_SHIPPING = 1500;
const SHIPPING_FEE = 50;

function loadOmiseJs(): Promise<OmiseJs> {
  return new Promise((resolve, reject) => {
    if (window.Omise) return resolve(window.Omise);
    const s = document.createElement("script");
    s.src = "https://cdn.omise.co/omise.js";
    s.onload = () => (window.Omise ? resolve(window.Omise) : reject(new Error("โหลด Omise.js ไม่สำเร็จ")));
    s.onerror = () => reject(new Error("โหลด Omise.js ไม่สำเร็จ"));
    document.head.appendChild(s);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, count, ready, clear } = useCart();

  const [customer, setCustomer] = useState({ name: "", phone: "", email: "", address: "" });
  const [method, setMethod] = useState<"promptpay" | "card">("promptpay");
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvc: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qr, setQr] = useState<{ image: string; chargeId: string } | null>(null);

  const shipping = subtotal >= FREE_SHIPPING || subtotal <= 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const cardEnabled = OMISE_PK.length > 0;

  // poll สถานะเมื่อได้ QR แล้ว
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!qr) return;
    pollRef.current = setInterval(async () => {
      try {
        const r = await fetch(`/api/checkout/status?chargeId=${qr.chargeId}`);
        const d = await r.json();
        if (d.ok && d.paid) {
          clear();
          router.push("/checkout/success");
        }
      } catch {
        // ลองใหม่รอบหน้า
      }
    }, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [qr, clear, router]);

  if (ready && count === 0 && !qr) {
    return (
      <section className="section" style={{ textAlign: "center" }}>
        <p className="eyebrow">CHECKOUT</p>
        <h2 style={{ fontSize: "clamp(28px,4vw,44px)", margin: "0 0 14px" }}>ตะกร้าว่างอยู่</h2>
        <Link className="button button--dark" href="/products" style={{ marginTop: 20 }}>
          เลือกดูสินค้า
        </Link>
      </section>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!customer.name || !customer.phone || !customer.address) {
      setError("กรุณากรอกชื่อ เบอร์โทร และที่อยู่จัดส่ง");
      return;
    }

    setSubmitting(true);
    try {
      let cardToken: string | undefined;

      if (method === "card") {
        if (!cardEnabled) throw new Error("ยังไม่ได้ตั้งค่าบัตรเครดิต (Omise public key)");
        const [expMonth, expYear] = card.exp.split("/").map((s) => s.trim());
        const omiseJs = await loadOmiseJs();
        omiseJs.setPublicKey(OMISE_PK);
        cardToken = await new Promise<string>((resolve, reject) => {
          omiseJs.createToken(
            "card",
            {
              name: card.name,
              number: card.number.replace(/\s/g, ""),
              expiration_month: expMonth,
              expiration_year: expYear,
              security_code: card.cvc,
            },
            (status, resp) => {
              if (resp.id) resolve(resp.id);
              else reject(new Error(resp.message || "ข้อมูลบัตรไม่ถูกต้อง"));
            },
          );
        });
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            size: i.size,
            color: i.color,
            qty: i.qty,
          })),
          customer,
          method,
          cardToken,
        }),
      });
      const data = await res.json();

      if (!data.ok) {
        setError(data.error || "ชำระเงินไม่สำเร็จ");
        return;
      }

      if (data.method === "promptpay" && data.qrImageUri) {
        setQr({ image: data.qrImageUri, chargeId: data.chargeId });
        return;
      }
      if (data.method === "card") {
        if (data.authorizeUri) {
          window.location.href = data.authorizeUri;
          return;
        }
        if (data.paid) {
          clear();
          router.push("/checkout/success");
          return;
        }
        setError("การชำระเงินยังไม่สำเร็จ กรุณาลองใหม่");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSubmitting(false);
    }
  }

  // แสดง QR PromptPay
  if (qr) {
    return (
      <section className="section" style={{ textAlign: "center", maxWidth: 480, marginInline: "auto" }}>
        <p className="eyebrow">SCAN TO PAY</p>
        <h2 style={{ fontSize: "clamp(26px,4vw,38px)", margin: "0 0 6px" }}>สแกนจ่ายด้วย PromptPay</h2>
        <p style={{ color: "rgba(14,14,16,.6)", marginBottom: 20 }}>
          ยอดชำระ {formatBaht(total)} · เปิดแอปธนาคารแล้วสแกน QR
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qr.image}
          alt="PromptPay QR"
          style={{ width: 260, height: 260, margin: "0 auto", border: "1px solid rgba(14,14,16,.15)" }}
        />
        <p style={{ marginTop: 20, fontSize: 14, color: "rgba(14,14,16,.6)" }}>
          กำลังรอการชำระเงิน… ระบบจะพาไปหน้าสำเร็จอัตโนมัติเมื่อจ่ายเสร็จ
        </p>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="section-head" style={{ marginBottom: 28 }}>
        <div>
          <p className="eyebrow">CHECKOUT</p>
          <h2>ชำระเงิน</h2>
        </div>
      </div>

      <form onSubmit={submit} style={{ maxWidth: 920 }}>
        <div className="checkout-grid">
          {/* ซ้าย: ฟอร์ม */}
          <div>
            <h3 style={{ fontSize: 18, marginBottom: 14 }}>ข้อมูลจัดส่ง</h3>
            <div style={{ display: "grid", gap: 12 }}>
              <Field label="ชื่อผู้รับ *" value={customer.name} onChange={(v) => setCustomer({ ...customer, name: v })} />
              <Field label="เบอร์โทรผู้รับ *" value={customer.phone} onChange={(v) => setCustomer({ ...customer, phone: v })} />
              <Field label="อีเมล (รับใบเสร็จ)" value={customer.email} onChange={(v) => setCustomer({ ...customer, email: v })} />
              <Field label="ที่อยู่จัดส่ง *" value={customer.address} onChange={(v) => setCustomer({ ...customer, address: v })} textarea />
            </div>

            <h3 style={{ fontSize: 18, margin: "28px 0 14px" }}>วิธีชำระเงิน</h3>
            <div style={{ display: "grid", gap: 10 }}>
              <Radio checked={method === "promptpay"} onChange={() => setMethod("promptpay")} label="QR PromptPay" desc="สแกนจ่ายด้วยแอปธนาคาร" />
              <Radio
                checked={method === "card"}
                onChange={() => cardEnabled && setMethod("card")}
                label="บัตรเครดิต / เดบิต"
                desc={cardEnabled ? "Visa, Mastercard, JCB" : "เปิดใช้เมื่อตั้งค่า Omise keys"}
                disabled={!cardEnabled}
              />
            </div>

            {method === "card" && cardEnabled && (
              <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
                <Field label="เลขบัตร" value={card.number} onChange={(v) => setCard({ ...card, number: v })} />
                <Field label="ชื่อบนบัตร" value={card.name} onChange={(v) => setCard({ ...card, name: v })} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label="เดือน/ปี (MM/YYYY)" value={card.exp} onChange={(v) => setCard({ ...card, exp: v })} />
                  <Field label="CVC" value={card.cvc} onChange={(v) => setCard({ ...card, cvc: v })} />
                </div>
              </div>
            )}
          </div>

          {/* ขวา: สรุปคำสั่งซื้อ */}
          <aside style={{ background: "var(--white)", padding: 24, alignSelf: "start" }}>
            <h3 style={{ fontSize: 16, marginTop: 0, marginBottom: 14 }}>สรุปคำสั่งซื้อ</h3>
            <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
              {items.map((i) => {
                const opt = [i.color, i.size].filter(Boolean).join(" / ");
                return (
                  <div key={i.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13 }}>
                    <span>{i.title}{opt ? ` (${opt})` : ""} × {i.qty}</span>
                    <span style={{ whiteSpace: "nowrap" }}>{formatBaht(i.price * i.qty)}</span>
                  </div>
                );
              })}
            </div>
            <Row label="ยอดสินค้า" value={formatBaht(subtotal)} />
            <Row label="ค่าจัดส่ง" value={shipping === 0 ? "ฟรี" : formatBaht(shipping)} />
            <div style={{ borderTop: "1px solid rgba(14,14,16,.15)", margin: "10px 0" }} />
            <Row label="ยอดชำระ" value={formatBaht(total)} bold />

            {error && (
              <p style={{ marginTop: 14, color: "#c0392b", fontSize: 13 }}>{error}</p>
            )}

            <button type="submit" className="button button--dark" style={{ width: "100%", marginTop: 18 }} disabled={submitting}>
              {submitting ? "กำลังดำเนินการ…" : `ชำระเงิน ${formatBaht(total)}`}
            </button>
            <Link href="/cart" style={{ display: "block", textAlign: "center", fontSize: 13, textDecoration: "underline", marginTop: 10 }}>
              กลับไปที่ตะกร้า
            </Link>
          </aside>
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  const style: React.CSSProperties = {
    width: "100%",
    padding: "11px 12px",
    border: "1px solid rgba(14,14,16,.25)",
    background: "var(--white)",
    fontFamily: "inherit",
    fontSize: 14,
  };
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 12, color: "rgba(14,14,16,.6)" }}>{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} style={style} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} style={style} />
      )}
    </label>
  );
}

function Radio({
  checked,
  onChange,
  label,
  desc,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  desc: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        textAlign: "left",
        padding: "14px 16px",
        border: "1px solid",
        borderColor: checked ? "var(--obsidian)" : "rgba(14,14,16,.2)",
        background: "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          border: "1px solid var(--obsidian)",
          background: checked ? "var(--obsidian)" : "transparent",
          flexShrink: 0,
        }}
      />
      <span>
        <span style={{ display: "block", fontWeight: 600, fontSize: 14 }}>{label}</span>
        <span style={{ display: "block", fontSize: 12, color: "rgba(14,14,16,.55)" }}>{desc}</span>
      </span>
    </button>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: bold ? 18 : 14,
        fontWeight: bold ? 700 : 400,
        fontFamily: bold ? "var(--font-montserrat), sans-serif" : "inherit",
        padding: "2px 0",
      }}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
