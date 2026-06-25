import Link from "next/link"
import { SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"

export default function RecipeNotFound() {
  return (
    <div className="py-24">
      <Container className="flex flex-col items-center text-center gap-6">
        <div className="flex size-20 items-center justify-center rounded-full bg-muted">
          <SearchX className="size-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold sm:text-3xl">
            레시피를 찾을 수 없습니다
          </h1>
          <p className="text-muted-foreground max-w-md">
            요청하신 레시피가 존재하지 않거나, 삭제되었을 수 있습니다.
          </p>
        </div>
        <Button asChild>
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </Container>
    </div>
  )
}
