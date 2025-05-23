"use server"

import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"
import * as mockDb from "./mock-db"

// Initialize the database schema
export async function initializeDb() {
  try {
    return await mockDb.initMockDb()
  } catch (error) {
    console.error("Database initialization error:", error)
    return false
  }
}

// Session management
export async function createSession(userId: string) {
  const sessionId = uuidv4()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

  await mockDb.createSessionRecord(sessionId, userId, expiresAt)

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

  if (!sessionId) return null

  const session = await mockDb.getSessionById(sessionId)
  if (!session || new Date(session.expires_at) <= new Date()) {
    cookies().delete("session_id")
    return null
  }

  // In a real application, you would get the user from the database
  // For now, we'll return a mock user
  return {
    id: session.user_id,
    name: "User",
    userType: "student",
  }
}

export async function deleteSession() {
  const sessionId = cookies().get("session_id")?.value

  if (sessionId) {
    await mockDb.deleteSessionById(sessionId)
    cookies().delete("session_id")
  }
}

// User functions
export async function createUser(id: string, name: string, password: string, userType: string) {
  return await mockDb.createUser(id, name, password, userType)
}

export async function getUserByIdAndPassword(id: string, password: string, userType: string) {
  return await mockDb.getUserByIdAndPassword(id, password, userType)
}

export async function getAllUsers(userType?: string) {
  return await mockDb.getAllUsers(userType)
}

export async function updateUser(id: string, data: any) {
  return await mockDb.updateUser(id, data)
}

export async function deleteUser(id: string) {
  return await mockDb.deleteUser(id)
}

// Course functions
export async function createCourse(name: string, type: string, teacherId: string, semester: number, year: string) {
  return await mockDb.createCourse(name, type, teacherId, semester, year)
}

export async function getCoursesByTeacher(teacherId: string) {
  return await mockDb.getCoursesByTeacher(teacherId)
}

export async function getAllCourses() {
  return await mockDb.getAllCourses()
}

export async function updateCourse(id: number, data: any) {
  return await mockDb.updateCourse(id, data)
}

export async function deleteCourse(id: number) {
  return await mockDb.deleteCourse(id)
}

// Attendance functions
export async function recordAttendance(studentId: string, courseId: number, status: string) {
  return await mockDb.recordAttendance(studentId, courseId, status)
}

export async function getStudentAttendance(studentId: string) {
  return await mockDb.getStudentAttendance(studentId)
}

export async function getAttendanceForCourse(courseId: number) {
  return await mockDb.getAttendanceForCourse(courseId)
}

export async function updateAttendance(id: number, status: string) {
  return await mockDb.updateAttendance(id, status)
}

// QR Code functions
export async function createQRCode(teacherId: string, courseId: number, code: string, expiresAt: Date) {
  return await mockDb.createQRCode(teacherId, courseId, code, expiresAt)
}

export async function validateQRCode(code: string) {
  return await mockDb.validateQRCode(code)
}

export async function getQRCodesByTeacher(teacherId: string) {
  return await mockDb.getQRCodesByTeacher(teacherId)
}

// Justification functions
export async function submitJustification(studentId: string, attendanceId: number, filePath: string) {
  return await mockDb.submitJustification(studentId, attendanceId, filePath)
}

export async function getJustificationsByStudent(studentId: string) {
  return await mockDb.getJustificationsByStudent(studentId)
}

export async function getJustificationsByTeacher(teacherId: string) {
  return await mockDb.getJustificationsByTeacher(teacherId)
}

export async function updateJustificationStatus(justificationId: number, status: string) {
  return await mockDb.updateJustificationStatus(justificationId, status)
}

// Notification functions
export async function createNotification(title: string, message: string, createdBy: string) {
  return await mockDb.createNotification(title, message, createdBy)
}

export async function getActiveNotifications() {
  return await mockDb.getActiveNotifications()
}

export async function getAllNotifications() {
  return await mockDb.getAllNotifications()
}

export async function updateNotification(id: number, data: any) {
  return await mockDb.updateNotification(id, data)
}

export async function deleteNotification(id: number) {
  return await mockDb.deleteNotification(id)
}

// Statistics functions
export async function getSystemStatistics() {
  return await mockDb.getSystemStatistics()
}

// Initialize the database
initializeDb().catch(console.error)
