import Link from "next/link"
import {
  Layers,
  Code2,
  Palette,
  LayoutTemplate,
  Moon,
  Package,
  ArrowRight,
  ExternalLink,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Container } from "@/components/layout/container"
import { siteConfig } from "@/lib/constants"

const features = [
  {
    icon: Layers,
    title: "App Router",
    description:
      "Next.js 16 App Router로 서버 컴포넌트, 스트리밍, 최신 라우팅 패턴을 활용합니다.",
  },
  {
    icon: Code2,
    title: "TypeScript",
    description:
      "엄격한 타입 체크로 안전하고 예측 가능한 코드를 작성합니다.",
  },
  {
    icon: Palette,
    title: "Tailwind CSS v4",
    description:
      "최신 Tailwind CSS v4 CSS 변수 기반 테마 시스템으로 빠른 스타일링을 구현합니다.",
  },
  {
    icon: LayoutTemplate,
    title: "ShadcnUI",
    description:
      "접근성 높은 Radix UI 기반 컴포넌트를 바로 사용할 수 있습니다.",
  },
  {
    icon: Moon,
    title: "다크 모드",
    description:
      "next-themes로 라이트/다크/시스템 테마를 지원합니다. SSR 깜빡임 없음.",
  },
  {
    icon: Package,
    title: "검증된 라이브러리",
    description:
      "react-hook-form, zod, usehooks-ts 등 검증된 라이브러리가 사전 구성됩니다.",
  },
]

const techStack = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Tailwind CSS v4",
  "ShadcnUI",
  "lucide-react",
  "next-themes",
  "sonner",
  "react-hook-form",
  "zod",
  "usehooks-ts",
]

export default function HomePage() {
  return (
    <div className="flex flex-col gap-24 py-16 pb-24">
      {/* Hero */}
      <section>
        <Container className="flex flex-col items-center text-center gap-6">
          <Badge variant="secondary">
            Next.js 16 · TypeScript · Tailwind CSS v4
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            모던 웹 개발을
            <br />
            빠르게 시작하세요
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            검증된 기술 스택과 최신 패턴으로 구성된 스타터킷입니다.
            레이아웃, 테마, 폼, 컴포넌트가 모두 준비되어 있습니다.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="#features">
                시작하기
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={siteConfig.github} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" />
                GitHub
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      <Separator />

      {/* Features */}
      <section id="features">
        <Container>
          <div className="flex flex-col items-center text-center gap-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight">주요 기능</h2>
            <p className="text-muted-foreground max-w-xl">
              개발을 빠르게 시작할 수 있도록 필요한 모든 것이 준비되어 있습니다.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Tech Stack */}
      <section id="stack">
        <Container>
          <div className="rounded-2xl bg-muted/50 p-10">
            <div className="flex flex-col items-center text-center gap-4 mb-8">
              <h2 className="text-3xl font-bold tracking-tight">기술 스택</h2>
              <p className="text-muted-foreground">
                검증된 라이브러리만을 선별했습니다.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {techStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-sm px-3 py-1">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section>
        <Container>
          <div className="flex flex-col items-center text-center gap-6 rounded-2xl border bg-card p-12">
            <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10">
              <Zap className="size-7 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">바로 시작하세요</h2>
            <p className="text-muted-foreground max-w-xl">
              설정은 완료되었습니다. 아이디어를 코드로 바꾸는 데 집중하세요.
            </p>
            <Button size="lg" asChild>
              <Link href={siteConfig.github} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" />
                GitHub에서 보기
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  )
}
