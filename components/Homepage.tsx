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
  "Classic Newspaper",
  "Retro Game Boy",
  "Neon Dreams",
  "Vintage Poster",
  "Old Terminal",
  "Sunset Comic",
  "Purple Matrix",
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
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <h2 className="font-subheader text-white" style={{ fontWeight: 700, fontSize: "clamp(1.5rem, 3.5vw, 2rem)" }}>
              Curated presets, ready to try.
            </h2>
            <Link href="/workspace" className="dd-label transition-colors hover:text-white">
              Open Workspace &rarr;
            </Link>
          </div>
          <p className="text-sm leading-loose text-white/40 md:text-base">
            {presets.join("  ·  ")}
          </p>
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
