import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "หมวดสินค้า",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "ชื่อหมวด",
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
      name: "description",
      title: "คำอธิบาย",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "image",
      title: "รูปหมวด",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "order",
      title: "ลำดับการแสดง",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "ลำดับการแสดง",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
