import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/lib/constants"

export function Footer() {
  return (
    <footer>
      <Separator />
      <Container>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
