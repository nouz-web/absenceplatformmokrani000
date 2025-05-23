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

export default function ModulesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProgram, setSelectedProgram] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedModule, setSelectedModule] = useState<any | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    program: "",
    semester: "1",
    credits: "3",
    type: "required",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock data for programs
  const programs = [
    { id: 1, name: "Computer Science", level: "license" },
    { id: 2, name: "Mathematics", level: "license" },
    { id: 3, name: "Physics", level: "license" },
    { id: 4, name: "Computer Engineering", level: "master" },
  ]

  // Mock data for modules
  const [modules, setModules] = useState([
    {
      id: 1,
      code: "CS101",
      name: "Introduction to Computer Science",
      program: "Computer Science",
      semester: 1,
      credits: 3,
      type: "required",
    },
    {
      id: 2,
      code: "CS102",
      name: "Programming Fundamentals",
      program: "Computer Science",
      semester: 1,
      credits: 4,
      type: "required",
    },
    {
      id: 3,
      code: "CS201",
      name: "Data Structures",
      program: "Computer Science",
      semester: 2,
      credits: 4,
      type: "required",
    },
    {
      id: 4,
      code: "MATH101",
      name: "Calculus I",
      program: "Mathematics",
      semester: 1,
      credits: 3,
      type: "required",
    },
    {
      id: 5,
      code: "PHYS101",
      name: "Mechanics",
      program: "Physics",
      semester: 1,
      credits: 4,
      type: "required",
    },
    {
      id: 6,
      code: "CS301",
      name: "Web Development",
      program: "Computer Science",
      semester: 3,
      credits: 3,
      type: "elective",
    },
  ])

  const filteredModules = modules.filter((module) => {
    return (
      (selectedProgram === "all" || module.program === selectedProgram) &&
      (!searchQuery ||
        module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.code.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddModule = () => {
    setFormData({
      code: "",
      name: "",
      program: programs[0].name,
      semester: "1",
      credits: "3",
      type: "required",
    })
    setIsAddDialogOpen(true)
  }

  const handleEditModule = (module: any) => {
    setSelectedModule(module)
    setFormData({
      code: module.code,
      name: module.name,
      program: module.program,
      semester: module.semester.toString(),
      credits: module.credits.toString(),
      type: module.type,
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteModule = (module: any) => {
    setSelectedModule(module)
    setIsDeleteDialogOpen(true)
  }

  const submitAddModule = async () => {
    if (!formData.code || !formData.name || !formData.program) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      // In a real implementation, this would call an API
      setTimeout(() => {
        const newModule = {
          id: modules.length + 1,
          code: formData.code,
          name: formData.name,
          program: formData.program,
          semester: Number.parseInt(formData.semester),
          credits: Number.parseInt(formData.credits),
          type: formData.type,
        }

        setModules((prev) => [...prev, newModule])
        setIsAddDialogOpen(false)
        setIsSubmitting(false)
      }, 1000)
    } catch (error) {
      console.error("Error adding module:", error)
      setIsSubmitting(false)
    }
  }

  const submitEditModule = async () => {
    if (!selectedModule) return

    if (!formData.code || !formData.name || !formData.program) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      // In a real implementation, this would call an API
      setTimeout(() => {
        setModules((prev) =>
          prev.map((module) =>
            module.id === selectedModule.id
              ? {
                  ...module,
                  code: formData.code,
                  name: formData.name,
                  program: formData.program,
                  semester: Number.parseInt(formData.semester),
                  credits: Number.parseInt(formData.credits),
                  type: formData.type,
                }
              : module,
          ),
        )
        setIsEditDialogOpen(false)
        setSelectedModule(null)
        setIsSubmitting(false)
      }, 1000)
    } catch (error) {
      console.error("Error editing module:", error)
      setIsSubmitting(false)
    }
  }

  const submitDeleteModule = async () => {
    if (!selectedModule) return

    setIsSubmitting(true)

    try {
      // In a real implementation, this would call an API
      setTimeout(() => {
        setModules((prev) => prev.filter((module) => module.id !== selectedModule.id))
        setIsDeleteDialogOpen(false)
        setSelectedModule(null)
        setIsSubmitting(false)
      }, 1000)
    } catch (error) {
      console.error("Error deleting module:", error)
      setIsSubmitting(false)
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "required":
        return <Badge className="bg-blue-100 text-blue-800">Required</Badge>
      case "elective":
        return <Badge className="bg-green-100 text-green-800">Elective</Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Modules</h1>
        <Button onClick={handleAddModule}>
          <Plus className="mr-2 h-4 w-4" />
          Add Module
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Modules</CardTitle>
          <CardDescription>Search and filter modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="program">Program</Label>
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger id="program">
                  <SelectValue placeholder="All programs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All programs</SelectItem>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.name}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by code or name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Modules List</CardTitle>
          <CardDescription>
            Showing {filteredModules.length} of {modules.length} modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModules.length > 0 ? (
                filteredModules.map((module) => (
                  <TableRow key={module.id}>
                    <TableCell className="font-medium">{module.code}</TableCell>
                    <TableCell>{module.name}</TableCell>
                    <TableCell>{module.program}</TableCell>
                    <TableCell>{module.semester}</TableCell>
                    <TableCell>{module.credits}</TableCell>
                    <TableCell>{getTypeBadge(module.type)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditModule(module)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteModule(module)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    No modules found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Module Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Module</DialogTitle>
            <DialogDescription>Create a new module</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Module Code</Label>
                <Input id="code" name="code" value={formData.code} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credits">Credits</Label>
                <Select value={formData.credits} onValueChange={(value) => handleSelectChange("credits", value)}>
                  <SelectTrigger id="credits">
                    <SelectValue placeholder="Select credits" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Module Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="program">Program</Label>
                <Select value={formData.program} onValueChange={(value) => handleSelectChange("program", value)}>
                  <SelectTrigger id="program">
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.name}>
                        {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Select value={formData.semester} onValueChange={(value) => handleSelectChange("semester", value)}>
                  <SelectTrigger id="semester">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="required">Required</SelectItem>
                  <SelectItem value="elective">Elective</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitAddModule} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Module"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Module Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Module</DialogTitle>
            <DialogDescription>Update module information</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code">Module Code</Label>
                <Input id="edit-code" name="code" value={formData.code} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-credits">Credits</Label>
                <Select value={formData.credits} onValueChange={(value) => handleSelectChange("credits", value)}>
                  <SelectTrigger id="edit-credits">
                    <SelectValue placeholder="Select credits" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-name">Module Name</Label>
              <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-program">Program</Label>
                <Select value={formData.program} onValueChange={(value) => handleSelectChange("program", value)}>
                  <SelectTrigger id="edit-program">
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.name}>
                        {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-semester">Semester</Label>
                <Select value={formData.semester} onValueChange={(value) => handleSelectChange("semester", value)}>
                  <SelectTrigger id="edit-semester">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="required">Required</SelectItem>
                  <SelectItem value="elective">Elective</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitEditModule} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Module"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Module Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Module</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this module? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedModule && (
            <div className="py-4">
              <p className="font-medium">
                {selectedModule.code}: {selectedModule.name}
              </p>
              <p className="text-sm text-muted-foreground">
                Program: {selectedModule.program} - Semester: {selectedModule.semester}
              </p>
              <p className="text-sm text-muted-foreground">
                Credits: {selectedModule.credits} - Type: {getTypeBadge(selectedModule.type)}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={submitDeleteModule} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete Module"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
