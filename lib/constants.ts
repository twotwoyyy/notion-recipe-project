import type { NavItem, SiteConfig } from "@/types"
import type { CategoryType } from "@/types/recipe"

export const siteConfig: SiteConfig = {
  name: "레시피 모음",
  description: "Notion CMS 기반 레시피 블로그 — Notion에서 작성하면 자동으로 웹에 반영됩니다.",
  url: "https://example.com",
  ogImage: "/og.png",
  github: "https://github.com/",
}

export const navItems: NavItem[] = [
  { title: "홈", href: "/" },
  { title: "레시피", href: "/#recipes" },
]

export const categories: CategoryType[] = [
  "한식",
  "양식",
  "중식",
  "일식",
  "베이킹",
  "음료",
  "기타",
]
