import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getCoursesByTeacher, getJustificationsByTeacher } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BookOpen, Calendar, FileCheck, Info, QrCode, List } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function TeacherDashboard() {
  const user = await getCurrentUser()

  if (!user || user.userType !== "teacher") {
    redirect("/login?type=teacher")
  }

  const courses = await getCoursesByTeacher(user.id)
  const justifications = await getJustificationsByTeacher(user.id)
  const pendingJustifications = justifications.filter((j: any) => j.status === "pending")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}</p>
      </div>

      {pendingJustifications.length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Pending Justifications</AlertTitle>
          <AlertDescription>
            You have {pendingJustifications.length} pending justification{pendingJustifications.length !== 1 ? "s" : ""}{" "}
            to review.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">
              {courses.filter((c: any) => c.type === "COUR").length} lectures,{" "}
              {courses.filter((c: any) => c.type === "TD").length} TDs,{" "}
              {courses.filter((c: any) => c.type === "TP").length} TPs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Justifications</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingJustifications.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingJustifications.length === 0 ? "No pending justifications" : "Waiting for your review"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{/* This would need to be fetched from the database */}2</div>
            <p className="text-xs text-muted-foreground">1 lecture, 1 TD session</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to perform</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link href="/dashboard/teacher/qr-code">
              <Button variant="outline" className="w-full justify-start">
                <QrCode className="mr-2 h-4 w-4" />
                Generate QR Code
              </Button>
            </Link>
            <Link href="/dashboard/teacher/attendance">
              <Button variant="outline" className="w-full justify-start">
                <List className="mr-2 h-4 w-4" />
                View Attendance Records
              </Button>
            </Link>
            <Link href="/dashboard/teacher/justifications">
              <Button variant="outline" className="w-full justify-start">
                <FileCheck className="mr-2 h-4 w-4" />
                Review Justifications
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
            <CardDescription>Your assigned courses for this semester</CardDescription>
          </CardHeader>
          <CardContent>
            {courses.length > 0 ? (
              <div className="space-y-2">
                {courses.slice(0, 5).map((course: any) => (
                  <div key={course.id} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium">{course.name}</span>
                      <span className="text-muted-foreground"> ({course.type})</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Semester {course.semester}</div>
                  </div>
                ))}
                {courses.length > 5 && (
                  <div className="text-xs text-muted-foreground text-center pt-2">
                    + {courses.length - 5} more courses
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No courses assigned yet.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
