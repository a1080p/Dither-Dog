import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import Homepage from "@/components/Homepage";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Dither Dog",
  url: "https://ditherdog.tech",
  description:
    "Turn any photo, video, or GIF into pixel-precise dithered art. 28 dithering algorithms and 23 color palettes, rendered entirely client-side in your browser — free, private, no uploads.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any (runs in browser)",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <Homepage />
    </>
  );
}
