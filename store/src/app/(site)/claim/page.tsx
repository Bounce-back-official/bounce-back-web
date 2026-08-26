"use client";

import { useState } from "react";

import { site } from "@/lib/site";

export default function ClaimPage() {
  const [form, setForm] = useState({ orderNumber: "", phone: "", reason: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.phone || !form.reason) {
      setError("กรุณากรอกเบอร์โทรและรายละเอียดการเคลม");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "ส่งเรื่องไม่สำเร็จ");
        return;
      }
      setDone(true);
    } catch {
      setError("เกิดข้อผิดพลาด ลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <section className="section" style={{ textAlign: "center", maxWidth: 520, marginInline: "auto" }}>
        <p className="eyebrow">CLAIM</p>
        <h2 style={{ fontSize: "clamp(28px,4vw,44px)", margin: "0 0 14px" }}>
          รับเรื่องเคลมแล้ว
        </h2>
        <p style={{ color: "rgba(14,14,16,.65)", lineHeight: 1.8 }}>
          ทีมงานได้รับเรื่องของคุณแล้ว และจะติดต่อกลับทาง LINE / โทรศัพท์โดยเร็วที่สุด
        </p>
        <a className="button button--dark" href={site.lineUrl} target="_blank" rel="noopener" style={{ marginTop: 24 }}>
          คุยกับทีมงานทาง LINE
        </a>
      </section>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 12px",
    border: "1px solid rgba(14,14,16,.25)",
    background: "var(--white)",
    fontFamily: "inherit",
    fontSize: 14,
  };

  return (
    <section className="section">
      <div className="section-head" style={{ marginBottom: 24 }}>
        <div>
          <p className="eyebrow">CLAIM / เคลมสินค้า</p>
          <h2>แจ้งเคลม / ขอเปลี่ยนสินค้า</h2>
        </div>
      </div>

      <form onSubmit={submit} style={{ maxWidth: 520, display: "grid", gap: 14 }}>
        <p style={{ color: "rgba(14,14,16,.65)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
          กรอกเบอร์โทรที่ใช้สั่งซื้อ + รายละเอียดปัญหา ทีมงานจะติดต่อกลับ
          (ใส่เลขออเดอร์ด้วยจะช่วยให้เร็วขึ้น)
        </p>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, color: "rgba(14,14,16,.6)" }}>
            เลขออเดอร์ (ถ้ามี)
          </span>
          <input
            value={form.orderNumber}
            onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
            placeholder="เช่น 26-08-2026-0007"
            style={inputStyle}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, color: "rgba(14,14,16,.6)" }}>
            เบอร์โทรที่ใช้สั่งซื้อ *
          </span>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            style={inputStyle}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, color: "rgba(14,14,16,.6)" }}>
            รายละเอียดปัญหา / สิ่งที่ต้องการเคลม *
          </span>
          <textarea
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            rows={4}
            style={inputStyle}
          />
        </label>

        {error && <p style={{ color: "#c0392b", fontSize: 13, margin: 0 }}>{error}</p>}

        <button
          type="submit"
          className="button button--dark"
          disabled={submitting}
          style={{ width: "100%", marginTop: 6 }}
        >
          {submitting ? "กำลังส่ง…" : "ส่งเรื่องเคลม"}
        </button>
      </form>
    </section>
  );
}
