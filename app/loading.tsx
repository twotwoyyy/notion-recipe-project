import { Skeleton } from "@/components/ui/skeleton"
import { Container } from "@/components/layout/container"

export default function HomeLoading() {
  return (
    <div className="flex flex-col">
      {/* 히어로 스켈레톤 */}
      <section className="border-b bg-muted/30 py-16 sm:py-20 lg:py-24">
        <Container className="flex flex-col items-center gap-6">
          <Skeleton className="h-12 w-64 sm:h-14 sm:w-80" />
          <Skeleton className="h-6 w-96 max-w-full" />
          <Skeleton className="h-10 w-full max-w-md rounded-full" />
        </Container>
      </section>

      {/* 필터 + 그리드 스켈레톤 */}
      <section className="py-12">
        <Container className="flex flex-col gap-8">
          {/* 필터 탭 스켈레톤 */}
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-16 shrink-0 rounded-full" />
            ))}
          </div>

          {/* 카드 그리드 스켈레톤 */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-xl border p-4">
                <Skeleton className="aspect-[16/10] w-full rounded-lg" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-6 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-14" />
                </div>
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}
