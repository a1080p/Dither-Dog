import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { CornerMarks } from "@/components/CornerMarks";

const title = "Dithering Guides";
const description =
  "Guides on dithering algorithms and use cases — Floyd-Steinberg, GIF dithering, and turning photos into pixel art — plus a free in-browser tool to try them yourself.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/guides" },
  openGraph: { title, description, url: "/guides" },
  twitter: { title, description },
};

const guides = [
  {
    href: "/guides/floyd-steinberg-dithering",
    label: "Floyd-Steinberg Dithering, Explained",
    blurb:
      "How the classic error-diffusion algorithm works, and why it's still the go-to choice for converting photos to 1-bit and low-color images.",
  },
  {
    href: "/guides/gif-dithering",
    label: "How to Dither a GIF Online",
    blurb:
      "Why GIF's 256-color limit causes banding, and how dithering fixes it — or gives your GIF an intentional retro look.",
  },
  {
    href: "/guides/pixel-art-from-photo",
    label: "Turn a Photo Into Pixel Art",
    blurb:
      "What actually makes an image read as pixel art, how to pick a palette, and how to generate it from any photo for free.",
  },
];

export default function GuidesIndex() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <SiteHeader />
      <div
        className="flex items-start justify-center"
        style={{ padding: "4rem 1rem 8rem 1rem" }}
      >
        <div
          className="w-full glass-panel relative"
          style={{ maxWidth: "48rem", padding: "1.5rem 1.5rem 6rem 1.5rem" }}
        >
          <CornerMarks />
          <div className="dd-label mb-4" style={{ color: "var(--accent)" }}>
            {"// Guides"}
          </div>
          <div
            className="content-wrapper"
            style={{ padding: "2rem 2.5rem 4rem 2.5rem" }}
          >
            <h1
              className="font-doto text-4xl md:text-5xl text-white tracking-tight"
              style={{ marginBottom: "1.5rem", fontWeight: 800 }}
            >
              Dithering <span style={{ color: "var(--accent)" }}>Guides</span>
            </h1>
            <p
              className="text-white/90 text-lg"
              style={{ marginBottom: "2.5rem" }}
            >
              Short explainers on dithering algorithms and how to use them —
              written alongside the free Dither Dog tool.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {guides.map((guide) => (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="dd-panel dd-panel-hover no-underline"
                  style={{ display: "block", padding: "1.25rem 1.5rem" }}
                >
                  <h2 className="font-subheader text-xl font-bold text-white" style={{ marginBottom: "0.5rem" }}>
                    {guide.label}
                  </h2>
                  <p className="text-white/70" style={{ margin: 0 }}>
                    {guide.blurb}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
