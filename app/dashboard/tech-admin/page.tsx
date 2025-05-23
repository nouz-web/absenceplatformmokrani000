import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Activity, AlertTriangle, Database, Server, Shield, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function TechAdminDashboard() {
  const user = await getCurrentUser()

  if (!user || user.userType !== "tech-admin") {
    redirect("/login?type=tech-admin")
  }

  // In a real implementation, these would be fetched from the database
  const stats = {
    totalUsers: 1350,
    activeUsers: 245,
    systemLoad: 32,
    databaseSize: 156,
    securityAlerts: 2,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Technical Administrator Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}</p>
      </div>

      {stats.securityAlerts > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Security Alerts</AlertTitle>
          <AlertDescription>
            There are {stats.securityAlerts} security alerts that require your attention.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered in the system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Load</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.systemLoad}%</div>
            <p className="text-xs text-muted-foreground">CPU utilization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Size</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.databaseSize} MB</div>
            <p className="text-xs text-muted-foreground">SQLite database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.securityAlerts}</div>
            <p className="text-xs text-muted-foreground">Pending security issues</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link href="/dashboard/tech-admin/users">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Manage User Accounts
              </Button>
            </Link>
            <Link href="/dashboard/tech-admin/notifications">
              <Button variant="outline" className="w-full justify-start">
                <Activity className="mr-2 h-4 w-4" />
                Manage Notifications
              </Button>
            </Link>
            <Link href="/dashboard/tech-admin/settings">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="mr-2 h-4 w-4" />
                System Settings
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Logs</CardTitle>
            <CardDescription>Recent system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">Failed login attempt</p>
                  <p className="text-xs text-muted-foreground">User ID: T12345 - IP: 192.168.1.105</p>
                </div>
                <p className="text-xs text-muted-foreground">10 minutes ago</p>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">Database backup completed</p>
                  <p className="text-xs text-muted-foreground">Size: 156 MB - Duration: 45s</p>
                </div>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">New user account created</p>
                  <p className="text-xs text-muted-foreground">User ID: S54321 - Role: Student</p>
                </div>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">System update installed</p>
                  <p className="text-xs text-muted-foreground">Version: 2.3.1 - Security patches</p>
                </div>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
