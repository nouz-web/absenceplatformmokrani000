"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { seedDatabase } from "@/lib/seed-db"

export default function SettingsPage() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSeedDatabase = async () => {
    setIsSeeding(true)
    setSeedResult(null)

    try {
      const result = await seedDatabase()
      setSeedResult({
        success: result,
        message: result ? "Database seeded successfully" : "Failed to seed database",
      })
    } catch (error) {
      setSeedResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage general platform settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-gray-500">Enable dark mode for the platform</p>
                </div>
                <Switch id="dark-mode" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive email notifications for important events</p>
                </div>
                <Switch id="notifications" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <p className="text-sm text-gray-500">Select the default language for the platform</p>
                </div>
                <select className="border rounded p-2">
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage security settings for the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">Require two-factor authentication for all users</p>
                </div>
                <Switch id="two-factor" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <p className="text-sm text-gray-500">Set the session timeout duration</p>
                </div>
                <Input id="session-timeout" type="number" className="w-24" defaultValue="30" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="password-policy">Password Policy</Label>
                  <p className="text-sm text-gray-500">Set the minimum password requirements</p>
                </div>
                <select className="border rounded p-2">
                  <option value="low">Low (6+ characters)</option>
                  <option value="medium">Medium (8+ characters, mixed case)</option>
                  <option value="high">High (10+ characters, mixed case, numbers, symbols)</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Database Management</CardTitle>
              <CardDescription>Manage database settings and operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Database Seeding</Label>
                <p className="text-sm text-gray-500">
                  Initialize the database with sample data for testing. This will create default users, courses, and
                  other records.
                </p>
                <Button onClick={handleSeedDatabase} disabled={isSeeding}>
                  {isSeeding ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Seeding Database...
                    </>
                  ) : (
                    "Seed Database"
                  )}
                </Button>
                {seedResult && (
                  <div
                    className={`mt-2 p-2 rounded text-sm ${seedResult.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {seedResult.message}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Database Backup</Label>
                <p className="text-sm text-gray-500">Create a backup of the current database state</p>
                <Button variant="outline">Create Backup</Button>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-gray-500">
                Note: Database operations may take some time to complete. Please be patient.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
