"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error(error)
    }
  }, [error])

  return (
    <Container className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <h2 className="text-2xl font-semibold">오류가 발생했습니다</h2>
      <p className="text-muted-foreground">
        예상치 못한 오류가 발생했습니다.
      </p>
      <Button onClick={reset} className="mt-2">
        다시 시도
      </Button>
    </Container>
  )
}
