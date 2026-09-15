import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { doto, alliance } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dither Dog - Image Dithering Web App",
  description: "A modern image processing application with dithering effects",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
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
