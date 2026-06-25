import Link from "next/link"
import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Recipe } from "@/types/recipe"

interface RecentRecipesProps {
  recipes: Recipe[]
}

export function RecentRecipes({ recipes }: RecentRecipesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 레시피</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {recipes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            등록된 레시피가 없습니다
          </p>
        ) : (
          recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="flex items-center justify-between gap-4 rounded-lg p-2 transition-colors hover:bg-muted"
            >
              <div className="flex flex-col gap-1 min-w-0">
                {recipe.status === "발행됨" ? (
                  <Link
                    href={`/recipes/${recipe.id}`}
                    target="_blank"
                    className="text-sm font-medium truncate hover:underline"
                  >
                    {recipe.title}
                  </Link>
                ) : (
                  <span className="text-sm font-medium truncate">
                    {recipe.title}
                  </span>
                )}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="size-3" />
                  <span>
                    {recipe.publishedAt
                      ? new Date(recipe.publishedAt).toLocaleDateString("ko-KR")
                      : "날짜 없음"}
                  </span>
                </div>
              </div>
              <Badge
                variant={recipe.status === "발행됨" ? "default" : "secondary"}
                className="shrink-0"
              >
                {recipe.status}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
