import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    // Try to query the database
    const { data, error } = await supabase.from("users").select("count").single()

    if (error) {
      console.error("Database connection error:", error)
      return NextResponse.json(
        {
          connected: false,
          error: error.message,
          details: {
            code: error.code,
            hint: error.hint,
            details: error.details,
          },
        },
        { status: 500 },
      )
    }

    // Check environment variables
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓" : "✗",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓" : "✗",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "✓" : "✗",
    }

    return NextResponse.json({
      connected: true,
      data,
      envCheck,
      message: "Successfully connected to the database",
    })
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json(
      {
        connected: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
