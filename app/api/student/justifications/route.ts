import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data: justifications, error } = await supabase
      .from("justifications")
      .select(`
        *,
        modules (
          name,
          code
        ),
        attendance (
          date,
          status
        )
      `)
      .eq("student_id", studentId)
      .order("submitted_at", { ascending: false })

    if (error) {
      console.error("Error fetching justifications:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ justifications })
  } catch (error: any) {
    console.error("Error in GET /api/student/justifications:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const studentId = formData.get("studentId") as string
    const moduleId = formData.get("moduleId") as string
    const absenceDate = formData.get("absenceDate") as string
    const reason = formData.get("reason") as string
    const file = formData.get("file") as File

    if (!studentId || !moduleId || !absenceDate || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()

    // البحث عن سجل الغياب المطابق
    const { data: attendanceRecord, error: attendanceError } = await supabase
      .from("attendance")
      .select("id")
      .eq("student_id", studentId)
      .eq("module_id", moduleId)
      .eq("status", "absent")
      .gte("date", absenceDate)
      .lt("date", new Date(new Date(absenceDate).getTime() + 24 * 60 * 60 * 1000).toISOString())
      .single()

    if (attendanceError || !attendanceRecord) {
      return NextResponse.json({ error: "No matching absence record found" }, { status: 404 })
    }

    // رفع الملف (في التطبيق الحقيقي، سيتم رفعه إلى خدمة تخزين)
    const filePath = file ? `/uploads/justifications/${Date.now()}_${file.name}` : null

    // إنشاء التبرير
    const { data: justification, error: justificationError } = await supabase
      .from("justifications")
      .insert({
        student_id: studentId,
        module_id: Number.parseInt(moduleId),
        attendance_id: attendanceRecord.id,
        file_path: filePath || reason, // في حالة عدم وجود ملف، نحفظ السبب
        status: "pending",
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (justificationError) {
      console.error("Error creating justification:", justificationError)
      return NextResponse.json({ error: "Failed to submit justification" }, { status: 500 })
    }

    // إرسال إشعار للأستاذ المسؤول (سيتم تطويره لاحقاً)
    // TODO: إرسال إشعار للأستاذ وإدارة القسم

    return NextResponse.json({
      message: "Justification submitted successfully",
      justification,
    })
  } catch (error: any) {
    console.error("Error in POST /api/student/justifications:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
