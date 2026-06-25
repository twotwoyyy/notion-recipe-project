import { Container } from "@/components/layout/container"
import { HeroSection } from "@/components/recipe/hero-section"
import { RecipeFilter } from "@/components/recipe/recipe-filter"
import { RecipeGrid } from "@/components/recipe/recipe-grid"
import { getPublishedRecipes } from "@/lib/notion"

export const revalidate = 60

export default async function HomePage() {
  const recipes = await getPublishedRecipes()

  return (
    <div className="flex flex-col">
      <HeroSection />

      <section id="recipes" className="py-12">
        <Container className="flex flex-col gap-8">
          <RecipeFilter />
          <RecipeGrid recipes={recipes} />
        </Container>
      </section>
    </div>
  )
}
