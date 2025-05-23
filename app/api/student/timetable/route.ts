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

    // الحصول على مجموعة الطالب
    const { data: studentGroup, error: groupError } = await supabase
      .from("student_groups")
      .select(`
        groups (
          id,
          name,
          specializations (
            name
          )
        )
      `)
      .eq("student_id", studentId)
      .single()

    if (groupError || !studentGroup) {
      return NextResponse.json({ error: "Student group not found" }, { status: 404 })
    }

    // الحصول على الجدول الزمني للمجموعة
    const { data: timetable, error: timetableError } = await supabase
      .from("timetable")
      .select(`
        *,
        modules (
          name,
          code,
          theory_hours,
          practical_hours,
          directed_work_hours,
          coefficient,
          credits
        ),
        users!timetable_teacher_id_fkey (
          name
        )
      `)
      .eq("group_id", studentGroup.groups.id)
      .order("day_of_week")
      .order("start_time")

    if (timetableError) {
      console.error("Error fetching timetable:", timetableError)
      return NextResponse.json({ error: timetableError.message }, { status: 500 })
    }

    // تنظيم الجدول حسب الأيام
    const organizedTimetable = {
      1: [], // الاثنين
      2: [], // الثلاثاء
      3: [], // الأربعاء
      4: [], // الخميس
      5: [], // الجمعة
      6: [], // السبت
      7: [], // الأحد
    }

    timetable.forEach((session) => {
      organizedTimetable[session.day_of_week].push(session)
    })

    return NextResponse.json({
      group: studentGroup.groups,
      timetable: organizedTimetable,
    })
  } catch (error: any) {
    console.error("Error in GET /api/student/timetable:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
