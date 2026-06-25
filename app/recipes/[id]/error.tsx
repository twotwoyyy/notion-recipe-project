"use client"

import { useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function RecipeError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("레시피 상세 페이지 에러:", error)
  }, [error])

  return (
    <div className="py-24">
      <Container className="flex flex-col items-center text-center gap-6">
        <div className="flex size-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="size-10 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold sm:text-3xl">
            오류가 발생했습니다
          </h1>
          <p className="text-muted-foreground max-w-md">
            레시피를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>
        </div>
        <Button onClick={reset}>다시 시도</Button>
      </Container>
    </div>
  )
}
