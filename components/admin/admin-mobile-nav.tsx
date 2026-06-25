"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { adminNavItems } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function AdminMobileNav() {
  const pathname = usePathname()

  return (
    <nav className="flex md:hidden border-b overflow-x-auto">
      {adminNavItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 px-4 py-3 text-sm font-medium transition-colors border-b-2",
              isActive
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
