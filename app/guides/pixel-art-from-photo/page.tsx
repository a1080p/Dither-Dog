import type { Metadata } from "next";
import Link from "next/link";
import { GuidePage, GuideH2, GuideP } from "@/components/GuidePage";

const title = "Turn a Photo Into Pixel Art, Free and Private";
const description =
  "How to turn any photo into retro pixel art using dithering and limited color palettes — no software install, no account, no upload. Free in-browser pixel art generator.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/guides/pixel-art-from-photo" },
  openGraph: { title, description, url: "/guides/pixel-art-from-photo" },
  twitter: { title, description },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  author: { "@type": "Person", name: "Aidan" },
  publisher: { "@type": "Organization", name: "Dither Dog" },
  mainEntityOfPage: "https://ditherdog.tech/guides/pixel-art-from-photo",
};

export default function PixelArtGuide() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GuidePage eyebrow="// Guide / Use Case" title="Photo to Pixel Art" accentWord="Pixel Art">
        <GuideP>
          Retro pixel art doesn&apos;t just come from a small canvas — the
          limited color palette is just as important as the resolution.
          Old game consoles and computers could only display a handful of
          colors at once, and dithering was the trick artists used to fake
          gradients, shading, and depth within that limit. That same
          technique is what turns an ordinary photo into something that
          looks like it was hand-drawn for a 16-bit game.
        </GuideP>

        <GuideH2>What actually makes an image &quot;pixel art&quot;</GuideH2>
        <GuideP>
          Two things: a restricted color palette (think 4, 8, or 16 colors
          instead of millions) and dithering to simulate shading within
          that palette. Simply downscaling a photo and picking the nearest
          color per pixel gives you flat, banded results. Adding an
          error-diffusion or ordered dithering pass — like Floyd-Steinberg
          or a Bayer matrix — is what produces the characteristic scattered
          shading real pixel art uses to suggest gradients, light, and
          texture with only a few colors.
        </GuideP>

        <GuideH2>Choosing a palette</GuideH2>
        <GuideP>
          The palette does most of the aesthetic work. A strict
          black-and-white or 1-bit palette gives a print/newspaper look.
          A handful of muted tones reads as a Game Boy-era aesthetic.
          Bright, saturated retro-console palettes (NES, CGA, C64) give
          that unmistakable 8-bit game look. Dither Dog ships with 23
          built-in palettes covering all of these, plus custom palette
          support, so you can try a photo against several styles in
          seconds without re-uploading anything.
        </GuideP>

        <GuideH2>Make your own pixel art</GuideH2>
        <GuideP>
          <Link href="/workspace" style={{ color: "var(--accent)", textDecoration: "underline" }}>Open the Dither Dog workspace</Link>,
          drop in any photo, and pick a dithering algorithm and color
          palette from the panel. Everything renders live in your browser —
          no install, no account, and your photo never leaves your device.
          When you land on a look you like, export it as a PNG or WebP at
          full resolution.
        </GuideP>
      </GuidePage>
    </>
  );
}
