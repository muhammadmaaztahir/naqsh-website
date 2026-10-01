import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, Menu, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/naqsh-logo.png.asset.json";
import hero from "@/assets/naqsh-01.jpg.asset.json";
import dress from "@/assets/naqsh-02.jpg.asset.json";
import kurta from "@/assets/naqsh-03.jpg.asset.json";
import shalwar from "@/assets/naqsh-04.jpg.asset.json";
import abaya from "@/assets/naqsh-05.jpg.asset.json";
import abayaTwo from "@/assets/naqsh-06.jpg.asset.json";
import shirt from "@/assets/naqsh-07.jpg.asset.json";
import jacket from "@/assets/naqsh-08.jpg.asset.json";
import denim from "@/assets/naqsh-09.jpg.asset.json";
import studio from "@/assets/naqsh-10.jpg.asset.json";
import detail from "@/assets/naqsh-11.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "NAQSH — Custom Clothing, Designed by You" },
    { name: "description", content: "You design it. We make it. Create clothing your way in the NAQSH custom design studio." },
    { property: "og:title", content: "NAQSH — Custom Clothing, Designed by You" },
    { property: "og:description", content: "Create clothing your way in the NAQSH custom design studio." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Home,
});

const heroSlides = [
  { image: hero.url, alt: "Editorial fashion portrait in an embroidered statement outfit", position: "center" },
  { image: abaya.url, alt: "Black embellished abaya in a bright atelier setting", position: "center 35%" },
  { image: dress.url, alt: "Burgundy custom outfit photographed outdoors", position: "center 35%" },
];
const garments = [
  { name: "Dress", image: dress.url }, { name: "Kurta", image: kurta.url },
  { name: "Shalwar Kameez", image: shalwar.url }, { name: "Abaya", image: abaya.url },
  { name: "Shirt", image: shirt.url }, { name: "Jacket", image: jacket.url },
  { name: "Pants", image: denim.url }, { name: "Custom Outfit", image: studio.url },
];
const gallery = [
  { name: "The Evening Edit", category: "DRESS", image: hero.url },
  { name: "Modern Tradition", category: "KURTA", image: shalwar.url },
  { name: "Understated Elegance", category: "ABAYA", image: abayaTwo.url },
  { name: "A New Perspective", category: "JACKET", image: jacket.url },
  { name: "Everyday, Reimagined", category: "KURTA", image: kurta.url },
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
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => { if (filePreview) URL.revokeObjectURL(filePreview); }, [filePreview]);
  useEffect(() => {
    const timer = window.setInterval(() => setHeroIndex(index => (index + 1) % heroSlides.length), 7000);
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

  return <div className="overflow-x-hidden">
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-[70px] max-w-[1440px] items-center justify-between gap-6 px-5 md:h-[78px] md:px-10 xl:px-14">
        <a href="#top" aria-label="Naqsh home" className="flex shrink-0 items-center gap-3" onClick={() => setMobileMenu(false)}>
          <img src={logo.url} alt="" className="h-11 w-11 rounded-full object-cover md:h-12 md:w-12" />
          <span className="flex flex-col"><span className="display text-xl leading-none md:text-[23px]">NAQSH</span><span className="mt-1.5 text-[8px] font-medium tracking-[.15em] text-ink-soft">CUSTOMIZE CLOTHING</span></span>
        </a>
        <nav className="hidden items-center gap-7 lg:flex xl:gap-10" aria-label="Main navigation">
          {nav.map(([name,id]) => <a key={id} href={`#${id}`} className="text-[12px] font-medium tracking-[.12em] transition-colors hover:text-primary">{name}</a>)}
        </nav>
        <Button onClick={() => scrollTo("design")} className="hidden h-11 rounded-sm px-7 text-[11px] font-semibold tracking-[.14em] shadow-none md:inline-flex">START DESIGNING <ArrowUpRight size={15}/></Button>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label={mobileMenu ? "Close menu" : "Open menu"} aria-expanded={mobileMenu} onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X/> : <Menu/>}</Button>
      </div>
      {mobileMenu && <nav className="border-t border-border bg-background px-6 py-4 lg:hidden" aria-label="Mobile navigation">{nav.map(([name,id]) => <a key={id} href={`#${id}`} onClick={() => setMobileMenu(false)} className="block border-b border-border py-3 text-xs tracking-[.13em]">{name}</a>)}<Button onClick={() => scrollTo("design")} className="mt-4 w-full rounded-sm">START DESIGNING <ArrowUpRight size={15}/></Button></nav>}
    </header>

    <main id="top">
      <section className="relative isolate flex min-h-[min(690px,calc(100svh-70px))] items-center overflow-hidden bg-foreground text-overlay-foreground md:min-h-[min(720px,calc(100svh-78px))]">
        {heroSlides.map((item, index) => <img key={`${item.image}-${index === heroIndex ? heroIndex : "idle"}`} src={item.image} alt={index === heroIndex ? item.alt : ""} aria-hidden={index !== heroIndex} className={`hero-slide absolute inset-0 -z-20 h-full w-full object-cover ${index === heroIndex ? "hero-slide-active" : "hero-slide-hidden"}`} style={{ objectPosition: item.position }} />)}
        <div className="hero-overlay absolute inset-0 -z-10" />
        <div className="mx-auto w-full max-w-[1440px] px-6 py-24 md:px-12 xl:px-20">
          <p className="mb-6 text-[10px] font-semibold tracking-[.25em] text-primary md:mb-8">✦ &nbsp; NAQSH CUSTOMIZE CLOTHING &nbsp; ✦</p>
          <h1 className="display max-w-[800px] text-[clamp(3.1rem,5.5vw,6.5rem)] leading-[1.04] font-normal">YOU DESIGN.<br/><span className="italic text-primary">WE CREATE.</span></h1>
          <p className="mt-6 max-w-[490px] text-[13px] leading-7 text-overlay-foreground/90 md:mt-8 md:text-[15px]">Create clothing exactly the way you imagine it. Choose your style, fabric and details — or show us your idea.</p>
          <div className="mt-7 flex flex-wrap gap-3 md:mt-9"><Button onClick={() => scrollTo("design")} className="h-11 rounded-sm px-6 text-[11px] font-semibold tracking-[.12em] shadow-none md:px-8">START DESIGNING <ArrowUpRight size={15}/></Button><Button onClick={() => scrollTo("process")} variant="outline" className="h-11 rounded-sm border-overlay-foreground/65 bg-transparent px-6 text-[11px] font-semibold tracking-[.12em] text-overlay-foreground shadow-none hover:bg-overlay-foreground hover:text-foreground md:px-8">HOW IT WORKS <ArrowDown size={14}/></Button></div>
        </div>
        <div className="absolute bottom-5 right-5 flex items-center gap-3 md:bottom-8 md:right-10"><span className="text-[10px] tracking-[.16em]">0{heroIndex+1} / 0{heroSlides.length}</span><Button variant="outline" size="icon" aria-label="Previous hero image" onClick={() => setHeroIndex((heroIndex - 1 + heroSlides.length) % heroSlides.length)} className="h-8 w-8 rounded-full border-overlay-foreground/60 bg-transparent text-overlay-foreground hover:bg-overlay-foreground hover:text-foreground"><ArrowLeft size={14}/></Button><Button variant="outline" size="icon" aria-label="Next hero image" onClick={() => setHeroIndex((heroIndex + 1) % heroSlides.length)} className="h-8 w-8 rounded-full border-overlay-foreground/60 bg-transparent text-overlay-foreground hover:bg-overlay-foreground hover:text-foreground"><ArrowRight size={14}/></Button></div>
      </section>

      <section id="process" className="scroll-mt-20 py-16 md:py-20"><div className="mx-auto max-w-[1200px] px-5 md:px-10"><div className="text-center"><p className="eyebrow">HOW IT WORKS</p><h2 className="section-title mt-4">From imagination <em>to creation.</em></h2><p className="mt-4 text-[13px] text-muted-foreground">A considered journey from the first idea to the final detail.</p></div><div className="mt-10 grid gap-px border border-border bg-border md:grid-cols-3">{process.map(([number,title,text]) => <div key={number} className="bg-background p-7 transition-colors hover:bg-card md:p-8"><span className="display text-3xl text-primary">{number}</span><div className="reveal-line mt-4"/><h3 className="display mt-4 text-xl">{title}</h3><p className="mt-2 text-xs leading-6 text-muted-foreground">{text}</p></div>)}</div></div></section>

      <section id="atelier" className="scroll-mt-20 bg-card"><div className="mx-auto grid max-w-[1440px] md:grid-cols-2"><div className="order-2 flex flex-col justify-center px-6 py-14 md:order-1 md:px-12 md:py-20 xl:px-24"><p className="eyebrow">THE NAQSH ATELIER</p><h2 className="section-title mt-5">Not off the rack.<br/><em>Entirely yours.</em></h2><p className="mt-6 max-w-[490px] text-[13px] leading-7 text-ink-soft">A favorite silhouette. A different sleeve. An idea saved in your camera roll. At Naqsh, each piece begins with what you imagine — not what’s already on the hanger.</p><Button variant="link" onClick={() => scrollTo("design")} className="mt-7 h-auto w-fit p-0 text-[11px] font-semibold tracking-[.13em] no-underline hover:no-underline">MAKE IT YOURS <ArrowUpRight size={16}/></Button></div><div className="order-1 h-[320px] overflow-hidden md:order-2 md:h-[480px]"><img src={studio.url} alt="Inside a clothing design studio with garments in progress" loading="lazy" className="h-full w-full object-cover"/></div></div></section>

      <section id="design" ref={studioRef} className="scroll-mt-20 py-16 md:py-20"><div className="mx-auto max-w-[1100px] px-5 md:px-10"><div className="mb-9 text-center"><p className="eyebrow">THE DESIGN STUDIO</p><h2 className="section-title mt-4">Design something <em>yours.</em></h2></div>
        <div className="border-y border-border py-4"><div className="flex items-center justify-between gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{steps.map((label,index) => <Button key={label} variant="ghost" onClick={() => changeStep(index)} aria-current={step === index ? "step" : undefined} className={`studio-step h-auto min-w-max flex-1 flex-col gap-2 rounded-none px-2 py-1 text-[10px] font-medium tracking-[.06em] shadow-none md:text-[11px] ${step === index ? "text-primary hover:text-primary" : "text-muted-foreground"}`}><span className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] ${step === index ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{index < step ? <Check size={14}/> : `0${index+1}`}</span>{label}</Button>)}</div></div>
        <div key={step} className="studio-panel min-h-[370px] py-10 md:min-h-[420px] md:py-12"><div className="mb-8 text-center"><p className="eyebrow">0{step+1} / 0{steps.length}</p><h3 className="display mt-3 text-3xl md:text-4xl">{stepTitles[step]}</h3><p className="mt-3 text-[13px] text-muted-foreground">{stepDescriptions[step]}</p></div>
          {step === 0 && <><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{garments.map(item => <Button key={item.name} variant="ghost" onClick={() => setActiveGarment(item.name)} aria-pressed={activeGarment === item.name} className={`group relative block h-auto overflow-hidden rounded-none p-0 text-left shadow-none hover:bg-transparent ${activeGarment === item.name ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}><span className="block aspect-[4/4] overflow-hidden bg-muted"><img src={item.image} alt="" loading="lazy" className="fashion-image h-full w-full object-cover"/></span><span className="flex min-h-10 items-center justify-between bg-card px-3"><span className="display text-sm md:text-base">{item.name}</span>{activeGarment === item.name && <Check className="text-primary" size={15}/>}</span></Button>)}</div><div className="mt-6 text-center"><Button variant="outline" onClick={() => { setActiveGarment("Something Else"); changeStep(3); }} className="rounded-sm border-border bg-transparent px-6 text-xs shadow-none">Something else? Tell us your idea <ArrowUpRight size={14}/></Button></div></>}
          {step === 1 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{fabrics.map(fabric => <Button key={fabric.name} onClick={() => setActiveFabric(fabric.name)} variant="ghost" aria-pressed={activeFabric === fabric.name} className={`group flex h-auto flex-col items-start rounded-none border p-2 text-left shadow-none hover:bg-card ${activeFabric === fabric.name ? "border-primary bg-card" : "border-border"}`}><span className={`fabric-swatch ${fabric.color} block h-20 w-full overflow-hidden sm:h-24`}></span><span className="mt-3 flex w-full items-center justify-between"><span className="display text-base">{fabric.name}</span>{activeFabric === fabric.name && <Check size={15} className="text-primary"/>}</span><span className="mt-1 text-[10px] font-normal text-muted-foreground">{fabric.note}</span></Button>)}</div>}
          {step === 2 && <div className="mx-auto max-w-[850px]"><div className="border-b border-border pb-7"><h4 className="display mb-4 text-xl">Main color</h4><div className="flex flex-wrap items-center gap-3">{swatches.map(color => <Button key={color} size="icon" variant="ghost" onClick={() => {setActiveColor(color);setCustomColor("");}} aria-label={`Select color ${color}`} aria-pressed={activeColor === color && !customColor} className={`h-9 w-9 rounded-full border-2 p-1 shadow-none hover:bg-transparent ${activeColor === color && !customColor ? "border-primary" : "border-transparent"}`}><span className="h-full w-full rounded-full border border-border" style={{backgroundColor: color}} /></Button>)}<label className="ml-2 flex items-center gap-2 border-b border-border text-[11px] text-muted-foreground">Custom color <input type="color" aria-label="Choose a custom color" value={customColor || activeColor} onChange={e => setCustomColor(e.target.value)} className="h-8 w-8 cursor-pointer border-none bg-transparent" /></label></div></div><div className="mt-7 grid gap-x-10 gap-y-7 sm:grid-cols-2">{Object.entries(choices).map(([category,items]) => <div key={category} className="border-b border-border pb-5"><div className="mb-4 flex items-baseline justify-between gap-2"><h4 className="display text-xl">{category}</h4><span className="text-[10px] text-muted-foreground">{parts[category] || "Your choice"}</span></div><div className="flex flex-wrap gap-2">{items.map(item => <Button key={item} variant="outline" onClick={() => setParts({...parts, [category]: item})} aria-pressed={parts[category] === item} className={`h-8 rounded-sm px-3 text-[11px] font-normal shadow-none ${parts[category] === item ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "border-border bg-transparent hover:border-primary hover:bg-card"}`}>{item}</Button>)}</div></div>)}</div><p className="mt-5 text-xs text-muted-foreground">Different colors for sleeves or embroidery? Describe them in the next step.</p></div>}
          {step === 3 && <div className="mx-auto grid max-w-[850px] gap-6 md:grid-cols-2"><div><input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => onFile(e.target.files?.[0])}/><Button variant="outline" onClick={() => fileRef.current?.click()} className="flex h-52 w-full flex-col rounded-sm border border-dashed border-primary bg-card text-foreground shadow-none hover:bg-muted"><UploadCloud className="mb-3 text-primary" size={28}/><span className="display max-w-full truncate text-lg">{fileName || "Upload your inspiration"}</span><span className="mt-2 text-[11px] font-normal text-muted-foreground">JPG, PNG or WebP · Up to 10 MB</span>{filePreview && <img src={filePreview} alt="Uploaded inspiration preview" className="mt-2 h-12 max-w-24 object-contain"/>}</Button></div><div><label htmlFor="idea" className="mb-3 block text-[11px] font-semibold uppercase tracking-[.12em]">Tell us your vision</label><textarea id="idea" value={idea} onChange={e => setIdea(e.target.value.slice(0,1000))} maxLength={1000} placeholder="A dress in black silk, with longer sleeves and gold embroidery..." className="min-h-44 w-full resize-y border border-border bg-card p-4 text-[13px] leading-6 outline-none placeholder:text-muted-foreground focus:border-primary"/></div></div>}
          {step === 4 && <div className="mx-auto max-w-[820px]"><div className="mx-auto flex max-w-sm border border-border p-1"><Button variant="ghost" onClick={() => setSizeMode("standard")} aria-pressed={sizeMode === "standard"} className={`h-10 flex-1 rounded-sm text-xs shadow-none ${sizeMode === "standard" ? "bg-foreground text-background hover:bg-foreground/90 hover:text-background" : "hover:bg-card"}`}>Standard size</Button><Button variant="ghost" onClick={() => setSizeMode("measurements")} aria-pressed={sizeMode === "measurements"} className={`h-10 flex-1 rounded-sm text-xs shadow-none ${sizeMode === "measurements" ? "bg-foreground text-background hover:bg-foreground/90 hover:text-background" : "hover:bg-card"}`}>My measurements</Button></div>{sizeMode === "standard" ? <div className="mt-8 flex flex-wrap justify-center gap-2">{["XS","S","M","L","XL","XXL","Custom"].map(s => <Button key={s} variant="outline" onClick={() => {setSize(s); if(s === "Custom") setSizeMode("measurements");}} aria-pressed={size === s} className={`h-12 min-w-14 rounded-sm text-xs shadow-none ${size === s ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90" : "border-border bg-transparent hover:bg-card"}`}>{s}</Button>)}</div> : <div className="mt-7 grid gap-4 sm:grid-cols-2 md:grid-cols-3">{measurements.map(label => <label key={label} className="block"><span className="mb-2 block text-[10px] font-semibold uppercase tracking-[.1em]">{label}</span><div className="flex items-center border border-border bg-card focus-within:border-primary"><input type="number" min="0" max="200" step="0.1" inputMode="decimal" value={measurementsValue[label] || ""} onChange={e => setMeasurementsValue({...measurementsValue,[label]:e.target.value})} placeholder="0" className="w-full bg-transparent px-4 py-3 text-sm outline-none"/><span className="pr-4 text-xs text-muted-foreground">in</span></div></label>)}</div>}</div>}
          {step === 5 && <div className="mx-auto max-w-[650px] border-y border-border py-6"><div className="grid gap-4 sm:grid-cols-2">{[["GARMENT",activeGarment],["FABRIC",activeFabric],["COLOR",customColor || activeColor],["FIT",sizeMode === "standard" ? size : "Custom measurements"],["REFERENCE",fileName || "Not added"],["DETAILS",Object.values(parts).join(", ") || "Your choice"]].map(([label,value]) => <div key={label}><span className="text-[10px] font-semibold tracking-[.14em] text-primary">{label}</span><p className="display mt-1 break-words text-lg">{value}</p></div>)}</div>{idea && <div className="mt-5 border-t border-border pt-5"><span className="text-[10px] font-semibold tracking-[.14em] text-primary">YOUR IDEA</span><p className="mt-2 text-sm leading-6">{idea}</p></div>}<div className="mt-7"><Button onClick={copySummary} className="h-11 w-full rounded-sm px-6 text-[11px] font-semibold tracking-[.12em] shadow-none sm:w-auto">{copied ? <><Check size={16}/> DESIGN DETAILS COPIED</> : <><Copy size={16}/> COPY MY DESIGN DETAILS</>}</Button><p className="mt-3 text-[11px] leading-5 text-muted-foreground">Your design stays on this page until you copy it. If you added a reference image, attach it separately when sharing.</p>{copyError && <p role="alert" className="mt-2 text-xs text-destructive">Couldn’t copy automatically. Please check clipboard permissions and try again.</p>}</div></div>}
        </div>
        <div className="flex items-center justify-between border-t border-border pt-5"><Button variant="ghost" onClick={() => changeStep(step-1)} disabled={step === 0} className="rounded-sm text-xs"><ArrowLeft size={16}/> BACK</Button><span className="text-xs text-muted-foreground">0{step+1} / 0{steps.length}</span>{step < steps.length - 1 ? <Button onClick={() => changeStep(step+1)} className="h-10 rounded-sm px-6 text-[11px] font-semibold tracking-[.1em] shadow-none">CONTINUE <ArrowRight size={16}/></Button> : <Button variant="outline" onClick={() => changeStep(0)} className="h-10 rounded-sm text-[11px]">START AGAIN <ArrowRight size={16}/></Button>}</div>
      </div></section>

      <section className="relative isolate flex min-h-[360px] items-center justify-center overflow-hidden bg-foreground px-6 text-center text-overlay-foreground"><img src={detail.url} alt="Close-up of intricate hand embellishment" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover"/><div className="absolute inset-0 -z-10 bg-foreground/65"/><div><p className="eyebrow">THE ART OF MAKING</p><h2 className="display mt-5 text-3xl leading-tight md:text-5xl">Every thread tells a story.<br/><em>Every stitch, a signature.</em></h2></div></section>

      <section id="gallery" className="scroll-mt-20 bg-card py-16 md:py-20"><div className="mx-auto max-w-[1200px] px-5 md:px-10"><div className="flex items-end justify-between gap-6"><div><p className="eyebrow">THE LOOKBOOK</p><h2 className="section-title mt-4">A little <em>inspiration.</em></h2></div><div className="flex gap-2"><Button variant="outline" size="icon" aria-label="Previous look" onClick={() => slide(-1)} className="h-10 w-10 rounded-sm border-border bg-transparent shadow-none"><ArrowLeft size={17}/></Button><Button variant="outline" size="icon" aria-label="Next look" onClick={() => slide(1)} className="h-10 w-10 rounded-sm border-border bg-transparent shadow-none"><ArrowRight size={17}/></Button></div></div><div ref={galleryRef} className="mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{gallery.map(item => <div key={item.name} className="group min-w-[75%] snap-start sm:min-w-[45%] lg:min-w-[31%]"><div className="aspect-[3/4] overflow-hidden bg-muted"><img src={item.image} alt={item.name} loading="lazy" className="fashion-image h-full w-full object-cover"/></div><div className="mt-4 flex items-end justify-between"><div><span className="eyebrow">{item.category}</span><h3 className="display mt-1 text-xl">{item.name}</h3></div><ArrowUpRight className="text-primary" size={20}/></div></div>)}</div><div className="mt-5 flex items-center justify-between"><span className="text-xs text-muted-foreground">0{galleryIndex+1} / 0{gallery.length}</span><div className="flex gap-1">{gallery.map((item,i)=><Button key={item.name} variant="ghost" aria-label={`Show look ${i+1}`} onClick={() => { setGalleryIndex(i); galleryRef.current?.children[i]?.scrollIntoView({behavior:"smooth",block:"nearest",inline:"start"}); }} className={`h-1.5 rounded-none p-0 shadow-none ${galleryIndex === i ? "w-7 bg-primary hover:bg-primary" : "w-3 bg-border hover:bg-primary"}`}/>)}</div></div></div></section>

      <section className="bg-foreground py-16 text-overlay-foreground md:py-20"><div className="mx-auto max-w-[1200px] px-5 text-center md:px-10"><p className="eyebrow">YOUR DESIGN, YOUR STORY</p><h2 className="display mt-5 text-3xl md:text-5xl">Ready to make it <em>yours?</em></h2><p className="mx-auto mt-4 max-w-xl text-[13px] leading-7 text-overlay-foreground/75">A piece made around your imagination begins in the design studio.</p><Button onClick={() => { changeStep(0); }} className="mt-7 h-11 rounded-sm px-7 text-[11px] font-semibold tracking-[.12em] shadow-none">START DESIGNING <ArrowUpRight size={16}/></Button></div></section>
    </main>
    <footer className="bg-background py-12"><div className="mx-auto grid max-w-[1200px] gap-9 px-5 md:grid-cols-[1.2fr_1fr_auto] md:px-10"><div><a href="#top" className="inline-flex items-center gap-3"><img src={logo.url} alt="Naqsh logo" className="h-14 w-14 rounded-full object-cover"/><span className="display text-2xl">NAQSH</span></a><p className="mt-3 text-xs text-muted-foreground">You design it. We make it.</p></div><nav aria-label="Footer navigation" className="flex flex-col items-start gap-3 text-[11px] font-medium tracking-[.1em]">{nav.map(([name,id]) => <a key={id} href={`#${id}`} className="hover:text-primary">{name}</a>)}</nav><div className="flex flex-col gap-2 text-[11px] text-muted-foreground md:items-end"><span>© 2026 NAQSH. MADE WITH CARE.</span><span>Powered by Digitalyze</span></div></div></footer>
  </div>;
}
