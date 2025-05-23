import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getStudentAttendance } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Clock, QrCode, Upload } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import BarChart from "@/components/ui/bar-chart" // Import BarChart
import FileCheck from "@/components/ui/file-check" // Import FileCheck

export default async function StudentDashboard() {
  const user = await getCurrentUser()

  if (!user || user.userType !== "student") {
    redirect("/login?type=student")
  }

  const attendance = await getStudentAttendance(user.id)

  // Count absences by type
  const absenceCount = {
    COUR: 0,
    TD: 0,
    TP: 0,
  }

  attendance.forEach((record: any) => {
    if (record.status === "absent") {
      absenceCount[record.course_type as keyof typeof absenceCount]++
    }
  })

  // Check if absence thresholds are exceeded
  const tdExceeded = absenceCount.TD >= 2
  const courExceeded = absenceCount.COUR >= 5

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}</p>
      </div>

      {(tdExceeded || courExceeded) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            {tdExceeded && <div>You have exceeded the allowed number of absences in TD sessions (2).</div>}
            {courExceeded && <div>You have exceeded the allowed number of absences in COUR sessions (5).</div>}
            Please submit justifications as soon as possible.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Absences</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendance.filter((record: any) => record.status === "absent").length}
            </div>
            <p className="text-xs text-muted-foreground">
              COUR: {absenceCount.COUR} | TD: {absenceCount.TD} | TP: {absenceCount.TP}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendance.length > 0
                ? Math.round(
                    (attendance.filter((record: any) => record.status === "present").length / attendance.length) * 100,
                  )
                : 100}
              %
            </div>
            <p className="text-xs text-muted-foreground">Based on {attendance.length} total sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Justifications</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{/* This would need to be fetched from the database */}0</div>
            <p className="text-xs text-muted-foreground">All justifications submitted</p>
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
            <Link href="/dashboard/student/scan">
              <Button variant="outline" className="w-full justify-start">
                <QrCode className="mr-2 h-4 w-4" />
                Scan QR Code
              </Button>
            </Link>
            <Link href="/dashboard/student/justifications">
              <Button variant="outline" className="w-full justify-start">
                <Upload className="mr-2 h-4 w-4" />
                Submit Justification
              </Button>
            </Link>
            <Link href="/dashboard/student/absences">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                View Absences
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Absences</CardTitle>
            <CardDescription>Your most recent absence records</CardDescription>
          </CardHeader>
          <CardContent>
            {attendance.filter((record: any) => record.status === "absent").slice(0, 5).length > 0 ? (
              <div className="space-y-2">
                {attendance
                  .filter((record: any) => record.status === "absent")
                  .slice(0, 5)
                  .map((record: any) => (
                    <div key={record.id} className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-medium">{record.course_name}</span>
                        <span className="text-muted-foreground"> ({record.course_type})</span>
                      </div>
                      <div className="text-muted-foreground">{new Date(record.date).toLocaleDateString()}</div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No recent absences. Keep up the good work!</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
