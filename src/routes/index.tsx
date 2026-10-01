import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, Menu, Plus, UploadCloud, X } from "lucide-react";
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
    { title: "NAQSH — Customize Clothing" },
    { name: "description", content: "You design it. We make it. Explore custom clothing and create your own garment with Naqsh." },
    { property: "og:title", content: "NAQSH — Customize Clothing" },
    { property: "og:description", content: "Create clothing exactly the way you imagine it with Naqsh." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Home,
});

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
const process = [
  ["01", "Choose your garment", "Start with the silhouette you love, or imagine something entirely new."],
  ["02", "Make it yours", "Explore fabrics, colors, finishes and all the little details."],
  ["03", "Find your fit", "Choose a standard size or share your own measurements."],
  ["04", "Made with care", "Your idea becomes a piece that's yours and yours alone."],
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
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => { if (filePreview) URL.revokeObjectURL(filePreview); }, [filePreview]);
  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMobileMenu(false); };
  const slide = (direction: number) => { const next = (galleryIndex + direction + gallery.length) % gallery.length; setGalleryIndex(next); galleryRef.current?.children[next]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" }); };
  const summary = [
    "NAQSH — MY CUSTOM DESIGN", "", `Garment: ${activeGarment}`, `Fabric: ${activeFabric}`,
    `Main color: ${customColor || activeColor}`, ...Object.entries(parts).map(([key, value]) => `${key}: ${value}`),
    `Size: ${sizeMode === "standard" ? size : "Custom measurements"}`,
    ...Object.entries(measurementsValue).filter(([, value]) => value).map(([key, value]) => `${key}: ${value} inches`),
    idea ? `My idea: ${idea}` : "", fileName ? `Reference image: ${fileName} (attach separately)` : "",
  ].filter(Boolean).join("\n");
  const copySummary = async () => { try { await navigator.clipboard.writeText(summary); setCopied(true); window.setTimeout(() => setCopied(false), 2500); } catch { setCopied(false); } };
  const onFile = (file?: File) => {
    if (!file || !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024) { window.alert("Please choose a JPG, PNG or WebP image under 10 MB."); return; }
    setFileName(file.name); setFilePreview(URL.createObjectURL(file));
  };

  return <div className="overflow-x-hidden">
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-[78px] max-w-[1440px] items-center justify-between px-5 md:px-10 xl:px-16">
        <a href="#top" aria-label="Naqsh home" className="flex items-center gap-3" onClick={() => setMobileMenu(false)}>
          <img src={logo.url} alt="Naqsh" className="h-12 w-12 rounded-full object-cover" />
          <span className="flex flex-col"><span className="display text-xl leading-none tracking-[.14em]">NAQSH</span><span className="mt-1 text-[7px] font-semibold tracking-[.24em]">CUSTOMIZE CLOTHING</span></span>
        </a>
        <nav className="hidden items-center gap-10 lg:flex" aria-label="Main navigation">
          {[["THE PROCESS","process"],["FABRICS","fabrics"],["GALLERY","gallery"],["DESIGN STUDIO","design"]].map(([name,id]) => <a key={id} href={`#${id}`} className="text-[10px] font-semibold tracking-[.18em] transition-colors hover:text-primary">{name}</a>)}
        </nav>
        <Button onClick={() => scrollTo("design")} className="hidden h-10 rounded-none px-7 text-[10px] font-semibold tracking-[.16em] shadow-none md:inline-flex">START DESIGNING <ArrowUpRight size={15}/></Button>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label={mobileMenu ? "Close menu" : "Open menu"} onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X/> : <Menu/>}</Button>
      </div>
      {mobileMenu && <nav className="border-t border-border bg-background px-6 py-5 lg:hidden" aria-label="Mobile navigation">{[["THE PROCESS","process"],["FABRICS","fabrics"],["GALLERY","gallery"],["DESIGN STUDIO","design"]].map(([name,id]) => <a key={id} href={`#${id}`} onClick={() => setMobileMenu(false)} className="block border-b border-border py-3 text-xs tracking-[.15em]">{name}</a>)}</nav>}
    </header>

    <main id="top">
      <section className="relative isolate flex min-h-[650px] items-center overflow-hidden bg-foreground text-overlay-foreground md:min-h-[690px] lg:min-h-[720px]">
        <img src={hero.url} alt="Fashion editorial portrait in an embroidered statement outfit" className="hero-image absolute inset-0 -z-20 h-full w-full object-cover object-[58%_center]" />
        <div className="hero-overlay absolute inset-0 -z-10" />
        <div className="mx-auto w-full max-w-[1440px] px-6 py-14 md:px-14 md:py-24 xl:px-24">
          <p className="mb-6 text-[10px] font-semibold tracking-[.3em] text-primary md:mb-8">✦ &nbsp; NAQSH CUSTOMIZE CLOTHING &nbsp; ✦</p>
          <h1 className="display max-w-[850px] text-[3.35rem] leading-[.96] font-normal md:text-[clamp(4.5rem,9vw,9.5rem)]">YOU DESIGN.<br/><span className="italic text-primary">WE CREATE.</span></h1>
          <p className="mt-8 max-w-[470px] text-sm leading-8 text-overlay-foreground/85 md:text-base">Clothing, exactly the way you imagine it. Choose every detail — or show us your idea and let your vision take shape.</p>
          <div className="mt-8 flex flex-wrap gap-3 md:mt-10"><Button onClick={() => scrollTo("design")} className="h-12 rounded-none px-6 text-[10px] font-semibold tracking-[.18em] shadow-none md:px-8">START DESIGNING <ArrowUpRight size={15}/></Button><Button onClick={() => scrollTo("process")} variant="outline" className="h-12 rounded-none border-overlay-foreground/65 bg-transparent px-6 text-[10px] font-semibold tracking-[.18em] text-overlay-foreground shadow-none hover:bg-overlay-foreground hover:text-foreground md:px-8">HOW IT WORKS <ArrowDown size={14}/></Button></div>
        </div>
        <div className="absolute bottom-8 right-8 hidden items-center gap-3 text-[9px] tracking-[.18em] md:flex">SCROLL TO EXPLORE <ArrowDown size={14}/></div>
      </section>

      <section id="process" className="scroll-mt-20 py-20 md:py-28">
        <div className="mx-auto max-w-[1320px] px-5 md:px-10"><div className="text-center"><p className="eyebrow">THE PROCESS</p><h2 className="section-title mt-5">From imagination <em>to creation.</em></h2><p className="mt-5 text-sm text-muted-foreground">A considered journey from the first idea to the final stitch.</p></div>
          <div className="mt-14 grid gap-px border border-border bg-border md:grid-cols-4">{process.map(([number,title,text]) => <div key={number} className="min-h-[230px] bg-background p-7 transition-colors hover:bg-card md:p-8"><span className="display text-4xl text-primary">{number}</span><div className="reveal-line mt-6"/><h3 className="display mt-5 text-xl">{title}</h3><p className="mt-3 text-xs leading-6 text-muted-foreground">{text}</p></div>)}</div>
        </div>
      </section>

      <section id="design" className="scroll-mt-20 bg-card py-20 md:py-28"><div className="mx-auto max-w-[1320px] px-5 md:px-10">
        <SectionHeading step="01 / THE SILHOUETTE" title={<>It begins with <em>you.</em></>} subtitle="What would you like us to make? Select a starting point for your design." />
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">{garments.map(item => <Button key={item.name} variant="ghost" onClick={() => setActiveGarment(item.name)} aria-pressed={activeGarment === item.name} className={`group relative block h-auto overflow-hidden rounded-none p-0 text-left shadow-none hover:bg-transparent ${activeGarment === item.name ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : ""}`}><span className="block aspect-[4/5] overflow-hidden bg-muted"><img src={item.image} alt={item.name} loading="lazy" className="fashion-image h-full w-full object-cover"/></span><span className="flex min-h-14 items-center justify-between bg-background px-4"><span className="display text-base md:text-lg">{item.name}</span>{activeGarment === item.name ? <Check className="text-primary" size={16}/> : <Plus size={16}/>}</span></Button>)}</div>
        <div className="mt-8 text-center"><Button variant="outline" onClick={() => setActiveGarment("Something Else")} className="rounded-none border-border bg-transparent px-7 text-xs shadow-none">Something else? Tell us your idea <ArrowUpRight size={14}/></Button></div>
      </div></section>

      <section id="fabrics" className="scroll-mt-20 py-20 md:py-28"><div className="mx-auto max-w-[1320px] px-5 md:px-10"><SectionHeading step="02 / THE FABRIC" title={<>Feel the <em>difference.</em></>} subtitle="The right material brings your vision to life. Choose what feels like you." />
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{fabrics.map(fabric => <Button key={fabric.name} onClick={() => setActiveFabric(fabric.name)} variant="ghost" aria-pressed={activeFabric === fabric.name} className={`group flex h-auto flex-col items-start rounded-none border p-3 text-left shadow-none hover:bg-card ${activeFabric === fabric.name ? "border-primary bg-card" : "border-border"}`}><span className={`fabric-swatch ${fabric.color} block h-24 w-full overflow-hidden sm:h-32`}></span><span className="mt-4 flex w-full items-center justify-between"><span className="display text-lg">{fabric.name}</span>{activeFabric === fabric.name && <Check size={15} className="text-primary"/>}</span><span className="mt-1 text-[10px] font-normal text-muted-foreground">{fabric.note}</span></Button>)}</div>
      </div></section>

      <section className="relative isolate flex min-h-[410px] items-center justify-center overflow-hidden bg-foreground px-6 text-center text-overlay-foreground"><img src={detail.url} alt="Close-up of intricate hand embellishment" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover"/><div className="absolute inset-0 -z-10 bg-foreground/65"/><div><p className="eyebrow">THE ART OF MAKING</p><h2 className="display mt-6 text-4xl leading-tight md:text-6xl">Every thread tells a story.<br/><em>Every stitch, a signature.</em></h2></div></section>

      <section className="py-20 md:py-28"><div className="mx-auto max-w-[1320px] px-5 md:px-10"><SectionHeading step="03 / THE DETAILS" title={<>Make it <em>your own.</em></>} subtitle="The smallest details make the biggest difference. Explore your options below." />
        <div className="mt-14 grid gap-x-16 gap-y-10 lg:grid-cols-2">{Object.entries(choices).map(([category,items]) => <div key={category} className="border-b border-border pb-8"><div className="mb-5 flex items-baseline justify-between"><h3 className="display text-2xl">{category}</h3><span className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">{parts[category] || "Select an option"}</span></div><div className="flex flex-wrap gap-2">{items.map(item => <Button key={item} variant="outline" onClick={() => setParts({...parts, [category]: item})} aria-pressed={parts[category] === item} className={`h-9 rounded-none px-4 text-[11px] font-normal shadow-none ${parts[category] === item ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "border-border bg-transparent hover:border-primary hover:bg-card"}`}>{item}</Button>)}</div></div>)}
          <div className="border-b border-border pb-8"><div className="mb-5 flex items-baseline justify-between"><h3 className="display text-2xl">Color</h3><span className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">Choose your shade</span></div><div className="flex flex-wrap items-center gap-3">{swatches.map(color => <Button key={color} size="icon" variant="ghost" onClick={() => {setActiveColor(color);setCustomColor("");}} aria-label={`Select color ${color}`} aria-pressed={activeColor === color && !customColor} className={`h-9 w-9 rounded-full border-2 p-1 shadow-none hover:bg-transparent ${activeColor === color && !customColor ? "border-primary" : "border-transparent"}`}><span className="h-full w-full rounded-full border border-border" style={{backgroundColor: color}} /></Button>)}<label className="relative ml-2 flex h-9 items-center gap-2 border-b border-border text-[11px] text-muted-foreground"><span>Custom color</span><input type="color" aria-label="Choose a custom color" value={customColor || activeColor} onChange={e => setCustomColor(e.target.value)} className="h-6 w-7 cursor-pointer border-none bg-transparent" /></label></div><p className="mt-5 text-xs text-muted-foreground">Need different colors for sleeves, embroidery or buttons? Describe them with your idea below.</p></div>
        </div>
      </div></section>

      <section className="bg-card py-20 md:py-28"><div className="mx-auto grid max-w-[1320px] items-center gap-12 px-5 md:px-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-24"><div><p className="eyebrow">YOUR INSPIRATION</p><h2 className="section-title mt-5">Have something<br/><em>in mind?</em></h2><p className="mt-6 max-w-md text-sm leading-8 text-muted-foreground">A photograph, a sketch, a garment you love. Show us your reference and tell us what you would make different. Your imagination is the starting point.</p><div className="reveal-line mt-9"/><p className="display mt-7 text-lg italic text-ink-soft">“This dress, in black silk, with longer sleeves and gold embroidery.”</p></div>
        <div className="space-y-5"><input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => onFile(e.target.files?.[0])}/><Button variant="outline" onClick={() => fileRef.current?.click()} className="flex h-56 w-full flex-col rounded-none border border-dashed border-primary bg-background text-foreground shadow-none hover:bg-muted"><UploadCloud className="mb-4 text-primary" size={30}/><span className="display text-xl">{fileName || "Upload your inspiration"}</span><span className="mt-2 text-xs font-normal text-muted-foreground">JPG, PNG or WebP · Up to 10 MB</span>{filePreview && <img src={filePreview} alt="Uploaded design inspiration preview" className="mt-3 h-16 max-w-24 object-contain"/>}</Button><label htmlFor="idea" className="block text-[10px] font-semibold uppercase tracking-[.16em]">Tell us your vision</label><textarea id="idea" value={idea} onChange={e => setIdea(e.target.value.slice(0,1000))} maxLength={1000} placeholder="Describe your idea, any changes you'd like, or colors for different details..." className="min-h-36 w-full resize-y border border-border bg-background p-5 text-sm leading-7 outline-none placeholder:text-muted-foreground focus:border-primary"/></div>
      </div></section>

      <section className="py-20 md:py-28"><div className="mx-auto max-w-[1000px] px-5 md:px-10"><SectionHeading step="04 / THE FIT" title={<>Made to <em>fit you.</em></>} subtitle="Select a standard size or enter your own measurements for a more personal fit." /><div className="mx-auto mt-10 flex max-w-md border border-border p-1"><Button variant="ghost" onClick={() => setSizeMode("standard")} aria-pressed={sizeMode === "standard"} className={`h-11 flex-1 rounded-none text-xs shadow-none ${sizeMode === "standard" ? "bg-foreground text-background hover:bg-foreground/90 hover:text-background" : "hover:bg-card"}`}>Standard size</Button><Button variant="ghost" onClick={() => setSizeMode("measurements")} aria-pressed={sizeMode === "measurements"} className={`h-11 flex-1 rounded-none text-xs shadow-none ${sizeMode === "measurements" ? "bg-foreground text-background hover:bg-foreground/90 hover:text-background" : "hover:bg-card"}`}>My measurements</Button></div>
        {sizeMode === "standard" ? <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-3">{["XS","S","M","L","XL","XXL","Custom"].map(s => <Button key={s} variant="outline" onClick={() => {setSize(s); if(s === "Custom") setSizeMode("measurements");}} aria-pressed={size === s} className={`h-14 min-w-16 rounded-none text-xs shadow-none ${size === s ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90" : "border-border bg-transparent hover:bg-card"}`}>{s}</Button>)}</div> : <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3">{measurements.map(label => <label key={label} className="block"><span className="mb-2 block text-[10px] font-semibold uppercase tracking-[.12em]">{label}</span><div className="flex items-center border border-border bg-card focus-within:border-primary"><input type="number" min="0" max="200" step="0.1" inputMode="decimal" value={measurementsValue[label] || ""} onChange={e => setMeasurementsValue({...measurementsValue,[label]:e.target.value})} placeholder="0" className="w-full bg-transparent px-4 py-3 text-sm outline-none"/><span className="pr-4 text-xs text-muted-foreground">in</span></div></label>)}</div>}
      </div></section>

      <section id="gallery" className="scroll-mt-20 bg-card py-20 md:py-28"><div className="mx-auto max-w-[1320px] px-5 md:px-10"><div className="flex items-end justify-between gap-6"><div><p className="eyebrow">THE LOOKBOOK</p><h2 className="section-title mt-4">A little <em>inspiration.</em></h2></div><div className="flex gap-2"><Button variant="outline" size="icon" aria-label="Previous look" onClick={() => slide(-1)} className="h-11 w-11 rounded-none border-border bg-transparent shadow-none"><ArrowLeft size={17}/></Button><Button variant="outline" size="icon" aria-label="Next look" onClick={() => slide(1)} className="h-11 w-11 rounded-none border-border bg-transparent shadow-none"><ArrowRight size={17}/></Button></div></div><div ref={galleryRef} className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{gallery.map(item => <div key={item.name} className="group min-w-[75%] snap-start sm:min-w-[45%] lg:min-w-[31%]"><div className="aspect-[3/4] overflow-hidden bg-muted"><img src={item.image} alt={item.name} loading="lazy" className="fashion-image h-full w-full object-cover"/></div><div className="mt-4 flex items-end justify-between"><div><span className="eyebrow">{item.category}</span><h3 className="display mt-1 text-xl">{item.name}</h3></div><ArrowUpRight className="text-primary" size={20}/></div></div>)}</div><div className="mt-5 flex items-center justify-between"><span className="text-xs text-muted-foreground">0{galleryIndex+1} / 0{gallery.length}</span><div className="flex gap-1">{gallery.map((item,i)=><Button key={item.name} variant="ghost" aria-label={`Show look ${i+1}`} onClick={() => { setGalleryIndex(i); galleryRef.current?.children[i]?.scrollIntoView({behavior:"smooth",block:"nearest",inline:"start"}); }} className={`h-1.5 rounded-none p-0 shadow-none ${galleryIndex === i ? "w-7 bg-primary hover:bg-primary" : "w-3 bg-border hover:bg-primary"}`}/>)}</div></div></div></section>

      <section className="bg-foreground py-20 text-overlay-foreground md:py-28"><div className="mx-auto max-w-[1320px] px-5 text-center md:px-10"><p className="eyebrow">YOUR DESIGN, YOUR STORY</p><h2 className="display mt-5 text-4xl md:text-6xl">Ready to make it <em>yours?</em></h2><p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-overlay-foreground/75">Your selections are ready. Copy the details of your design to share with Naqsh when you're ready to enquire.</p><Button onClick={copySummary} className="mt-9 h-12 rounded-none px-8 text-[10px] font-semibold tracking-[.15em] shadow-none">{copied ? <><Check size={16}/> DESIGN DETAILS COPIED</> : <><Copy size={16}/> COPY MY DESIGN DETAILS</>}</Button><p className="mt-4 text-[11px] text-overlay-foreground/60">If you added a reference image, attach it separately when you get in touch.</p></div></section>
    </main>
    <footer className="bg-background py-12"><div className="mx-auto flex max-w-[1320px] flex-col gap-8 px-5 md:flex-row md:items-end md:justify-between md:px-10"><div><div className="display text-3xl tracking-[.12em]">NAQSH</div><p className="mt-2 text-xs text-muted-foreground">You design it. We make it.</p></div><div className="flex flex-wrap gap-5 text-[10px] font-semibold tracking-[.12em]"><a href="#process" className="hover:text-primary">THE PROCESS</a><a href="#fabrics" className="hover:text-primary">FABRICS</a><a href="#gallery" className="hover:text-primary">GALLERY</a><a href="#design" className="hover:text-primary">DESIGN STUDIO</a></div><span className="text-[10px] text-muted-foreground">© 2026 NAQSH. MADE WITH CARE.</span></div></footer>
  </div>;
}

function SectionHeading({step,title,subtitle}:{step:string;title:React.ReactNode;subtitle:string}) { return <div className="text-center"><p className="eyebrow">{step}</p><h2 className="section-title mt-5">{title}</h2><p className="mt-5 text-sm leading-7 text-muted-foreground">{subtitle}</p></div>; }
