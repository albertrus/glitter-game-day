import { MetadataRoute } from "next";
import { teams } from "@/data/teams";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://glittergameday.com";

  const teamEntries = teams.map((team) => ({
    url: `${baseUrl}/#${team.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...teamEntries,
  ];
}
