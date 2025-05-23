"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  BarChart,
  BookOpen,
  Calendar,
  Home,
  QrCode,
  Settings,
  Users,
  Clock,
  FileCheck,
  Upload,
  List,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getUserTypeIcon, userTypeColors } from "@/lib/theme-config"

interface DashboardSidebarProps {
  user: {
    id: string
    name: string
    userType: string
  }
  isMobile?: boolean
}

export function DashboardSidebar({ user, isMobile = false }: DashboardSidebarProps) {
  const pathname = usePathname()
  const userColors = userTypeColors[user.userType as keyof typeof userTypeColors] || userTypeColors.student
  const userIcon = getUserTypeIcon(user.userType)

  const navItems = {
    student: [
      { href: "/dashboard/student", label: "Dashboard", icon: Home },
      { href: "/dashboard/student/scan", label: "Scan QR Code", icon: QrCode },
      { href: "/dashboard/student/absences", label: "My Absences", icon: Clock },
      { href: "/dashboard/student/justifications", label: "Submit Justification", icon: Upload },
      { href: "/dashboard/student/lessons", label: "Lessons", icon: BookOpen },
    ],
    teacher: [
      { href: "/dashboard/teacher", label: "Dashboard", icon: Home },
      { href: "/dashboard/teacher/qr-code", label: "Generate QR Code", icon: QrCode },
      { href: "/dashboard/teacher/attendance", label: "Attendance Records", icon: List },
      { href: "/dashboard/teacher/justifications", label: "Pending Justifications", icon: FileCheck },
    ],
    admin: [
      { href: "/dashboard/admin", label: "Dashboard", icon: Home },
      { href: "/dashboard/admin/programs", label: "Programs", icon: Calendar },
      { href: "/dashboard/admin/modules", label: "Modules", icon: BookOpen },
      { href: "/dashboard/admin/reports", label: "Reports", icon: BarChart },
    ],
    "tech-admin": [
      { href: "/dashboard/tech-admin", label: "Dashboard", icon: Home },
      { href: "/dashboard/tech-admin/users", label: "User Management", icon: Users },
      { href: "/dashboard/tech-admin/notifications", label: "Notifications", icon: Bell },
      { href: "/dashboard/tech-admin/statistics", label: "Statistics", icon: BarChart },
      { href: "/dashboard/tech-admin/settings", label: "System Settings", icon: Settings },
    ],
  }

  const items = navItems[user.userType as keyof typeof navItems] || []

  return (
    <nav
      className={cn("bg-white dark:bg-gray-950 border-r h-full", isMobile ? "w-full" : "w-64 hidden md:block shrink-0")}
      style={{ borderColor: userColors.secondary }}
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6 p-2 rounded-lg" style={{ backgroundColor: userColors.secondary }}>
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image
              src={userIcon || "/placeholder.svg"}
              alt={user.userType}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-medium text-sm">{user.name}</div>
            <div className="text-xs opacity-70" style={{ color: userColors.primary }}>
              {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive ? "font-medium" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
                )}
                style={
                  isActive
                    ? {
                        backgroundColor: userColors.secondary,
                        color: userColors.primary,
                      }
                    : {}
                }
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
