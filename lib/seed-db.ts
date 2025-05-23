"use server"

import { createServerClient } from "./supabase"
import bcryptjs from "bcryptjs"

export async function seedDatabase() {
  const supabase = createServerClient()
  console.log("Seeding database...")

  try {
    // Check if users already exist
    const { data: existingUsers, error: userCheckError } = await supabase.from("users").select("id").limit(1)

    if (userCheckError) {
      console.error("Error checking for existing users:", userCheckError)
      return false
    }

    // If users already exist, don't seed
    if (existingUsers && existingUsers.length > 0) {
      console.log("Database already seeded")
      return true
    }

    // Create default users
    const hashedPassword = await bcryptjs.hash("password", 10)
    const techAdminPassword = await bcryptjs.hash("010218821", 10)

    const users = [
      {
        id: "2020234049140",
        name: "Technical Administrator",
        password: techAdminPassword,
        user_type: "tech-admin",
        created_at: new Date().toISOString(),
      },
      {
        id: "T12345",
        name: "Dr. Mohammed Alaoui",
        password: hashedPassword,
        user_type: "teacher",
        created_at: new Date().toISOString(),
      },
      {
        id: "S12345",
        name: "Ahmed Benali",
        password: hashedPassword,
        user_type: "student",
        created_at: new Date().toISOString(),
      },
      {
        id: "A12345",
        name: "Amina Tazi",
        password: hashedPassword,
        user_type: "admin",
        created_at: new Date().toISOString(),
      },
      {
        id: "T54321",
        name: "Dr. Fatima Zahra",
        password: hashedPassword,
        user_type: "teacher",
        created_at: new Date().toISOString(),
      },
      {
        id: "S54321",
        name: "Karim Mansouri",
        password: hashedPassword,
        user_type: "student",
        created_at: new Date().toISOString(),
      },
    ]

    const { error: userInsertError } = await supabase.from("users").insert(users)

    if (userInsertError) {
      console.error("Error inserting users:", userInsertError)
      return false
    }

    // Create courses
    const courses = [
      {
        name: "Introduction to Computer Science",
        type: "COUR",
        teacher_id: "T12345",
        semester: 1,
        year: "2023-2024",
      },
      {
        name: "Programming Fundamentals",
        type: "TD",
        teacher_id: "T12345",
        semester: 1,
        year: "2023-2024",
      },
      {
        name: "Data Structures",
        type: "TP",
        teacher_id: "T12345",
        semester: 1,
        year: "2023-2024",
      },
      {
        name: "Artificial Intelligence",
        type: "COUR",
        teacher_id: "T54321",
        semester: 2,
        year: "2023-2024",
      },
      {
        name: "Machine Learning",
        type: "TD",
        teacher_id: "T54321",
        semester: 2,
        year: "2023-2024",
      },
    ]

    const { data: insertedCourses, error: courseInsertError } = await supabase.from("courses").insert(courses).select()

    if (courseInsertError) {
      console.error("Error inserting courses:", courseInsertError)
      return false
    }

    // Create some attendance records
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const twoDaysAgo = new Date(today)
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

    const attendance = [
      {
        student_id: "S12345",
        course_id: 1,
        date: today.toISOString(),
        status: "present",
      },
      {
        student_id: "S12345",
        course_id: 2,
        date: yesterday.toISOString(),
        status: "absent",
      },
      {
        student_id: "S12345",
        course_id: 3,
        date: twoDaysAgo.toISOString(),
        status: "present",
      },
      {
        student_id: "S54321",
        course_id: 1,
        date: today.toISOString(),
        status: "present",
      },
      {
        student_id: "S54321",
        course_id: 2,
        date: yesterday.toISOString(),
        status: "absent",
      },
    ]

    const { error: attendanceInsertError } = await supabase.from("attendance").insert(attendance)

    if (attendanceInsertError) {
      console.error("Error inserting attendance:", attendanceInsertError)
      return false
    }

    // Create some justifications
    const justifications = [
      {
        student_id: "S12345",
        attendance_id: 2,
        file_path: "/uploads/justification1.pdf",
        status: "pending",
        submitted_at: new Date().toISOString(),
      },
      {
        student_id: "S54321",
        attendance_id: 5,
        file_path: "/uploads/justification2.pdf",
        status: "approved",
        submitted_at: new Date().toISOString(),
      },
    ]

    const { error: justificationInsertError } = await supabase.from("justifications").insert(justifications)

    if (justificationInsertError) {
      console.error("Error inserting justifications:", justificationInsertError)
      return false
    }

    // Create some QR codes
    const tenMinutesLater = new Date(today)
    tenMinutesLater.setMinutes(tenMinutesLater.getMinutes() + 10)

    const qrCodes = [
      {
        teacher_id: "T12345",
        course_id: 1,
        code: "QR123456",
        created_at: today.toISOString(),
        expires_at: tenMinutesLater.toISOString(),
      },
    ]

    const { error: qrCodeInsertError } = await supabase.from("qr_codes").insert(qrCodes)

    if (qrCodeInsertError) {
      console.error("Error inserting QR codes:", qrCodeInsertError)
      return false
    }

    // Create some notifications
    const notifications = [
      {
        title: "Welcome to the Absence Management Platform",
        message: "This platform helps manage student attendance using QR codes.",
        active: true,
        created_at: new Date().toISOString(),
        created_by: "2020234049140",
      },
      {
        title: "System Maintenance",
        message: "The system will be under maintenance on Sunday from 2 AM to 4 AM.",
        active: true,
        created_at: new Date().toISOString(),
        created_by: "2020234049140",
      },
    ]

    const { error: notificationInsertError } = await supabase.from("notifications").insert(notifications)

    if (notificationInsertError) {
      console.error("Error inserting notifications:", notificationInsertError)
      return false
    }

    console.log("Database seeded successfully")
    return true
  } catch (error) {
    console.error("Error seeding database:", error)
    return false
  }
}
