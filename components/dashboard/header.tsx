"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Bell, ChevronDown, LogOut, Menu, Moon, Sun, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CurrentDate } from "@/components/current-date"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { logout } from "@/lib/auth"
import { useTheme } from "next-themes"
import { getUserTypeLabel, userTypeColors } from "@/lib/theme-config"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DashboardHeaderProps {
  user: {
    id: string
    name: string
    userType: string
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Get user type specific colors
  const userColors = userTypeColors[user.userType as keyof typeof userTypeColors] || userTypeColors.student

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <header
      className="bg-white dark:bg-gray-950 border-b sticky top-0 z-30 shadow-sm"
      style={{
        borderColor: userColors.primary,
        borderBottomWidth: "3px",
      }}
    >
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-4 border-b" style={{ borderColor: userColors.primary }}>
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Menu</div>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
              </div>
              <div className="py-2">
                <DashboardSidebar user={user} isMobile />
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border">
              <Image
                src="/images/university-logo.png"
                alt="Abbas Laghrour University"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="hidden md:block">
              <div className="font-semibold text-sm">Abbas Laghrour University</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Attendance Management 4.0</div>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex items-center text-sm text-gray-600 dark:text-gray-400">
          <CurrentDate />
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/notifications">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2" style={{ color: userColors.primary }}>
                <User className="h-4 w-4" />
                <span className="hidden sm:inline-block">{user.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{getUserTypeLabel(user.userType)}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
