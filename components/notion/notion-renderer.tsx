import Image from "next/image"
import { cn } from "@/lib/utils"
import type { NotionBlock, RichText } from "@/types/recipe"

interface NotionRendererProps {
  blocks: NotionBlock[]
  className?: string
}

export function NotionRenderer({ blocks, className }: NotionRendererProps) {
  return (
    <div className={cn("notion-content space-y-4", className)}>
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  )
}

function BlockRenderer({ block }: { block: NotionBlock }) {
  switch (block.type) {
    case "paragraph":
      return <ParagraphBlock block={block} />
    case "heading_1":
      return <HeadingBlock block={block} level={1} />
    case "heading_2":
      return <HeadingBlock block={block} level={2} />
    case "heading_3":
      return <HeadingBlock block={block} level={3} />
    case "bulleted_list_item":
      return <ListItemBlock block={block} type="bulleted" />
    case "numbered_list_item":
      return <ListItemBlock block={block} type="numbered" />
    case "image":
      return <ImageBlock block={block} />
    case "divider":
      return <DividerBlock />
    case "quote":
      return <QuoteBlock block={block} />
    case "code":
      return <CodeBlock block={block} />
    case "callout":
      return <CalloutBlock block={block} />
    case "toggle":
      return <ToggleBlock block={block} />
    default:
      return null
  }
}

// 리치 텍스트 렌더러
function RichTextRenderer({ richText }: { richText: RichText[] }) {
  return (
    <>
      {richText.map((text, index) => {
        let content: React.ReactNode = text.plainText

        // 스타일 적용
        if (text.annotations.code) {
          content = (
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.875em] text-foreground">
              {content}
            </code>
          )
        }
        if (text.annotations.bold) {
          content = <strong className="font-semibold">{content}</strong>
        }
        if (text.annotations.italic) {
          content = <em>{content}</em>
        }
        if (text.annotations.underline) {
          content = <u className="underline underline-offset-2">{content}</u>
        }
        if (text.annotations.strikethrough) {
          content = <s className="line-through">{content}</s>
        }

        // 색상 적용
        const colorClass = getColorClass(text.annotations.color)

        // 링크 처리
        if (text.href) {
          return (
            <a
              key={index}
              href={text.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "text-primary underline underline-offset-2 hover:text-primary/80 transition-colors",
                colorClass
              )}
            >
              {content}
            </a>
          )
        }

        if (colorClass) {
          return (
            <span key={index} className={colorClass}>
              {content}
            </span>
          )
        }

        return <span key={index}>{content}</span>
      })}
    </>
  )
}

// Notion 색상 → Tailwind 클래스 매핑
function getColorClass(color: string): string | undefined {
  const colorMap: Record<string, string> = {
    gray: "text-gray-500 dark:text-gray-400",
    brown: "text-amber-700 dark:text-amber-500",
    orange: "text-orange-600 dark:text-orange-400",
    yellow: "text-yellow-600 dark:text-yellow-400",
    green: "text-green-600 dark:text-green-400",
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
    pink: "text-pink-600 dark:text-pink-400",
    red: "text-red-600 dark:text-red-400",
    gray_background: "bg-gray-100 dark:bg-gray-800 px-1 rounded",
    brown_background: "bg-amber-100 dark:bg-amber-900/30 px-1 rounded",
    orange_background: "bg-orange-100 dark:bg-orange-900/30 px-1 rounded",
    yellow_background: "bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded",
    green_background: "bg-green-100 dark:bg-green-900/30 px-1 rounded",
    blue_background: "bg-blue-100 dark:bg-blue-900/30 px-1 rounded",
    purple_background: "bg-purple-100 dark:bg-purple-900/30 px-1 rounded",
    pink_background: "bg-pink-100 dark:bg-pink-900/30 px-1 rounded",
    red_background: "bg-red-100 dark:bg-red-900/30 px-1 rounded",
  }
  return color !== "default" ? colorMap[color] : undefined
}

// --- 개별 블록 컴포넌트 ---

function ParagraphBlock({ block }: { block: NotionBlock }) {
  if (block.richText.length === 0) {
    return <div className="h-4" />
  }
  return (
    <p className="text-base leading-7 text-foreground">
      <RichTextRenderer richText={block.richText} />
    </p>
  )
}

function HeadingBlock({
  block,
  level,
}: {
  block: NotionBlock
  level: 1 | 2 | 3
}) {
  const Tag = `h${level}` as const
  const styles = {
    1: "text-2xl sm:text-3xl font-bold mt-8 mb-4 tracking-tight",
    2: "text-xl sm:text-2xl font-semibold mt-6 mb-3 tracking-tight",
    3: "text-lg sm:text-xl font-semibold mt-5 mb-2",
  }

  return (
    <Tag className={styles[level]}>
      <RichTextRenderer richText={block.richText} />
    </Tag>
  )
}

function ListItemBlock({
  block,
  type,
}: {
  block: NotionBlock
  type: "bulleted" | "numbered"
}) {
  return (
    <div className={cn("flex gap-2", type === "numbered" ? "ml-1" : "ml-0")}>
      <span className="mt-1 shrink-0 text-muted-foreground" aria-hidden="true">
        {type === "bulleted" ? "•" : "–"}
      </span>
      <p className="text-base leading-7">
        <RichTextRenderer richText={block.richText} />
      </p>
    </div>
  )
}

function ImageBlock({ block }: { block: NotionBlock }) {
  if (!block.imageUrl) return null

  return (
    <figure className="my-6">
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src={block.imageUrl}
          alt={block.imageCaption || ""}
          width={800}
          height={450}
          className="w-full h-auto object-cover"
        />
      </div>
      {block.imageCaption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {block.imageCaption}
        </figcaption>
      )}
    </figure>
  )
}

function DividerBlock() {
  return <hr data-block-type="divider" className="my-6 border-border" />
}

function QuoteBlock({ block }: { block: NotionBlock }) {
  return (
    <blockquote className="border-l-4 border-primary/30 pl-4 py-1 my-4 italic text-muted-foreground">
      <p className="text-base leading-7">
        <RichTextRenderer richText={block.richText} />
      </p>
    </blockquote>
  )
}

function CodeBlock({ block }: { block: NotionBlock }) {
  const plainText = block.richText.map((rt) => rt.plainText).join("")

  return (
    <div className="my-4 overflow-hidden rounded-lg border bg-muted/50">
      {block.language && (
        <div className="flex items-center border-b bg-muted px-4 py-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            {block.language}
          </span>
        </div>
      )}
      <pre className="overflow-x-auto p-4">
        <code className="font-mono text-sm leading-relaxed text-foreground">
          {plainText}
        </code>
      </pre>
    </div>
  )
}

function CalloutBlock({ block }: { block: NotionBlock }) {
  return (
    <div data-block-type="callout" className="my-4 flex gap-3 rounded-lg border bg-muted/30 p-4">
      {block.icon && (
        <span className="shrink-0 text-lg" role="img" aria-hidden="true">
          {block.icon}
        </span>
      )}
      <div className="text-base leading-7">
        <RichTextRenderer richText={block.richText} />
      </div>
    </div>
  )
}

function ToggleBlock({ block }: { block: NotionBlock }) {
  return (
    <details className="group my-2 rounded-lg border px-4 py-3">
      <summary className="cursor-pointer text-base font-medium leading-7 list-none flex items-center gap-2">
        <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-90">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </span>
        <RichTextRenderer richText={block.richText} />
      </summary>
      {block.children && block.children.length > 0 && (
        <div className="mt-2 ml-6 space-y-2">
          {block.children.map((child) => (
            <BlockRenderer key={child.id} block={child} />
          ))}
        </div>
      )}
    </details>
  )
}
