"use client"

import { useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("관리자 페이지 에러:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="size-8 text-destructive" />
      </div>
      <h2 className="text-xl font-semibold">오류가 발생했습니다</h2>
      <p className="text-sm text-muted-foreground">
        데이터를 불러오는 중 문제가 발생했습니다.
      </p>
      <Button onClick={reset}>다시 시도</Button>
    </div>
  )
}
