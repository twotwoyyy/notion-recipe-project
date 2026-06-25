import type { MetadataRoute } from "next"
import { getAllRecipeIds } from "@/lib/notion"
import { siteConfig } from "@/lib/constants"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ids = await getAllRecipeIds()

  const recipeEntries: MetadataRoute.Sitemap = ids.map((id) => ({
    url: `${siteConfig.url}/recipes/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...recipeEntries,
  ]
}
