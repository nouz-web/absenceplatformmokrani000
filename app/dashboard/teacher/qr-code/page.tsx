"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import Image from "next/image"

// Mock data for courses
const courses = [
  { id: 1, name: "Introduction to Computer Science", type: "COUR" },
  { id: 2, name: "Programming Fundamentals", type: "TD" },
  { id: 3, name: "Data Structures", type: "TP" },
]

export default function QRCodePage() {
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [qrCodeValue, setQrCodeValue] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [isActive, setIsActive] = useState(false)

  // Function to generate a QR code
  const generateQRCode = async () => {
    if (!selectedCourse) {
      toast({
        title: "Error",
        description: "Please select a course first",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Generate a unique code for this session
      const timestamp = new Date().getTime()
      const randomPart = Math.floor(Math.random() * 10000)
      const courseId = selectedCourse
      const newQrValue = `COURSE-${courseId}-${timestamp}-${randomPart}`
      setQrCodeValue(newQrValue)

      // Generate QR code URL using a public API
      const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        newQrValue,
      )}`
      setQrCodeUrl(qrCodeApiUrl)

      // Reset and start the timer
      setTimeLeft(600)
      setIsActive(true)

      toast({
        title: "QR Code Generated",
        description: "The QR code will expire in 10 minutes",
      })
    } catch (error) {
      console.error("Error generating QR code:", error)
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Function to format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
      setQrCodeUrl("")
      setQrCodeValue("")
      toast({
        title: "QR Code Expired",
        description: "Please generate a new QR code",
      })
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft])

  // Get the selected course name
  const getSelectedCourseName = () => {
    const course = courses.find((c) => c.id.toString() === selectedCourse)
    return course ? course.name : ""
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Generate QR Code</h1>

      <Card>
        <CardHeader>
          <CardTitle>Attendance QR Code</CardTitle>
          <CardDescription>Generate a QR code for students to scan and register their attendance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="course">Select Course</Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger id="course">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.name} ({course.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {qrCodeUrl && (
            <div className="flex flex-col items-center space-y-4 mt-4">
              <div className="relative bg-white p-4 rounded-lg">
                <Image
                  src={qrCodeUrl || "/placeholder.svg"}
                  alt="QR Code"
                  width={200}
                  height={200}
                  className="mx-auto"
                  priority
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">QR Code for: {getSelectedCourseName()}</p>
                <p className="text-sm font-medium">Expires in: {formatTime(timeLeft)}</p>
                <p className="text-xs mt-2 max-w-xs mx-auto">
                  Students should scan this code with the Absence Management app to register their attendance
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={generateQRCode} disabled={isGenerating || !selectedCourse} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : qrCodeUrl ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate QR Code
              </>
            ) : (
              "Generate QR Code"
            )}
          </Button>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  )
}
