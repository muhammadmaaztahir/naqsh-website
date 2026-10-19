// One-time import of the existing static catalog (src/data/shopProducts.ts) into Sanity.
// Safe to re-run: documents use fixed ids, so they are replaced, not duplicated.
//
// Usage (from /studio):
//   SANITY_STUDIO_PROJECT_ID=xxxx SANITY_WRITE_TOKEN=skxxxx npm run seed
// PowerShell:
//   $env:SANITY_STUDIO_PROJECT_ID="xxxx"; $env:SANITY_WRITE_TOKEN="skxxxx"; npm run seed

import { createClient } from "@sanity/client";
import { createReadStream, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..", "..");
const srcFile = path.join(root, "src", "data", "shopProducts.ts");

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;
let client;
if (token) {
  if (!projectId) {
    console.error("Set SANITY_STUDIO_PROJECT_ID.");
    process.exit(1);
  }
  client = createClient({ projectId, dataset, token, apiVersion: "2024-01-01", useCdn: false });
} else {
  // Run through `sanity exec scripts/seed.mjs --with-user-token` (uses your `sanity login`)
  const { getCliClient } = await import("sanity/cli");
  client = getCliClient({ apiVersion: "2024-01-01", useCdn: false });
}
const source = readFileSync(srcFile, "utf8");
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// import <var> from "@/assets/..."
const imports = {};
for (const m of source.matchAll(/import\s+(\w+)\s+from\s+"@\/(assets\/[^"]+)";/g)) {
  imports[m[1]] = path.join(root, "src", m[2]);
}

// Products
const arrayBlock = source.slice(source.indexOf("export const SHOP_PRODUCTS"), source.indexOf("\n];"));
const products = [...arrayBlock.matchAll(/\{\s*\n\s*id:[\s\S]*?\n\s{2}\}/g)].map((m) => {
  const obj = {};
  for (const f of m[0].matchAll(/^\s{4}(\w+):\s*(.+?),\s*$/gm)) {
    const [, key, raw] = f;
    obj[key] = /^["[]/.test(raw) ? JSON.parse(raw) : /^\d+$/.test(raw) ? Number(raw) : raw === "true" ? true : raw === "false" ? false : raw;
  }
  return obj;
});

// Filter lists
const listFrom = (name) => {
  const start = source.indexOf(`export const ${name}`);
  const block = source.slice(start, source.indexOf("] as const", start));
  return [...block.matchAll(/"([^"]+)"/g)].map((m) => m[1]).filter((v) => !v.startsWith("All "));
};
const brands = listFrom("BRANDS");
const categories = listFrom("CATEGORIES");
const fabrics = listFrom("FABRICS");
const colorsBlock = source.slice(source.indexOf("export const COLORS"), source.indexOf("];", source.indexOf("export const COLORS")));
const colors = [...colorsBlock.matchAll(/name:\s*"([^"]+)",\s*hex:\s*"([^"]+)"/g)]
  .map((m) => ({ name: m[1], hex: m[2] }))
  .filter((c) => !c.name.startsWith("All "));

async function main() {
  console.log(`Importing ${products.length} products...`);
  const tx = client.transaction();
  brands.forEach((title, i) => tx.createOrReplace({ _id: `brand-${slug(title)}`, _type: "brand", title, sortOrder: i }));
  categories.forEach((title, i) => tx.createOrReplace({ _id: `category-${slug(title)}`, _type: "category", title, sortOrder: i }));
  fabrics.forEach((title, i) => tx.createOrReplace({ _id: `fabric-${slug(title)}`, _type: "fabric", title, sortOrder: i }));
  colors.forEach((c, i) => tx.createOrReplace({ _id: `color-${slug(c.name)}`, _type: "color", name: c.name, hex: c.hex, sortOrder: i }));
  await tx.commit();

  for (const [i, p] of products.entries()) {
    const file = imports[p.image];
    if (!file || !existsSync(file)) {
      console.warn(`! image missing for ${p.id}, skipping`);
      continue;
    }
    const asset = await client.assets.upload("image", createReadStream(file), { filename: path.basename(file) });
    await client.createOrReplace({
      _id: `product-${p.id}`,
      _type: "product",
      title: p.title,
      sku: p.sku,
      image: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
      brand: { _type: "reference", _ref: `brand-${slug(p.brand)}` },
      category: { _type: "reference", _ref: `category-${slug(p.category)}` },
      fabric: { _type: "reference", _ref: `fabric-${slug(p.fabric)}` },
      color: { _type: "reference", _ref: `color-${slug(p.color)}` },
      price: p.price,
      ...(p.originalPrice ? { originalPrice: p.originalPrice } : {}),
      description: p.description,
      ...(p.tag ? { tag: p.tag } : {}),
      sizes: p.sizes,
      inStock: p.inStock ?? true,
      sortOrder: i,
    });
    console.log(`✓ ${p.sku} ${p.title}`);
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
