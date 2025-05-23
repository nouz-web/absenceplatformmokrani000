import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { qrCode, studentId } = await request.json()

    if (!qrCode || !studentId) {
      return NextResponse.json({ message: "QR code and student ID are required" }, { status: 400 })
    }

    // Validate the QR code
    const { data: qrData, error: qrError } = await supabase
      .from("qr_codes")
      .select("*, timetable:timetable_id(*)")
      .eq("code", qrCode)
      .eq("is_active", true)
      .single()

    if (qrError || !qrData) {
      return NextResponse.json({ message: "Invalid or expired QR code" }, { status: 400 })
    }

    // Check if the QR code is still valid (not expired)
    if (new Date(qrData.expires_at) < new Date()) {
      return NextResponse.json({ message: "QR code has expired" }, { status: 400 })
    }

    // Get timetable and module information
    const { data: timetableData, error: timetableError } = await supabase
      .from("timetable")
      .select("*, module:module_id(*)")
      .eq("id", qrData.timetable_id)
      .single()

    if (timetableError || !timetableData) {
      return NextResponse.json({ message: "Failed to retrieve session information" }, { status: 500 })
    }

    // Check if student is already marked for this session
    const { data: existingAttendance, error: attendanceCheckError } = await supabase
      .from("attendance")
      .select("*")
      .eq("student_id", studentId)
      .eq("timetable_id", qrData.timetable_id)
      .eq("date", new Date().toISOString().split("T")[0])

    if (existingAttendance && existingAttendance.length > 0) {
      return NextResponse.json({
        message: "You have already registered your attendance for this session",
        attendance: existingAttendance[0],
        module: {
          name: timetableData.module.name,
          code: timetableData.module.code,
        },
        session: {
          type: timetableData.session_type,
          room: timetableData.room,
          time: `${timetableData.start_time} - ${timetableData.end_time}`,
        },
      })
    }

    // Record the attendance
    const { data: attendance, error: insertError } = await supabase
      .from("attendance")
      .insert({
        student_id: studentId,
        module_id: timetableData.module_id,
        timetable_id: qrData.timetable_id,
        date: new Date(),
        status: "present",
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error recording attendance:", insertError)
      return NextResponse.json({ message: "Failed to record attendance" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Attendance recorded successfully",
      attendance,
      module: {
        name: timetableData.module.name,
        code: timetableData.module.code,
      },
      session: {
        type: timetableData.session_type,
        room: timetableData.room,
        time: `${timetableData.start_time} - ${timetableData.end_time}`,
      },
    })
  } catch (error) {
    console.error("Error recording attendance:", error)
    return NextResponse.json({ message: "Failed to record attendance" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const url = new URL(request.url)
    const studentId = url.searchParams.get("studentId")

    if (!studentId) {
      return NextResponse.json({ message: "Student ID is required" }, { status: 400 })
    }

    // Get attendance records for the student
    const { data, error } = await supabase
      .from("attendance")
      .select(`
        *,
        module:module_id(*),
        timetable:timetable_id(*)
      `)
      .eq("student_id", studentId)
      .order("date", { ascending: false })

    if (error) {
      console.error("Error fetching attendance:", error)
      return NextResponse.json({ message: "Failed to fetch attendance records" }, { status: 500 })
    }

    return NextResponse.json({
      attendance: data,
    })
  } catch (error) {
    console.error("Error fetching attendance:", error)
    return NextResponse.json({ message: "Failed to fetch attendance records" }, { status: 500 })
  }
}
