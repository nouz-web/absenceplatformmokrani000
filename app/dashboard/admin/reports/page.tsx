"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, AlertCircle, FileText, FileSpreadsheet, FileSpreadsheetIcon as FileCsv } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

export default function ReportsPage() {
  const [selectedProgram, setSelectedProgram] = useState("all")
  const [selectedModule, setSelectedModule] = useState("all")
  const [selectedPeriod, setSelectedPeriod] = useState("semester")
  const [exportFormat, setExportFormat] = useState("pdf")
  const [exportSuccess, setExportSuccess] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Mock data for programs
  const programs = [
    { id: 1, name: "Computer Science", level: "license" },
    { id: 2, name: "Mathematics", level: "license" },
    { id: 3, name: "Physics", level: "license" },
    { id: 4, name: "Computer Engineering", level: "master" },
  ]

  // Mock data for modules
  const modules = [
    { id: 1, code: "CS101", name: "Introduction to Computer Science", program: "Computer Science" },
    { id: 2, code: "CS102", name: "Programming Fundamentals", program: "Computer Science" },
    { id: 3, code: "MATH101", name: "Calculus I", program: "Mathematics" },
    { id: 4, code: "PHYS101", name: "Mechanics", program: "Physics" },
  ]

  // Mock data for attendance statistics
  const attendanceStats = [
    {
      program: "Computer Science",
      module: "CS101",
      totalSessions: 24,
      totalStudents: 120,
      presentRate: 85,
      absentRate: 15,
      justifiedRate: 10,
    },
    {
      program: "Computer Science",
      module: "CS102",
      totalSessions: 24,
      totalStudents: 118,
      presentRate: 82,
      absentRate: 18,
      justifiedRate: 12,
    },
    {
      program: "Mathematics",
      module: "MATH101",
      totalSessions: 24,
      totalStudents: 85,
      presentRate: 88,
      absentRate: 12,
      justifiedRate: 8,
    },
    {
      program: "Physics",
      module: "PHYS101",
      totalSessions: 24,
      totalStudents: 65,
      presentRate: 90,
      absentRate: 10,
      justifiedRate: 7,
    },
  ]

  // Mock data for student attendance
  const studentAttendance = [
    {
      id: "S12345",
      name: "Ahmed Benali",
      program: "Computer Science",
      module: "CS101",
      presentRate: 75,
      absentRate: 25,
      justifiedRate: 15,
      unjustifiedRate: 10,
    },
    {
      id: "S12346",
      name: "Fatima Zahra",
      program: "Computer Science",
      module: "CS101",
      presentRate: 92,
      absentRate: 8,
      justifiedRate: 8,
      unjustifiedRate: 0,
    },
    {
      id: "S12347",
      name: "Mohammed Alaoui",
      program: "Computer Science",
      module: "CS101",
      presentRate: 83,
      absentRate: 17,
      justifiedRate: 12,
      unjustifiedRate: 5,
    },
    {
      id: "S12348",
      name: "Amina Tazi",
      program: "Mathematics",
      module: "MATH101",
      presentRate: 96,
      absentRate: 4,
      justifiedRate: 4,
      unjustifiedRate: 0,
    },
    {
      id: "S12349",
      name: "Youssef Mansouri",
      program: "Physics",
      module: "PHYS101",
      presentRate: 88,
      absentRate: 12,
      justifiedRate: 8,
      unjustifiedRate: 4,
    },
  ]

  const filteredStats = attendanceStats.filter((stat) => {
    return (
      (selectedProgram === "all" || stat.program === selectedProgram) &&
      (selectedModule === "all" || stat.module === selectedModule)
    )
  })

  const filteredStudents = studentAttendance.filter((student) => {
    return (
      (selectedProgram === "all" || student.program === selectedProgram) &&
      (selectedModule === "all" || student.module === selectedModule)
    )
  })

  const exportReport = () => {
    setIsExportDialogOpen(true)
  }

  const handleExport = () => {
    setIsExporting(true)

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false)
      setIsExportDialogOpen(false)
      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 3000)
    }, 2000)
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "excel":
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />
      case "csv":
        return <FileCsv className="h-5 w-5 text-blue-500" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Attendance Reports</h1>
        <Button onClick={exportReport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {exportSuccess && (
        <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Export Successful</AlertTitle>
          <AlertDescription>
            Your report has been exported successfully in {exportFormat.toUpperCase()} format. Check your downloads
            folder.
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Reports</CardTitle>
          <CardDescription>Select criteria to filter attendance reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="program">Program</Label>
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger id="program">
                  <SelectValue placeholder="All programs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All programs</SelectItem>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.name}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="module">Module</Label>
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger id="module">
                  <SelectValue placeholder="All modules" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All modules</SelectItem>
                  {modules
                    .filter((module) => selectedProgram === "all" || module.program === selectedProgram)
                    .map((module) => (
                      <SelectItem key={module.id} value={module.code}>
                        {module.code}: {module.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger id="period">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semester">Current Semester</SelectItem>
                  <SelectItem value="year">Academic Year</SelectItem>
                  <SelectItem value="custom">Custom Period</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedPeriod === "custom" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input id="start-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input id="end-date" type="date" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="summary">
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="students">Student Details</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
              <CardDescription>
                Overall attendance statistics for {selectedProgram === "all" ? "all programs" : selectedProgram}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Attendance Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {filteredStats.length > 0
                        ? Math.round(
                            filteredStats.reduce((acc, stat) => acc + stat.presentRate, 0) / filteredStats.length,
                          )
                        : 0}
                      %
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Absence Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {filteredStats.length > 0
                        ? Math.round(
                            filteredStats.reduce((acc, stat) => acc + stat.absentRate, 0) / filteredStats.length,
                          )
                        : 0}
                      %
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Justified Absences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {filteredStats.length > 0
                        ? Math.round(
                            filteredStats.reduce((acc, stat) => acc + stat.justifiedRate, 0) / filteredStats.length,
                          )
                        : 0}
                      %
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Program</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Total Students</TableHead>
                    <TableHead>Total Sessions</TableHead>
                    <TableHead>Present Rate</TableHead>
                    <TableHead>Absent Rate</TableHead>
                    <TableHead>Justified Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStats.length > 0 ? (
                    filteredStats.map((stat, index) => (
                      <TableRow key={index}>
                        <TableCell>{stat.program}</TableCell>
                        <TableCell>{stat.module}</TableCell>
                        <TableCell>{stat.totalStudents}</TableCell>
                        <TableCell>{stat.totalSessions}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">{stat.presentRate}%</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-red-100 text-red-800">{stat.absentRate}%</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800">{stat.justifiedRate}%</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No data available for the selected criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Student Attendance Details</CardTitle>
              <CardDescription>Individual student attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Absent</TableHead>
                    <TableHead>Justified</TableHead>
                    <TableHead>Unjustified</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.id}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.program}</TableCell>
                        <TableCell>{student.module}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">{student.presentRate}%</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-red-100 text-red-800">{student.absentRate}%</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800">{student.justifiedRate}%</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-amber-100 text-amber-800">{student.unjustifiedRate}%</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                        No student data available for the selected criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Report</DialogTitle>
            <DialogDescription>Choose your export format and options</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="export-format">Export Format</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={exportFormat === "pdf" ? "default" : "outline"}
                  className="flex flex-col items-center justify-center h-24 p-2"
                  onClick={() => setExportFormat("pdf")}
                >
                  <FileText className="h-8 w-8 mb-2" />
                  <span>PDF</span>
                </Button>
                <Button
                  variant={exportFormat === "excel" ? "default" : "outline"}
                  className="flex flex-col items-center justify-center h-24 p-2"
                  onClick={() => setExportFormat("excel")}
                >
                  <FileSpreadsheet className="h-8 w-8 mb-2" />
                  <span>Excel</span>
                </Button>
                <Button
                  variant={exportFormat === "csv" ? "default" : "outline"}
                  className="flex flex-col items-center justify-center h-24 p-2"
                  onClick={() => setExportFormat("csv")}
                >
                  <FileCsv className="h-8 w-8 mb-2" />
                  <span>CSV</span>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Include in Report</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-summary" defaultChecked />
                  <label
                    htmlFor="include-summary"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Summary Statistics
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-details" defaultChecked />
                  <label
                    htmlFor="include-details"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Student Details
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-charts" defaultChecked />
                  <label
                    htmlFor="include-charts"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Charts and Graphs
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-logo" defaultChecked />
                  <label
                    htmlFor="include-logo"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    University Logo
                  </label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <span>Exporting...</span>
              ) : (
                <span className="flex items-center">
                  {getFormatIcon(exportFormat)}
                  <span className="ml-2">Export as {exportFormat.toUpperCase()}</span>
                </span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
