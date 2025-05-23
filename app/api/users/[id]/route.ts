import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import bcryptjs from "bcryptjs"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, password, userType } = body

    if (!name || !userType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()

    const updateData: any = {
      name,
      user_type: userType,
    }

    // Only update password if provided
    if (password && password.trim() !== "") {
      updateData.password = await bcryptjs.hash(password, 10)
    }

    const { data: updatedUser, error } = await supabase.from("users").update(updateData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating user:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        userType: updatedUser.user_type,
        createdAt: updatedUser.created_at,
      },
    })
  } catch (error: any) {
    console.error("Error in PUT /api/users/[id]:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Prevent deletion of the main tech admin account
    if (id === "2020234049140") {
      return NextResponse.json({ error: "Cannot delete the main technical administrator account" }, { status: 400 })
    }

    const supabase = createServerClient()

    const { error } = await supabase.from("users").delete().eq("id", id)

    if (error) {
      console.error("Error deleting user:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error in DELETE /api/users/[id]:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
