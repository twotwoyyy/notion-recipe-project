import { Container } from "@/components/layout/container"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <Container className="flex flex-col items-center gap-16 py-16">
      <div className="flex flex-col items-center gap-4 w-full max-w-2xl">
        <Skeleton className="h-6 w-48 rounded-full" />
        <Skeleton className="h-14 w-full max-w-xl" />
        <Skeleton className="h-6 w-96" />
        <div className="flex gap-3 mt-2">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-xl" />
        ))}
      </div>
    </Container>
  )
}
