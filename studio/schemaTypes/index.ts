import { defineField, defineType } from "sanity";

const simpleList = (name: string, title: string, fieldName = "title") =>
  defineType({
    name,
    title,
    type: "document",
    fields: [
      defineField({ name: fieldName, title: "Name", type: "string", validation: (r) => r.required() }),
      defineField({
        name: "sortOrder",
        title: "Display order",
        description: "Lower numbers show first in the shop filters.",
        type: "number",
      }),
    ],
    preview: { select: { title: fieldName } },
  });

export const brand = simpleList("brand", "Brand");
export const category = simpleList("category", "Category");
export const fabric = simpleList("fabric", "Fabric");

export const color = defineType({
  name: "color",
  title: "Color",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "hex",
      title: "Hex code",
      description: "Example: #1F2022",
      type: "string",
      validation: (r) => r.required().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, { name: "hex color" }),
    }),
    defineField({ name: "sortOrder", title: "Display order", type: "number" }),
  ],
  preview: { select: { title: "name", subtitle: "hex" } },
});

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "sku",
      title: "SKU / Item code",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Main image",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: [{ type: "brand" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "fabric",
      title: "Fabric",
      type: "reference",
      to: [{ type: "fabric" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "reference",
      to: [{ type: "color" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "price",
      title: "Price ($ USD)",
      type: "number",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "originalPrice",
      title: "Original price ($ USD) — for strike-through discount",
      type: "number",
      validation: (r) => r.min(0),
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
    defineField({
      name: "tag",
      title: "Badge",
      type: "string",
      options: {
        list: ["Bestseller", "New Arrival", "Festive", "Limited"],
        layout: "radio",
      },
    }),
    defineField({
      name: "sizes",
      title: "Available sizes",
      description: "Type a size and press Enter, e.g. S, M, L, XL, Custom",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({ name: "inStock", title: "In stock", type: "boolean", initialValue: true }),
    defineField({
      name: "sortOrder",
      title: "Display order",
      description: "Optional. Lower numbers show first on the shop page.",
      type: "number",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "sku", media: "image" },
  },
});

export const schemaTypes = [product, brand, category, fabric, color];
