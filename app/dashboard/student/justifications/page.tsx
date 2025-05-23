"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Check, AlertCircle, Loader2, FileText } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function JustificationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const absenceId = searchParams.get("absenceId")

  const [activeTab, setActiveTab] = useState(absenceId ? "submit" : "history")
  const [absenceDate, setAbsenceDate] = useState("")
  const [moduleId, setModuleId] = useState("")
  const [reason, setReason] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [justifications, setJustifications] = useState<any[]>([])
  const [modules, setModules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJustifications = async () => {
      try {
        setLoading(true)
        // في التطبيق الحقيقي، سنحصل على معرف الطالب من الجلسة
        const studentId = "student1"
        const response = await fetch(`/api/student/justifications?studentId=${studentId}`)

        if (!response.ok) {
          throw new Error("فشل في جلب التبريرات")
        }

        const data = await response.json()
        setJustifications(data.justifications || [])

        // استخراج الوحدات الفريدة من التبريرات
        const uniqueModules = new Map()
        data.justifications.forEach((justification: any) => {
          if (justification.modules) {
            uniqueModules.set(justification.modules.id, justification.modules)
          }
        })
        setModules(Array.from(uniqueModules.values()))

        // إذا كان هناك معرف غياب في الرابط، نحاول الحصول على تفاصيله
        if (absenceId) {
          // في التطبيق الحقيقي، سنقوم بجلب تفاصيل الغياب من الخادم
          // هنا نستخدم قيمة افتراضية للتوضيح
          setAbsenceDate(new Date().toISOString().split("T")[0])
          setModuleId("1") // قيمة افتراضية
        }
      } catch (error) {
        console.error("Error fetching justifications:", error)
        setMessage({ type: "error", text: "حدث خطأ أثناء جلب التبريرات. يرجى المحاولة مرة أخرى." })
      } finally {
        setLoading(false)
      }
    }

    fetchJustifications()
  }, [absenceId])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!absenceDate || !moduleId || !reason) {
      setMessage({ type: "error", text: "يرجى ملء جميع الحقول المطلوبة" })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      // في التطبيق الحقيقي، سنقوم بإرسال البيانات إلى الخادم
      const formData = new FormData()
      formData.append("studentId", "student1") // في التطبيق الحقيقي، سنحصل على معرف الطالب من الجلسة
      formData.append("moduleId", moduleId)
      formData.append("absenceDate", absenceDate)
      formData.append("reason", reason)
      if (file) {
        formData.append("file", file)
      }

      const response = await fetch("/api/student/justifications", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "فشل في تقديم التبرير")
      }

      setMessage({
        type: "success",
        text: "تم تقديم التبرير بنجاح! سيتم مراجعته من قبل الأستاذ.",
      })

      // إعادة تعيين النموذج
      setAbsenceDate("")
      setModuleId("")
      setReason("")
      setFile(null)

      // الانتقال إلى تبويب السجل بعد فترة
      setTimeout(() => {
        setActiveTab("history")
      }, 2000)
    } catch (error: any) {
      console.error("Error submitting justification:", error)
      setMessage({ type: "error", text: error.message || "فشل في تقديم التبرير. يرجى المحاولة مرة أخرى." })
    } finally {
      setIsSubmitting(false)
    }
  }

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold mb-6">تبريرات الغياب</h1>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-6">تبريرات الغياب</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="submit">
            <Upload className="mr-2 h-4 w-4" />
            تقديم تبرير
          </TabsTrigger>
          <TabsTrigger value="history">
            <FileText className="mr-2 h-4 w-4" />
            سجل التبريرات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="submit">
          <Card>
            <CardHeader>
              <CardTitle>تقديم تبرير غياب</CardTitle>
              <CardDescription>قم بتعبئة النموذج وإرفاق المستندات المطلوبة</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {message && (
                  <Alert variant={message.type === "success" ? "default" : "destructive"}>
                    {message.type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertTitle>{message.type === "success" ? "نجاح" : "خطأ"}</AlertTitle>
                    <AlertDescription>{message.text}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="absence-date">تاريخ الغياب</Label>
                  <Input
                    id="absence-date"
                    type="date"
                    value={absenceDate}
                    onChange={(e) => setAbsenceDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="module">الوحدة التعليمية</Label>
                  <Select value={moduleId} onValueChange={setModuleId} required>
                    <SelectTrigger id="module">
                      <SelectValue placeholder="اختر الوحدة التعليمية" />
                    </SelectTrigger>
                    <SelectContent>
                      {modules.map((module) => (
                        <SelectItem key={module.id} value={module.id.toString()}>
                          {module.name} ({module.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">سبب الغياب</Label>
                  <Textarea
                    id="reason"
                    placeholder="اشرح سبب غيابك"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document">المستند الداعم (اختياري)</Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="document"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">انقر للرفع</span> أو اسحب وأفلت
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PDF أو صورة (الحد الأقصى 5 ميجابايت)</p>
                      </div>
                      <Input
                        id="document"
                        type="file"
                        className="hidden"
                        accept=".pdf,image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  {file && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">الملف المحدد: {file.name}</p>}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      جاري التقديم...
                    </>
                  ) : (
                    "تقديم التبرير"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>سجل التبريرات</CardTitle>
              <CardDescription>عرض {justifications.length} تبرير</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الوحدة التعليمية</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>تاريخ التقديم</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {justifications.length > 0 ? (
                    justifications.map((justification, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {justification.attendance?.date
                            ? new Date(justification.attendance.date).toLocaleDateString("ar-MA")
                            : "غير محدد"}
                        </TableCell>
                        <TableCell>
                          {justification.modules
                            ? `${justification.modules.name} (${justification.modules.code})`
                            : "غير محدد"}
                        </TableCell>
                        <TableCell>
                          {justification.status === "approved" ? (
                            <Badge className="bg-green-100 text-green-800">مقبول</Badge>
                          ) : justification.status === "rejected" ? (
                            <Badge className="bg-red-100 text-red-800">مرفوض</Badge>
                          ) : (
                            <Badge className="bg-blue-100 text-blue-800">قيد المراجعة</Badge>
                          )}
                        </TableCell>
                        <TableCell>{new Date(justification.submitted_at).toLocaleDateString("ar-MA")}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        لا توجد تبريرات مسجلة
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
