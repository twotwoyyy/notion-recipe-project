import Link from "next/link"
import { Zap } from "lucide-react"
import { Container } from "@/components/layout/container"
import { MainNav } from "@/components/layout/main-nav"
import { MobileNav } from "@/components/layout/mobile-nav"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { siteConfig } from "@/lib/constants"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <Container>
        <div className="flex h-14 items-center gap-4">
          <MobileNav />
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Zap className="size-5 text-primary" />
            <span>{siteConfig.name}</span>
          </Link>
          <div className="flex-1" />
          <MainNav />
          <ThemeToggle />
        </div>
      </Container>
    </header>
  )
}
