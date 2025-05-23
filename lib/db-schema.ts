import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

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

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  user_type: text("user_type").notNull(),
  created_at: text("created_at").notNull(),
})

export const courses = sqliteTable("courses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  type: text("type").notNull(),
  teacher_id: text("teacher_id").notNull(),
  semester: integer("semester").notNull(),
  year: text("year").notNull(),
})

export const attendance = sqliteTable("attendance", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  student_id: text("student_id").notNull(),
  course_id: integer("course_id").notNull(),
  date: text("date").notNull(),
  status: text("status").notNull(),
})

export const justifications = sqliteTable("justifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  student_id: text("student_id").notNull(),
  attendance_id: integer("attendance_id").notNull(),
  file_path: text("file_path").notNull(),
  status: text("status").notNull(),
  submitted_at: text("submitted_at").notNull(),
})

export const qr_codes = sqliteTable("qr_codes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teacher_id: text("teacher_id").notNull(),
  course_id: integer("course_id").notNull(),
  code: text("code").notNull(),
  created_at: text("created_at").notNull(),
  expires_at: text("expires_at").notNull(),
})

export const notifications = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  active: integer("active", { mode: "boolean" }).notNull(),
  created_at: text("created_at").notNull(),
  created_by: text("created_by").notNull(),
})

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull(),
  expires_at: text("expires_at").notNull(),
})
