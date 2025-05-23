import { type NextRequest, NextResponse } from "next/server"
import { validateQRCode, recordAttendance } from "@/lib/db-supabase"

export async function POST(request: NextRequest) {
  try {
    // Get the QR code from the request body
    const { qrCode, studentId } = await request.json()

    if (!qrCode || !studentId) {
      return NextResponse.json({ message: "QR code and student ID are required" }, { status: 400 })
    }

    // Validate the QR code
    const validatedQR = await validateQRCode(qrCode)

    if (!validatedQR) {
      return NextResponse.json({ message: "Invalid or expired QR code" }, { status: 400 })
    }

    // Record the attendance
    const attendance = await recordAttendance(studentId, validatedQR.course_id, "present")

    return NextResponse.json({
      message: "Attendance recorded successfully",
      attendance,
      course: {
        name: validatedQR.course_name,
        type: validatedQR.course_type,
      },
    })
  } catch (error) {
    console.error("Error recording attendance:", error)
    return NextResponse.json({ message: "Failed to record attendance" }, { status: 500 })
  }
}
