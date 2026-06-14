import Link from "next/link"
import { navItems } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function MainNav() {
  return (
    <nav className="hidden md:flex items-center gap-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
            item.disabled && "pointer-events-none opacity-50"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
