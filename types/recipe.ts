export type CategoryType =
  | "한식"
  | "양식"
  | "중식"
  | "일식"
  | "베이킹"
  | "음료"
  | "기타"

export type RecipeStatus = "초안" | "발행됨"

export interface Recipe {
  id: string
  title: string
  category: CategoryType
  tags: string[]
  publishedAt: string
  status: RecipeStatus
  coverImage: string | null
}

export type RichTextAnnotations = {
  bold: boolean
  italic: boolean
  strikethrough: boolean
  underline: boolean
  code: boolean
  color: string
}

export type RichText = {
  type: "text" | "mention" | "equation"
  plainText: string
  href: string | null
  annotations: RichTextAnnotations
}

export type NotionBlockType =
  | "paragraph"
  | "heading_1"
  | "heading_2"
  | "heading_3"
  | "bulleted_list_item"
  | "numbered_list_item"
  | "image"
  | "divider"
  | "quote"
  | "code"
  | "callout"
  | "toggle"

export interface NotionBlock {
  id: string
  type: NotionBlockType
  richText: RichText[]
  children?: NotionBlock[]
  imageUrl?: string
  imageCaption?: string
  language?: string
  icon?: string
}

export interface RecipeStats {
  total: number
  published: number
  draft: number
}
