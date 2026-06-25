import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { NotionRenderer } from "@/components/notion/notion-renderer"
import { RecipePrintButton } from "@/components/recipe/recipe-print-button"
import { getRecipeById, getRecipeBlocks, getAllRecipeIds } from "@/lib/notion"
import { transformBlocks } from "@/lib/notion-utils"

export const revalidate = 60

export async function generateStaticParams() {
  const ids = await getAllRecipeIds()
  return ids.map((id) => ({ id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const recipe = await getRecipeById(id)
  if (!recipe) return { title: "레시피를 찾을 수 없습니다" }

  return {
    title: recipe.title,
    description: `${recipe.title} 레시피 - ${recipe.category}`,
    openGraph: {
      title: recipe.title,
      description: `${recipe.title} 레시피 - ${recipe.category}`,
      images: recipe.coverImage ? [recipe.coverImage] : [],
    },
  }
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const recipe = await getRecipeById(id)
  if (!recipe) notFound()

  const rawBlocks = await getRecipeBlocks(id)
  const blocks = transformBlocks(rawBlocks)

  const formattedDate = new Date(recipe.publishedAt).toLocaleDateString(
    "ko-KR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  )

  return (
    <div className="py-8">
      <Container>
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">홈</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/?category=${recipe.category}`}>
                  {recipe.category}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{recipe.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mx-auto max-w-3xl">
          <header className="mb-8 space-y-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {recipe.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary">{recipe.category}</Badge>

              {recipe.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="font-normal">
                  {tag}
                </Badge>
              ))}

              <span className="text-muted-foreground">|</span>

              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="size-3.5" />
                <time dateTime={recipe.publishedAt}>{formattedDate}</time>
              </div>

              <span className="text-muted-foreground">|</span>

              <RecipePrintButton />
            </div>
          </header>

          <NotionRenderer blocks={blocks} />
        </div>
      </Container>
    </div>
  )
}
