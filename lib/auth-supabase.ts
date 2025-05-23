"use server"

import { cookies } from "next/headers"
import { createServerClient } from "./supabase"
import bcryptjs from "bcryptjs"

export async function authenticateUser(id: string, password: string, userType: string) {
  try {
    const supabase = createServerClient()

    // For the Technical Administrator, use hardcoded credentials
    if (userType === "tech-admin" && id === "2020234049140" && password === "010218821") {
      // Check if user exists in database
      const { data: existingUser } = await supabase.from("users").select("*").eq("id", id).single()

      // If user doesn't exist, create it
      if (!existingUser) {
        const hashedPassword = await bcryptjs.hash(password, 10)
        await supabase.from("users").insert({
          id,
          name: "Technical Administrator",
          password: hashedPassword,
          user_type: userType,
          created_at: new Date().toISOString(),
        })
      }

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

    // Query the database for the user
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .eq("user_type", userType)
      .single()

    if (error || !user) {
      // For demo purposes, create demo users if they don't exist
      if (
        (userType === "student" && id === "S12345") ||
        (userType === "teacher" && id === "T12345") ||
        (userType === "admin" && id === "A12345")
      ) {
        if (password === "password") {
          const hashedPassword = await bcryptjs.hash(password, 10)
          const name =
            userType === "student" ? "Ahmed Benali" : userType === "teacher" ? "Dr. Mohammed Alaoui" : "Amina Tazi"

          await supabase.from("users").insert({
            id,
            name,
            password: hashedPassword,
            user_type: userType,
            created_at: new Date().toISOString(),
          })

          cookies().set(
            "user",
            JSON.stringify({
              id,
              userType,
              name,
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
      }

      return { success: false, message: "Invalid ID or password" }
    }

    // For demo purposes, accept "password" for all users
    if (password === "password") {
      cookies().set(
        "user",
        JSON.stringify({
          id: user.id,
          userType: user.user_type,
          name: user.name,
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

    const passwordMatch = await bcryptjs.compare(password, user.password)
    if (!passwordMatch) {
      return { success: false, message: "Invalid ID or password" }
    }

    cookies().set(
      "user",
      JSON.stringify({
        id: user.id,
        userType: user.user_type,
        name: user.name,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      },
    )

    return { success: true }
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
