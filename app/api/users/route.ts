import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import bcryptjs from "bcryptjs"

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: users, error } = await supabase
      .from("users")
      .select("id, name, user_type, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching users:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ users })
  } catch (error: any) {
    console.error("Error in GET /api/users:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, password, userType } = body

    if (!id || !name || !password || !userType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("id", id).single()

    if (existingUser) {
      return NextResponse.json({ error: "User with this ID already exists" }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10)

    // Insert new user
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        id,
        name,
        password: hashedPassword,
        user_type: userType,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating user:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        userType: newUser.user_type,
        createdAt: newUser.created_at,
      },
    })
  } catch (error: any) {
    console.error("Error in POST /api/users:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
