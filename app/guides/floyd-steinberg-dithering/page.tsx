import type { Metadata } from "next";
import Link from "next/link";
import { GuidePage, GuideH2, GuideP } from "@/components/GuidePage";

const title = "Floyd-Steinberg Dithering, Explained";
const description =
  "How Floyd-Steinberg error-diffusion dithering works, why it's the classic choice for converting photos to 1-bit and low-color images, and how to apply it to your own images and GIFs for free.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/guides/floyd-steinberg-dithering" },
  openGraph: { title, description, url: "/guides/floyd-steinberg-dithering" },
  twitter: { title, description },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  author: { "@type": "Person", name: "Aidan" },
  publisher: { "@type": "Organization", name: "Dither Dog" },
  mainEntityOfPage: "https://ditherdog.tech/guides/floyd-steinberg-dithering",
};

export default function FloydSteinbergGuide() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GuidePage eyebrow="// Guide / Algorithm" title="Floyd-Steinberg Dithering" accentWord="Floyd-Steinberg">
        <GuideP>
          Floyd-Steinberg dithering is the most widely used error-diffusion
          algorithm for reducing an image to a limited color palette — often
          just black and white — without losing the impression of smooth
          tone. Developed by Robert W. Floyd and Louis Steinberg in 1976,
          it&apos;s the reason old black-and-white newspaper photos, early Mac
          bitmap graphics, and modern pixel-art tools all share that
          distinctive scattered, grainy look instead of harsh color bands.
        </GuideP>

        <GuideH2>How it works</GuideH2>
        <GuideP>
          The algorithm scans an image pixel by pixel, left to right, top to
          bottom. For each pixel, it picks the closest available color in the
          output palette (say, pure black or pure white), then calculates
          the <em>error</em> — the difference between the original pixel&apos;s
          brightness and the color it just chose. Instead of discarding that
          error, Floyd-Steinberg diffuses it forward into neighboring pixels
          that haven&apos;t been processed yet, using a fixed set of weights:
        </GuideP>
        <div
          className="dd-panel"
          style={{ padding: "1rem 1.25rem", marginBottom: "1.5rem", fontFamily: "var(--dd-mono)", fontSize: "0.85rem", color: "rgba(242,242,238,0.85)" }}
        >
          7/16 to the pixel immediately to the right<br />
          3/16 to the pixel below-left<br />
          5/16 to the pixel directly below<br />
          1/16 to the pixel below-right
        </div>
        <GuideP>
          By the time the scan reaches those neighboring pixels, their
          brightness has already been nudged toward compensating for the
          rounding error of the pixels before them. The net effect: regions
          that should look like 50% gray end up as a fine, semi-random
          checkerboard of black and white pixels that reads as gray from a
          normal viewing distance, instead of a flat gray block or a harsh
          cutoff.
        </GuideP>

        <GuideH2>Why it still matters</GuideH2>
        <GuideP>
          Error diffusion beats simple threshold-based dithering (like
          ordered/Bayer dithering) at preserving fine detail and smooth
          gradients, which is why it&apos;s still the default choice for
          converting photographs to 1-bit images, preparing art for
          e-ink displays and thermal printers, and giving digital art a
          hand-halftoned, print-like texture. Its main tradeoff is that the
          resulting pattern is less uniform and repeatable than ordered
          dithering, which is why some retro/pixel-art styles prefer Bayer
          matrices instead — Dither Dog supports both, along with 26 other
          algorithms, so you can compare them side by side.
        </GuideP>

        <GuideH2>Try it on your own image</GuideH2>
        <GuideP>
          You don&apos;t need Photoshop or a command-line tool to apply
          Floyd-Steinberg dithering. <Link href="/workspace" style={{ color: "var(--accent)", textDecoration: "underline" }}>Open the Dither Dog workspace</Link>,
          drop in a photo, video, or GIF, and select Floyd-Steinberg from the
          algorithm list. Everything runs client-side in your browser — your
          file is never uploaded anywhere — and you can pair it with any of
          the 23 built-in color palettes, from pure black-and-white to retro
          console palettes, and export the result as a PNG, WebP, GIF, or
          video.
        </GuideP>
      </GuidePage>
    </>
  );
}
