import { Badge } from "@/components/ui/badge"
import type { RecipeStatus } from "@/types/recipe"

interface StatusBadgeProps {
  status: RecipeStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "발행됨") {
    return (
      <Badge className="bg-green-600 hover:bg-green-600/80 text-white">
        {status}
      </Badge>
    )
  }
  return <Badge variant="secondary">{status}</Badge>
}
