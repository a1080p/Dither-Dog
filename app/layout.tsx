import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { doto, alliance } from "./fonts";
import "./globals.css";

const siteUrl = "https://ditherdog.tech";
const title = "Dither Dog - Image, Video & GIF Dithering App";
const description =
  "Turn any photo, video, or GIF into pixel-precise dithered art. 28 dithering algorithms and 23 color palettes, rendered entirely client-side in your browser — free, private, no uploads.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Dither Dog",
  },
  description,
  keywords: [
    "dithering",
    "image dithering",
    "video dithering",
    "gif dithering",
    "Floyd-Steinberg dithering",
    "Bayer dithering",
    "pixel art generator",
    "retro image effect",
    "halftone effect",
    "1-bit image converter",
    "free online dithering tool",
  ],
  authors: [{ name: "Aidan" }],
  creator: "Aidan",
  applicationName: "Dither Dog",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Dither Dog",
    title,
    description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Dither Dog" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0a0a0b',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/raq3tkk.css" />
      </head>
      <body className={`${alliance.className} ${doto.variable} antialiased bg-black`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
