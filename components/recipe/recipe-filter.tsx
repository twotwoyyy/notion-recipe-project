"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { categories } from "@/lib/constants"
import type { CategoryType } from "@/types/recipe"

// "전체"를 포함한 필터 옵션 타입
type FilterOption = "전체" | CategoryType

interface RecipeFilterProps {
  className?: string
  onFilterChange?: (category: FilterOption) => void
}

export function RecipeFilter({ className, onFilterChange }: RecipeFilterProps) {
  const [selected, setSelected] = useState<FilterOption>("전체")

  const filterOptions: FilterOption[] = ["전체", ...categories]

  const handleSelect = (option: FilterOption) => {
    setSelected(option)
    onFilterChange?.(option)
  }

  return (
    <div className={cn("w-full", className)}>
      {/* 모바일에서 가로 스크롤 가능한 탭 */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filterOptions.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              selected === option
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
