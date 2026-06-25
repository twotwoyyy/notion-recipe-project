import { FileText, CheckCircle, PenLine } from "lucide-react"
import { getAllRecipes } from "@/lib/notion"
import { StatsCard } from "@/components/admin/stats-card"
import { RecentRecipes } from "@/components/admin/recent-recipes"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const allRecipes = await getAllRecipes()

  const published = allRecipes.filter((r) => r.status === "발행됨").length
  const draft = allRecipes.length - published
  const recentRecipes = allRecipes.slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
        <p className="text-muted-foreground">
          레시피 현황을 한눈에 확인하세요.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard title="전체 레시피" value={allRecipes.length} icon={FileText} />
        <StatsCard title="발행됨" value={published} icon={CheckCircle} />
        <StatsCard title="초안" value={draft} icon={PenLine} />
      </div>

      <RecentRecipes recipes={recentRecipes} />
    </div>
  )
}
