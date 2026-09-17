import type { MetadataRoute } from "next";

const siteUrl = "https://ditherdog.tech";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/workspace`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/guides`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/guides/floyd-steinberg-dithering`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/guides/gif-dithering`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/guides/pixel-art-from-photo`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
