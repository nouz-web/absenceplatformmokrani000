"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Edit, Plus, Search, Trash } from "lucide-react"

export default function ProgramsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    level: "license",
    department: "",
    duration: "3",
    status: "active",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock data for programs
  const [programs, setPrograms] = useState([
    {
      id: 1,
      name: "Computer Science",
      level: "license",
      department: "Computer Science",
      duration: 3,
      status: "active",
      students: 120,
    },
    {
      id: 2,
      name: "Mathematics",
      level: "license",
      department: "Mathematics",
      duration: 3,
      status: "active",
      students: 85,
    },
    {
      id: 3,
      name: "Physics",
      level: "license",
      department: "Physics",
      duration: 3,
      status: "active",
      students: 65,
    },
    {
      id: 4,
      name: "Computer Engineering",
      level: "master",
      department: "Computer Science",
      duration: 2,
      status: "active",
      students: 45,
    },
    {
      id: 5,
      name: "Data Science",
      level: "master",
      department: "Computer Science",
      duration: 2,
      status: "planned",
      students: 0,
    },
  ])

  const filteredPrograms = programs.filter((program) => {
    return (
      !searchQuery ||
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.department.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddProgram = () => {
    setFormData({
      name: "",
      level: "license",
      department: "",
      duration: "3",
      status: "active",
    })
    setIsAddDialogOpen(true)
  }

  const handleEditProgram = (program: any) => {
    setSelectedProgram(program)
    setFormData({
      name: program.name,
      level: program.level,
      department: program.department,
      duration: program.duration.toString(),
      status: program.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteProgram = (program: any) => {
    setSelectedProgram(program)
    setIsDeleteDialogOpen(true)
  }

  const submitAddProgram = async () => {
    if (!formData.name || !formData.department) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      // In a real implementation, this would call an API
      setTimeout(() => {
        const newProgram = {
          id: programs.length + 1,
          name: formData.name,
          level: formData.level,
          department: formData.department,
          duration: Number.parseInt(formData.duration),
          status: formData.status,
          students: 0,
        }

        setPrograms((prev) => [...prev, newProgram])
        setIsAddDialogOpen(false)
        setIsSubmitting(false)
      }, 1000)
    } catch (error) {
      console.error("Error adding program:", error)
      setIsSubmitting(false)
    }
  }

  const submitEditProgram = async () => {
    if (!selectedProgram) return

    if (!formData.name || !formData.department) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      // In a real implementation, this would call an API
      setTimeout(() => {
        setPrograms((prev) =>
          prev.map((program) =>
            program.id === selectedProgram.id
              ? {
                  ...program,
                  name: formData.name,
                  level: formData.level,
                  department: formData.department,
                  duration: Number.parseInt(formData.duration),
                  status: formData.status,
                }
              : program,
          ),
        )
        setIsEditDialogOpen(false)
        setSelectedProgram(null)
        setIsSubmitting(false)
      }, 1000)
    } catch (error) {
      console.error("Error editing program:", error)
      setIsSubmitting(false)
    }
  }

  const submitDeleteProgram = async () => {
    if (!selectedProgram) return

    setIsSubmitting(true)

    try {
      // In a real implementation, this would call an API
      setTimeout(() => {
        setPrograms((prev) => prev.filter((program) => program.id !== selectedProgram.id))
        setIsDeleteDialogOpen(false)
        setSelectedProgram(null)
        setIsSubmitting(false)
      }, 1000)
    } catch (error) {
      console.error("Error deleting program:", error)
      setIsSubmitting(false)
    }
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "license":
        return <Badge className="bg-blue-100 text-blue-800">License</Badge>
      case "master":
        return <Badge className="bg-green-100 text-green-800">Master</Badge>
      case "doctorate":
        return <Badge className="bg-purple-100 text-purple-800">Doctorate</Badge>
      default:
        return <Badge>{level}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "planned":
        return <Badge className="bg-amber-100 text-amber-800">Planned</Badge>
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Academic Programs</h1>
        <Button onClick={handleAddProgram}>
          <Plus className="mr-2 h-4 w-4" />
          Add Program
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Programs</CardTitle>
          <CardDescription>Search by program name or department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Programs List</CardTitle>
          <CardDescription>
            Showing {filteredPrograms.length} of {programs.length} programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program Name</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.name}</TableCell>
                    <TableCell>{getLevelBadge(program.level)}</TableCell>
                    <TableCell>{program.department}</TableCell>
                    <TableCell>{program.duration} years</TableCell>
                    <TableCell>{program.students}</TableCell>
                    <TableCell>{getStatusBadge(program.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditProgram(program)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteProgram(program)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    No programs found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Program Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Program</DialogTitle>
            <DialogDescription>Create a new academic program</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Program Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select value={formData.level} onValueChange={(value) => handleSelectChange("level", value)}>
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="license">License</SelectItem>
                    <SelectItem value="master">Master</SelectItem>
                    <SelectItem value="doctorate">Doctorate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (years)</Label>
                <Select value={formData.duration} onValueChange={(value) => handleSelectChange("duration", value)}>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitAddProgram} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Program"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Program Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Program</DialogTitle>
            <DialogDescription>Update program information</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Program Name</Label>
              <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-level">Level</Label>
                <Select value={formData.level} onValueChange={(value) => handleSelectChange("level", value)}>
                  <SelectTrigger id="edit-level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="license">License</SelectItem>
                    <SelectItem value="master">Master</SelectItem>
                    <SelectItem value="doctorate">Doctorate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration (years)</Label>
                <Select value={formData.duration} onValueChange={(value) => handleSelectChange("duration", value)}>
                  <SelectTrigger id="edit-duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-department">Department</Label>
              <Input
                id="edit-department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitEditProgram} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Program"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Program Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Program</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this program? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedProgram && (
            <div className="py-4">
              <p className="font-medium">{selectedProgram.name}</p>
              <p className="text-sm text-muted-foreground">
                {getLevelBadge(selectedProgram.level)} - {selectedProgram.department}
              </p>
              <p className="text-sm text-muted-foreground">
                Duration: {selectedProgram.duration} years - Students: {selectedProgram.students}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={submitDeleteProgram} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete Program"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
