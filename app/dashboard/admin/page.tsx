import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BookOpen, Calendar, GraduationCap, Info, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminDashboard() {
  const user = await getCurrentUser()

  if (!user || user.userType !== "admin") {
    redirect("/login?type=admin")
  }

  // In a real implementation, these would be fetched from the database
  const stats = {
    totalStudents: 1250,
    totalTeachers: 85,
    totalCourses: 120,
    totalPrograms: 15,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Administration Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Academic Year 2023-2024</AlertTitle>
        <AlertDescription>
          The current semester is in progress. Make sure all courses and timetables are properly configured.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Registered in the system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeachers}</div>
            <p className="text-xs text-muted-foreground">Active faculty members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">Across all programs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Academic Programs</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPrograms}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
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
            <Link href="/dashboard/admin/programs">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Manage Academic Programs
              </Button>
            </Link>
            <Link href="/dashboard/admin/modules">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Manage Modules
              </Button>
            </Link>
            <Link href="/dashboard/admin/reports">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                View Attendance Reports
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">New course added</p>
                  <p className="text-xs text-muted-foreground">Advanced Algorithms (CS401)</p>
                </div>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">Timetable updated</p>
                  <p className="text-xs text-muted-foreground">Computer Science Department</p>
                </div>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">New teacher assigned</p>
                  <p className="text-xs text-muted-foreground">Dr. Ahmed Benali to Database Systems</p>
                </div>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">Semester schedule finalized</p>
                  <p className="text-xs text-muted-foreground">Spring 2024</p>
                </div>
                <p className="text-xs text-muted-foreground">1 week ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
