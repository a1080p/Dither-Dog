import Link from "next/link";
import { GlowingCards, GlowingCard } from "@/components/lightswind/glowing-cards";

const stats = [
  { value: "28", label: "Dither Algorithms" },
  { value: "23", label: "Color Palettes" },
  { value: "100%", label: "Client-Side" },
];

const features = [
  {
    tag: "01",
    title: "Error Diffusion",
    desc: "Floyd-Steinberg, Atkinson, Stucki, Sierra and more — the classic algorithms that scatter quantization error across neighboring pixels.",
  },
  {
    tag: "02",
    title: "Ordered Dither",
    desc: "Bayer matrices, blue noise, and clustered-dot halftone patterns for that unmistakable print and retro-display look.",
  },
  {
    tag: "03",
    title: "Artistic Patterns",
    desc: "Halftone dots, crosshatch, stipple and spiral patterns for expressive, poster-grade output.",
  },
];

const presets = [
  { name: "Classic Newspaper", algorithm: "Floyd-Steinberg", palette: "Black & White", desc: "Classic print-press grain, straight out of a 1970s broadsheet." },
  { name: "Retro Game Boy", algorithm: "Bayer 8x8", palette: "Game Boy", desc: "Four shades of green, exactly like the handheld that started it all." },
  { name: "Neon Dreams", algorithm: "Halftone Dots", palette: "Hot Pink & Cyan", desc: "Oversized halftone dots in blown-out arcade neon." },
  { name: "Vintage Poster", algorithm: "Crosshatch", palette: "Teal & Orange", desc: "Hand-inked crosshatching in a cinematic teal-and-orange grade." },
  { name: "Old Terminal", algorithm: "Bayer 8x8", palette: "Green Terminal", desc: "Phosphor-green scanlines like a 1980s command line." },
  { name: "Sunset Comic", algorithm: "Stipple", palette: "Sunset Red", desc: "Pointillist stippling washed in warm sunset red." },
  { name: "Electric Pop Art", algorithm: "Newspaper", palette: "Electric Blue", desc: "Ben-Day dots blown out in electric pop-art blue." },
  { name: "Sepia Memories", algorithm: "Jarvis-Judice-Ninke", palette: "Sepia", desc: "Soft, high-quality error diffusion in faded sepia tones." },
  { name: "Forest Lines", algorithm: "Horizontal Lines", palette: "Forest Green", desc: "Engraved horizontal linework in deep forest green." },
  { name: "Purple Matrix", algorithm: "Grid Pattern", palette: "Lime & Purple", desc: "A glitchy lime-on-purple grid, straight out of The Matrix." },
  { name: "Blue Noise Pro", algorithm: "Blue Noise", palette: "Black & White", desc: "The gold standard of dithering — smooth, artifact-free black & white." },
  { name: "Print Halftone", algorithm: "Clustered Dot", palette: "Cyan & Magenta", desc: "Genuine offset-press halftone in cyan and magenta." },
  { name: "Static TV", algorithm: "White Noise", palette: "Black & White", desc: "Pure television static, frozen mid-frame." },
  { name: "Organic Curves", algorithm: "Riemersma", palette: "Burgundy & Cream", desc: "Space-filling curves for a hand-drawn, organic texture." },
  { name: "Adaptive Dream", algorithm: "Variable Error", palette: "Lavender & Sage", desc: "Adaptive error diffusion in a soft lavender-sage palette." },
  { name: "Pixel Rot", algorithm: "Bayer 2x2", palette: "Commodore 64", desc: "Chunky 2x2 ordered dither pushed until it falls apart into blocky pixel rot.", stylized: true },
  { name: "Broken Signal", algorithm: "Random", palette: "Red & Black", desc: "Pure random dithering — no structure, just degraded VHS-static red.", stylized: true },
  { name: "Cheap Print", algorithm: "Ordered", palette: "Blue & White", desc: "Bargain-bin dot-matrix printing, muddy and low-res on purpose.", stylized: true },
  { name: "Scanline Rot", algorithm: "Vertical Lines", palette: "Green & Black", desc: "Crude vertical scanlines like a dying CRT losing sync.", stylized: true },
  { name: "Doodle Spiral", algorithm: "Spiral", palette: "Orange & Blue", desc: "Loose hand-doodled spiral dithering, rough and unpolished.", stylized: true },
];

export default function Homepage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-20 md:px-8 md:pb-28 md:pt-28">
        <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-2 md:gap-10">
          <div>
            <div className="dd-label mb-5">Client-Side Image, Video &amp; GIF Processor</div>
            <h1
              className="font-doto text-white"
              style={{ fontWeight: 700, fontSize: "clamp(2.25rem, 5vw, 3.75rem)", lineHeight: 1.05, letterSpacing: "-0.01em" }}
            >
              Dither your<br />whole world.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/55 md:text-lg">
              Turn any photo, video, or GIF into pixel-precise art. Dozens of
              dithering algorithms and color palettes, rendered entirely in
              your browser.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/workspace" className="dd-btn dd-btn-primary no-underline">
                Open Workspace
              </Link>
              <a href="#presets" className="dd-btn dd-btn-outline no-underline">
                View Presets
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm md:max-w-none">
            <div className="overflow-hidden rounded-2xl">
              <div className="relative aspect-square w-full">
                <video
                  src="/videos/dither-dog-hero.webm"
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-6 py-14 md:px-8">
        <div className="grid grid-cols-3 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-subheader text-white" style={{ fontWeight: 700, fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
                {stat.value}
              </div>
              <div className="dd-label mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature grid */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-24">
        <h2
          className="mb-12 font-subheader text-white"
          style={{ fontWeight: 700, fontSize: "clamp(1.5rem, 3.5vw, 2rem)" }}
        >
          Every dithering method, tuned for real use.
        </h2>
        <GlowingCards
          gap="1.5rem"
          maxWidth="100%"
          padding="0"
          borderRadius="1rem"
          glowRadius={22}
        >
          {features.map((f) => (
            <GlowingCard
              key={f.tag}
              glowColor="#ff5a1f"
              className="min-w-0 flex-1 border-white/10 bg-[var(--background)]"
            >
              <div className="dd-label mb-4" style={{ color: "var(--accent)" }}>{f.tag}</div>
              <h3 className="font-subheader mb-3 text-lg font-semibold text-white">{f.title}</h3>
              <p className="text-sm leading-relaxed text-white/50">{f.desc}</p>
            </GlowingCard>
          ))}
        </GlowingCards>
      </section>

      {/* Presets */}
      <section id="presets" className="border-t border-white/10 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="dd-label mb-3">{`// ${presets.length} Presets`}</div>
              <h2 className="font-subheader text-white" style={{ fontWeight: 700, fontSize: "clamp(1.5rem, 3.5vw, 2rem)" }}>
                Curated presets, ready to try.
              </h2>
            </div>
            <Link href="/workspace" className="dd-label transition-colors hover:text-white">
              Open Workspace &rarr;
            </Link>
          </div>
          <p className="mb-12 max-w-2xl text-sm leading-relaxed text-white/50 md:text-base">
            Every preset dials in a specific algorithm, color palette, and
            contrast curve — hand-tuned so you can go from source file to
            finished look in one click, then tweak from there.
          </p>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {presets.map((p) => (
              <Link
                key={p.name}
                href={`/workspace?preset=${encodeURIComponent(p.name)}`}
                className="group block bg-[var(--background)] p-6 no-underline transition-colors hover:bg-white/[0.04]"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="font-subheader text-sm font-semibold text-white">{p.name}</h3>
                  {p.stylized && (
                    <span className="dd-chip-outline shrink-0 text-[9px]" style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>
                      Stylized
                    </span>
                  )}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-white/50">{p.desc}</p>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-2">
                    <span className="dd-chip-outline text-[10px]">{p.algorithm}</span>
                    <span className="dd-chip-outline text-[10px]">{p.palette}</span>
                  </div>
                  <span className="dd-label text-[10px] opacity-0 transition-opacity group-hover:opacity-100">
                    Try it &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Preset showcase */}
      <section className="border-t border-white/10 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="dd-label mb-3">{'// Neon Dreams Preset'}</div>
          <h2 className="mb-8 font-subheader text-white" style={{ fontWeight: 700, fontSize: "clamp(1.5rem, 3.5vw, 2rem)" }}>
            One preset, wildly different results.
          </h2>
          <div className="relative mx-auto max-w-lg overflow-hidden rounded-2xl">
            <video
              src="/videos/neon-dreams-showcase.webm"
              className="h-auto w-full"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-20 text-center md:py-28">
        <h2
          className="font-subheader text-white"
          style={{ fontWeight: 700, fontSize: "clamp(1.75rem, 4.5vw, 2.75rem)" }}
        >
          Ready to dither?
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-white/50 md:text-base">
          Runs 100% in your browser. Nothing is ever uploaded.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/workspace" className="dd-btn dd-btn-primary no-underline">
            Open Workspace
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-10 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <span className="font-doto text-sm text-white/60" style={{ fontWeight: 700 }}>
            DITHER DOG
          </span>
          <div className="dd-label flex items-center gap-6">
            <a
              href="https://github.com/a1080p/Dither-Dog"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/80"
            >
              GitHub
            </a>
            <a href="mailto:aidand510@gmail.com" className="hover:text-white/80">
              Contact
            </a>
            <a
              href="https://buymeacoffee.com/GreattAidan"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80"
              style={{ color: "var(--accent)" }}
            >
              Donate
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
