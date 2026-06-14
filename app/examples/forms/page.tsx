import type { Metadata } from "next"
import { Container } from "@/components/layout/container"
import { ProfileForm } from "@/components/examples/profile-form"

export const metadata: Metadata = {
  title: "폼 예제",
}

export default function FormsPage() {
  return (
    <Container className="py-12 max-w-2xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">폼 예제</h1>
        <p className="mt-2 text-muted-foreground">
          react-hook-form + zod 유효성 검사 예시입니다.
        </p>
      </div>
      <ProfileForm />
    </Container>
  )
}
