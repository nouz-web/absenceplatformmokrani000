"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Edit } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function StatisticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingMetric, setEditingMetric] = useState<any>(null)
  const [editValue, setEditValue] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Mock data for system statistics
  const [systemStats, setSystemStats] = useState({
    totalUsers: 1350,
    activeUsers: {
      daily: 245,
      weekly: 780,
      monthly: 1120,
    },
    newUsers: {
      daily: 5,
      weekly: 25,
      monthly: 85,
    },
    logins: {
      daily: 320,
      weekly: 1850,
      monthly: 7200,
    },
    qrCodesGenerated: {
      daily: 45,
      weekly: 280,
      monthly: 1100,
    },
    justificationsSubmitted: {
      daily: 12,
      weekly: 75,
      monthly: 320,
    },
  })

  // Mock data for user activity by role
  const [userActivityByRole, setUserActivityByRole] = useState([
    {
      role: "Student",
      count: 1200,
      activeRate: 85,
      avgSessionsPerDay: 2.3,
    },
    {
      role: "Teacher",
      count: 85,
      activeRate: 92,
      avgSessionsPerDay: 4.1,
    },
    {
      role: "Admin",
      count: 15,
      activeRate: 95,
      avgSessionsPerDay: 5.7,
    },
    {
      role: "Tech Admin",
      count: 5,
      activeRate: 100,
      avgSessionsPerDay: 8.2,
    },
  ])

  // Mock data for system performance
  const [systemPerformance, setSystemPerformance] = useState([
    {
      id: 1,
      metric: "Average Response Time",
      value: "120ms",
      change: -5,
      status: "good",
    },
    {
      id: 2,
      metric: "CPU Utilization",
      value: "32%",
      change: 2,
      status: "good",
    },
    {
      id: 3,
      metric: "Memory Usage",
      value: "45%",
      change: 3,
      status: "good",
    },
    {
      id: 4,
      metric: "Database Size",
      value: "156 MB",
      change: 8,
      status: "warning",
    },
    {
      id: 5,
      metric: "Failed Logins",
      value: "12",
      change: -20,
      status: "good",
    },
  ])

  const getStatValue = (stat: any) => {
    switch (selectedPeriod) {
      case "day":
        return stat.daily
      case "week":
        return stat.weekly
      case "month":
        return stat.monthly
      default:
        return stat.monthly
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "good":
        return <Badge className="bg-green-100 text-green-800">Good</Badge>
      case "warning":
        return <Badge className="bg-amber-100 text-amber-800">Warning</Badge>
      case "critical":
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const exportStatistics = () => {
    // In a real implementation, this would generate a PDF or Excel file
    alert("Statistics exported successfully!")
  }

  const handleEditMetric = (metric: any) => {
    setEditingMetric(metric)
    setEditValue(metric.value)
    setIsEditDialogOpen(true)
  }

  const handleSaveMetric = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setSystemPerformance((prev) =>
        prev.map((item) => (item.id === editingMetric.id ? { ...item, value: editValue } : item)),
      )
      setIsEditDialogOpen(false)
      setIsSubmitting(false)
      setShowSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000)
    }, 800)
  }

  const handleEditUserStat = (role: string, field: string, value: number) => {
    setUserActivityByRole((prev) => prev.map((item) => (item.role === role ? { ...item, [field]: value } : item)))
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleEditSystemStat = (statKey: string, period: string, value: number) => {
    setSystemStats((prev) => ({
      ...prev,
      [statKey]: {
        ...prev[statKey as keyof typeof prev],
        [period]: value,
      },
    }))
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">System Statistics</h1>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportStatistics}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {showSuccess && (
        <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Statistics updated successfully.</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                const newValue = prompt(
                  "Enter new value for Active Users",
                  getStatValue(systemStats.activeUsers).toString(),
                )
                if (newValue && !isNaN(Number(newValue))) {
                  handleEditSystemStat(
                    "activeUsers",
                    selectedPeriod === "day" ? "daily" : selectedPeriod === "week" ? "weekly" : "monthly",
                    Number(newValue),
                  )
                }
              }}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatValue(systemStats.activeUsers)}</div>
            <p className="text-xs text-muted-foreground">
              {selectedPeriod === "day"
                ? "In the last 24 hours"
                : selectedPeriod === "week"
                  ? "In the last 7 days"
                  : "In the last 30 days"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                const newValue = prompt("Enter new value for New Users", getStatValue(systemStats.newUsers).toString())
                if (newValue && !isNaN(Number(newValue))) {
                  handleEditSystemStat(
                    "newUsers",
                    selectedPeriod === "day" ? "daily" : selectedPeriod === "week" ? "weekly" : "monthly",
                    Number(newValue),
                  )
                }
              }}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatValue(systemStats.newUsers)}</div>
            <p className="text-xs text-muted-foreground">
              {selectedPeriod === "day"
                ? "In the last 24 hours"
                : selectedPeriod === "week"
                  ? "In the last 7 days"
                  : "In the last 30 days"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Logins</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                const newValue = prompt("Enter new value for Logins", getStatValue(systemStats.logins).toString())
                if (newValue && !isNaN(Number(newValue))) {
                  handleEditSystemStat(
                    "logins",
                    selectedPeriod === "day" ? "daily" : selectedPeriod === "week" ? "weekly" : "monthly",
                    Number(newValue),
                  )
                }
              }}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatValue(systemStats.logins)}</div>
            <p className="text-xs text-muted-foreground">
              {selectedPeriod === "day"
                ? "In the last 24 hours"
                : selectedPeriod === "week"
                  ? "In the last 7 days"
                  : "In the last 30 days"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">QR Codes Generated</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                const newValue = prompt(
                  "Enter new value for QR Codes Generated",
                  getStatValue(systemStats.qrCodesGenerated).toString(),
                )
                if (newValue && !isNaN(Number(newValue))) {
                  handleEditSystemStat(
                    "qrCodesGenerated",
                    selectedPeriod === "day" ? "daily" : selectedPeriod === "week" ? "weekly" : "monthly",
                    Number(newValue),
                  )
                }
              }}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatValue(systemStats.qrCodesGenerated)}</div>
            <p className="text-xs text-muted-foreground">
              {selectedPeriod === "day"
                ? "In the last 24 hours"
                : selectedPeriod === "week"
                  ? "In the last 7 days"
                  : "In the last 30 days"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">User Statistics</TabsTrigger>
          <TabsTrigger value="performance">System Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Activity by Role</CardTitle>
              <CardDescription>Statistics on user activity grouped by role</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Total Users</TableHead>
                    <TableHead>Active Rate</TableHead>
                    <TableHead>Avg. Sessions Per Day</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userActivityByRole.map((role) => (
                    <TableRow key={role.role}>
                      <TableCell className="font-medium">{role.role}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {role.count}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              const newValue = prompt(`Enter new value for ${role.role} count`, role.count.toString())
                              if (newValue && !isNaN(Number(newValue))) {
                                handleEditUserStat(role.role, "count", Number(newValue))
                              }
                            }}
                          >
                            <Edit className="h-3 w-3" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              role.activeRate >= 90
                                ? "bg-green-100 text-green-800"
                                : role.activeRate >= 70
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {role.activeRate}%
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              const newValue = prompt(
                                `Enter new value for ${role.role} active rate`,
                                role.activeRate.toString(),
                              )
                              if (
                                newValue &&
                                !isNaN(Number(newValue)) &&
                                Number(newValue) >= 0 &&
                                Number(newValue) <= 100
                              ) {
                                handleEditUserStat(role.role, "activeRate", Number(newValue))
                              }
                            }}
                          >
                            <Edit className="h-3 w-3" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {role.avgSessionsPerDay}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              const newValue = prompt(
                                `Enter new value for ${role.role} average sessions`,
                                role.avgSessionsPerDay.toString(),
                              )
                              if (newValue && !isNaN(Number(newValue))) {
                                handleEditUserStat(role.role, "avgSessionsPerDay", Number(newValue))
                              }
                            }}
                          >
                            <Edit className="h-3 w-3" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newCount = prompt(`Enter new value for ${role.role} count`, role.count.toString())
                            const newActiveRate = prompt(
                              `Enter new value for ${role.role} active rate`,
                              role.activeRate.toString(),
                            )
                            const newAvgSessions = prompt(
                              `Enter new value for ${role.role} average sessions`,
                              role.avgSessionsPerDay.toString(),
                            )

                            if (newCount && !isNaN(Number(newCount))) {
                              handleEditUserStat(role.role, "count", Number(newCount))
                            }
                            if (
                              newActiveRate &&
                              !isNaN(Number(newActiveRate)) &&
                              Number(newActiveRate) >= 0 &&
                              Number(newActiveRate) <= 100
                            ) {
                              handleEditUserStat(role.role, "activeRate", Number(newActiveRate))
                            }
                            if (newAvgSessions && !isNaN(Number(newAvgSessions))) {
                              handleEditUserStat(role.role, "avgSessionsPerDay", Number(newAvgSessions))
                            }
                          }}
                        >
                          Edit All
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Additional User Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-medium">Most Active Hours</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          alert("This feature will be implemented in the next update.")
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">10 AM - 2 PM</div>
                      <p className="text-xs text-muted-foreground">Peak activity period</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-medium">Justifications Submitted</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          const newValue = prompt(
                            "Enter new value for Justifications Submitted",
                            getStatValue(systemStats.justificationsSubmitted).toString(),
                          )
                          if (newValue && !isNaN(Number(newValue))) {
                            handleEditSystemStat(
                              "justificationsSubmitted",
                              selectedPeriod === "day" ? "daily" : selectedPeriod === "week" ? "weekly" : "monthly",
                              Number(newValue),
                            )
                          }
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{getStatValue(systemStats.justificationsSubmitted)}</div>
                      <p className="text-xs text-muted-foreground">
                        {selectedPeriod === "day"
                          ? "In the last 24 hours"
                          : selectedPeriod === "week"
                            ? "In the last 7 days"
                            : "In the last 30 days"}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>System Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators for the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemPerformance.map((metric) => (
                    <TableRow key={metric.id}>
                      <TableCell className="font-medium">{metric.metric}</TableCell>
                      <TableCell>{metric.value}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {metric.change > 0 ? (
                            <span className="text-red-600">↑ {metric.change}%</span>
                          ) : (
                            <span className="text-green-600">↓ {Math.abs(metric.change)}%</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(metric.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleEditMetric(metric)}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">System Health</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          alert("This feature will be implemented in the next update.")
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">99.98%</div>
                      <p className="text-xs text-muted-foreground">Last 30 days</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          alert("This feature will be implemented in the next update.")
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">0.02%</div>
                      <p className="text-xs text-muted-foreground">Last 30 days</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          alert("This feature will be implemented in the next update.")
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">2 hours ago</div>
                      <p className="text-xs text-muted-foreground">Automatic daily backup</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Metric Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Metric</DialogTitle>
            <DialogDescription>Update the value for {editingMetric?.metric}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input id="value" value={editValue} onChange={(e) => setEditValue(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMetric} disabled={isSubmitting}>
              {isSubmitting ? <span>Saving...</span> : <span>Save Changes</span>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
