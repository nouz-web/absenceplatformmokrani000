import type React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  console.log("Dashboard layout - Current user:", user)

  if (!user) {
    console.log("No user found, redirecting to login")
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />
      <div className="flex flex-1 relative">
        <aside className="hidden md:block w-64 border-r border-gray-200 dark:border-gray-800 shrink-0">
          <DashboardSidebar user={user} />
        </aside>
        <main className="flex-1 overflow-y-auto">
          <div className="page-container">{children}</div>
        </main>
      </div>
    </div>
  )
}
