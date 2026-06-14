export type NavItem = {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
  description?: string
}

export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  github: string
}

export type ApiResponse<T = unknown> = {
  data?: T
  error?: string
  message?: string
}
