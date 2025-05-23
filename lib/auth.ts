"use server"

import { cookies } from "next/headers"

export async function authenticateUser(id: string, password: string, userType: string) {
  try {
    // For the Technical Administrator, use hardcoded credentials
    if (userType === "tech-admin" && id === "2020234049140" && password === "010218821") {
      // Set authentication cookie
      cookies().set(
        "user",
        JSON.stringify({
          id,
          userType,
          name: "Technical Administrator",
        }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24, // 1 day
          path: "/",
        },
      )

      return { success: true }
    }

    // For demo purposes, accept these credentials
    if (userType === "student" && id === "S12345" && password === "password") {
      cookies().set(
        "user",
        JSON.stringify({
          id,
          userType,
          name: "Ahmed Benali",
        }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24, // 1 day
          path: "/",
        },
      )

      return { success: true }
    }

    if (userType === "teacher" && id === "T12345" && password === "password") {
      cookies().set(
        "user",
        JSON.stringify({
          id,
          userType,
          name: "Dr. Mohammed Alaoui",
        }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24, // 1 day
          path: "/",
        },
      )

      return { success: true }
    }

    if (userType === "admin" && id === "A12345" && password === "password") {
      cookies().set(
        "user",
        JSON.stringify({
          id,
          userType,
          name: "Amina Tazi",
        }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24, // 1 day
          path: "/",
        },
      )

      return { success: true }
    }

    return { success: false, message: "Invalid ID or password" }
  } catch (error) {
    console.error("Authentication error:", error)
    return { success: false, message: "Authentication failed" }
  }
}

export async function getCurrentUser() {
  const userCookie = cookies().get("user")

  if (!userCookie) {
    return null
  }

  try {
    return JSON.parse(userCookie.value)
  } catch {
    return null
  }
}

export async function logout() {
  cookies().delete("user")
  return { success: true }
}
