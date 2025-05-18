import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const session = await getServerSession(authOptions)

  // Redirect based on user role
  if (session) {
    if (session.user.role === "student") {
      redirect("/checkin")
    } else if (["admin", "dept_head"].includes(session.user.role as string)) {
      redirect("/admin/dashboard")
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to inSSIght</h1>
        <p className="text-xl mb-8">Student Success Initiative Platform</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/checkin">Student Check-In</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/auth/signin">Admin Login</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
