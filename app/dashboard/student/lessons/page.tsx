"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function StudentLessonsPage() {
  const [selectedDay, setSelectedDay] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  // Mock data for lessons
  const lessons = [
    {
      id: 1,
      day: "Monday",
      startTime: "08:00",
      endTime: "09:30",
      courseName: "Introduction to Computer Science",
      courseType: "COUR",
      location: "Amphitheater A",
      teacher: "Dr. Mohammed Alaoui",
    },
    {
      id: 2,
      day: "Monday",
      startTime: "10:00",
      endTime: "11:30",
      courseName: "Programming Fundamentals",
      courseType: "TD",
      location: "Room 101",
      teacher: "Dr. Mohammed Alaoui",
    },
    {
      id: 3,
      day: "Tuesday",
      startTime: "13:00",
      endTime: "14:30",
      courseName: "Data Structures",
      courseType: "COUR",
      location: "Amphitheater B",
      teacher: "Dr. Fatima Zahra",
    },
    {
      id: 4,
      day: "Wednesday",
      startTime: "08:00",
      endTime: "11:00",
      courseName: "Data Structures",
      courseType: "TP",
      location: "Lab 3",
      teacher: "Dr. Fatima Zahra",
    },
    {
      id: 5,
      day: "Thursday",
      startTime: "10:00",
      endTime: "11:30",
      courseName: "Linear Algebra",
      courseType: "COUR",
      location: "Amphitheater C",
      teacher: "Dr. Ahmed Benali",
    },
  ]

  const filteredLessons = lessons.filter((lesson) => {
    return (
      (selectedDay === "all" || lesson.day === selectedDay) &&
      (selectedType === "all" || lesson.courseType === selectedType)
    )
  })

  const getSessionTypeBadge = (type: string) => {
    switch (type) {
      case "COUR":
        return <Badge className="bg-blue-100 text-blue-800">Lecture</Badge>
      case "TD":
        return <Badge className="bg-green-100 text-green-800">Directed Work</Badge>
      case "TP":
        return <Badge className="bg-amber-100 text-amber-800">Practical Work</Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Lessons</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Lessons</CardTitle>
          <CardDescription>Select criteria to filter your lessons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="day">Day</Label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger id="day">
                  <SelectValue placeholder="All days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All days</SelectItem>
                  <SelectItem value="Monday">Monday</SelectItem>
                  <SelectItem value="Tuesday">Tuesday</SelectItem>
                  <SelectItem value="Wednesday">Wednesday</SelectItem>
                  <SelectItem value="Thursday">Thursday</SelectItem>
                  <SelectItem value="Friday">Friday</SelectItem>
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Schedule</CardTitle>
          <CardDescription>
            Showing {filteredLessons.length} of {lessons.length} lessons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Teacher</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLessons.length > 0 ? (
                filteredLessons.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell>{lesson.day}</TableCell>
                    <TableCell>
                      {lesson.startTime} - {lesson.endTime}
                    </TableCell>
                    <TableCell>{lesson.courseName}</TableCell>
                    <TableCell>{getSessionTypeBadge(lesson.courseType)}</TableCell>
                    <TableCell>{lesson.location}</TableCell>
                    <TableCell>{lesson.teacher}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No lessons found matching your criteria
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
