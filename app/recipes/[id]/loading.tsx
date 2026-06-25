import { Skeleton } from "@/components/ui/skeleton"
import { Container } from "@/components/layout/container"

export default function RecipeDetailLoading() {
  return (
    <div className="py-8">
      <Container>
        {/* 브레드크럼 스켈레톤 */}
        <div className="mb-6 flex items-center gap-2">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-3" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-3" />
          <Skeleton className="h-4 w-20" />
        </div>

        <div className="mx-auto max-w-3xl">
          {/* 헤더 스켈레톤 */}
          <div className="mb-8 space-y-4">
            <Skeleton className="h-10 w-3/4 sm:h-12" />
            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-12 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>

          {/* 본문 스켈레톤 */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-4/6" />
            <div className="space-y-2 ml-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-3/4" />
            </div>
            <Skeleton className="h-px w-full my-6" />
            <Skeleton className="h-7 w-1/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        </div>
      </Container>
    </div>
  )
}
