import { UtensilsCrossed } from "lucide-react"
import { RecipeCard } from "@/components/recipe/recipe-card"
import { cn } from "@/lib/utils"
import type { Recipe } from "@/types/recipe"

interface RecipeGridProps {
  recipes: Recipe[]
  className?: string
}

export function RecipeGrid({ recipes, className }: RecipeGridProps) {
  if (recipes.length === 0) {
    return <EmptyState />
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <UtensilsCrossed className="size-8 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">레시피가 없습니다</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          아직 등록된 레시피가 없거나, 선택한 조건에 맞는 레시피가 없습니다.
        </p>
      </div>
    </div>
  )
}
