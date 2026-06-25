import Image from "next/image"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Recipe } from "@/types/recipe"

interface RecipeCardProps {
  recipe: Recipe
  className?: string
}

export function RecipeCard({ recipe, className }: RecipeCardProps) {
  const formattedDate = new Date(recipe.publishedAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Link href={`/recipes/${recipe.id}`} className={cn("group block", className)}>
      <Card className="h-full overflow-hidden transition-all duration-300 group-hover:ring-2 group-hover:ring-primary/30 group-hover:shadow-lg">
        {/* 썸네일 이미지 영역 */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          {recipe.coverImage ? (
            <Image
              src={recipe.coverImage}
              alt={recipe.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-12 text-muted-foreground/40"
              >
                <path d="M6.13 1L6 16a2 2 0 0 0 2 2h15" />
                <path d="M1 6.13L16 6a2 2 0 0 1 2 2v15" />
              </svg>
            </div>
          )}
        </div>

        <CardHeader className="pb-1">
          {/* 카테고리 배지 */}
          <Badge variant="secondary" className="w-fit text-xs">
            {recipe.category}
          </Badge>
          {/* 제목 */}
          <h3 className="text-lg font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {recipe.title}
          </h3>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          {/* 태그 목록 */}
          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {recipe.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* 발행일 */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3.5" />
            <time dateTime={recipe.publishedAt}>{formattedDate}</time>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
