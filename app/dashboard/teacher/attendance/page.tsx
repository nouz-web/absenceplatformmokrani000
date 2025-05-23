"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, Search, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AttendanceRecordsPage() {
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedDate, setSelectedDate] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [exportFormat, setExportFormat] = useState("pdf")
  const [showExportOptions, setShowExportOptions] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  const [courses, setCourses] = useState([
    { id: "CS101", name: "Introduction to Computer Science", type: "COUR" },
    { id: "CS102", name: "Programming Fundamentals", type: "TD" },
    { id: "CS103", name: "Data Structures", type: "TP" },
    { id: "MATH201", name: "Linear Algebra", type: "COUR" },
  ])
  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      id: "1",
      studentId: "S12345",
      studentName: "Ahmed Benali",
      status: "present",
      date: "2023-05-15",
      courseId: "CS101",
      type: "COUR",
    },
    {
      id: "2",
      studentId: "S12346",
      studentName: "Fatima Zahra",
      status: "absent",
      justificationStatus: "pending",
      date: "2023-05-15",
      courseId: "CS101",
      type: "COUR",
    },
    {
      id: "3",
      studentId: "S12347",
      studentName: "Mohammed Alaoui",
      status: "absent",
      justificationStatus: "approved",
      date: "2023-05-15",
      courseId: "CS101",
      type: "COUR",
    },
    {
      id: "4",
      studentId: "S12348",
      studentName: "Amina Tazi",
      status: "present",
      date: "2023-05-15",
      courseId: "CS101",
      type: "COUR",
    },
    {
      id: "5",
      studentId: "S12349",
      studentName: "Youssef Mansouri",
      status: "absent",
      justificationStatus: "rejected",
      date: "2023-05-15",
      courseId: "CS101",
      type: "COUR",
    },
  ])

  const filteredRecords = attendanceRecords.filter((record) => {
    return (
      (selectedCourse === "all" || record.courseId === selectedCourse) &&
      (selectedType === "all" || record.type === selectedType) &&
      (!selectedDate || record.date === selectedDate) &&
      (!searchQuery ||
        record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.studentId.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  const getStatusBadge = (record: any) => {
    if (record.status === "present") {
      return <Badge className="bg-green-100 text-green-800">Present</Badge>
    } else if (record.justificationStatus === "approved") {
      return <Badge className="bg-yellow-100 text-yellow-800">Justified</Badge>
    } else if (record.justificationStatus === "pending") {
      return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800">Absent</Badge>
    }
  }

  const exportAttendance = () => {
    // In a real implementation, this would generate a file in the selected format
    setTimeout(() => {
      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 3000)
    }, 1000)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Attendance Records</h1>
        <Button onClick={() => setShowExportOptions(!showExportOptions)}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {showExportOptions && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
            <CardDescription>Select format and options for your export</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="format">
              <TabsList className="mb-4">
                <TabsTrigger value="format">Format</TabsTrigger>
                <TabsTrigger value="options">Options</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="format">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="format">Export Format</Label>
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                      <SelectTrigger id="format">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="csv">CSV File</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="include-details">Include Details</Label>
                    <Select defaultValue="summary">
                      <SelectTrigger id="include-details">
                        <SelectValue placeholder="Select detail level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary">Summary Only</SelectItem>
                        <SelectItem value="detailed">Detailed Report</SelectItem>
                        <SelectItem value="full">Full Report with Justifications</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button onClick={exportAttendance} className="w-full">
                      Generate {exportFormat.toUpperCase()}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="options">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="include-header">Include Header</Label>
                    <Select defaultValue="yes">
                      <SelectTrigger id="include-header">
                        <SelectValue placeholder="Include header?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="include-logo">Include University Logo</Label>
                    <Select defaultValue="yes">
                      <SelectTrigger id="include-logo">
                        <SelectValue placeholder="Include logo?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="schedule">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-export">Schedule Export</Label>
                    <Select defaultValue="no">
                      <SelectTrigger id="schedule-export">
                        <SelectValue placeholder="Schedule export?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-export">Email Export</Label>
                    <Select defaultValue="yes">
                      <SelectTrigger id="email-export">
                        <SelectValue placeholder="Email export?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {exportSuccess && (
              <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Your {exportFormat.toUpperCase()} has been generated successfully. Check your downloads folder.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Records</CardTitle>
          <CardDescription>Select criteria to filter attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger id="course">
                  <SelectValue placeholder="All courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All courses</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Session Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="COUR">Lecture (COUR)</SelectItem>
                  <SelectItem value="TD">Directed Work (TD)</SelectItem>
                  <SelectItem value="TP">Practical Work (TP)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="flex">
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full"
                />
                {selectedDate && (
                  <Button variant="ghost" size="icon" onClick={() => setSelectedDate("")} className="ml-2">
                    <Calendar className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance List</CardTitle>
          <CardDescription>
            Showing {filteredRecords.length} of {attendanceRecords.length} records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.studentId}</TableCell>
                    <TableCell>{record.studentName}</TableCell>
                    <TableCell>{courses.find((c) => c.id === record.courseId)?.name || record.courseId}</TableCell>
                    <TableCell>
                      {record.type === "COUR" ? "Lecture" : record.type === "TD" ? "Directed Work" : "Practical Work"}
                    </TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(record)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No attendance records found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
