import type { Metadata } from "next";
import Link from "next/link";
import { GuidePage, GuideH2, GuideP } from "@/components/GuidePage";

const title = "How to Dither a GIF Online (Free, No Upload)";
const description =
  "Why GIF dithering fixes color banding and washed-out gradients caused by GIF's 256-color limit, and how to dither any GIF for free in your browser with Dither Dog.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/guides/gif-dithering" },
  openGraph: { title, description, url: "/guides/gif-dithering" },
  twitter: { title, description },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  author: { "@type": "Person", name: "Aidan" },
  publisher: { "@type": "Organization", name: "Dither Dog" },
  mainEntityOfPage: "https://ditherdog.tech/guides/gif-dithering",
};

export default function GifDitheringGuide() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GuidePage eyebrow="// Guide / Format" title="Dithering a GIF" accentWord="GIF">
        <GuideP>
          The GIF format can only store 256 colors per frame. Any photo,
          screen recording, or video you convert to GIF has to be squeezed
          down from millions of colors to that palette — and without
          dithering, smooth gradients (skies, skin tones, shadows) break
          into ugly, visible bands of flat color called{" "}
          <em>color banding</em>. Dithering is the fix: it scatters pixels
          from the limited palette so your eye blends them back into a
          gradient, at the cost of a bit of visible grain or texture.
        </GuideP>

        <GuideH2>Why GIFs need dithering more than other formats</GuideH2>
        <GuideP>
          Formats like PNG, WebP, and MP4 can represent millions of colors
          natively, so banding is rarely an issue. GIF's 256-color ceiling
          means it's almost always the format where dithering matters most —
          it's the difference between a GIF that looks like a cheap
          screenshot and one that looks intentional, whether that's a
          faithful color reproduction or a deliberately retro, grainy
          aesthetic.
        </GuideP>

        <GuideH2>Two reasons to dither a GIF</GuideH2>
        <GuideP>
          <strong className="text-white">1. Quality —</strong> applying an
          error-diffusion algorithm like Floyd-Steinberg before or during
          GIF export keeps gradients looking smooth despite the 256-color
          limit, so photos and video frames don&apos;t get that washed-out,
          posterized look.
        </GuideP>
        <GuideP>
          <strong className="text-white">2. Style —</strong> a lot of
          creators dither GIFs on purpose, pairing an ordered/Bayer pattern
          with a low-color palette (black-and-white, 1-bit, or a retro
          console palette) to get a deliberately lo-fi, print-halftone, or
          8-bit look for memes, album art, and social posts.
        </GuideP>

        <GuideH2>Dither a GIF in your browser</GuideH2>
        <GuideP>
          <Link href="/workspace" style={{ color: "var(--accent)", textDecoration: "underline" }}>Open the Dither Dog workspace</Link>{" "}
          and drop in a GIF directly — it's processed frame by frame, fully
          client-side, so nothing is ever uploaded to a server. Pick from 28
          dithering algorithms (Floyd-Steinberg for smooth photographic
          results, Bayer/ordered patterns for a more uniform retro texture)
          and 23 color palettes, adjust brightness and contrast live, and
          export straight back out as a GIF, WebM, or MP4.
        </GuideP>
      </GuidePage>
    </>
  );
}
