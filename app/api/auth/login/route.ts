import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase"
import bcryptjs from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, password, userType } = body

    console.log("Login attempt:", { id, userType })
    console.log("Environment variables:", {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    })

    if (!id || !password || !userType) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    try {
      const supabase = createServerClient()

      // For the Technical Administrator, use hardcoded credentials
      if (userType === "tech-admin" && id === "2020234049140" && password === "010218821") {
        console.log("Technical Administrator login successful")

        // Check if user exists in database
        const { data: existingUser, error: userError } = await supabase.from("users").select("*").eq("id", id).single()

        if (userError) {
          console.log("User not found, creating tech admin account")
          // If user doesn't exist, create it
          const hashedPassword = await bcryptjs.hash(password, 10)
          const { error: insertError } = await supabase.from("users").insert({
            id,
            name: "Technical Administrator",
            password: hashedPassword,
            user_type: userType,
            created_at: new Date().toISOString(),
          })

          if (insertError) {
            console.error("Error creating tech admin:", insertError)
            return NextResponse.json(
              {
                success: false,
                message: "Failed to create admin account",
                error: insertError.message,
              },
              { status: 500 },
            )
          }
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

        return NextResponse.json({ success: true })
      }

      // For demo users, accept "password" as the password
      if (
        ((userType === "student" && id === "S12345") ||
          (userType === "teacher" && id === "T12345") ||
          (userType === "admin" && id === "A12345")) &&
        password === "password"
      ) {
        const name =
          userType === "student" ? "Ahmed Benali" : userType === "teacher" ? "Dr. Mohammed Alaoui" : "Amina Tazi"

        // Check if user exists
        const { data: existingUser, error: userError } = await supabase.from("users").select("*").eq("id", id).single()

        if (userError) {
          console.log("Demo user not found, creating account")
          // Create user if not exists
          const hashedPassword = await bcryptjs.hash(password, 10)
          const { error: insertError } = await supabase.from("users").insert({
            id,
            name,
            password: hashedPassword,
            user_type: userType,
            created_at: new Date().toISOString(),
          })

          if (insertError) {
            console.error("Error creating demo user:", insertError)
            return NextResponse.json(
              {
                success: false,
                message: "Failed to create demo account",
                error: insertError.message,
              },
              { status: 500 },
            )
          }
        }

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

        return NextResponse.json({ success: true })
      }

      // Regular user authentication
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .eq("user_type", userType)
        .single()

      if (error) {
        console.error("Error fetching user:", error)
        return NextResponse.json(
          {
            success: false,
            message: "Invalid credentials",
            error: error.message,
          },
          { status: 401 },
        )
      }

      // For demo purposes, accept "password" for all users
      if (password === "password" || (await bcryptjs.compare(password, user.password))) {
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

        return NextResponse.json({ success: true })
      }

      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    } catch (dbError: any) {
      console.error("Database error:", dbError)
      return NextResponse.json(
        {
          success: false,
          message: "Database connection error",
          error: dbError.message,
          stack: dbError.stack,
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Authentication error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Authentication failed",
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
