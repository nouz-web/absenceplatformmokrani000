"use server"

import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"
import bcryptjs from "bcryptjs"
import { createServerClient } from "./supabase"

// Initialize the database schema
export async function initializeDb() {
  try {
    // No need to initialize Supabase as tables are already created
    return true
  } catch (error) {
    console.error("Database initialization error:", error)
    return false
  }
}

// Session management
export async function createSession(userId: string) {
  const supabase = createServerClient()
  const sessionId = uuidv4()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

  await supabase.from("sessions").insert({
    id: sessionId,
    user_id: userId,
    expires_at: expiresAt.toISOString(),
  })

  cookies().set("session_id", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  })

  return sessionId
}

export async function getUserFromSession() {
  const sessionId = cookies().get("session_id")?.value
  const supabase = createServerClient()

  if (!sessionId) return null

  const { data: session, error } = await supabase.from("sessions").select("*").eq("id", sessionId).single()

  if (error || !session || new Date(session.expires_at) <= new Date()) {
    cookies().delete("session_id")
    return null
  }

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, name, user_type")
    .eq("id", session.user_id)
    .single()

  if (userError || !user) {
    return null
  }

  return {
    id: user.id,
    name: user.name,
    userType: user.user_type,
  }
}

export async function deleteSession() {
  const sessionId = cookies().get("session_id")?.value
  const supabase = createServerClient()

  if (sessionId) {
    await supabase.from("sessions").delete().eq("id", sessionId)
    cookies().delete("session_id")
  }
}

// User functions
export async function createUser(id: string, name: string, password: string, userType: string) {
  const supabase = createServerClient()
  const hashedPassword = await bcryptjs.hash(password, 10)

  const { data, error } = await supabase
    .from("users")
    .insert({
      id,
      name,
      password: hashedPassword,
      user_type: userType,
      created_at: new Date().toISOString(),
    })
    .select()

  if (error) {
    console.error("Error creating user:", error)
    throw new Error("Failed to create user")
  }

  return { id, name, userType }
}

export async function getUserByIdAndPassword(id: string, password: string, userType: string) {
  const supabase = createServerClient()

  const { data: user, error } = await supabase.from("users").select("*").eq("id", id).eq("user_type", userType).single()

  if (error || !user) {
    return null
  }

  // For demo purposes, accept "password" for all users
  if (password === "password") {
    return {
      id: user.id,
      name: user.name,
      userType: user.user_type,
    }
  }

  const passwordMatch = await bcryptjs.compare(password, user.password)
  if (!passwordMatch) {
    return null
  }

  return {
    id: user.id,
    name: user.name,
    userType: user.user_type,
  }
}

export async function getAllUsers(userType?: string) {
  const supabase = createServerClient()
  let query = supabase.from("users").select("id, name, user_type, created_at")

  if (userType) {
    query = query.eq("user_type", userType)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error getting users:", error)
    return []
  }

  return data
}

export async function updateUser(id: string, data: any) {
  const supabase = createServerClient()
  const { error } = await supabase.from("users").update(data).eq("id", id)

  if (error) {
    console.error("Error updating user:", error)
    return null
  }

  const { data: updatedUser, error: fetchError } = await supabase
    .from("users")
    .select("id, name, user_type, created_at")
    .eq("id", id)
    .single()

  if (fetchError) {
    console.error("Error fetching updated user:", fetchError)
    return null
  }

  return updatedUser
}

export async function deleteUser(id: string) {
  const supabase = createServerClient()
  const { error } = await supabase.from("users").delete().eq("id", id)

  if (error) {
    console.error("Error deleting user:", error)
    return false
  }

  return true
}

// Course functions
export async function createCourse(name: string, type: string, teacherId: string, semester: number, year: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("courses")
    .insert({
      name,
      type,
      teacher_id: teacherId,
      semester,
      year,
    })
    .select()

  if (error) {
    console.error("Error creating course:", error)
    throw new Error("Failed to create course")
  }

  return data[0]
}

export async function getCoursesByTeacher(teacherId: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase.from("courses").select("*").eq("teacher_id", teacherId)

  if (error) {
    console.error("Error getting courses by teacher:", error)
    return []
  }

  return data
}

export async function getAllCourses() {
  const supabase = createServerClient()
  const { data: courses, error } = await supabase.from("courses").select("*")

  if (error) {
    console.error("Error getting all courses:", error)
    return []
  }

  // Get teacher names
  const teacherIds = [...new Set(courses.map((course) => course.teacher_id))]
  const { data: teachers, error: teacherError } = await supabase.from("users").select("id, name").in("id", teacherIds)

  if (teacherError) {
    console.error("Error getting teachers:", teacherError)
    return courses
  }

  const teacherMap = new Map(teachers.map((teacher) => [teacher.id, teacher.name]))

  return courses.map((course) => ({
    ...course,
    teacher_name: teacherMap.get(course.teacher_id) || "Unknown Teacher",
  }))
}

export async function updateCourse(id: number, data: any) {
  const supabase = createServerClient()
  const { error } = await supabase.from("courses").update(data).eq("id", id)

  if (error) {
    console.error("Error updating course:", error)
    return null
  }

  const { data: updatedCourse, error: fetchError } = await supabase.from("courses").select("*").eq("id", id).single()

  if (fetchError) {
    console.error("Error fetching updated course:", fetchError)
    return null
  }

  return updatedCourse
}

export async function deleteCourse(id: number) {
  const supabase = createServerClient()
  const { error } = await supabase.from("courses").delete().eq("id", id)

  if (error) {
    console.error("Error deleting course:", error)
    return false
  }

  return true
}

// Attendance functions
export async function recordAttendance(studentId: string, courseId: number, status: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("attendance")
    .insert({
      student_id: studentId,
      course_id: courseId,
      date: new Date().toISOString(),
      status,
    })
    .select()

  if (error) {
    console.error("Error recording attendance:", error)
    throw new Error("Failed to record attendance")
  }

  return data[0]
}

export async function getStudentAttendance(studentId: string) {
  const supabase = createServerClient()
  const { data: attendanceRecords, error } = await supabase.from("attendance").select("*").eq("student_id", studentId)

  if (error) {
    console.error("Error getting student attendance:", error)
    return []
  }

  // Get course information
  const courseIds = [...new Set(attendanceRecords.map((record) => record.course_id))]
  const { data: courses, error: courseError } = await supabase
    .from("courses")
    .select("id, name, type")
    .in("id", courseIds)

  if (courseError) {
    console.error("Error getting courses:", courseError)
    return attendanceRecords
  }

  const courseMap = new Map(courses.map((course) => [course.id, { name: course.name, type: course.type }]))

  return attendanceRecords.map((record) => ({
    ...record,
    course_name: courseMap.get(record.course_id)?.name || "Unknown Course",
    course_type: courseMap.get(record.course_id)?.type || "Unknown",
  }))
}

export async function getAttendanceForCourse(courseId: number) {
  const supabase = createServerClient()
  const { data: attendanceRecords, error } = await supabase.from("attendance").select("*").eq("course_id", courseId)

  if (error) {
    console.error("Error getting attendance for course:", error)
    return []
  }

  // Get student information
  const studentIds = [...new Set(attendanceRecords.map((record) => record.student_id))]
  const { data: students, error: studentError } = await supabase.from("users").select("id, name").in("id", studentIds)

  if (studentError) {
    console.error("Error getting students:", studentError)
    return attendanceRecords
  }

  const studentMap = new Map(students.map((student) => [student.id, student.name]))

  return attendanceRecords.map((record) => ({
    ...record,
    student_name: studentMap.get(record.student_id) || "Unknown Student",
  }))
}

export async function updateAttendance(id: number, status: string) {
  const supabase = createServerClient()
  const { error } = await supabase.from("attendance").update({ status }).eq("id", id)

  if (error) {
    console.error("Error updating attendance:", error)
    return null
  }

  const { data: updatedAttendance, error: fetchError } = await supabase
    .from("attendance")
    .select("*")
    .eq("id", id)
    .single()

  if (fetchError) {
    console.error("Error fetching updated attendance:", fetchError)
    return null
  }

  return updatedAttendance
}

// QR Code functions
export async function createQRCode(teacherId: string, courseId: number, code: string, expiresAt: Date) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("qr_codes")
    .insert({
      teacher_id: teacherId,
      course_id: courseId,
      code,
      created_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
    })
    .select()

  if (error) {
    console.error("Error creating QR code:", error)
    throw new Error("Failed to create QR code")
  }

  return data[0]
}

export async function validateQRCode(code: string) {
  const supabase = createServerClient()
  const { data: qrCode, error } = await supabase.from("qr_codes").select("*").eq("code", code).single()

  if (error || !qrCode || new Date(qrCode.expires_at) <= new Date()) {
    return null
  }

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("name, type")
    .eq("id", qrCode.course_id)
    .single()

  if (courseError) {
    console.error("Error getting course:", courseError)
    return {
      ...qrCode,
      course_name: "Unknown Course",
      course_type: "Unknown",
    }
  }

  return {
    ...qrCode,
    course_name: course.name,
    course_type: course.type,
  }
}

export async function getQRCodesByTeacher(teacherId: string) {
  const supabase = createServerClient()
  const { data: teacherQRCodes, error } = await supabase.from("qr_codes").select("*").eq("teacher_id", teacherId)

  if (error) {
    console.error("Error getting QR codes by teacher:", error)
    return []
  }

  // Get course information
  const courseIds = [...new Set(teacherQRCodes.map((qrCode) => qrCode.course_id))]
  const { data: courses, error: courseError } = await supabase
    .from("courses")
    .select("id, name, type")
    .in("id", courseIds)

  if (courseError) {
    console.error("Error getting courses:", courseError)
    return teacherQRCodes
  }

  const courseMap = new Map(courses.map((course) => [course.id, { name: course.name, type: course.type }]))

  return teacherQRCodes.map((qrCode) => ({
    ...qrCode,
    course_name: courseMap.get(qrCode.course_id)?.name || "Unknown Course",
    course_type: courseMap.get(qrCode.course_id)?.type || "Unknown",
  }))
}

// Justification functions
export async function submitJustification(studentId: string, attendanceId: number, filePath: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("justifications")
    .insert({
      student_id: studentId,
      attendance_id: attendanceId,
      file_path: filePath,
      status: "pending",
      submitted_at: new Date().toISOString(),
    })
    .select()

  if (error) {
    console.error("Error submitting justification:", error)
    throw new Error("Failed to submit justification")
  }

  return data[0]
}

export async function getJustificationsByStudent(studentId: string) {
  const supabase = createServerClient()
  const { data: studentJustifications, error } = await supabase
    .from("justifications")
    .select("*")
    .eq("student_id", studentId)

  if (error) {
    console.error("Error getting justifications by student:", error)
    return []
  }

  // Get attendance records
  const attendanceIds = [...new Set(studentJustifications.map((justification) => justification.attendance_id))]
  const { data: attendanceRecords, error: attendanceError } = await supabase
    .from("attendance")
    .select("id, course_id, date")
    .in("id", attendanceIds)

  if (attendanceError) {
    console.error("Error getting attendance records:", attendanceError)
    return studentJustifications
  }

  const attendanceMap = new Map(
    attendanceRecords.map((record) => [record.id, { course_id: record.course_id, date: record.date }]),
  )

  // Get course information
  const courseIds = [...new Set(attendanceRecords.map((record) => record.course_id))]
  const { data: courses, error: courseError } = await supabase
    .from("courses")
    .select("id, name, type")
    .in("id", courseIds)

  if (courseError) {
    console.error("Error getting courses:", courseError)
    return studentJustifications
  }

  const courseMap = new Map(courses.map((course) => [course.id, { name: course.name, type: course.type }]))

  return studentJustifications.map((justification) => {
    const attendance = attendanceMap.get(justification.attendance_id)
    const course = attendance ? courseMap.get(attendance.course_id) : null

    return {
      ...justification,
      absence_date: attendance ? attendance.date : null,
      course_name: course ? course.name : "Unknown Course",
      course_type: course ? course.type : "Unknown",
    }
  })
}

export async function getJustificationsByTeacher(teacherId: string) {
  const supabase = createServerClient()

  // Get teacher's courses
  const { data: teacherCourses, error: courseError } = await supabase
    .from("courses")
    .select("id")
    .eq("teacher_id", teacherId)

  if (courseError) {
    console.error("Error getting teacher courses:", courseError)
    return []
  }

  const courseIds = teacherCourses.map((course) => course.id)

  // Get attendance records for these courses
  const { data: attendanceRecords, error: attendanceError } = await supabase
    .from("attendance")
    .select("id, student_id, course_id, date")
    .in("course_id", courseIds)

  if (attendanceError) {
    console.error("Error getting attendance records:", attendanceError)
    return []
  }

  const attendanceIds = attendanceRecords.map((record) => record.id)

  // Get justifications for these attendance records
  const { data: justifications, error: justificationError } = await supabase
    .from("justifications")
    .select("*")
    .in("attendance_id", attendanceIds)

  if (justificationError) {
    console.error("Error getting justifications:", justificationError)
    return []
  }

  // Create maps for efficient lookups
  const attendanceMap = new Map(attendanceRecords.map((record) => [record.id, record]))

  // Get student information
  const studentIds = [...new Set(justifications.map((j) => j.student_id))]
  const { data: students, error: studentError } = await supabase.from("users").select("id, name").in("id", studentIds)

  if (studentError) {
    console.error("Error getting students:", studentError)
    return []
  }

  const studentMap = new Map(students.map((student) => [student.id, student.name]))

  // Get course information
  const { data: courses, error: coursesError } = await supabase.from("courses").select("id, name").in("id", courseIds)

  if (coursesError) {
    console.error("Error getting courses:", coursesError)
    return []
  }

  const courseMap = new Map(courses.map((course) => [course.id, course.name]))

  return justifications.map((justification) => {
    const attendance = attendanceMap.get(justification.attendance_id)

    return {
      ...justification,
      absence_date: attendance ? attendance.date : null,
      course_name: attendance ? courseMap.get(attendance.course_id) || "Unknown Course" : "Unknown Course",
      student_name: studentMap.get(justification.student_id) || "Unknown Student",
    }
  })
}

export async function updateJustificationStatus(justificationId: number, status: string) {
  const supabase = createServerClient()
  const { error } = await supabase.from("justifications").update({ status }).eq("id", justificationId)

  if (error) {
    console.error("Error updating justification status:", error)
    return null
  }

  return { id: justificationId, status }
}

// Notification functions
export async function createNotification(title: string, message: string, createdBy: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      title,
      message,
      active: true,
      created_at: new Date().toISOString(),
      created_by: createdBy,
    })
    .select()

  if (error) {
    console.error("Error creating notification:", error)
    throw new Error("Failed to create notification")
  }

  return data[0]
}

export async function getActiveNotifications() {
  const supabase = createServerClient()
  const { data, error } = await supabase.from("notifications").select("*").eq("active", true)

  if (error) {
    console.error("Error getting active notifications:", error)
    return []
  }

  return data
}

export async function getAllNotifications() {
  const supabase = createServerClient()
  const { data: notifications, error } = await supabase.from("notifications").select("*")

  if (error) {
    console.error("Error getting all notifications:", error)
    return []
  }

  // Get creator information
  const creatorIds = [...new Set(notifications.map((notification) => notification.created_by))]
  const { data: creators, error: creatorError } = await supabase.from("users").select("id, name").in("id", creatorIds)

  if (creatorError) {
    console.error("Error getting creators:", creatorError)
    return notifications
  }

  const creatorMap = new Map(creators.map((creator) => [creator.id, creator.name]))

  return notifications.map((notification) => ({
    ...notification,
    creator_name: creatorMap.get(notification.created_by) || "Unknown User",
  }))
}

export async function updateNotification(id: number, data: any) {
  const supabase = createServerClient()
  const { error } = await supabase.from("notifications").update(data).eq("id", id)

  if (error) {
    console.error("Error updating notification:", error)
    return null
  }

  const { data: updatedNotification, error: fetchError } = await supabase
    .from("notifications")
    .select("*")
    .eq("id", id)
    .single()

  if (fetchError) {
    console.error("Error fetching updated notification:", fetchError)
    return null
  }

  return updatedNotification
}

export async function deleteNotification(id: number) {
  const supabase = createServerClient()
  const { error } = await supabase.from("notifications").delete().eq("id", id)

  if (error) {
    console.error("Error deleting notification:", error)
    return false
  }

  return true
}

// Statistics functions
export async function getSystemStatistics() {
  const supabase = createServerClient()

  // Get user counts
  const { data: users, error: userError } = await supabase.from("users").select("user_type")

  if (userError) {
    console.error("Error getting users:", userError)
    return null
  }

  const totalStudents = users.filter((u) => u.user_type === "student").length
  const totalTeachers = users.filter((u) => u.user_type === "teacher").length
  const totalAdmins = users.filter((u) => u.user_type === "admin").length
  const totalTechAdmins = users.filter((u) => u.user_type === "tech-admin").length

  // Get course counts
  const { data: courses, error: courseError } = await supabase.from("courses").select("type")

  if (courseError) {
    console.error("Error getting courses:", courseError)
    return null
  }

  const coursesByType = {
    COUR: courses.filter((c) => c.type === "COUR").length,
    TD: courses.filter((c) => c.type === "TD").length,
    TP: courses.filter((c) => c.type === "TP").length,
  }

  // Get attendance data
  const { data: attendanceRecords, error: attendanceError } = await supabase
    .from("attendance")
    .select("status, course_id")

  if (attendanceError) {
    console.error("Error getting attendance:", attendanceError)
    return null
  }

  const totalAttendance = attendanceRecords.length
  const presentCount = attendanceRecords.filter((a) => a.status === "present").length
  const absentCount = attendanceRecords.filter((a) => a.status === "absent").length

  // Get course type for each attendance record
  const courseTypeAttendance = {
    COUR: { present: 0, absent: 0, total: 0 },
    TD: { present: 0, absent: 0, total: 0 },
    TP: { present: 0, absent: 0, total: 0 },
  }

  // This would require a join query or multiple queries in a real implementation
  // For simplicity, we'll return placeholder data

  // Get justification counts
  const { data: justifications, error: justificationError } = await supabase.from("justifications").select("status")

  if (justificationError) {
    console.error("Error getting justifications:", justificationError)
    return null
  }

  const pendingJustifications = justifications.filter((j) => j.status === "pending").length
  const approvedJustifications = justifications.filter((j) => j.status === "approved").length
  const rejectedJustifications = justifications.filter((j) => j.status === "rejected").length

  // Get recent activity
  // This would require complex queries in a real implementation
  // For simplicity, we'll return placeholder data
  const recentActivity = []

  return {
    users: {
      total: users.length,
      students: totalStudents,
      teachers: totalTeachers,
      admins: totalAdmins,
      techAdmins: totalTechAdmins,
    },
    courses: {
      total: courses.length,
      byType: coursesByType,
    },
    attendance: {
      total: totalAttendance,
      present: presentCount,
      absent: absentCount,
      presentRate: totalAttendance > 0 ? ((presentCount / totalAttendance) * 100).toFixed(2) : "0",
      byCourseType: courseTypeAttendance,
    },
    justifications: {
      total: justifications.length,
      pending: pendingJustifications,
      approved: approvedJustifications,
      rejected: rejectedJustifications,
    },
    recentActivity,
  }
}

// Initialize the database
initializeDb().catch(console.error)
