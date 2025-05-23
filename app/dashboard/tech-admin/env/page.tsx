"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export default function EnvironmentPage() {
  const [dbStatus, setDbStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isChecking, setIsChecking] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    checkDatabaseConnection()
  }, [])

  const checkDatabaseConnection = async () => {
    setIsChecking(true)
    try {
      const response = await fetch("/api/db-check")
      const data = await response.json()
      setDbStatus(data)
    } catch (error) {
      console.error("Error checking database:", error)
      setDbStatus({ connected: false, error: "Failed to check database connection" })
    } finally {
      setIsChecking(false)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Environment Configuration</h1>
        <Button onClick={checkDatabaseConnection} disabled={isChecking}>
          {isChecking ? "Checking..." : "Check Connection"}
        </Button>
      </div>

      {showSuccess && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Settings saved successfully!</AlertDescription>
        </Alert>
      )}

      {showError && (
        <Alert className="bg-red-50 text-red-800 border-red-200" variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Database Connection</CardTitle>
          <CardDescription>Check the status of your database connection</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Checking database connection...</div>
          ) : dbStatus?.connected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Connected to database</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Environment Variables</h3>
                  <div className="space-y-2">
                    {Object.entries(dbStatus.envCheck).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{key}</span>
                        <span className={value === "✓" ? "text-green-600" : "text-red-600"}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Database Info</h3>
                  <pre className="bg-gray-50 p-3 rounded overflow-auto text-sm">
                    {JSON.stringify(dbStatus.data, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Failed to connect to database</span>
              </div>
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Connection Error</AlertTitle>
                <AlertDescription>{dbStatus?.error || "Unknown error occurred"}</AlertDescription>
              </Alert>
              <div>
                <h3 className="font-medium mb-2">Error Details</h3>
                <pre className="bg-gray-50 p-3 rounded overflow-auto text-sm">
                  {JSON.stringify(dbStatus?.details || {}, null, 2)}
                </pre>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
                <h3 className="font-medium text-amber-800 mb-2">Troubleshooting Steps</h3>
                <ol className="list-decimal list-inside space-y-2 text-amber-800">
                  <li>Verify that your Supabase project is active</li>
                  <li>Check that your environment variables are correctly set</li>
                  <li>Ensure your IP address is not blocked by Supabase</li>
                  <li>Verify that the database tables have been created</li>
                  <li>Check for any network issues or firewalls blocking connections</li>
                </ol>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
          <CardDescription>
            These variables are used to connect to your Supabase database. They should be set in your deployment
            environment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="supabase_url">NEXT_PUBLIC_SUPABASE_URL</Label>
              <Input
                id="supabase_url"
                placeholder="https://your-project.supabase.co"
                disabled
                value="****************************************"
              />
              <p className="text-sm text-gray-500">
                The URL of your Supabase project. Find this in your Supabase dashboard under Project Settings &gt; API.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="supabase_anon_key">NEXT_PUBLIC_SUPABASE_ANON_KEY</Label>
              <Input
                id="supabase_anon_key"
                placeholder="your-anon-key"
                disabled
                value="****************************************"
              />
              <p className="text-sm text-gray-500">
                The anonymous key for your Supabase project. Find this in your Supabase dashboard under Project Settings
                &gt; API.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="supabase_service_key">SUPABASE_SERVICE_ROLE_KEY</Label>
              <Input
                id="supabase_service_key"
                placeholder="your-service-role-key"
                disabled
                value="****************************************"
              />
              <p className="text-sm text-gray-500">
                The service role key for your Supabase project. Find this in your Supabase dashboard under Project
                Settings &gt; API.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
              <h3 className="font-medium text-blue-800 mb-2">How to Set Environment Variables</h3>
              <p className="text-blue-800 mb-2">
                Environment variables should be set in your deployment platform (e.g., Vercel, Netlify) or in a
                .env.local file for local development.
              </p>
              <pre className="bg-blue-100 p-3 rounded overflow-auto text-sm text-blue-800">
                {`# .env.local example
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
