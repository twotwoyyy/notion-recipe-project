import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Container } from "@/components/layout/container"
import { siteConfig } from "@/lib/constants"

export function HeroSection() {
  return (
    <section className="border-b bg-muted/30 py-16 sm:py-20 lg:py-24">
      <Container className="flex flex-col items-center text-center gap-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {siteConfig.name}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          {siteConfig.description}
        </p>

        {/* 검색창 (디자인만, 기능 없음) */}
        <div className="relative w-full max-w-md mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="레시피 검색..."
            className="h-10 pl-10 pr-4 rounded-full"
            readOnly
          />
        </div>
      </Container>
    </section>
  )
}
