import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

// ใช้ projectId ชั่วคราวเมื่อยังไม่ได้ตั้งค่า เพื่อไม่ให้ createClient throw
// การเรียกข้อมูลจริงถูกกันไว้ด้วย isSanityConfigured ใน src/lib/products.ts
export const client = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: true,
});
