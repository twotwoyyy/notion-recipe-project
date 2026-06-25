import Link from "next/link"
import { ExternalLink, Calendar } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/admin/status-badge"
import type { Recipe } from "@/types/recipe"

interface RecipeTableProps {
  recipes: Recipe[]
}

export function RecipeTable({ recipes }: RecipeTableProps) {
  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="text-sm text-muted-foreground">
          등록된 레시피가 없습니다.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* 데스크톱 테이블 */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">제목</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>태그</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>발행일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipes.map((recipe) => (
              <TableRow key={recipe.id}>
                <TableCell className="font-medium">
                  {recipe.status === "발행됨" ? (
                    <Link
                      href={`/recipes/${recipe.id}`}
                      target="_blank"
                      className="flex items-center gap-1.5 hover:text-primary transition-colors"
                    >
                      <span className="truncate">{recipe.title}</span>
                      <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">
                      {recipe.title}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{recipe.category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {recipe.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={recipe.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {recipe.publishedAt
                    ? new Date(recipe.publishedAt).toLocaleDateString("ko-KR")
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 모바일 카드형 리스트 */}
      <div className="flex flex-col gap-3 md:hidden">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-start justify-between gap-2">
              {recipe.status === "발행됨" ? (
                <Link
                  href={`/recipes/${recipe.id}`}
                  target="_blank"
                  className="font-medium text-sm hover:text-primary transition-colors"
                >
                  {recipe.title}
                </Link>
              ) : (
                <span className="font-medium text-sm text-muted-foreground">
                  {recipe.title}
                </span>
              )}
              <StatusBadge status={recipe.status} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {recipe.category}
              </Badge>
              {recipe.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {recipe.tags.length > 2 && (
                <span>+{recipe.tags.length - 2}</span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="size-3" />
              <span>
                {recipe.publishedAt
                  ? new Date(recipe.publishedAt).toLocaleDateString("ko-KR")
                  : "날짜 없음"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
