import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Dither Dog is a free, open-source image, video, and GIF dithering tool. Everything runs locally in your browser — nothing is ever uploaded.",
  alternates: { canonical: "/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
