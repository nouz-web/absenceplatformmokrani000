// Mock Database Implementation
// This file provides a complete in-memory database implementation

import bcryptjs from "bcryptjs"

// Define types for our database entities
export interface User {
  id: string
  name: string
  password: string
  user_type: string
  created_at: string
}

export interface Course {
  id: number
  name: string
  type: string
  teacher_id: string
  semester: number
  year: string
}

export interface Attendance {
  id: number
  student_id: string
  course_id: number
  date: string
  status: string
}

export interface Justification {
  id: number
  student_id: string
  attendance_id: number
  file_path: string
  status: string
  submitted_at: string
}

export interface QRCode {
  id: number
  teacher_id: string
  course_id: number
  code: string
  created_at: string
  expires_at: string
}

export interface Notification {
  id: number
  title: string
  message: string
  active: boolean
  created_at: string
  created_by: string
}

export interface Session {
  id: string
  user_id: string
  expires_at: string
}

// In-memory storage
let users: User[] = []
let courses: Course[] = []
let attendance: Attendance[] = []
let justifications: Justification[] = []
let qrCodes: QRCode[] = []
let notifications: Notification[] = []
const sessions: Session[] = []
let initialized = false

// Initialize the mock database with sample data
export async function initMockDb() {
  if (initialized) return true

  try {
    console.log("Initializing mock database...")

    // Create the technical administrator
    const hashedPassword = await bcryptjs.hash("010218821", 10)
    const defaultPassword = await bcryptjs.hash("password", 10)

    users = [
      {
        id: "2020234049140",
        name: "Technical Administrator",
        password: hashedPassword,
        user_type: "tech-admin",
        created_at: new Date().toISOString(),
      },
      {
        id: "T12345",
        name: "Dr. Mohammed Alaoui",
        password: defaultPassword,
        user_type: "teacher",
        created_at: new Date().toISOString(),
      },
      {
        id: "S12345",
        name: "Ahmed Benali",
        password: defaultPassword,
        user_type: "student",
        created_at: new Date().toISOString(),
      },
      {
        id: "A12345",
        name: "Amina Tazi",
        password: defaultPassword,
        user_type: "admin",
        created_at: new Date().toISOString(),
      },
      {
        id: "T54321",
        name: "Dr. Fatima Zahra",
        password: defaultPassword,
        user_type: "teacher",
        created_at: new Date().toISOString(),
      },
      {
        id: "S54321",
        name: "Karim Mansouri",
        password: defaultPassword,
        user_type: "student",
        created_at: new Date().toISOString(),
      },
    ]

    courses = [
      {
        id: 1,
        name: "Introduction to Computer Science",
        type: "COUR",
        teacher_id: "T12345",
        semester: 1,
        year: "2023-2024",
      },
      {
        id: 2,
        name: "Programming Fundamentals",
        type: "TD",
        teacher_id: "T12345",
        semester: 1,
        year: "2023-2024",
      },
      {
        id: 3,
        name: "Data Structures",
        type: "TP",
        teacher_id: "T12345",
        semester: 1,
        year: "2023-2024",
      },
      {
        id: 4,
        name: "Artificial Intelligence",
        type: "COUR",
        teacher_id: "T54321",
        semester: 2,
        year: "2023-2024",
      },
      {
        id: 5,
        name: "Machine Learning",
        type: "TD",
        teacher_id: "T54321",
        semester: 2,
        year: "2023-2024",
      },
    ]

    // Create some attendance records
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const twoDaysAgo = new Date(today)
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

    attendance = [
      {
        id: 1,
        student_id: "S12345",
        course_id: 1,
        date: today.toISOString(),
        status: "present",
      },
      {
        id: 2,
        student_id: "S12345",
        course_id: 2,
        date: yesterday.toISOString(),
        status: "absent",
      },
      {
        id: 3,
        student_id: "S12345",
        course_id: 3,
        date: twoDaysAgo.toISOString(),
        status: "present",
      },
      {
        id: 4,
        student_id: "S54321",
        course_id: 1,
        date: today.toISOString(),
        status: "present",
      },
      {
        id: 5,
        student_id: "S54321",
        course_id: 2,
        date: yesterday.toISOString(),
        status: "absent",
      },
    ]

    // Create some justifications
    justifications = [
      {
        id: 1,
        student_id: "S12345",
        attendance_id: 2,
        file_path: "/uploads/justification1.pdf",
        status: "pending",
        submitted_at: new Date().toISOString(),
      },
      {
        id: 2,
        student_id: "S54321",
        attendance_id: 5,
        file_path: "/uploads/justification2.pdf",
        status: "approved",
        submitted_at: new Date().toISOString(),
      },
    ]

    // Create some QR codes
    const tenMinutesLater = new Date(today)
    tenMinutesLater.setMinutes(tenMinutesLater.getMinutes() + 10)

    qrCodes = [
      {
        id: 1,
        teacher_id: "T12345",
        course_id: 1,
        code: "QR123456",
        created_at: today.toISOString(),
        expires_at: tenMinutesLater.toISOString(),
      },
    ]

    // Create some notifications
    notifications = [
      {
        id: 1,
        title: "Welcome to the Absence Management Platform",
        message: "This platform helps manage student attendance using QR codes.",
        active: true,
        created_at: new Date().toISOString(),
        created_by: "2020234049140",
      },
      {
        id: 2,
        title: "System Maintenance",
        message: "The system will be under maintenance on Sunday from 2 AM to 4 AM.",
        active: true,
        created_at: new Date().toISOString(),
        created_by: "2020234049140",
      },
    ]

    initialized = true
    console.log("Mock database initialized successfully")
    return true
  } catch (error) {
    console.error("Error initializing mock database:", error)
    return false
  }
}

// User functions
export async function createUser(id: string, name: string, password: string, userType: string) {
  await initMockDb()

  const hashedPassword = await bcryptjs.hash(password, 10)

  const newUser: User = {
    id,
    name,
    password: hashedPassword,
    user_type: userType,
    created_at: new Date().toISOString(),
  }

  users.push(newUser)

  return { id, name, userType }
}

export async function getUserByIdAndPassword(id: string, password: string, userType: string) {
  await initMockDb()

  // For the Technical Administrator, use hardcoded credentials
  if (userType === "tech-admin" && id === "2020234049140" && password === "010218821") {
    return {
      id,
      name: "Technical Administrator",
      userType,
    }
  }

  const user = users.find((u) => u.id === id && u.user_type === userType)

  if (!user) {
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
  await initMockDb()

  if (userType) {
    return users
      .filter((u) => u.user_type === userType)
      .map((u) => ({
        id: u.id,
        name: u.name,
        user_type: u.user_type,
        created_at: u.created_at,
      }))
  }

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    user_type: u.user_type,
    created_at: u.created_at,
  }))
}

export async function updateUser(id: string, data: Partial<User>) {
  await initMockDb()

  const userIndex = users.findIndex((u) => u.id === id)
  if (userIndex === -1) return null

  // Update user data
  users[userIndex] = {
    ...users[userIndex],
    ...data,
    // Don't allow changing these fields
    id: users[userIndex].id,
    created_at: users[userIndex].created_at,
  }

  return {
    id: users[userIndex].id,
    name: users[userIndex].name,
    user_type: users[userIndex].user_type,
    created_at: users[userIndex].created_at,
  }
}

export async function deleteUser(id: string) {
  await initMockDb()

  const userIndex = users.findIndex((u) => u.id === id)
  if (userIndex === -1) return false

  users.splice(userIndex, 1)
  return true
}

// Course functions
export async function createCourse(name: string, type: string, teacherId: string, semester: number, year: string) {
  await initMockDb()

  const newCourse: Course = {
    id: courses.length > 0 ? Math.max(...courses.map((c) => c.id)) + 1 : 1,
    name,
    type,
    teacher_id: teacherId,
    semester,
    year,
  }

  courses.push(newCourse)

  return newCourse
}

export async function getCoursesByTeacher(teacherId: string) {
  await initMockDb()

  return courses.filter((c) => c.teacher_id === teacherId)
}

export async function getAllCourses() {
  await initMockDb()

  return courses.map((course) => {
    const teacher = users.find((u) => u.id === course.teacher_id)
    return {
      ...course,
      teacher_name: teacher ? teacher.name : "Unknown Teacher",
    }
  })
}

export async function updateCourse(id: number, data: Partial<Course>) {
  await initMockDb()

  const courseIndex = courses.findIndex((c) => c.id === id)
  if (courseIndex === -1) return null

  // Update course data
  courses[courseIndex] = {
    ...courses[courseIndex],
    ...data,
    // Don't allow changing the ID
    id: courses[courseIndex].id,
  }

  return courses[courseIndex]
}

export async function deleteCourse(id: number) {
  await initMockDb()

  const courseIndex = courses.findIndex((c) => c.id === id)
  if (courseIndex === -1) return false

  courses.splice(courseIndex, 1)
  return true
}

// Attendance functions
export async function recordAttendance(studentId: string, courseId: number, status: string) {
  await initMockDb()

  const newAttendance: Attendance = {
    id: attendance.length > 0 ? Math.max(...attendance.map((a) => a.id)) + 1 : 1,
    student_id: studentId,
    course_id: courseId,
    date: new Date().toISOString(),
    status,
  }

  attendance.push(newAttendance)

  return newAttendance
}

export async function getStudentAttendance(studentId: string) {
  await initMockDb()

  const attendanceRecords = attendance.filter((a) => a.student_id === studentId)

  return attendanceRecords.map((record) => {
    const course = courses.find((c) => c.id === record.course_id)
    return {
      ...record,
      course_name: course ? course.name : "Unknown Course",
      course_type: course ? course.type : "Unknown",
    }
  })
}

export async function getAttendanceForCourse(courseId: number) {
  await initMockDb()

  const attendanceRecords = attendance.filter((a) => a.course_id === courseId)

  return attendanceRecords.map((record) => {
    const student = users.find((u) => u.id === record.student_id)
    return {
      ...record,
      student_name: student ? student.name : "Unknown Student",
    }
  })
}

export async function updateAttendance(id: number, status: string) {
  await initMockDb()

  const attendanceIndex = attendance.findIndex((a) => a.id === id)
  if (attendanceIndex === -1) return null

  attendance[attendanceIndex].status = status
  return attendance[attendanceIndex]
}

// QR Code functions
export async function createQRCode(teacherId: string, courseId: number, code: string, expiresAt: Date) {
  await initMockDb()

  const newQRCode: QRCode = {
    id: qrCodes.length > 0 ? Math.max(...qrCodes.map((q) => q.id)) + 1 : 1,
    teacher_id: teacherId,
    course_id: courseId,
    code,
    created_at: new Date().toISOString(),
    expires_at: expiresAt.toISOString(),
  }

  qrCodes.push(newQRCode)

  return newQRCode
}

export async function validateQRCode(code: string) {
  await initMockDb()

  const qrCode = qrCodes.find((q) => q.code === code)

  if (!qrCode || new Date(qrCode.expires_at) <= new Date()) {
    return null
  }

  const course = courses.find((c) => c.id === qrCode.course_id)

  return {
    ...qrCode,
    course_name: course ? course.name : "Unknown Course",
    course_type: course ? course.type : "Unknown",
  }
}

export async function getQRCodesByTeacher(teacherId: string) {
  await initMockDb()

  const teacherQRCodes = qrCodes.filter((q) => q.teacher_id === teacherId)

  return teacherQRCodes.map((qrCode) => {
    const course = courses.find((c) => c.id === qrCode.course_id)
    return {
      ...qrCode,
      course_name: course ? course.name : "Unknown Course",
      course_type: course ? course.type : "Unknown",
    }
  })
}

// Justification functions
export async function submitJustification(studentId: string, attendanceId: number, filePath: string) {
  await initMockDb()

  const newJustification: Justification = {
    id: justifications.length > 0 ? Math.max(...justifications.map((j) => j.id)) + 1 : 1,
    student_id: studentId,
    attendance_id: attendanceId,
    file_path: filePath,
    status: "pending",
    submitted_at: new Date().toISOString(),
  }

  justifications.push(newJustification)

  return newJustification
}

export async function getJustificationsByStudent(studentId: string) {
  await initMockDb()

  const studentJustifications = justifications.filter((j) => j.student_id === studentId)

  return studentJustifications.map((justification) => {
    const attendanceRecord = attendance.find((a) => a.id === justification.attendance_id)
    const course = attendanceRecord ? courses.find((c) => c.id === attendanceRecord.course_id) : null

    return {
      ...justification,
      absence_date: attendanceRecord ? attendanceRecord.date : null,
      course_name: course ? course.name : "Unknown Course",
      course_type: course ? course.type : "Unknown",
    }
  })
}

export async function getJustificationsByTeacher(teacherId: string) {
  await initMockDb()

  // Get teacher's courses
  const teacherCourses = courses.filter((c) => c.teacher_id === teacherId)
  const courseIds = teacherCourses.map((c) => c.id)

  // Get all justifications
  const results = []

  for (const justification of justifications) {
    const attendanceRecord = attendance.find((a) => a.id === justification.attendance_id)

    if (attendanceRecord && courseIds.includes(attendanceRecord.course_id)) {
      const course = courses.find((c) => c.id === attendanceRecord.course_id)
      const student = users.find((u) => u.id === justification.student_id)

      results.push({
        ...justification,
        absence_date: attendanceRecord ? attendanceRecord.date : null,
        course_name: course ? course.name : "Unknown Course",
        student_name: student ? student.name : "Unknown Student",
      })
    }
  }

  return results
}

export async function updateJustificationStatus(justificationId: number, status: string) {
  await initMockDb()

  const justification = justifications.find((j) => j.id === justificationId)

  if (justification) {
    justification.status = status
  }

  return { id: justificationId, status }
}

// Notification functions
export async function createNotification(title: string, message: string, createdBy: string) {
  await initMockDb()

  const newNotification: Notification = {
    id: notifications.length > 0 ? Math.max(...notifications.map((n) => n.id)) + 1 : 1,
    title,
    message,
    active: true,
    created_at: new Date().toISOString(),
    created_by: createdBy,
  }

  notifications.push(newNotification)

  return newNotification
}

export async function getActiveNotifications() {
  await initMockDb()

  return notifications.filter((n) => n.active)
}

export async function getAllNotifications() {
  await initMockDb()

  return notifications.map((notification) => {
    const creator = users.find((u) => u.id === notification.created_by)
    return {
      ...notification,
      creator_name: creator ? creator.name : "Unknown User",
    }
  })
}

export async function updateNotification(id: number, data: Partial<Notification>) {
  await initMockDb()

  const notificationIndex = notifications.findIndex((n) => n.id === id)
  if (notificationIndex === -1) return null

  // Update notification data
  notifications[notificationIndex] = {
    ...notifications[notificationIndex],
    ...data,
    // Don't allow changing these fields
    id: notifications[notificationIndex].id,
    created_at: notifications[notificationIndex].created_at,
    created_by: notifications[notificationIndex].created_by,
  }

  return notifications[notificationIndex]
}

export async function deleteNotification(id: number) {
  await initMockDb()

  const notificationIndex = notifications.findIndex((n) => n.id === id)
  if (notificationIndex === -1) return false

  notifications.splice(notificationIndex, 1)
  return true
}

// Session functions
export async function createSessionRecord(id: string, userId: string, expiresAt: Date) {
  await initMockDb()

  const newSession: Session = {
    id,
    user_id: userId,
    expires_at: expiresAt.toISOString(),
  }

  sessions.push(newSession)
  return newSession
}

export async function getSessionById(id: string) {
  await initMockDb()

  return sessions.find((s) => s.id === id) || null
}

export async function deleteSessionById(id: string) {
  await initMockDb()

  const sessionIndex = sessions.findIndex((s) => s.id === id)
  if (sessionIndex === -1) return false

  sessions.splice(sessionIndex, 1)
  return true
}

// Statistics functions
export async function getSystemStatistics() {
  await initMockDb()

  const totalStudents = users.filter((u) => u.user_type === "student").length
  const totalTeachers = users.filter((u) => u.user_type === "teacher").length
  const totalCourses = courses.length
  const totalAttendance = attendance.length
  const presentCount = attendance.filter((a) => a.status === "present").length
  const absentCount = attendance.filter((a) => a.status === "absent").length
  const pendingJustifications = justifications.filter((j) => j.status === "pending").length

  // Attendance by course type
  const courseTypeAttendance = {
    COUR: {
      present: 0,
      absent: 0,
      total: 0,
    },
    TD: {
      present: 0,
      absent: 0,
      total: 0,
    },
    TP: {
      present: 0,
      absent: 0,
      total: 0,
    },
  }

  for (const record of attendance) {
    const course = courses.find((c) => c.id === record.course_id)
    if (course) {
      const type = course.type as keyof typeof courseTypeAttendance
      courseTypeAttendance[type].total++
      if (record.status === "present") {
        courseTypeAttendance[type].present++
      } else {
        courseTypeAttendance[type].absent++
      }
    }
  }

  // Recent activity
  const recentActivity = [
    ...attendance.map((a) => ({
      type: "attendance",
      date: a.date,
      details: `Student ${a.student_id} marked ${a.status} for course ${a.course_id}`,
    })),
    ...justifications.map((j) => ({
      type: "justification",
      date: j.submitted_at,
      details: `Student ${j.student_id} submitted justification for attendance ${j.attendance_id}`,
    })),
    ...qrCodes.map((q) => ({
      type: "qrcode",
      date: q.created_at,
      details: `Teacher ${q.teacher_id} created QR code for course ${q.course_id}`,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  return {
    users: {
      total: users.length,
      students: totalStudents,
      teachers: totalTeachers,
      admins: users.filter((u) => u.user_type === "admin").length,
      techAdmins: users.filter((u) => u.user_type === "tech-admin").length,
    },
    courses: {
      total: totalCourses,
      byType: {
        COUR: courses.filter((c) => c.type === "COUR").length,
        TD: courses.filter((c) => c.type === "TD").length,
        TP: courses.filter((c) => c.type === "TP").length,
      },
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
      approved: justifications.filter((j) => j.status === "approved").length,
      rejected: justifications.filter((j) => j.status === "rejected").length,
    },
    recentActivity,
  }
}

// Initialize the database
initMockDb().catch(console.error)
