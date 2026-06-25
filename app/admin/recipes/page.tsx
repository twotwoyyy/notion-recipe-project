import type { Metadata } from "next"
import { getAllRecipes } from "@/lib/notion"
import { RecipeTable } from "@/components/admin/recipe-table"

export const metadata: Metadata = {
  title: "레시피 관리",
}

export const dynamic = "force-dynamic"

export default async function AdminRecipesPage() {
  const recipes = await getAllRecipes()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">레시피 관리</h1>
        <p className="text-muted-foreground">
          전체 레시피 {recipes.length}개
        </p>
      </div>

      <RecipeTable recipes={recipes} />
    </div>
  )
}
