import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <p className="text-8xl font-bold text-muted-foreground/30">404</p>
      <h2 className="text-2xl font-semibold">페이지를 찾을 수 없습니다</h2>
      <p className="text-muted-foreground">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Button asChild className="mt-2">
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </Container>
  )
}
