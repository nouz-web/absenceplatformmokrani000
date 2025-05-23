import type { Metadata } from "next"
import { getCurrentUser } from "@/lib/auth"
import { getActiveNotifications } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell } from "lucide-react"

export const metadata: Metadata = {
  title: "Notifications | Absence Management Platform",
  description: "View your notifications",
}

export default async function NotificationsPage() {
  const user = await getCurrentUser()
  const notifications = await getActiveNotifications()

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
      </div>

      <div className="grid gap-6">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{notification.title}</CardTitle>
                <CardDescription>{new Date(notification.created_at).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{notification.message}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <Bell className="h-10 w-10 text-gray-400 mb-4" />
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm text-gray-500 mt-1">You don't have any notifications at the moment</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
