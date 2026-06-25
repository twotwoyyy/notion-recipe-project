import { Client } from "@notionhq/client"
import type {
  PageObjectResponse,
  BlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints"
import type { Recipe, CategoryType } from "@/types/recipe"

const notionClient = new Client({
  auth: process.env.NOTION_API_KEY,
})

const dataSourceId = process.env.NOTION_DATABASE_ID!

function extractCoverImage(page: PageObjectResponse): string | null {
  if (!page.cover) return null
  if (page.cover.type === "external") return page.cover.external.url
  if (page.cover.type === "file") return page.cover.file.url
  return null
}

function extractTitle(page: PageObjectResponse): string {
  const titleProp = page.properties["Title"]
  if (titleProp?.type === "title") {
    return titleProp.title.map((t) => t.plain_text).join("")
  }
  return ""
}

function extractSelect(page: PageObjectResponse, property: string): string {
  const prop = page.properties[property]
  if (prop?.type === "select" && prop.select) return prop.select.name
  if (prop?.type === "status" && prop.status) return prop.status.name
  return ""
}

function extractMultiSelect(page: PageObjectResponse, property: string): string[] {
  const prop = page.properties[property]
  if (prop?.type === "multi_select") {
    return prop.multi_select.map((s) => s.name)
  }
  return []
}

function extractDate(page: PageObjectResponse, property: string): string {
  const prop = page.properties[property]
  if (prop?.type === "date" && prop.date) return prop.date.start
  return ""
}

function pageToRecipe(page: PageObjectResponse): Recipe {
  return {
    id: page.id,
    title: extractTitle(page),
    category: (extractSelect(page, "Category") || "기타") as CategoryType,
    tags: extractMultiSelect(page, "Tags"),
    publishedAt: extractDate(page, "Published"),
    status: extractSelect(page, "Status") as Recipe["status"],
    coverImage: extractCoverImage(page),
  }
}

export async function getPublishedRecipes(category?: string): Promise<Recipe[]> {
  const filter: Parameters<typeof notionClient.dataSources.query>[0]["filter"] = category
    ? {
        and: [
          { property: "Status", select: { equals: "발행됨" } },
          { property: "Category", select: { equals: category } },
        ],
      }
    : {
        property: "Status",
        select: { equals: "발행됨" },
      }

  const response = await notionClient.dataSources.query({
    data_source_id: dataSourceId,
    filter,
    sorts: [{ property: "Published", direction: "descending" }],
  })

  return response.results
    .filter((page): page is PageObjectResponse => "properties" in page)
    .map(pageToRecipe)
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  try {
    const page = await notionClient.pages.retrieve({ page_id: id })
    if (!("properties" in page)) return null
    const recipe = pageToRecipe(page as PageObjectResponse)
    if (recipe.status !== "발행됨") return null
    return recipe
  } catch {
    return null
  }
}

export async function getRecipeBlocks(id: string): Promise<BlockObjectResponse[]> {
  const blocks: BlockObjectResponse[] = []
  let cursor: string | undefined

  do {
    const response = await notionClient.blocks.children.list({
      block_id: id,
      start_cursor: cursor,
      page_size: 100,
    })

    for (const block of response.results) {
      if ("type" in block) {
        blocks.push(block as BlockObjectResponse)
      }
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor)

  return blocks
}

export async function getAllRecipeIds(): Promise<string[]> {
  const recipes = await getPublishedRecipes()
  return recipes.map((r) => r.id)
}
