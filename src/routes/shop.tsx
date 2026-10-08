import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  Check,
  Eye,
  ShoppingBag,
  ArrowUpRight,
  Menu,
  Phone,
  Mail,
  Filter,
  Copy,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SHOP_PRODUCTS,
  BRANDS,
  CATEGORIES,
  FABRICS,
  COLORS,
  createWhatsAppProductUrl,
  type ShopProduct,
} from "@/data/shopProducts";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Ready-to-Wear & Luxury Pret — NAQSH" },
      {
        name: "description",
        content:
          "Explore the Naqsh shop featuring J., Sapphire, and Atelier collections. Abayas, kurtas, stitched suits and luxury silks ready to order directly via WhatsApp.",
      },
      { property: "og:title", content: "Shop Ready-to-Wear & Luxury Pret — NAQSH" },
      {
        property: "og:description",
        content: "Browse stitched & ready-to-wear collections with instant WhatsApp ordering concierge.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ShopPage,
});

type SortOption = "featured" | "price-asc" | "price-desc" | "newest" | "name-asc";
type PricePreset = "all" | "under-6k" | "6k-10k" | "10k-14k" | "above-14k";

function ShopPage() {
  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("All Brands");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [selectedFabric, setSelectedFabric] = useState<string>("All Fabrics");
  const [selectedColor, setSelectedColor] = useState<string>("All Colors");
  const [selectedPricePreset, setSelectedPricePreset] = useState<PricePreset>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  // Mobile menu & drawer states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Quick view / Product detail modal
  const [quickViewProduct, setQuickViewProduct] = useState<ShopProduct | null>(null);
  const [modalSelectedSize, setModalSelectedSize] = useState<string>("");
  const [copiedDetails, setCopiedDetails] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Navigation items matching Home
  const nav = [
    ["HOW IT WORKS", "/#process"],
    ["THE ATELIER", "/#atelier"],
    ["GALLERY", "/#gallery"],
    ["DESIGN STUDIO", "/#design"],
  ];

  // Min & max prices in catalog
  const catalogPrices = useMemo(() => SHOP_PRODUCTS.map((p) => p.price), []);
  const minCatalogPrice = Math.min(...catalogPrices);
  const maxCatalogPrice = Math.max(...catalogPrices);

  // Price presets handler
  const handlePricePreset = (preset: PricePreset) => {
    setSelectedPricePreset(preset);
    if (preset === "all") setPriceRange([0, 20000]);
    else if (preset === "under-6k") setPriceRange([0, 6000]);
    else if (preset === "6k-10k") setPriceRange([6000, 10000]);
    else if (preset === "10k-14k") setPriceRange([10000, 14000]);
    else if (preset === "above-14k") setPriceRange([14000, 25000]);
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return SHOP_PRODUCTS.filter((product) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = product.title.toLowerCase().includes(q);
        const matchSku = product.sku.toLowerCase().includes(q);
        const matchBrand = product.brand.toLowerCase().includes(q);
        const matchFabric = product.fabric.toLowerCase().includes(q);
        const matchCategory = product.category.toLowerCase().includes(q);
        const matchColor = product.color.toLowerCase().includes(q);
        const matchDesc = product.description.toLowerCase().includes(q);
        if (!matchTitle && !matchSku && !matchBrand && !matchFabric && !matchCategory && !matchColor && !matchDesc) {
          return false;
        }
      }

      // 2. Brand Filter
      if (selectedBrand !== "All Brands") {
        if (product.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
          return false;
        }
      }

      // 3. Category Filter
      if (selectedCategory !== "All Categories") {
        if (product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // 4. Fabric Filter
      if (selectedFabric !== "All Fabrics") {
        if (product.fabric.toLowerCase() !== selectedFabric.toLowerCase()) {
          return false;
        }
      }

      // 5. Color Filter
      if (selectedColor !== "All Colors") {
        const pColor = product.color.toLowerCase();
        const sColor = selectedColor.toLowerCase();
        if (sColor === "gold / yellow") {
          if (!pColor.includes("gold") && !pColor.includes("yellow")) return false;
        } else if (!pColor.includes(sColor) && !sColor.includes(pColor)) {
          return false;
        }
      }

      // 6. Tag / Collection Filter
      if (selectedTag !== "All") {
        if (selectedTag === "Bestseller" && product.tag !== "Bestseller") return false;
        if (selectedTag === "New Arrival" && product.tag !== "New Arrival") return false;
        if (selectedTag === "Festive" && product.tag !== "Festive") return false;
        if (selectedTag === "Limited" && product.tag !== "Limited") return false;
      }

      // 7. Price Filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name-asc") return a.title.localeCompare(b.title);
      if (sortBy === "newest") {
        if (a.tag === "New Arrival" && b.tag !== "New Arrival") return -1;
        if (b.tag === "New Arrival" && a.tag !== "New Arrival") return 1;
        return 0;
      }
      return 0;
    });
  }, [searchQuery, selectedBrand, selectedCategory, selectedFabric, selectedColor, selectedTag, priceRange, sortBy]);

  // Active filters count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedBrand !== "All Brands") count++;
    if (selectedCategory !== "All Categories") count++;
    if (selectedFabric !== "All Fabrics") count++;
    if (selectedColor !== "All Colors") count++;
    if (selectedTag !== "All") count++;
    if (selectedPricePreset !== "all" || priceRange[0] > 0 || priceRange[1] < 20000) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [selectedBrand, selectedCategory, selectedFabric, selectedColor, selectedTag, selectedPricePreset, priceRange, searchQuery]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedBrand("All Brands");
    setSelectedCategory("All Categories");
    setSelectedFabric("All Fabrics");
    setSelectedColor("All Colors");
    setSelectedTag("All");
    setSelectedPricePreset("all");
    setPriceRange([0, 20000]);
    setSortBy("featured");
  };

  const handleOpenQuickView = (product: ShopProduct) => {
    setQuickViewProduct(product);
    setModalSelectedSize(product.sizes[0] || "M");
    setIsZoomed(false);
    setCopiedDetails(false);
  };

  const copyProductDetails = async (product: ShopProduct, size: string) => {
    const summary = [
      `NAQSH ATELIER — PRODUCT INQUIRY`,
      `Product: ${product.title}`,
      `SKU: ${product.sku}`,
      `Brand: ${product.brand}`,
      `Category: ${product.category}`,
      `Fabric: ${product.fabric}`,
      `Color: ${product.color}`,
      `Size: ${size}`,
      `Price: PKR ${product.price.toLocaleString()}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summary);
      setCopiedDetails(true);
      setTimeout(() => setCopiedDetails(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-foreground overflow-x-hidden">
      {/* ── TOP ANNOUNCEMENT BAR (Identical to Home) ──────────────── */}
      <div className="bg-[#1A1A1A] py-2 px-4 text-center text-[11px] font-medium tracking-[.15em] text-[#E5D7B7] uppercase">
        <span className="inline-flex items-center gap-2">
          <Sparkles size={12} className="text-[#C09757]" />
          Direct WhatsApp Ordering Concierge & Custom Sizing Available Across All Pieces
          <Sparkles size={12} className="text-[#C09757]" />
        </span>
      </div>

      {/* ── NAVIGATION HEADER (Exact same styling & structure as Home) ─ */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/98 backdrop-blur-md">
        <div className="mx-auto flex h-[64px] max-w-[1440px] items-center justify-between gap-6 px-6 md:h-[80px] md:px-12 xl:px-16">
          <Link to="/" aria-label="Naqsh Home" className="flex shrink-0 items-center gap-3">
            <img src="/favicon.png" alt="" className="h-9 w-9 rounded-full object-cover md:h-[38px] md:w-[38px]" />
            <span className="flex flex-col">
              <span className="display text-[18px] font-semibold leading-none tracking-[.06em] md:text-[20px]">NAQSH</span>
              <span className="mt-1 text-[7.5px] font-bold tracking-[.22em] text-muted-foreground/80">CUSTOMIZE CLOTHING</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 lg:flex xl:gap-8" aria-label="Main navigation">
            <Link
              to="/shop"
              className="nav-link text-[12px] font-semibold tracking-[.1em] text-primary transition-colors hover:text-primary flex items-center gap-1.5"
            >
              <ShoppingBag size={13} /> SHOP
            </Link>
            {nav.map(([name, href]) => (
              <a
                key={name}
                href={href}
                className="nav-link text-[12px] font-medium tracking-[.1em] text-foreground/80 transition-colors hover:text-primary"
              >
                {name}
              </a>
            ))}
          </nav>

          <a
            href="/#design"
            className="hidden h-[38px] rounded-[3px] px-5 !text-[12px] font-bold tracking-[.10em] shadow-none md:inline-flex items-center text-white bg-[#C09757] hover:bg-[#a88246] transition-colors"
          >
            START DESIGNING <ArrowUpRight size={12} className="ml-1" />
          </a>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <nav className="border-t border-border bg-background px-6 py-4 lg:hidden" aria-label="Mobile navigation">
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 border-b border-border/60 py-3 text-[12px] font-bold tracking-[.14em] text-primary"
            >
              <ShoppingBag size={14} /> SHOP COLLECTION
            </Link>
            {nav.map(([name, href]) => (
              <a
                key={name}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="block border-b border-border/60 py-3 text-[12px] font-medium tracking-[.14em]"
              >
                {name}
              </a>
            ))}
            <a
              href="/#design"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 flex w-full h-11 items-center justify-center rounded-[3px] text-[11px] font-bold tracking-[.14em] text-white bg-[#C09757] hover:bg-[#a88246]"
            >
              START DESIGNING <ArrowUpRight size={14} className="ml-1" />
            </a>
          </nav>
        )}
      </header>

      {/* ── HERO BANNER ──────────────────────────────────────────────── */}
      <section className="border-b border-border/60 bg-[#161616] text-[#F5F2EB] py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C09757_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="relative mx-auto max-w-[1440px] px-6 md:px-12 xl:px-16 text-center">
          <p className="eyebrow !text-[#C09757]">CURATED COLLECTION & READY-TO-WEAR</p>
          <h1 className="display mt-3 text-3xl md:text-5xl font-light tracking-wide text-white">
            The Naqsh <em>Shop</em> Catalog
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-[13px] md:text-[14px] leading-relaxed text-[#C5BEB3]">
            Browse ready suits, lawn prints, raw silks, and signature abayas. Click any piece to enlarge or order directly on WhatsApp.
          </p>

          {/* Tag Pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 md:gap-3">
            {[
              { label: "All Items", val: "All" },
              { label: "Bestsellers", val: "Bestseller" },
              { label: "New Arrivals", val: "New Arrival" },
              { label: "Festive Pret", val: "Festive" },
              { label: "Limited Edition", val: "Limited" },
            ].map((t) => (
              <button
                key={t.val}
                onClick={() => setSelectedTag(t.val)}
                className={`rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-wider transition-all cursor-pointer ${
                  selectedTag === t.val
                    ? "bg-[#C09757] text-white shadow-md shadow-[#C09757]/20"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT (SIDEBAR + GRID) ────────────────────────────── */}
      <main className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-12 xl:px-16 py-8 md:py-12">
        {/* Top Control Bar: Search + Mobile filter toggle + Sorting */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, brand, fabric, color or SKU..."
              className="w-full rounded-md border border-border bg-card py-2.5 pl-10 pr-10 text-[13px] placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Right controls: Mobile filter trigger, result count & Sort */}
          <div className="flex items-center justify-between gap-3 md:justify-end">
            {/* Mobile Filter Button */}
            <Button
              variant="outline"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 text-[12px] font-semibold h-10 border-border"
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {/* Product Counter */}
            <span className="text-[12px] font-medium text-muted-foreground hidden sm:inline-block">
              Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> pieces
            </span>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase hidden md:inline">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-md border border-border bg-card px-3 py-2 text-[12px] font-medium text-foreground focus:border-primary focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured / Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">New Arrivals First</option>
                <option value="name-asc">Title: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Badges Bar */}
        {activeFilterCount > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2 p-3 rounded-lg bg-card border border-border">
            <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase mr-1">
              Active Filters:
            </span>

            {selectedBrand !== "All Brands" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-medium text-primary">
                Brand: {selectedBrand}
                <button onClick={() => setSelectedBrand("All Brands")} className="cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedCategory !== "All Categories" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-medium text-primary">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory("All Categories")} className="cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedFabric !== "All Fabrics" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-medium text-primary">
                Fabric: {selectedFabric}
                <button onClick={() => setSelectedFabric("All Fabrics")} className="cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedColor !== "All Colors" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-medium text-primary">
                Color: {selectedColor}
                <button onClick={() => setSelectedColor("All Colors")} className="cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedTag !== "All" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-medium text-primary">
                Tag: {selectedTag}
                <button onClick={() => setSelectedTag("All")} className="cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {(selectedPricePreset !== "all" || priceRange[0] > 0 || priceRange[1] < 20000) && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-medium text-primary">
                Price: PKR {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}
                <button onClick={() => handlePricePreset("all")} className="cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-medium text-primary">
                Query: "{searchQuery}"
                <button onClick={() => setSearchQuery("")} className="cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-destructive hover:underline cursor-pointer"
            >
              <RotateCcw size={12} /> Clear all
            </button>
          </div>
        )}

        {/* Layout: Sidebar (Desktop) + Products Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          {/* ── DESKTOP FILTERS SIDEBAR ────────────────────────────── */}
          <aside className="hidden lg:block space-y-6">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <h2 className="flex items-center gap-2 text-[14px] font-bold tracking-[.15em] uppercase text-foreground">
                <Filter size={16} className="text-primary" /> Filters
              </h2>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] font-semibold text-muted-foreground hover:text-primary flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={11} /> Reset
                </button>
              )}
            </div>

            {/* Brands Filter */}
            <div className="border-b border-border/60 pb-5">
              <h3 className="mb-3 text-[11px] font-bold tracking-[.18em] uppercase text-foreground/70">
                Brand
              </h3>
              <div className="space-y-1.5">
                {BRANDS.map((brand) => {
                  const isSelected = selectedBrand === brand;
                  const count =
                    brand === "All Brands"
                      ? SHOP_PRODUCTS.length
                      : SHOP_PRODUCTS.filter((p) => p.brand === brand).length;
                  return (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`flex w-full items-center justify-between rounded px-2.5 py-1.5 text-[12.5px] transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-primary/10 font-bold text-primary border-l-2 border-primary"
                          : "text-foreground/75 hover:bg-card hover:text-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${isSelected ? "bg-primary" : "bg-border"}`} />
                        {brand}
                      </span>
                      <span className="text-[11px] text-muted-foreground">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Categories Filter */}
            <div className="border-b border-border/60 pb-5">
              <h3 className="mb-3 text-[11px] font-bold tracking-[.18em] uppercase text-foreground/70">
                Category
              </h3>
              <div className="space-y-1.5">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  const count =
                    cat === "All Categories"
                      ? SHOP_PRODUCTS.length
                      : SHOP_PRODUCTS.filter((p) => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex w-full items-center justify-between rounded px-2.5 py-1.5 text-[12.5px] transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-primary/10 font-bold text-primary border-l-2 border-primary"
                          : "text-foreground/75 hover:bg-card hover:text-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${isSelected ? "bg-primary" : "bg-border"}`} />
                        {cat}
                      </span>
                      <span className="text-[11px] text-muted-foreground">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fabrics Filter */}
            <div className="border-b border-border/60 pb-5">
              <h3 className="mb-3 text-[11px] font-bold tracking-[.18em] uppercase text-foreground/70">
                Fabric Material
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                {FABRICS.map((fabric) => {
                  const isSelected = selectedFabric === fabric;
                  return (
                    <button
                      key={fabric}
                      onClick={() => setSelectedFabric(fabric)}
                      className={`truncate rounded px-2.5 py-1.5 text-left text-[12px] transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-primary text-white font-semibold shadow-sm"
                          : "bg-card text-foreground/70 hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      {fabric}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors Filter */}
            <div className="border-b border-border/60 pb-5">
              <h3 className="mb-3 text-[11px] font-bold tracking-[.18em] uppercase text-foreground/70">
                Color Palette
              </h3>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((col) => {
                  const isSelected = selectedColor === col.name;
                  return (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(col.name)}
                      title={col.name}
                      className={`group flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/15 font-bold text-primary shadow-sm ring-1 ring-primary"
                          : "border-border bg-card text-foreground/70 hover:border-foreground/40 hover:text-foreground"
                      }`}
                    >
                      {col.hex !== "transparent" && (
                        <span
                          className="h-3 w-3 rounded-full border border-black/20"
                          style={{ backgroundColor: col.hex }}
                        />
                      )}
                      <span>{col.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter: Presets + Slider */}
            <div className="pb-4">
              <h3 className="mb-3 text-[11px] font-bold tracking-[.18em] uppercase text-foreground/70">
                Price Range
              </h3>
              
              {/* Quick Presets */}
              <div className="grid grid-cols-2 gap-1.5 mb-4">
                {[
                  { label: "All Prices", id: "all" as PricePreset },
                  { label: "< PKR 6,000", id: "under-6k" as PricePreset },
                  { label: "6k - 10k", id: "6k-10k" as PricePreset },
                  { label: "10k - 14k", id: "10k-14k" as PricePreset },
                  { label: "> PKR 14k", id: "above-14k" as PricePreset },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handlePricePreset(p.id)}
                    className={`rounded px-2 py-1 text-[11px] transition-colors cursor-pointer ${
                      selectedPricePreset === p.id
                        ? "bg-[#C09757] text-white font-semibold"
                        : "bg-card text-foreground/70 hover:bg-accent"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between text-[12px] font-bold text-primary mb-1">
                <span>Max: PKR {priceRange[1].toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={minCatalogPrice}
                max={maxCatalogPrice}
                step={500}
                value={priceRange[1]}
                onChange={(e) => {
                  setSelectedPricePreset("all");
                  setPriceRange([priceRange[0], Number(e.target.value)]);
                }}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                <span>PKR {minCatalogPrice.toLocaleString()}</span>
                <span>PKR {maxCatalogPrice.toLocaleString()}</span>
              </div>
            </div>
          </aside>

          {/* ── PRODUCTS CATALOG GRID ──────────────────────────────── */}
          <div>
            {filteredProducts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-12 text-center bg-card/30">
                <ShoppingBag className="mx-auto text-muted-foreground/50 mb-3" size={48} />
                <h3 className="display text-xl text-foreground font-medium">No Matching Pieces Found</h3>
                <p className="mx-auto mt-2 max-w-md text-[13px] text-muted-foreground">
                  We couldn't find any items matching your selected criteria. Try resetting your filters or modifying search keywords.
                </p>
                <Button onClick={resetFilters} className="mt-6 text-[12px] font-semibold bg-[#C09757] hover:bg-[#a88246] text-white cursor-pointer">
                  <RotateCcw size={14} className="mr-2" /> Reset All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-7">
                {filteredProducts.map((product) => {
                  const whatsappUrl = createWhatsAppProductUrl(product);

                  return (
                    <article
                      key={product.id}
                      onClick={() => handleOpenQuickView(product)}
                      className="group relative flex flex-col rounded-lg border border-border/70 bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:-translate-y-1 cursor-pointer"
                    >
                      {/* Image Container with Badges */}
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted/40">
                        <img
                          src={product.image}
                          alt={product.title}
                          loading="lazy"
                          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                          {product.tag && (
                            <span
                              className={`rounded-sm px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-white shadow-sm ${
                                product.tag === "Bestseller"
                                  ? "bg-[#C09757]"
                                  : product.tag === "Festive"
                                  ? "bg-[#8D1B2D]"
                                  : product.tag === "New Arrival"
                                  ? "bg-[#2D5943]"
                                  : "bg-[#1A1A1A]"
                              }`}
                            >
                              {product.tag}
                            </span>
                          )}
                          <span className="rounded-sm bg-black/70 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-white/95">
                            {product.brand}
                          </span>
                        </div>

                        {/* SKU tag top right */}
                        <div className="absolute top-3 right-3 z-10 pointer-events-none">
                          <span className="rounded-sm bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[9.5px] font-mono font-semibold text-foreground/80 shadow-sm">
                            {product.sku}
                          </span>
                        </div>

                        {/* Click to Enlarge Overlay Indicator on Hover */}
                        <div className="absolute inset-0 bg-black/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center pointer-events-none">
                          <span className="flex items-center gap-1.5 rounded-full bg-black/75 px-3.5 py-1.5 text-[11px] font-bold tracking-wider text-white backdrop-blur-sm shadow-md">
                            <ZoomIn size={14} /> VIEW DETAILS
                          </span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="flex flex-1 flex-col p-4 md:p-5">
                        {/* Meta tags */}
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                          <span className="font-medium tracking-wide uppercase text-primary text-[10.5px]">
                            {product.category} • {product.fabric}
                          </span>
                          <span className="flex items-center gap-1">
                            <span
                              className="h-2 w-2 rounded-full border border-black/20"
                              style={{ backgroundColor: product.colorHex }}
                            />
                            {product.color}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="display text-[16px] md:text-[17px] font-medium leading-snug text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {product.title}
                        </h3>

                        {/* Description snippet */}
                        <p className="mt-1.5 text-[12px] text-muted-foreground line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>

                        {/* Price Area */}
                        <div className="mt-4 flex items-baseline gap-2.5">
                          <span className="text-[17px] font-bold text-foreground">
                            PKR {product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="text-[12.5px] text-muted-foreground line-through">
                              PKR {product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Size availability chips */}
                        <div className="mt-3 flex items-center gap-1 text-[10px] text-muted-foreground">
                          <span className="font-semibold text-foreground/70">Sizes:</span>
                          <span className="truncate">{product.sizes.join(", ")}</span>
                        </div>

                        {/* WhatsApp Buy / Order Button */}
                        <div className="mt-5 pt-3 border-t border-border/60">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex w-full items-center justify-center gap-2 rounded bg-[#25D366] hover:bg-[#20ba5a] text-white py-2.5 px-4 text-[12px] font-bold tracking-wider transition-colors shadow-sm shadow-[#25D366]/20 cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            ORDER VIA WHATSAPP
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── PRODUCT DETAILS / LARGE EXPANDED VIEW MODAL ───────────────── */}
      {quickViewProduct && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-background p-6 md:p-8 shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute right-4 top-4 z-20 rounded-full bg-card/80 p-2 text-muted-foreground hover:bg-card hover:text-foreground transition-colors cursor-pointer"
            >
              <X size={22} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Product Image Large with Zoom */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted group/img">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.title}
                  className={`h-full w-full object-cover object-center transition-all duration-500 cursor-zoom-in ${
                    isZoomed ? "scale-150 cursor-zoom-out" : "scale-100 hover:scale-110"
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
                
                {/* Zoom toggle pill */}
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm cursor-pointer"
                >
                  <ZoomIn size={13} /> {isZoomed ? "Zoom Out" : "Zoom In"}
                </button>

                {quickViewProduct.tag && (
                  <span className="absolute top-3 left-3 rounded-sm bg-[#C09757] px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider shadow">
                    {quickViewProduct.tag}
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-[11.5px] font-bold tracking-widest uppercase text-primary">
                  <span>{quickViewProduct.brand}</span>
                  <span>•</span>
                  <span>{quickViewProduct.sku}</span>
                </div>

                <h2 className="display mt-2 text-2xl md:text-3xl font-medium text-foreground leading-tight">
                  {quickViewProduct.title}
                </h2>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-foreground">
                    PKR {quickViewProduct.price.toLocaleString()}
                  </span>
                  {quickViewProduct.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      PKR {quickViewProduct.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
                  {quickViewProduct.description}
                </p>

                {/* Specs Grid */}
                <div className="mt-6 grid grid-cols-2 gap-3 border-y border-border/80 py-4 text-[12.5px]">
                  <div>
                    <span className="font-semibold text-foreground/60 block text-[10.5px] uppercase tracking-wider">Category</span>
                    <span className="font-medium text-foreground">{quickViewProduct.category}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground/60 block text-[10.5px] uppercase tracking-wider">Fabric</span>
                    <span className="font-medium text-foreground">{quickViewProduct.fabric}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground/60 block text-[10.5px] uppercase tracking-wider">Color</span>
                    <span className="font-medium text-foreground flex items-center gap-1.5 mt-0.5">
                      <span className="h-2.5 w-2.5 rounded-full border border-black/20" style={{ backgroundColor: quickViewProduct.colorHex }} />
                      {quickViewProduct.color}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground/60 block text-[10.5px] uppercase tracking-wider">Availability</span>
                    <span className="font-medium text-emerald-600">In Stock Ready</span>
                  </div>
                </div>

                {/* Size Selector */}
                <div className="mt-5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground/70 mb-2">
                    Select Sizing:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setModalSelectedSize(s)}
                        className={`rounded px-3.5 py-1.5 text-[12px] font-semibold transition-colors cursor-pointer ${
                          modalSelectedSize === s
                            ? "bg-[#C09757] text-white shadow"
                            : "bg-card border border-border text-foreground hover:border-foreground/50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons: WhatsApp Order + Copy details */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <a
                    href={createWhatsAppProductUrl(quickViewProduct, modalSelectedSize)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2.5 rounded bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 px-6 text-[13px] font-bold tracking-wider transition-colors shadow-lg shadow-[#25D366]/25 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    ORDER ON WHATSAPP
                  </a>

                  <Button
                    variant="outline"
                    onClick={() => copyProductDetails(quickViewProduct, modalSelectedSize)}
                    className="flex items-center justify-center gap-2 py-3.5 px-4 text-[12px] font-semibold border-border cursor-pointer"
                  >
                    {copiedDetails ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    {copiedDetails ? "Copied!" : "Copy Details"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE FILTER DRAWER ─────────────────────────────────────── */}
      {mobileFiltersOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex bg-black/70 backdrop-blur-sm lg:hidden"
        >
          <div className="ml-auto flex h-full w-full max-w-xs flex-col bg-background p-6 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-[14px] font-bold uppercase tracking-wider text-foreground">Filter Catalog</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-6 flex-1">
              {/* Brands */}
              <div>
                <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-foreground/70">Brand</h3>
                <div className="space-y-1">
                  {BRANDS.map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(b)}
                      className={`block w-full text-left px-3 py-1.5 rounded text-[13px] cursor-pointer ${
                        selectedBrand === b ? "bg-primary text-white font-semibold" : "text-foreground/80 hover:bg-card"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-foreground/70">Category</h3>
                <div className="space-y-1">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCategory(c)}
                      className={`block w-full text-left px-3 py-1.5 rounded text-[13px] cursor-pointer ${
                        selectedCategory === c ? "bg-primary text-white font-semibold" : "text-foreground/80 hover:bg-card"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabrics */}
              <div>
                <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-foreground/70">Fabric</h3>
                <div className="grid grid-cols-2 gap-1.5">
                  {FABRICS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFabric(f)}
                      className={`rounded px-2.5 py-1.5 text-center text-[12px] truncate cursor-pointer ${
                        selectedFabric === f ? "bg-primary text-white font-semibold" : "bg-card text-foreground/80"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-foreground/70">Color</h3>
                <div className="flex flex-wrap gap-1.5">
                  {COLORS.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(col.name)}
                      className={`rounded-full px-3 py-1 text-[11.5px] border cursor-pointer ${
                        selectedColor === col.name ? "border-primary bg-primary/10 text-primary font-bold" : "border-border bg-card"
                      }`}
                    >
                      {col.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price */}
              <div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-foreground/70 mb-2">
                  <span>Max Price</span>
                  <span className="text-primary font-bold">PKR {priceRange[1].toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={minCatalogPrice}
                  max={maxCatalogPrice}
                  step={500}
                  value={priceRange[1]}
                  onChange={(e) => {
                    setSelectedPricePreset("all");
                    setPriceRange([priceRange[0], Number(e.target.value)]);
                  }}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 flex gap-3 border-t border-border pt-4">
              <Button variant="outline" onClick={resetFilters} className="flex-1 text-[12px] cursor-pointer">
                Reset
              </Button>
              <Button onClick={() => setMobileFiltersOpen(false)} className="flex-1 text-[12px] bg-[#C09757] text-white cursor-pointer">
                Show ({filteredProducts.length})
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER (Exact same structure & original categories) ─────────── */}
      <footer className="bg-background py-14 border-t border-border/60 mt-16">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 md:grid-cols-[1.6fr_1fr_1.2fr] md:gap-12 md:px-10">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <img src="/favicon.png" alt="Naqsh logo" className="h-14 w-14 rounded-full object-cover" />
              <span className="flex flex-col">
                <span className="display text-2xl tracking-wide">NAQSH</span>
                <span className="text-[8px] font-semibold tracking-[.16em] text-muted-foreground">
                  CUSTOMIZE CLOTHING
                </span>
              </span>
            </Link>
            <p className="mt-4 max-w-[280px] text-[12px] leading-6 text-muted-foreground">
              You design it. We make it. Every piece is crafted exactly to your vision, from fabric to finishing.
            </p>
            {/* Social */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Naqsh on Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/60 transition-colors hover:border-primary hover:text-primary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.696 4.533-4.696 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.884v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://wa.me/14156245109"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Naqsh on WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/60 transition-colors hover:border-primary hover:text-primary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-5 text-[10px] font-bold tracking-[.2em] text-foreground/50 uppercase">Categories</h3>
            <nav aria-label="Footer categories" className="flex flex-col gap-3">
              {["Dress", "Kurta", "Shalwar Kameez", "Abaya", "Jacket", "Custom Outfit"].map((name) => (
                <a key={name} href="#" className="text-[13px] font-medium text-foreground/70 transition-colors hover:text-primary">
                  {name}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-[10px] font-bold tracking-[.2em] text-foreground/50 uppercase">Contact</h3>
            <div className="flex flex-col gap-4 text-[13px] text-foreground/70">
              <a href="tel:+14156245109" className="flex items-center gap-2.5 transition-colors hover:text-primary">
                <Phone size={14} /> +1 (415) 624-5109
              </a>
              <a href="mailto:contact@naqsh.online" className="flex items-center gap-2.5 transition-colors hover:text-primary">
                <Mail size={14} /> contact@naqsh.online
              </a>
              <a
                href="https://www.facebook.com/share/1CvN7VCBXf/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 transition-colors hover:text-primary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.696 4.533-4.696 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.884v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                </svg>
                Naqsh on Facebook
              </a>
            </div>
            <div className="mt-8 border-t border-border pt-5 text-[11px] text-muted-foreground">
              <p>© 2026 NAQSH. MADE WITH CARE.</p>
              <p className="mt-1">
                Powered by{" "}
                <a className="text-primary underline" href="https://digitalyze.tech" target="_blank" rel="noopener noreferrer">
                  Digitalyze
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* ── FLOATING WHATSAPP BUTTON ─────────────────────────────────── */}
      <a
        href="https://wa.me/14156245109"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="whatsapp-widget fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-110"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
