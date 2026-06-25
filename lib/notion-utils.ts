import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import type { NotionBlock, RichText, NotionBlockType } from "@/types/recipe"

type RichTextItem = {
  plain_text: string
  href: string | null
  annotations: {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
    color: string
  }
  type: string
}

function transformRichText(richTextItems: RichTextItem[]): RichText[] {
  return richTextItems.map((item) => ({
    type: item.type as RichText["type"],
    plainText: item.plain_text,
    href: item.href,
    annotations: {
      bold: item.annotations.bold,
      italic: item.annotations.italic,
      strikethrough: item.annotations.strikethrough,
      underline: item.annotations.underline,
      code: item.annotations.code,
      color: item.annotations.color,
    },
  }))
}

export function extractPlainText(richTextItems: RichTextItem[]): string {
  return richTextItems.map((item) => item.plain_text).join("")
}

function extractImageUrl(block: BlockObjectResponse & { type: "image" }): string {
  const { image } = block
  if (image.type === "external") return image.external.url
  if (image.type === "file") return image.file.url
  return ""
}

function extractImageCaption(block: BlockObjectResponse & { type: "image" }): string {
  return extractPlainText(block.image.caption as RichTextItem[])
}

function extractCalloutIcon(block: BlockObjectResponse & { type: "callout" }): string {
  const icon = block.callout.icon
  if (!icon) return ""
  if (icon.type === "emoji") return icon.emoji
  return ""
}

const supportedBlockTypes = new Set<string>([
  "paragraph",
  "heading_1",
  "heading_2",
  "heading_3",
  "bulleted_list_item",
  "numbered_list_item",
  "image",
  "divider",
  "quote",
  "code",
  "callout",
  "toggle",
])

export function transformBlock(block: BlockObjectResponse): NotionBlock | null {
  if (!supportedBlockTypes.has(block.type)) return null

  const base = {
    id: block.id,
    type: block.type as NotionBlockType,
  }

  switch (block.type) {
    case "paragraph":
      return {
        ...base,
        richText: transformRichText(block.paragraph.rich_text as RichTextItem[]),
      }
    case "heading_1":
      return {
        ...base,
        richText: transformRichText(block.heading_1.rich_text as RichTextItem[]),
      }
    case "heading_2":
      return {
        ...base,
        richText: transformRichText(block.heading_2.rich_text as RichTextItem[]),
      }
    case "heading_3":
      return {
        ...base,
        richText: transformRichText(block.heading_3.rich_text as RichTextItem[]),
      }
    case "bulleted_list_item":
      return {
        ...base,
        richText: transformRichText(block.bulleted_list_item.rich_text as RichTextItem[]),
      }
    case "numbered_list_item":
      return {
        ...base,
        richText: transformRichText(block.numbered_list_item.rich_text as RichTextItem[]),
      }
    case "image":
      return {
        ...base,
        richText: [],
        imageUrl: extractImageUrl(block),
        imageCaption: extractImageCaption(block),
      }
    case "divider":
      return { ...base, richText: [] }
    case "quote":
      return {
        ...base,
        richText: transformRichText(block.quote.rich_text as RichTextItem[]),
      }
    case "code":
      return {
        ...base,
        richText: transformRichText(block.code.rich_text as RichTextItem[]),
        language: block.code.language,
      }
    case "callout":
      return {
        ...base,
        richText: transformRichText(block.callout.rich_text as RichTextItem[]),
        icon: extractCalloutIcon(block),
      }
    case "toggle":
      return {
        ...base,
        richText: transformRichText(block.toggle.rich_text as RichTextItem[]),
      }
    default:
      return null
  }
}

export function transformBlocks(blocks: BlockObjectResponse[]): NotionBlock[] {
  return blocks
    .map(transformBlock)
    .filter((block): block is NotionBlock => block !== null)
}
