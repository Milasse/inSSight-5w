import type React from "react"
import { getServerSession } from "next-auth/react"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin/sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Check if user is authenticated and has admin role
  if (!session || !["admin", "dept_head"].includes(session.user.role as string)) {
    redirect("/auth/signin?callbackUrl=/admin/dashboard")
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  )
}
