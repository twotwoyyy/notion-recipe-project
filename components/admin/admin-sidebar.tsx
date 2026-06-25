"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText } from "lucide-react"
import { adminNavItems } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  "/admin": LayoutDashboard,
  "/admin/recipes": FileText,
}

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r bg-muted/30 p-4 gap-1">
      {adminNavItems.map((item) => {
        const Icon = iconMap[item.href] ?? FileText
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {item.title}
          </Link>
        )
      })}
    </aside>
  )
}
