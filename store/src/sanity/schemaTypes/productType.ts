import { defineArrayMember, defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "สินค้า",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "ชื่อสินค้า",
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
      name: "images",
      title: "รูปสินค้า",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
      validation: (rule) => rule.min(1).error("ต้องมีรูปอย่างน้อย 1 รูป"),
    }),
    defineField({
      name: "price",
      title: "ราคา (บาท)",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "compareAtPrice",
      title: "ราคาก่อนลด (บาท) — ใส่เมื่อจัดโปร",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "category",
      title: "หมวดสินค้า",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "description",
      title: "รายละเอียด",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "variants",
      title: "ตัวเลือก (ไซซ์ / สี / สต็อก)",
      description: "ใส่ 1 แถวต่อ 1 ตัวเลือกที่ขาย เช่น ดำ/M, ดำ/L, ขาว/M",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "variant",
          fields: [
            defineField({ name: "size", title: "ไซซ์", type: "string" }),
            defineField({ name: "color", title: "สี", type: "string" }),
            defineField({
              name: "sku",
              title: "SKU",
              type: "string",
            }),
            defineField({
              name: "stock",
              title: "จำนวนคงเหลือ",
              type: "number",
              initialValue: 0,
              validation: (rule) => rule.required().min(0),
            }),
          ],
          preview: {
            select: { size: "size", color: "color", stock: "stock" },
            prepare({ size, color, stock }) {
              const label = [color, size].filter(Boolean).join(" / ") || "ตัวเลือก";
              return { title: label, subtitle: `คงเหลือ ${stock ?? 0} ชิ้น` };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "sizeChart",
      title: "ตารางไซซ์ (ซม.)",
      description: "วัดแบน (รอบอก = วัดจากรักแร้ถึงรักแร้ × 2)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "sizeRow",
          fields: [
            defineField({ name: "size", title: "ไซซ์", type: "string" }),
            defineField({ name: "chest", title: "รอบอก (ซม.)", type: "number" }),
            defineField({ name: "length", title: "ความยาวเสื้อ (ซม.)", type: "number" }),
            defineField({ name: "sleeve", title: "ความยาวแขน (ซม.)", type: "number" }),
          ],
          preview: {
            select: { size: "size", chest: "chest", length: "length" },
            prepare({ size, chest, length }) {
              return {
                title: size || "ไซซ์",
                subtitle: `อก ${chest ?? "-"} · ยาว ${length ?? "-"} ซม.`,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "featured",
      title: "แสดงเป็นสินค้าเด่นบนหน้าแรก",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "active",
      title: "เปิดขาย (ปิดไว้ = ซ่อนจากหน้าร้าน)",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "title", media: "images.0", price: "price" },
    prepare({ title, media, price }) {
      return { title, media, subtitle: price != null ? `฿${price}` : "" };
    },
  },
});
