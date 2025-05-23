"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getUserTypeLabel, userTypeColors } from "@/lib/theme-config"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [userType, setUserType] = useState<string | null>(null)

  // Get the user type from the URL query parameter using useSearchParams
  useEffect(() => {
    const type = searchParams.get("type")
    if (type) {
      setUserType(type)
    } else {
      // Default to student if no type is specified
      setUserType("student")
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!id || !password || !userType) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log("Submitting login form:", { id, password, userType })

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, password, userType }),
      })

      console.log("Login response status:", response.status)

      const data = await response.json()
      console.log("Login response data:", data)

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed")
      }

      console.log("Login successful, redirecting to dashboard...")

      // Redirect based on user type
      switch (userType) {
        case "student":
          window.location.href = "/dashboard/student"
          break
        case "teacher":
          window.location.href = "/dashboard/teacher"
          break
        case "admin":
          window.location.href = "/dashboard/admin"
          break
        case "tech-admin":
          window.location.href = "/dashboard/tech-admin"
          break
        default:
          window.location.href = "/"
      }
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "Invalid credentials. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Get user type specific colors
  const userColors = userType ? userTypeColors[userType as keyof typeof userTypeColors] : userTypeColors.student

  // Don't render until userType is set
  if (!userType) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md" style={{ borderTop: `4px solid ${userColors.primary}` }}>
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Image src="/images/university-logo.png" alt="University Logo" width={120} height={120} priority />
          </div>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your credentials to access the {getUserTypeLabel(userType)} dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id">ID Number</Label>
              <Input
                id="id"
                placeholder={`Enter your ${getUserTypeLabel(userType)} ID`}
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              style={{ backgroundColor: userColors.primary, color: "white" }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button variant="link" onClick={() => router.push("/")} className="text-sm text-muted-foreground">
            Back to Home
          </Button>

          <div className="text-xs text-muted-foreground border-t pt-2 w-full">
            <p className="font-semibold mb-1">Demo Credentials:</p>
            <p>Technical Admin: ID: 2020234049140, Password: 010218821</p>
            <p>Student: ID: S12345, Password: password</p>
            <p>Teacher: ID: T12345, Password: password</p>
            <p>Admin: ID: A12345, Password: password</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
