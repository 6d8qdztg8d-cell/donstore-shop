import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://donstore.de";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/produkte`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/produkte/donstore-grip-socks`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/kontakt`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/versand`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/impressum`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/datenschutz`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/agb`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];
}
