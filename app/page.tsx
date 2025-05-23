import Image from "next/image"
import { CurrentDate } from "@/components/current-date"
import { UserTypeCard } from "@/components/user-type-card"
import { NotificationBanner } from "@/components/notification-banner"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Image
              src="/logo.png"
              alt="Abbes Laghrour University Khenchela Logo"
              width={80}
              height={80}
              className="mr-4"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Abbes Laghrour University Khenchela
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Absence Management Platform</p>
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <CurrentDate />
          </div>
        </div>
      </header>

      <NotificationBanner
        title="Notification System Maintenance"
        message="The notifications page (/dashboard/notifications) is currently not working. Our technical team is working to resolve this issue."
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Welcome to the Absence Management Platform
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This platform helps manage student attendance using QR codes. Please select your user type below to log
              in.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <UserTypeCard
              title="Student"
              description="Scan QR codes to register attendance and manage your absences"
              color="blue"
              icon="👨‍🎓"
              href="/login?type=student"
            />
            <UserTypeCard
              title="Teacher"
              description="Generate QR codes and track student attendance"
              color="green"
              icon="👨‍🏫"
              href="/login?type=teacher"
            />
            <UserTypeCard
              title="Administration"
              description="Manage programs, modules, and view reports"
              color="purple"
              icon="👨‍💼"
              href="/login?type=admin"
            />
            <UserTypeCard
              title="Technical Administrator"
              description="Manage users, system settings, and monitor performance"
              color="red"
              icon="👨‍💻"
              href="/login?type=tech-admin"
            />
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Abbes Laghrour University Khenchela. All rights reserved.</p>
            <p className="mt-1">Designed for University 4.0 - Absence Management Platform</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
