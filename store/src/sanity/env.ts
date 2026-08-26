export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

/** true เมื่อกรอก Project ID ของ Sanity แล้ว — ใช้กันไม่ให้เว็บพังตอนยังไม่ได้ตั้งค่า */
export const isSanityConfigured = projectId.length > 0;
