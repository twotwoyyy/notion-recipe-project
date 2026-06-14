import type { NavItem, SiteConfig } from "@/types"

export const siteConfig: SiteConfig = {
  name: "Next Starter",
  description: "Next.js + TypeScript + Tailwind CSS v4 + ShadcnUI로 빠르게 시작하는 모던 웹 스타터킷",
  url: "https://example.com",
  ogImage: "/og.png",
  github: "https://github.com/",
}

export const navItems: NavItem[] = [
  { title: "홈", href: "/" },
  { title: "컴포넌트", href: "/examples/components" },
  { title: "폼", href: "/examples/forms" },
]
