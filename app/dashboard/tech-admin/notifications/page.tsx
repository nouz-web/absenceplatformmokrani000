"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Edit, Plus, Trash, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NotificationsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    targetAudience: "all",
    priority: "normal",
    expiresAt: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Mock data for notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "System Maintenance",
      message: "The system will be down for maintenance on Saturday from 2 AM to 4 AM.",
      active: true,
      targetAudience: "all",
      priority: "high",
      expiresAt: "2023-06-15",
      createdAt: "2023-05-15",
      createdBy: "Technical Administrator",
    },
    {
      id: 2,
      title: "New Feature: QR Code Scanning",
      message:
        "Students can now scan QR codes to register attendance. Teachers can generate QR codes from their dashboard.",
      active: true,
      targetAudience: "students,teachers",
      priority: "normal",
      expiresAt: "2023-06-30",
      createdAt: "2023-05-10",
      createdBy: "Technical Administrator",
    },
    {
      id: 3,
      title: "End of Semester Reminder",
      message: "The current semester ends on June 15. Please ensure all attendance records are up to date.",
      active: true,
      targetAudience: "teachers,admin",
      priority: "normal",
      expiresAt: "2023-06-10",
      createdAt: "2023-05-05",
      createdBy: "Administration",
    },
    {
      id: 4,
      title: "Password Reset Required",
      message: "All users are required to reset their passwords by the end of the month for security purposes.",
      active: false,
      targetAudience: "all",
      priority: "high",
      expiresAt: "2023-05-31",
      createdAt: "2023-04-20",
      createdBy: "Technical Administrator",
    },
  ])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddNotification = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 7)

    setFormData({
      title: "",
      message: "",
      targetAudience: "all",
      priority: "normal",
      expiresAt: tomorrow.toISOString().split("T")[0],
    })
    setIsAddDialogOpen(true)
  }

  const handleEditNotification = (notification: any) => {
    setSelectedNotification(notification)
    setFormData({
      title: notification.title,
      message: notification.message,
      targetAudience: notification.targetAudience,
      priority: notification.priority,
      expiresAt: notification.expiresAt,
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteNotification = (notification: any) => {
    setSelectedNotification(notification)
    setIsDeleteDialogOpen(true)
  }

  const toggleNotificationStatus = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, active: !notification.active } : notification,
      ),
    )

    setSuccessMessage("Notification status updated successfully")
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const submitAddNotification = async () => {
    if (!formData.title || !formData.message) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      // In a real implementation, this would call an API
      setTimeout(() => {
        const newNotification = {
          id: notifications.length + 1,
          title: formData.title,
          message: formData.message,
          active: true,
          targetAudience: formData.targetAudience,
          priority: formData.priority,
          expiresAt: formData.expiresAt,
          createdAt: new Date().toISOString().split("T")[0],
          createdBy: "Technical Administrator",
        }

        setNotifications((prev) => [...prev, newNotification])
        setIsAddDialogOpen(false)
        setIsSubmitting(false)

        setSuccessMessage("Notification created successfully")
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }, 1000)
    } catch (error) {
      console.error("Error adding notification:", error)
      setIsSubmitting(false)
    }
  }

  const submitEditNotification = async () => {
    if (!selectedNotification) return

    if (!formData.title || !formData.message) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      // In a real implementation, this would call an API
      setTimeout(() => {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === selectedNotification.id
              ? {
                  ...notification,
                  title: formData.title,
                  message: formData.message,
                  targetAudience: formData.targetAudience,
                  priority: formData.priority,
                  expiresAt: formData.expiresAt,
                }
              : notification,
          ),
        )
        setIsEditDialogOpen(false)
        setSelectedNotification(null)
        setIsSubmitting(false)

        setSuccessMessage("Notification updated successfully")
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }, 1000)
    } catch (error) {
      console.error("Error editing notification:", error)
      setIsSubmitting(false)
    }
  }

  const submitDeleteNotification = async () => {
    if (!selectedNotification) return

    setIsSubmitting(true)

    try {
      // In a real implementation, this would call an API
      setTimeout(() => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== selectedNotification.id))
        setIsDeleteDialogOpen(false)
        setSelectedNotification(null)
        setIsSubmitting(false)

        setSuccessMessage("Notification deleted successfully")
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }, 1000)
    } catch (error) {
      console.error("Error deleting notification:", error)
      setIsSubmitting(false)
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>
      case "normal":
        return <Badge className="bg-blue-100 text-blue-800">Normal</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default:
        return <Badge>{priority}</Badge>
    }
  }

  const formatTargetAudience = (audience: string) => {
    if (audience === "all") return "All Users"

    return audience
      .split(",")
      .map((a) => a.charAt(0).toUpperCase() + a.slice(1))
      .join(", ")
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications Management</h1>
        <Button onClick={handleAddNotification}>
          <Plus className="mr-2 h-4 w-4" />
          Add Notification
        </Button>
      </div>

      {showSuccess && (
        <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>System Notifications</CardTitle>
          <CardDescription>Manage notifications displayed to users</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Target Audience</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell className="font-medium">{notification.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{notification.message}</TableCell>
                    <TableCell>{formatTargetAudience(notification.targetAudience)}</TableCell>
                    <TableCell>{getPriorityBadge(notification.priority)}</TableCell>
                    <TableCell>{notification.expiresAt}</TableCell>
                    <TableCell>
                      {notification.active ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => toggleNotificationStatus(notification.id)}>
                          {notification.active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditNotification(notification)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteNotification(notification)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    No notifications found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Notification Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Notification</DialogTitle>
            <DialogDescription>Create a new system notification</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Select
                value={formData.targetAudience}
                onValueChange={(value) => handleSelectChange("targetAudience", value)}
              >
                <SelectTrigger id="targetAudience">
                  <SelectValue placeholder="Select target audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="students">Students Only</SelectItem>
                  <SelectItem value="teachers">Teachers Only</SelectItem>
                  <SelectItem value="admin">Administrators Only</SelectItem>
                  <SelectItem value="students,teachers">Students and Teachers</SelectItem>
                  <SelectItem value="teachers,admin">Teachers and Administrators</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expiration Date</Label>
              <Input
                id="expiresAt"
                name="expiresAt"
                type="date"
                value={formData.expiresAt}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitAddNotification} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Notification"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Notification Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Notification</DialogTitle>
            <DialogDescription>Update notification information</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input id="edit-title" name="title" value={formData.title} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-message">Message</Label>
              <Textarea
                id="edit-message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-targetAudience">Target Audience</Label>
              <Select
                value={formData.targetAudience}
                onValueChange={(value) => handleSelectChange("targetAudience", value)}
              >
                <SelectTrigger id="edit-targetAudience">
                  <SelectValue placeholder="Select target audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="students">Students Only</SelectItem>
                  <SelectItem value="teachers">Teachers Only</SelectItem>
                  <SelectItem value="admin">Administrators Only</SelectItem>
                  <SelectItem value="students,teachers">Students and Teachers</SelectItem>
                  <SelectItem value="teachers,admin">Teachers and Administrators</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                <SelectTrigger id="edit-priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-expiresAt">Expiration Date</Label>
              <Input
                id="edit-expiresAt"
                name="expiresAt"
                type="date"
                value={formData.expiresAt}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitEditNotification} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Notification"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Notification Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Notification</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this notification? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedNotification && (
            <div className="py-4">
              <p className="font-medium">{selectedNotification.title}</p>
              <p className="text-sm text-muted-foreground">{selectedNotification.message}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Created on {selectedNotification.createdAt} by {selectedNotification.createdBy}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={submitDeleteNotification} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete Notification"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
