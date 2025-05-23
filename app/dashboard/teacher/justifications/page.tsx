"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, Eye, FileText, XCircle } from "lucide-react"

export default function JustificationsPage() {
  const [selectedJustification, setSelectedJustification] = useState<any | null>(null)
  const [reviewComment, setReviewComment] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [justifications, setJustifications] = useState([
    {
      id: "1",
      studentId: "S12346",
      studentName: "Fatima Zahra",
      courseId: "CS101",
      courseName: "Introduction to Computer Science",
      type: "COUR",
      date: "2023-05-15",
      submissionDate: "2023-05-16",
      reason: "Medical appointment",
      documentUrl: "/documents/justification1.pdf",
      status: "pending",
    },
    {
      id: "2",
      studentId: "S12347",
      studentName: "Mohammed Alaoui",
      courseId: "CS101",
      courseName: "Introduction to Computer Science",
      type: "COUR",
      date: "2023-05-15",
      submissionDate: "2023-05-17",
      reason: "Family emergency",
      documentUrl: "/documents/justification2.pdf",
      status: "approved",
      comment: "Valid documentation provided",
    },
    {
      id: "3",
      studentId: "S12349",
      studentName: "Youssef Mansouri",
      courseId: "CS101",
      courseName: "Introduction to Computer Science",
      type: "COUR",
      date: "2023-05-15",
      submissionDate: "2023-05-18",
      reason: "Transportation issues",
      documentUrl: "/documents/justification3.pdf",
      status: "rejected",
      comment: "Insufficient documentation",
    },
  ])

  const pendingJustifications = justifications.filter((j) => j.status === "pending")
  const reviewedJustifications = justifications.filter((j) => j.status !== "pending")

  const handleViewJustification = (justification: any) => {
    setSelectedJustification(justification)
    setReviewComment(justification.comment || "")
    setIsDialogOpen(true)
  }

  const handleApprove = async () => {
    if (!selectedJustification) return

    setIsSubmitting(true)

    try {
      // In a real implementation, this would call an API
      setTimeout(() => {
        setJustifications((prev) =>
          prev.map((j) =>
            j.id === selectedJustification.id ? { ...j, status: "approved", comment: reviewComment || "Approved" } : j,
          ),
        )
        setIsDialogOpen(false)
        setSelectedJustification(null)
        setReviewComment("")
        setIsSubmitting(false)
      }, 1000)
    } catch (error) {
      console.error("Error approving justification:", error)
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!selectedJustification) return

    if (!reviewComment) {
      alert("Please provide a reason for rejection")
      return
    }

    setIsSubmitting(true)

    try {
      // In a real implementation, this would call an API
      setTimeout(() => {
        setJustifications((prev) =>
          prev.map((j) =>
            j.id === selectedJustification.id ? { ...j, status: "rejected", comment: reviewComment } : j,
          ),
        )
        setIsDialogOpen(false)
        setSelectedJustification(null)
        setReviewComment("")
        setIsSubmitting(false)
      }, 1000)
    } catch (error) {
      console.error("Error rejecting justification:", error)
      setIsSubmitting(false)
    }
  }

  const getSessionTypeLabel = (type: string) => {
    switch (type) {
      case "COUR":
        return "Lecture"
      case "TD":
        return "Directed Work"
      case "TP":
        return "Practical Work"
      default:
        return type
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Absence Justifications</h1>

      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">
            Pending
            {pendingJustifications.length > 0 && (
              <Badge className="ml-2 bg-blue-100 text-blue-800">{pendingJustifications.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Justifications</CardTitle>
              <CardDescription>Review and approve or reject student absence justifications</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingJustifications.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Session Type</TableHead>
                      <TableHead>Absence Date</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingJustifications.map((justification) => (
                      <TableRow key={justification.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{justification.studentName}</div>
                            <div className="text-sm text-muted-foreground">{justification.studentId}</div>
                          </div>
                        </TableCell>
                        <TableCell>{justification.courseName}</TableCell>
                        <TableCell>{getSessionTypeLabel(justification.type)}</TableCell>
                        <TableCell>{new Date(justification.date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(justification.submissionDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewJustification(justification)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <p className="mt-2 text-muted-foreground">No pending justifications to review</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviewed">
          <Card>
            <CardHeader>
              <CardTitle>Reviewed Justifications</CardTitle>
              <CardDescription>Previously reviewed absence justifications</CardDescription>
            </CardHeader>
            <CardContent>
              {reviewedJustifications.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Absence Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviewedJustifications.map((justification) => (
                      <TableRow key={justification.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{justification.studentName}</div>
                            <div className="text-sm text-muted-foreground">{justification.studentId}</div>
                          </div>
                        </TableCell>
                        <TableCell>{justification.courseName}</TableCell>
                        <TableCell>{new Date(justification.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {justification.status === "approved" ? (
                            <Badge className="bg-green-100 text-green-800">Approved</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewJustification(justification)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <p className="mt-2 text-muted-foreground">No reviewed justifications</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Justification Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Justification Details</DialogTitle>
            <DialogDescription>Review the absence justification details</DialogDescription>
          </DialogHeader>

          {selectedJustification && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Student</h3>
                  <p className="font-medium">{selectedJustification.studentName}</p>
                  <p className="text-sm text-muted-foreground">{selectedJustification.studentId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Course</h3>
                  <p>{selectedJustification.courseName}</p>
                  <p className="text-sm text-muted-foreground">{getSessionTypeLabel(selectedJustification.type)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Absence Date</h3>
                  <p>{new Date(selectedJustification.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Submission Date</h3>
                  <p>{new Date(selectedJustification.submissionDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Reason</h3>
                <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">{selectedJustification.reason}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Supporting Document</h3>
                <Button variant="outline" size="sm" className="mt-1">
                  <FileText className="h-4 w-4 mr-2" />
                  View Document
                </Button>
              </div>

              {selectedJustification.status === "pending" ? (
                <div className="space-y-2">
                  <Label htmlFor="comment">Review Comment</Label>
                  <Textarea
                    id="comment"
                    placeholder="Add a comment (required for rejection)"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Review Comment</h3>
                  <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">{selectedJustification.comment}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {selectedJustification?.status === "pending" ? (
              <>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleReject} disabled={isSubmitting}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button variant="default" onClick={handleApprove} disabled={isSubmitting}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
