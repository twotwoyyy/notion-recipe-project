"use client"

import { Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RecipePrintButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      className="print:hidden"
      onClick={() => window.print()}
    >
      <Printer className="size-4" />
      PDF 저장
    </Button>
  )
}
