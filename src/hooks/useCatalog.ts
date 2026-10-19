import { useQuery } from "@tanstack/react-query";
import { isSanityConfigured, sanityFetch } from "@/lib/sanity";
import {
  SHOP_PRODUCTS,
  BRANDS,
  CATEGORIES,
  FABRICS,
  COLORS,
  type ShopProduct,
} from "@/data/shopProducts";

export interface CatalogColor {
  name: string;
  hex: string;
}

export interface Catalog {
  products: ShopProduct[];
  brands: string[];
  categories: string[];
  fabrics: string[];
  colors: CatalogColor[];
}

const STATIC_CATALOG: Catalog = {
  products: SHOP_PRODUCTS,
  brands: [...BRANDS],
  categories: [...CATEGORIES],
  fabrics: [...FABRICS],
  colors: [...COLORS],
};

const CATALOG_QUERY = `{
  "products": *[_type == "product" && defined(brand) && defined(category) && defined(fabric) && defined(color) && defined(image.asset)]
    | order(coalesce(sortOrder, 9999) asc, _createdAt asc) {
      "id": _id,
      sku,
      title,
      "brand": brand->title,
      "category": category->title,
      "fabric": fabric->title,
      "color": color->name,
      "colorHex": color->hex,
      price,
      originalPrice,
      "image": image.asset->url + "?w=1000&auto=format&q=80",
      description,
      tag,
      "inStock": coalesce(inStock, true),
      "sizes": coalesce(sizes, [])
    },
  "brands": *[_type == "brand"] | order(coalesce(sortOrder, 9999) asc, title asc).title,
  "categories": *[_type == "category"] | order(coalesce(sortOrder, 9999) asc, title asc).title,
  "fabrics": *[_type == "fabric"] | order(coalesce(sortOrder, 9999) asc, title asc).title,
  "colors": *[_type == "color"] | order(coalesce(sortOrder, 9999) asc, name asc) { name, hex }
}`;

interface RawCatalog {
  products: ShopProduct[];
  brands: string[];
  categories: string[];
  fabrics: string[];
  colors: CatalogColor[];
}

async function loadCatalog(): Promise<Catalog> {
  const raw = await sanityFetch<RawCatalog>(CATALOG_QUERY);
  return {
    products: raw.products.map((p) => ({ ...p, colorHex: p.colorHex || "#999999", description: p.description || "" })),
    brands: ["All Brands", ...raw.brands],
    categories: ["All Categories", ...raw.categories],
    fabrics: ["All Fabrics", ...raw.fabrics],
    colors: [{ name: "All Colors", hex: "transparent" }, ...raw.colors],
  };
}

/**
 * Catalog data (products + filter lists).
 * - When Sanity is configured, content comes from the CMS dashboard.
 * - Otherwise (or if the CMS is unreachable) the bundled static catalog is used.
 */
export function useCatalog(): { catalog: Catalog; isLoading: boolean } {
  const query = useQuery({
    queryKey: ["catalog"],
    queryFn: loadCatalog,
    enabled: isSanityConfigured,
    staleTime: 60_000,
    retry: 1,
  });

  if (!isSanityConfigured) return { catalog: STATIC_CATALOG, isLoading: false };
  if (query.data) return { catalog: query.data, isLoading: false };
  if (query.isError) return { catalog: STATIC_CATALOG, isLoading: false };
  return {
    catalog: { ...STATIC_CATALOG, products: [] },
    isLoading: true,
  };
}
