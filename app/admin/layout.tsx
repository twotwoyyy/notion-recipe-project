import type { Metadata } from "next"
import Link from "next/link"
import { Shield } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Badge } from "@/components/ui/badge"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav"

export const metadata: Metadata = {
  title: {
    default: "관리자",
    template: "%s | 관리자",
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col">
      <div className="border-b bg-muted/50">
        <Container>
          <div className="flex h-10 items-center gap-2">
            <Shield className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">관리자</span>
            <Badge variant="secondary" className="text-xs">
              Admin
            </Badge>
            <div className="flex-1" />
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              사이트로 돌아가기
            </Link>
          </div>
        </Container>
      </div>

      <AdminMobileNav />

      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 min-w-0">
          <Container className="py-6">{children}</Container>
        </div>
      </div>
    </div>
  )
}
