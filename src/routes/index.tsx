import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, Menu, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Direct local image imports — bypassing broken Lovable CDN asset.json files
import heroImg from "@/assets/Images/banner_1.jpg";
import dress from "@/assets/Images/IMG_1110.jpeg";
import kurta from "@/assets/Images/IMG_1133.jpeg";
import shalwar from "@/assets/Images/IMG_1128.jpeg";
import abaya from "@/assets/Images/IMG_1141.jpeg";
import abayaTwo from "@/assets/Images/IMG_1146.jpeg";
import shirt from "@/assets/Images/IMG_1145.jpeg";
import jacket from "@/assets/Images/IMG_1136.jpeg";
import denim from "@/assets/Images/IMG_1205.jpeg";
import studio from "@/assets/Images/studio.jpg";
import detail from "@/assets/Images/IMG_1203.jpeg";
import heroTwo from "@/assets/Images/banner_2.jpg";
import heroThree from "@/assets/Images/banner_3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NAQSH — Custom Clothing, Designed by You" },
      { name: "description", content: "You design it. We make it. Create clothing your way in the NAQSH custom design studio." },
      { property: "og:title", content: "NAQSH — Custom Clothing, Designed by You" },
      { property: "og:description", content: "Create clothing your way in the NAQSH custom design studio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ]
  }),
  component: Home,
});

const heroSlides = [
  { image: heroImg, alt: "Bridal outfit with intricate embroidery", position: "center", zoom: "in" },
  { image: heroTwo, alt: "Elegant lawn outfit at heritage site", position: "center 25%", zoom: "out" },
  { image: heroThree, alt: "Maroon printed outfit in a classic interior", position: "center 20%", zoom: "in" },
];
const garments = [
  { name: "Dress", image: dress }, { name: "Kurta", image: kurta },
  { name: "Shalwar Kameez", image: shalwar }, { name: "Abaya", image: abaya },
  { name: "Shirt", image: shirt }, { name: "Jacket", image: jacket },
  { name: "Pants", image: denim }, { name: "Custom Outfit", image: studio },
];
const gallery = [
  { name: "The Evening Edit", category: "DRESS", image: heroImg },
  { name: "Modern Tradition", category: "KURTA", image: shalwar },
  { name: "Understated Elegance", category: "ABAYA", image: abayaTwo },
  { name: "A New Perspective", category: "JACKET", image: jacket },
  { name: "Everyday, Reimagined", category: "KURTA", image: kurta },
];
const fabrics = [
  { name: "Cotton", note: "Soft & breathable", color: "fabric-cotton" },
  { name: "Linen", note: "Naturally textured", color: "fabric-linen" },
  { name: "Silk", note: "Fluid & luminous", color: "fabric-silk" },
  { name: "Chiffon", note: "Light as air", color: "fabric-chiffon" },
  { name: "Velvet", note: "Rich & sumptuous", color: "fabric-velvet" },
  { name: "Lawn", note: "Fine & lightweight", color: "fabric-lawn" },
  { name: "Georgette", note: "Softly flowing", color: "fabric-georgette" },
  { name: "Wool", note: "Warm & structured", color: "fabric-wool" },
  { name: "Denim", note: "Timeless & durable", color: "fabric-denim" },
  { name: "Custom", note: "Your own choice", color: "fabric-custom" },
];
const swatches = ["#292524", "#F4EDE1", "#8D243C", "#52654D", "#C5A059", "#1E3143", "#D6A5A5", "#7E644F"];
const choices: Record<string, string[]> = {
  Neckline: ["Round", "V-neck", "Square", "Collar", "Custom"],
  Sleeves: ["Short", "Long", "Bell", "Straight", "Cuffed", "Custom"],
  Length: ["Short", "Medium", "Long", "Custom"],
  Fit: ["Loose", "Regular", "Fitted", "Custom"],
  Details: ["Embroidery", "Lace", "Beading", "Buttons", "Pockets", "Borders", "Prints", "Sequins"],
};
const measurements = ["Bust / chest", "Waist", "Hips", "Shoulder", "Sleeve length", "Arm circumference", "Garment length", "Pants length", "Inseam"];
const steps = ["Garment", "Fabric", "Color & details", "Inspiration", "Your fit", "Your design"];
const stepTitles = [<>It begins with <em>you.</em></>, <>Choose your <em>fabric.</em></>, <>Make it <em>your own.</em></>, <>Show us your <em>vision.</em></>, <>Made to <em>fit you.</em></>, <>Your idea, <em>all together.</em></>];
const stepDescriptions = ["What would you like us to make? Start with a silhouette, or imagine your own.", "The right material brings your vision to life.", "Choose a shade and the details that make it unmistakably yours.", "A photograph, a sketch, or just a few words — every idea starts somewhere.", "Choose a standard size or share your own measurements.", "Take a moment to review your choices before copying your design."];
const process = [
  ["01", "Imagine it", "Start with a silhouette, a sketch, or a piece you've always wanted."],
  ["02", "Shape the details", "Bring together fabrics, colors, finishing touches and your perfect fit."],
  ["03", "Share your vision", "Keep your selections together and share your idea with Naqsh."],
];
const atelierStats = [
  { value: "500+", label: "Pieces crafted" },
  { value: "100%", label: "Made to order" },
  { value: "8+", label: "Fabric types" },
  { value: "∞", label: "Design possibilities" },
];

function Home() {
  const [activeGarment, setActiveGarment] = useState("Dress");
  const [activeFabric, setActiveFabric] = useState("Silk");
  const [activeColor, setActiveColor] = useState(swatches[2]);
  const [customColor, setCustomColor] = useState("");
  const [parts, setParts] = useState<Record<string, string>>({});
  const [sizeMode, setSizeMode] = useState<"standard" | "measurements">("standard");
  const [size, setSize] = useState("M");
  const [measurementsValue, setMeasurementsValue] = useState<Record<string, string>>({});
  const [idea, setIdea] = useState("");
  const [fileName, setFileName] = useState("");
  const [filePreview, setFilePreview] = useState("");
  const [step, setStep] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);
  const [prevHeroIndex, setPrevHeroIndex] = useState<number | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => { if (filePreview) URL.revokeObjectURL(filePreview); }, [filePreview]);
  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex(index => {
        setPrevHeroIndex(index);
        return (index + 1) % heroSlides.length;
      });
    }, 6500);
    return () => window.clearInterval(timer);
  }, []);

  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMobileMenu(false); };
  const changeStep = (next: number) => {
    setStep(Math.max(0, Math.min(steps.length - 1, next)));
    studioRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const slide = (direction: number) => { const next = (galleryIndex + direction + gallery.length) % gallery.length; setGalleryIndex(next); galleryRef.current?.children[next]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" }); };
  const summary = [
    "NAQSH — MY CUSTOM DESIGN", "", `Garment: ${activeGarment}`, `Fabric: ${activeFabric}`,
    `Main color: ${customColor || activeColor}`, ...Object.entries(parts).map(([key, value]) => `${key}: ${value}`),
    `Size: ${sizeMode === "standard" ? size : "Custom measurements"}`,
    ...(sizeMode === "measurements" ? Object.entries(measurementsValue).filter(([, value]) => value).map(([key, value]) => `${key}: ${value} inches`) : []),
    idea ? `My idea: ${idea}` : "", fileName ? `Reference image: ${fileName} (attach separately)` : "",
  ].filter(Boolean).join("\n");
  const copySummary = async () => { try { await navigator.clipboard.writeText(summary); setCopied(true); setCopyError(false); window.setTimeout(() => setCopied(false), 2500); } catch { setCopyError(true); } };
  const onFile = (file?: File) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024) { window.alert("Please choose a JPG, PNG or WebP image under 10 MB."); return; }
    setFileName(file.name); setFilePreview(URL.createObjectURL(file));
  };
  const nav = [["HOW IT WORKS", "process"], ["THE ATELIER", "atelier"], ["GALLERY", "gallery"], ["DESIGN STUDIO", "design"]];

  const goToHero = (index: number) => {
    setPrevHeroIndex(heroIndex);
    setHeroIndex(index);
  };

  return <div className="overflow-x-hidden">
    {/* ── NAV ─────────────────────────────────────────────────── */}
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/98 backdrop-blur-md">
      <div className="mx-auto flex h-[64px] max-w-[1440px] items-center justify-between gap-6 px-6 md:h-[80px] md:px-12 xl:px-16">
        <a href="#top" aria-label="Naqsh home" className="flex shrink-0 items-center gap-3" onClick={() => setMobileMenu(false)}>
          <img src="/favicon.png" alt="" className="h-9 w-9 rounded-full object-cover md:h-[38px] md:w-[38px]" />
          <span className="flex flex-col">
            <span className="display text-[18px] font-semibold leading-none tracking-[.06em] md:text-[20px]">NAQSH</span>
            <span className="mt-1 text-[7.5px] font-bold tracking-[.22em] text-muted-foreground/80">CUSTOMIZE CLOTHING</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex xl:gap-8" aria-label="Main navigation">
          {nav.map(([name, id]) => <a key={id} href={`#${id}`} className="nav-link text-[12px] font-medium tracking-[.1em] text-foreground/80 transition-colors hover:text-primary">{name}</a>)}
        </nav>

        <Button onClick={() => scrollTo("design")} className="hidden h-[38px] rounded-[3px] px-5 !text-[12px] font-bold tracking-[.10em] shadow-none md:inline-flex text-white bg-[#C09757] hover:bg-[#a88246] transition-colors">
          START DESIGNING <ArrowUpRight size={12} className="ml-1" />
        </Button>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label={mobileMenu ? "Close menu" : "Open menu"} aria-expanded={mobileMenu} onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <X /> : <Menu />}
        </Button>
      </div>

      {mobileMenu && <nav className="border-t border-border bg-background px-6 py-4 lg:hidden" aria-label="Mobile navigation">
        {nav.map(([name, id]) => <a key={id} href={`#${id}`} onClick={() => setMobileMenu(false)} className="block border-b border-border/60 py-3 text-[12px] font-medium tracking-[.14em]">{name}</a>)}
        <Button onClick={() => scrollTo("design")} className="mt-4 w-full rounded-[3px] h-11 text-[11px] font-bold tracking-[.14em] text-white bg-[#C09757] hover:bg-[#a88246]">START DESIGNING <ArrowUpRight size={14} className="ml-1" /></Button>
      </nav>}
    </header>

    <main id="top">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative isolate flex min-h-[min(700px,calc(100svh-64px))] items-center justify-center overflow-hidden bg-foreground text-overlay-foreground md:min-h-[min(760px,calc(100svh-68px))]">
        {/* Slides */}
        {heroSlides.map((item, index) => (
          <img
            key={item.image}
            src={item.image}
            alt={index === heroIndex ? item.alt : ""}
            aria-hidden={index !== heroIndex}
            data-zoom={item.zoom}
            className={`hero-slide absolute inset-0 -z-20 h-full w-full object-cover ${index === heroIndex ? "hero-slide-active" : index === prevHeroIndex ? "hero-slide-exit" : "hero-slide-hidden"}`}
            style={{ objectPosition: item.position }}
          />
        ))}
        {/* Dark overlay - more dramatic */}
        <div className="hero-overlay-dark absolute inset-0 -z-10" />

        {/* Center-aligned content */}
        <div className="relative z-10 mx-auto w-full max-w-[900px] px-6 py-20 text-center md:px-12">
          <p className="mb-6 text-[10px] font-bold tracking-[.28em] text-primary md:mb-8">✦ &nbsp; NAQSH CUSTOMIZE CLOTHING &nbsp; ✦</p>
          <h1 className="display text-[clamp(3.4rem,6.5vw,7.5rem)] leading-[1.02] font-normal">
            YOU DESIGN.<br />
            <span className="italic text-primary">WE CREATE.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-[480px] text-[14px] leading-[1.85] text-overlay-foreground/85 md:mt-9 md:text-[15px]">
            Create clothing exactly the way you imagine it. Choose your style, fabric and details — or show us your idea.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:mt-10">
            <Button onClick={() => scrollTo("design")} className="h-12 rounded-sm px-8 text-[11px] font-bold tracking-[.14em] shadow-none text-white">
              START DESIGNING <ArrowUpRight size={15} className="ml-1" />
            </Button>
            <Button onClick={() => scrollTo("process")} variant="outline" className="h-12 rounded-sm border-overlay-foreground/50 bg-transparent px-8 text-[11px] font-bold tracking-[.14em] text-overlay-foreground shadow-none hover:bg-overlay-foreground/10 hover:text-[#C09757]">
              HOW IT WORKS <ArrowDown size={14} className="ml-1" />
            </Button>
          </div>
        </div>

        {/* Slide controls */}
        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 flex items-center gap-4">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goToHero(i)}
              className={`hero-dot transition-all duration-500 ${heroIndex === i ? "hero-dot-active" : ""}`}
            />
          ))}
        </div>

        {/* Slide number + arrows */}
        <div className="absolute bottom-6 right-6 z-10 flex items-center gap-3 md:bottom-8 md:right-12">
          <span className="text-[10px] tracking-[.18em] text-overlay-foreground/70">0{heroIndex + 1} / 0{heroSlides.length}</span>
          <Button variant="outline" size="icon" aria-label="Previous hero image" onClick={() => goToHero((heroIndex - 1 + heroSlides.length) % heroSlides.length)} className="h-9 w-9 rounded-full border-overlay-foreground/40 bg-transparent text-overlay-foreground hover:bg-overlay-foreground/20">
            <ArrowLeft size={14} />
          </Button>
          <Button variant="outline" size="icon" aria-label="Next hero image" onClick={() => goToHero((heroIndex + 1) % heroSlides.length)} className="h-9 w-9 rounded-full border-overlay-foreground/40 bg-transparent text-overlay-foreground hover:bg-overlay-foreground/20">
            <ArrowRight size={14} />
          </Button>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section id="process" className="scroll-mt-20 py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-5 md:px-10">
          <div className="text-center">
            <p className="eyebrow">HOW IT WORKS</p>
            <h2 className="section-title mt-4">From imagination <em>to creation.</em></h2>
            <p className="mt-4 text-[13px] text-muted-foreground">A considered journey from the first idea to the final detail.</p>
          </div>
          <div className="mt-12 grid gap-px border border-border bg-border md:grid-cols-3">
            {process.map(([number, title, text]) => <div key={number} className="bg-background p-8 transition-colors hover:bg-card md:p-10">
              <span className="display text-4xl text-primary">{number}</span>
              <div className="reveal-line mt-5" />
              <h3 className="display mt-5 text-xl">{title}</h3>
              <p className="mt-3 text-[13px] leading-7 text-muted-foreground">{text}</p>
            </div>)}
          </div>
        </div>
      </section>

      {/* ── THE ATELIER ───────────────────────────────────────── */}
      <section id="atelier" className="scroll-mt-20 bg-card">
        <div className="mx-auto grid max-w-[1440px] md:grid-cols-2">
          <div className="order-2 flex flex-col justify-center px-6 py-14 md:order-1 md:px-12 md:py-20 xl:px-24">
            <p className="eyebrow">THE NAQSH ATELIER</p>
            <h2 className="section-title mt-5">Not off the rack.<br /><em>Entirely yours.</em></h2>
            <p className="mt-6 max-w-[490px] text-[13px] leading-7 text-ink-soft">A favorite silhouette. A different sleeve. An idea saved in your camera roll. At Naqsh, each piece begins with what you imagine — not what's already on the hanger.</p>
            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
              {atelierStats.map(s => <div key={s.label}>
                <div className="display text-2xl text-primary md:text-3xl">{s.value}</div>
                <div className="mt-1 text-[10px] font-semibold tracking-[.1em] text-muted-foreground uppercase">{s.label}</div>
              </div>)}
            </div>
            <Button variant="link" onClick={() => scrollTo("design")} className="mt-8 h-auto w-fit p-0 text-[11px] font-bold tracking-[.14em] no-underline hover:no-underline">
              MAKE IT YOURS <ArrowUpRight size={16} />
            </Button>
          </div>
          <div className="order-1 h-[340px] overflow-hidden md:order-2 md:h-full">
            <img src={studio} alt="Inside a clothing design studio with garments in progress" loading="lazy" className="h-full w-full object-cover fashion-image" />
          </div>
        </div>
      </section>

      {/* ── DESIGN STUDIO ─────────────────────────────────────── */}
      <section id="design" ref={studioRef} className="scroll-mt-20 py-16 md:py-24">
        <div className="mx-auto max-w-[900px] px-5 md:px-10">

          {/* Header */}
          <div className="mb-10 text-center">
            <p className="eyebrow">THE DESIGN STUDIO</p>
            <h2 className="section-title mt-4">Design something <em>yours.</em></h2>
          </div>

          {/* Multi-step progress bar */}
          <div className="mb-8 flex items-center gap-0">
            {steps.map((label, index) => (
              <div key={label} className="flex flex-1 flex-col items-center">
                <div className="relative flex w-full items-center">
                  {/* Left connector */}
                  <div className={`h-[2px] flex-1 transition-all duration-500 ${index === 0 ? "invisible" : index <= step ? "bg-primary" : "bg-border"}`} />
                  {/* Circle */}
                  <button
                    onClick={() => changeStep(index)}
                    aria-label={`Go to step ${index + 1}: ${label}`}
                    className={`step-circle relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-[12px] font-semibold transition-all duration-300 ${step === index ? "border-primary bg-primary text-primary-foreground scale-110" : index < step ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground"}`}
                  >
                    {index < step ? <Check size={14} /> : `${index + 1}`}
                  </button>
                  {/* Right connector */}
                  <div className={`h-[2px] flex-1 transition-all duration-500 ${index === steps.length - 1 ? "invisible" : index < step ? "bg-primary" : "bg-border"}`} />
                </div>
                <span className={`mt-2 hidden text-[9px] font-semibold tracking-[.08em] uppercase transition-colors sm:block ${step === index ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
              </div>
            ))}
          </div>

          {/* Step panel */}
          <div key={step} className="studio-panel min-h-[400px] rounded-sm border border-border bg-card px-6 py-10 md:px-10 md:py-12">
            <div className="mb-8 text-center">
              <p className="eyebrow">STEP {step + 1} OF {steps.length}</p>
              <h3 className="display mt-3 text-3xl md:text-[2.4rem]">{stepTitles[step]}</h3>
              <p className="mx-auto mt-3 max-w-[520px] text-[13px] text-muted-foreground">{stepDescriptions[step]}</p>
            </div>

            {step === 0 && <><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{garments.map(item => <Button key={item.name} variant="ghost" onClick={() => setActiveGarment(item.name)} aria-pressed={activeGarment === item.name} className={`group relative block h-auto overflow-hidden rounded-none p-0 text-left shadow-none hover:bg-transparent ${activeGarment === item.name ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}><span className="block aspect-[4/4] overflow-hidden bg-muted"><img src={item.image} alt="" loading="lazy" className="fashion-image h-full w-full object-cover" /></span><span className="flex min-h-10 items-center justify-between bg-background px-3"><span className="display text-sm md:text-base">{item.name}</span>{activeGarment === item.name && <Check className="text-primary" size={15} />}</span></Button>)}</div><div className="mt-6 text-center"><Button variant="outline" onClick={() => { setActiveGarment("Something Else"); changeStep(3); }} className="rounded-sm border-border bg-transparent px-6 text-xs shadow-none">Something else? Tell us your idea <ArrowUpRight size={14} /></Button></div></>}

            {step === 1 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{fabrics.map(fabric => <Button key={fabric.name} onClick={() => setActiveFabric(fabric.name)} variant="ghost" aria-pressed={activeFabric === fabric.name} className={`group flex h-auto flex-col items-start rounded-none border p-2 text-left shadow-none hover:bg-card ${activeFabric === fabric.name ? "border-primary bg-card" : "border-border"}`}><span className={`fabric-swatch ${fabric.color} block h-20 w-full overflow-hidden sm:h-24`} /><span className="mt-3 flex w-full items-center justify-between"><span className="display text-base">{fabric.name}</span>{activeFabric === fabric.name && <Check size={15} className="text-primary" />}</span><span className="mt-1 text-[10px] font-normal text-muted-foreground">{fabric.note}</span></Button>)}</div>}

            {step === 2 && <div className="mx-auto max-w-[850px]"><div className="border-b border-border pb-7"><h4 className="display mb-4 text-xl">Main color</h4><div className="flex flex-wrap items-center gap-3">{swatches.map(color => <Button key={color} size="icon" variant="ghost" onClick={() => { setActiveColor(color); setCustomColor(""); }} aria-label={`Select color ${color}`} aria-pressed={activeColor === color && !customColor} className={`h-9 w-9 rounded-full border-2 p-1 shadow-none hover:bg-transparent ${activeColor === color && !customColor ? "border-primary" : "border-transparent"}`}><span className="h-full w-full rounded-full border border-border" style={{ backgroundColor: color }} /></Button>)}<label className="ml-2 flex items-center gap-2 border-b border-border text-[11px] text-muted-foreground">Custom color <input type="color" aria-label="Choose a custom color" value={customColor || activeColor} onChange={e => setCustomColor(e.target.value)} className="h-8 w-8 cursor-pointer border-none bg-transparent" /></label></div></div><div className="mt-7 grid gap-x-10 gap-y-7 sm:grid-cols-2">{Object.entries(choices).map(([category, items]) => <div key={category} className="border-b border-border pb-5"><div className="mb-4 flex items-baseline justify-between gap-2"><h4 className="display text-xl">{category}</h4><span className="text-[10px] text-muted-foreground">{parts[category] || "Your choice"}</span></div><div className="flex flex-wrap gap-2">{items.map(item => <Button key={item} variant="outline" onClick={() => setParts({ ...parts, [category]: item })} aria-pressed={parts[category] === item} className={`h-8 rounded-sm px-3 text-[11px] font-normal shadow-none ${parts[category] === item ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "border-border bg-transparent hover:border-primary hover:bg-card"}`}>{item}</Button>)}</div></div>)}</div><p className="mt-5 text-xs text-muted-foreground">Different colors for sleeves or embroidery? Describe them in the next step.</p></div>}

            {step === 3 && <div className="mx-auto grid max-w-[850px] gap-6 md:grid-cols-2"><div><input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => onFile(e.target.files?.[0])} /><Button variant="outline" onClick={() => fileRef.current?.click()} className="flex h-52 w-full flex-col rounded-sm border border-dashed border-primary bg-card text-foreground shadow-none hover:bg-muted"><UploadCloud className="mb-3 text-primary" size={28} /><span className="display max-w-full truncate text-lg">{fileName || "Upload your inspiration"}</span><span className="mt-2 text-[11px] font-normal text-muted-foreground">JPG, PNG or WebP · Up to 10 MB</span>{filePreview && <img src={filePreview} alt="Uploaded inspiration preview" className="mt-2 h-12 max-w-24 object-contain" />}</Button></div><div><label htmlFor="idea" className="mb-3 block text-[11px] font-semibold uppercase tracking-[.12em]">Tell us your vision</label><textarea id="idea" value={idea} onChange={e => setIdea(e.target.value.slice(0, 1000))} maxLength={1000} placeholder="A dress in black silk, with longer sleeves and gold embroidery..." className="min-h-44 w-full resize-y border border-border bg-card p-4 text-[13px] leading-6 outline-none placeholder:text-muted-foreground focus:border-primary" /></div></div>}

            {step === 4 && <div className="mx-auto max-w-[820px]"><div className="mx-auto flex max-w-sm border border-border p-1"><Button variant="ghost" onClick={() => setSizeMode("standard")} aria-pressed={sizeMode === "standard"} className={`h-10 flex-1 rounded-sm text-xs shadow-none ${sizeMode === "standard" ? "bg-foreground text-background hover:bg-foreground/90 hover:text-background" : "hover:bg-card"}`}>Standard size</Button><Button variant="ghost" onClick={() => setSizeMode("measurements")} aria-pressed={sizeMode === "measurements"} className={`h-10 flex-1 rounded-sm text-xs shadow-none ${sizeMode === "measurements" ? "bg-foreground text-background hover:bg-foreground/90 hover:text-background" : "hover:bg-card"}`}>My measurements</Button></div>{sizeMode === "standard" ? <div className="mt-8 flex flex-wrap justify-center gap-2">{["XS", "S", "M", "L", "XL", "XXL", "Custom"].map(s => <Button key={s} variant="outline" onClick={() => { setSize(s); if (s === "Custom") setSizeMode("measurements"); }} aria-pressed={size === s} className={`h-12 min-w-14 rounded-sm text-xs shadow-none ${size === s ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90" : "border-border bg-transparent hover:bg-card"}`}>{s}</Button>)}</div> : <div className="mt-7 grid gap-4 sm:grid-cols-2 md:grid-cols-3">{measurements.map(label => <label key={label} className="block"><span className="mb-2 block text-[10px] font-semibold uppercase tracking-[.1em]">{label}</span><div className="flex items-center border border-border bg-card focus-within:border-primary"><input type="number" min="0" max="200" step="0.1" inputMode="decimal" value={measurementsValue[label] || ""} onChange={e => setMeasurementsValue({ ...measurementsValue, [label]: e.target.value })} placeholder="0" className="w-full bg-transparent px-4 py-3 text-sm outline-none" /><span className="pr-4 text-xs text-muted-foreground">in</span></div></label>)}</div>}</div>}

            {step === 5 && <div className="mx-auto max-w-[650px] border-y border-border py-6"><div className="grid gap-4 sm:grid-cols-2">{[["GARMENT", activeGarment], ["FABRIC", activeFabric], ["COLOR", customColor || activeColor], ["FIT", sizeMode === "standard" ? size : "Custom measurements"], ["REFERENCE", fileName || "Not added"], ["DETAILS", Object.values(parts).join(", ") || "Your choice"]].map(([label, value]) => <div key={label}><span className="text-[10px] font-semibold tracking-[.14em] text-primary">{label}</span><p className="display mt-1 break-words text-lg">{value}</p></div>)}</div>{idea && <div className="mt-5 border-t border-border pt-5"><span className="text-[10px] font-semibold tracking-[.14em] text-primary">YOUR IDEA</span><p className="mt-2 text-sm leading-6">{idea}</p></div>}<div className="mt-7"><Button onClick={copySummary} className="h-11 w-full rounded-sm px-6 text-[11px] font-semibold tracking-[.12em] shadow-none sm:w-auto">{copied ? <><Check size={16} /> DESIGN DETAILS COPIED</> : <><Copy size={16} /> COPY MY DESIGN DETAILS</>}</Button><p className="mt-3 text-[11px] leading-5 text-muted-foreground">Your design stays on this page until you copy it. If you added a reference image, attach it separately when sharing.</p>{copyError && <p role="alert" className="mt-2 text-xs text-destructive">Couldn't copy automatically. Please check clipboard permissions and try again.</p>}</div></div>}
          </div>

          {/* Navigation buttons */}
          <div className="mt-6 flex items-center justify-between">
            <Button variant="ghost" onClick={() => changeStep(step - 1)} disabled={step === 0} className="rounded-sm text-xs font-semibold tracking-[.08em]">
              <ArrowLeft size={16} /> BACK
            </Button>
            <span className="text-[11px] font-medium text-muted-foreground">{step + 1} / {steps.length}</span>
            {step < steps.length - 1
              ? <Button onClick={() => changeStep(step + 1)} className="h-11 rounded-sm px-7 text-[11px] font-bold tracking-[.1em] shadow-none">CONTINUE <ArrowRight size={16} /></Button>
              : <Button variant="outline" onClick={() => changeStep(0)} className="h-11 rounded-sm text-[11px] font-semibold">START AGAIN <ArrowRight size={16} /></Button>}
          </div>
        </div>
      </section>

      {/* ── CRAFTSMANSHIP BANNER ──────────────────────────────── */}
      <section className="relative isolate flex min-h-[380px] items-center justify-center overflow-hidden bg-foreground px-6 text-center text-overlay-foreground">
        <img src={detail} alt="Close-up of intricate hand embellishment" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-foreground/72" />
        <div>
          <p className="eyebrow">THE ART OF MAKING</p>
          <h2 className="display mt-5 text-3xl leading-tight md:text-5xl">Every thread tells a story.<br /><em>Every stitch, a signature.</em></h2>
        </div>
      </section>

      {/* ── GALLERY ───────────────────────────────────────────── */}
      <section id="gallery" className="scroll-mt-20 bg-card py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-5 md:px-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">THE LOOKBOOK</p>
              <h2 className="section-title mt-4">A little <em>inspiration.</em></h2>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" aria-label="Previous look" onClick={() => slide(-1)} className="h-10 w-10 rounded-sm border-border bg-transparent shadow-none"><ArrowLeft size={17} /></Button>
              <Button variant="outline" size="icon" aria-label="Next look" onClick={() => slide(1)} className="h-10 w-10 rounded-sm border-border bg-transparent shadow-none"><ArrowRight size={17} /></Button>
            </div>
          </div>
          <div ref={galleryRef} className="mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {gallery.map(item => <div key={item.name} className="group min-w-[75%] snap-start sm:min-w-[45%] lg:min-w-[31%]">
              <div className="aspect-[3/4] overflow-hidden bg-muted">
                <img src={item.image} alt={item.name} loading="lazy" className="fashion-image h-full w-full object-cover" />
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <span className="eyebrow">{item.category}</span>
                  <h3 className="display mt-1 text-xl">{item.name}</h3>
                </div>
                <ArrowUpRight className="text-primary" size={20} />
              </div>
            </div>)}
          </div>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">0{galleryIndex + 1} / 0{gallery.length}</span>
            <div className="flex gap-1">{gallery.map((item, i) => <Button key={item.name} variant="ghost" aria-label={`Show look ${i + 1}`} onClick={() => { setGalleryIndex(i); galleryRef.current?.children[i]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" }); }} className={`h-1.5 rounded-none p-0 shadow-none ${galleryIndex === i ? "w-7 bg-primary hover:bg-primary" : "w-3 bg-border hover:bg-primary"}`} />)}</div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────── */}
      <section className="bg-foreground py-16 text-overlay-foreground md:py-24">
        <div className="mx-auto max-w-[1200px] px-5 text-center md:px-10">
          <p className="eyebrow">YOUR DESIGN, YOUR STORY</p>
          <h2 className="display mt-5 text-3xl md:text-5xl">Ready to make it <em>yours?</em></h2>
          <p className="mx-auto mt-4 max-w-xl text-[13px] leading-7 text-overlay-foreground/75">A piece made around your imagination begins in the design studio.</p>
          <Button onClick={() => { changeStep(0); scrollTo("design"); }} className="mt-8 h-12 rounded-sm px-8 text-[11px] font-bold tracking-[.14em] shadow-none">
            START DESIGNING <ArrowUpRight size={16} />
          </Button>
        </div>
      </section>
    </main>

    {/* ── FOOTER ────────────────────────────────────────────── */}
    <footer className="bg-background py-14 border-t border-border/60">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 md:grid-cols-[1.6fr_1fr_1.2fr] md:gap-12 md:px-10">
        {/* Brand */}
        <div>
          <a href="#top" className="inline-flex items-center gap-3">
            <img src="/favicon.png" alt="Naqsh logo" className="h-14 w-14 rounded-full object-cover" />
            <span className="flex flex-col">
              <span className="display text-2xl tracking-wide">NAQSH</span>
              <span className="text-[8px] font-semibold tracking-[.16em] text-muted-foreground">CUSTOMIZE CLOTHING</span>
            </span>
          </a>
          <p className="mt-4 max-w-[280px] text-[12px] leading-6 text-muted-foreground">You design it. We make it. Every piece is crafted exactly to your vision, from fabric to finishing.</p>
          {/* Social */}
          <div className="mt-5 flex items-center gap-3">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Naqsh on Facebook" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/60 transition-colors hover:border-primary hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.696 4.533-4.696 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.884v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" /></svg>
            </a>
            <a href="https://wa.me/14153518167" target="_blank" rel="noopener noreferrer" aria-label="Naqsh on WhatsApp" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/60 transition-colors hover:border-primary hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </a>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="mb-5 text-[10px] font-bold tracking-[.2em] text-foreground/50 uppercase">Categories</h3>
          <nav aria-label="Footer categories" className="flex flex-col gap-3">
            {["Dress", "Kurta", "Shalwar Kameez", "Abaya", "Jacket", "Custom Outfit"].map(name => (
              <a key={name} href="#" className="text-[13px] font-medium text-foreground/70 transition-colors hover:text-primary">{name}</a>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 text-[10px] font-bold tracking-[.2em] text-foreground/50 uppercase">Contact</h3>
          <div className="flex flex-col gap-4 text-[13px] text-foreground/70">
            <a href="tel:+14153518167" className="flex items-center gap-2.5 transition-colors hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.63a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
              +1 (415) 351-8167
            </a>
            <a href="mailto:contact@naqsh.online" className="flex items-center gap-2.5 transition-colors hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" /></svg>
              contact@naqsh.online
            </a>
            <a href="https://www.facebook.com/share/1CvN7VCBXf/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 transition-colors hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.696 4.533-4.696 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.884v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" /></svg>
              Naqsh on Facebook
            </a>
          </div>
          <div className="mt-8 border-t border-border pt-5 text-[11px] text-muted-foreground">
            <p>© 2026 NAQSH. MADE WITH CARE.</p>
            <p className="mt-1">Powered by <a className="text-primary underline" href="https://digitalyze.tech" target="_blank" rel="noopener noreferrer">Digitalyze</a></p>
          </div>
        </div>
      </div>
    </footer>

    {/* ── WHATSAPP WIDGET ──────────────────────────────────── */}
    <a
      href="https://wa.me/14153518167"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="whatsapp-widget fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-110"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
    </a>
  </div>;
}
