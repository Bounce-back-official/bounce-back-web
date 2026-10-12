import { defineArrayMember, defineField, defineType } from "sanity";

export const articleType = defineType({
  name: "article",
  title: "บทความ / เกร็ดความรู้",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "หัวข้อบทความ",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (ใช้ใน URL)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "หมวดหมู่",
      type: "string",
      options: {
        list: [
          { title: "ความรู้เรื่องผ้า", value: "fabric" },
          { title: "การดูแลรักษา", value: "care" },
          { title: "ทั่วไป", value: "general" },
        ],
        layout: "radio",
      },
      initialValue: "fabric",
    }),
    defineField({
      name: "coverImage",
      title: "รูปปก",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "excerpt",
      title: "คำโปรย (สรุปสั้น ๆ แสดงในหน้ารายการ)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "body",
      title: "เนื้อหาบทความ",
      description: "พิมพ์ได้เหมือน Word — เลือกหัวข้อ/ตัวหนา/ลิสต์ ได้ และกดปุ่มรูปเพื่อแทรกภาพ",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "ปกติ", value: "normal" },
            { title: "หัวข้อใหญ่", value: "h2" },
            { title: "หัวข้อย่อย", value: "h3" },
            { title: "ยกคำพูด", value: "blockquote" },
          ],
          lists: [
            { title: "จุด", value: "bullet" },
            { title: "ตัวเลข", value: "number" },
          ],
        }),
        defineArrayMember({ type: "image", options: { hotspot: true } }),
      ],
    }),
    defineField({
      name: "faq",
      title: "คำถามที่พบบ่อย (FAQ) — ช่วยเรื่อง SEO",
      description: "ใส่ 3 ข้อกำลังดี จะแสดงท้ายบทความ และช่วยให้ขึ้น Google แบบมีคำถาม-คำตอบ",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          fields: [
            defineField({ name: "question", title: "คำถาม", type: "string" }),
            defineField({ name: "answer", title: "คำตอบ", type: "text", rows: 3 }),
          ],
          preview: {
            select: { title: "question", subtitle: "answer" },
          },
        }),
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "วันที่เผยแพร่",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "featured",
      title: "ปักหมุด (แสดงก่อนใคร)",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "active",
      title: "เผยแพร่ (ปิดไว้ = ซ่อนจากเว็บ)",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "ใหม่สุดก่อน",
      name: "newest",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", media: "coverImage", category: "category" },
    prepare({ title, media, category }) {
      const labels: Record<string, string> = {
        fabric: "ความรู้เรื่องผ้า",
        care: "การดูแลรักษา",
        general: "ทั่วไป",
      };
      return { title, media, subtitle: labels[category as string] ?? "" };
    },
  },
});
