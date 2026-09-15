import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import ImageProcessor from "@/components/ImageProcessor";

export const metadata: Metadata = {
  title: "Workspace",
  description:
    "Load an image, video, or GIF and dither it live in your browser. 28 algorithms, 23 color palettes, presets, and export to PNG, JPEG, WebP, WebM, or MP4 — free and private.",
  alternates: { canonical: "/workspace" },
};

export default function WorkspacePage() {
  return (
    <>
      <SiteHeader />
      <ImageProcessor />
    </>
  );
}
