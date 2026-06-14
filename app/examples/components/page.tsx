import type { Metadata } from "next"
import {
  Bell,
  Check,
  Info,
  AlertTriangle,
  X,
  User,
  Mail,
  Settings,
  Star,
} from "lucide-react"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "컴포넌트 예제",
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

export default function ComponentsPage() {
  return (
    <Container className="py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">컴포넌트 예제</h1>
        <p className="mt-2 text-muted-foreground">
          ShadcnUI 컴포넌트 사용 예시입니다.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        {/* Buttons */}
        <Section title="Button">
          <Button>기본</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button disabled>비활성화</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button size="icon"><Bell className="size-4" /></Button>
        </Section>

        <Separator />

        {/* Badges */}
        <Section title="Badge">
          <Badge>기본</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge className="gap-1"><Star className="size-3" /> 추천</Badge>
        </Section>

        <Separator />

        {/* Avatar */}
        <Section title="Avatar">
          <Avatar>
            <AvatarFallback>김</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar className="size-12">
            <AvatarFallback className="text-lg">이</AvatarFallback>
          </Avatar>
        </Section>

        <Separator />

        {/* Alerts */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Alert</h2>
          <Alert>
            <Info className="size-4" />
            <AlertTitle>안내</AlertTitle>
            <AlertDescription>일반 안내 메시지입니다.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>오류</AlertTitle>
            <AlertDescription>오류가 발생했습니다. 다시 시도해주세요.</AlertDescription>
          </Alert>
        </div>

        <Separator />

        {/* Card */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Card</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>카드 제목</CardTitle>
                <CardDescription>카드 설명 텍스트입니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">카드 본문 내용이 여기에 들어갑니다.</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">취소</Button>
                <Button size="sm">확인</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback><User className="size-4" /></AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">사용자 카드</CardTitle>
                    <CardDescription>user@example.com</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Badge variant="secondary">관리자</Badge>
                  <Badge variant="outline">활성</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="flex flex-col items-center justify-center p-8 text-center">
              <Check className="size-10 text-primary mb-3" />
              <CardTitle className="text-base">완료!</CardTitle>
              <CardDescription className="mt-1">작업이 성공적으로 완료되었습니다.</CardDescription>
            </Card>
          </div>
        </div>

        <Separator />

        {/* Skeleton */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Skeleton</h2>
          <div className="flex items-center gap-4">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>

        <Separator />

        {/* Overlay Components */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">오버레이</h2>
          <div className="flex flex-wrap gap-3">
            {/* Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Dialog 열기</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>다이얼로그 제목</DialogTitle>
                  <DialogDescription>
                    다이얼로그 설명 텍스트입니다. 중요한 정보나 확인을 요청할 때 사용합니다.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">취소</Button>
                  <Button>확인</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Settings className="size-4" />
                  드롭다운
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="size-4" />
                  프로필
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Mail className="size-4" />
                  메시지
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="size-4" />
                  설정
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <X className="size-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Tooltip */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Info className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>툴팁 내용입니다.</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </Container>
  )
}
