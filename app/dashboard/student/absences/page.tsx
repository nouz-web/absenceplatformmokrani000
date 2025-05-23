"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, AlertCircle, FileText, Calendar, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

export default function StudentAbsencesPage() {
  const [attendanceData, setAttendanceData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedModule, setSelectedModule] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [activeTab, setActiveTab] = useState("records")

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true)
        // في التطبيق الحقيقي، سنحصل على معرف الطالب من الجلسة
        const studentId = "student1"
        const response = await fetch(`/api/student/attendance?studentId=${studentId}`)

        if (!response.ok) {
          throw new Error("فشل في جلب سجلات الحضور")
        }

        const data = await response.json()

        // تنظيم البيانات وحساب الإحصائيات
        const records = data.attendanceRecords || []
        const modules: any = {}
        let totalPresent = 0
        let totalAbsent = 0

        records.forEach((record: any) => {
          // حساب إجمالي الحضور والغياب
          if (record.status === "present") totalPresent++
          else if (record.status === "absent") totalAbsent++

          // تنظيم البيانات حسب الوحدة
          const moduleId = record.module_id
          if (!modules[moduleId]) {
            modules[moduleId] = {
              id: moduleId,
              name: record.modules?.name || "غير معروف",
              code: record.modules?.code || "",
              present: 0,
              absent: 0,
              total: 0,
              records: [],
            }
          }

          modules[moduleId].records.push(record)
          if (record.status === "present") modules[moduleId].present++
          else if (record.status === "absent") modules[moduleId].absent++
          modules[moduleId].total++
        })

        setAttendanceData({
          records,
          modules: Object.values(modules),
          stats: {
            totalPresent,
            totalAbsent,
            total: totalPresent + totalAbsent,
            presentPercentage: totalPresent + totalAbsent > 0 ? (totalPresent / (totalPresent + totalAbsent)) * 100 : 0,
          },
        })
      } catch (error) {
        console.error("Error fetching attendance:", error)
        setError("حدث خطأ أثناء جلب سجلات الحضور. يرجى المحاولة مرة أخرى.")
      } finally {
        setLoading(false)
      }
    }

    fetchAttendanceData()
  }, [])

  // تصفية السجلات حسب المعايير المحددة
  const getFilteredRecords = () => {
    if (!attendanceData?.records) return []

    return attendanceData.records.filter((record: any) => {
      const moduleMatch = selectedModule === "all" || record.module_id.toString() === selectedModule
      const statusMatch = selectedStatus === "all" || record.status === selectedStatus
      const dateMatch =
        (!startDate || new Date(record.date) >= new Date(startDate)) &&
        (!endDate || new Date(record.date) <= new Date(endDate))

      return moduleMatch && statusMatch && dateMatch
    })
  }

  // الحصول على اسم الوحدة من المعرف
  const getModuleName = (moduleId: number) => {
    const module = attendanceData?.modules.find((m: any) => m.id === moduleId)
    return module ? `${module.name} (${module.code})` : "غير معروف"
  }

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold mb-6">سجل الحضور والغياب</h1>
        <Card className="mb-4">
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

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

  // عرض رسالة الخطأ
  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold mb-6">سجل الحضور والغياب</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>خطأ</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const filteredRecords = getFilteredRecords()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">سجل الحضور والغياب</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          تصدير السجل
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="records">
            <FileText className="mr-2 h-4 w-4" />
            السجلات
          </TabsTrigger>
          <TabsTrigger value="stats">
            <Calendar className="mr-2 h-4 w-4" />
            الإحصائيات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="records">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                تصفية السجلات
              </CardTitle>
              <CardDescription>حدد معايير لتصفية سجلات الحضور والغياب</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="module">الوحدة التعليمية</Label>
                  <Select value={selectedModule} onValueChange={setSelectedModule}>
                    <SelectTrigger id="module">
                      <SelectValue placeholder="جميع الوحدات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الوحدات</SelectItem>
                      {attendanceData?.modules.map((module: any) => (
                        <SelectItem key={module.id} value={module.id.toString()}>
                          {module.name} ({module.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">الحالة</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="جميع الحالات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="present">حاضر</SelectItem>
                      <SelectItem value="absent">غائب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start-date">من تاريخ</Label>
                  <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-date">إلى تاريخ</Label>
                  <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>سجلات الحضور والغياب</CardTitle>
              <CardDescription>
                عرض {filteredRecords.length} من أصل {attendanceData?.records.length} سجل
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الوحدة التعليمية</TableHead>
                    <TableHead>نوع الحصة</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(record.date).toLocaleDateString("ar-MA")}</TableCell>
                        <TableCell>{getModuleName(record.module_id)}</TableCell>
                        <TableCell>{record.timetable?.session_type || "غير محدد"}</TableCell>
                        <TableCell>
                          {record.status === "present" ? (
                            <Badge className="bg-green-100 text-green-800">حاضر</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">غائب</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {record.status === "absent" && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={`/dashboard/student/justifications?absenceId=${record.id}`}>تقديم تبرير</a>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        لا توجد سجلات تطابق معايير البحث
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>ملخص الحضور</CardTitle>
              <CardDescription>إحصائيات الحضور والغياب الإجمالية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>نسبة الحضور الإجمالية</span>
                    <span className="font-medium">{attendanceData?.stats.presentPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={attendanceData?.stats.presentPercentage} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{attendanceData?.stats.total}</div>
                        <div className="text-sm text-muted-foreground">إجمالي الحصص</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">{attendanceData?.stats.totalPresent}</div>
                        <div className="text-sm text-muted-foreground">حضور</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600">{attendanceData?.stats.totalAbsent}</div>
                        <div className="text-sm text-muted-foreground">غياب</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تفاصيل الحضور حسب الوحدة</CardTitle>
              <CardDescription>إحصائيات الحضور والغياب لكل وحدة تعليمية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {attendanceData?.modules.map((module: any) => (
                  <div key={module.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">
                        {module.name} <span className="text-sm text-muted-foreground">({module.code})</span>
                      </h3>
                      <Badge variant="outline">
                        {module.present} / {module.total} حصة
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>نسبة الحضور</span>
                        <span>{module.total > 0 ? ((module.present / module.total) * 100).toFixed(1) : 0}%</span>
                      </div>
                      <Progress value={module.total > 0 ? (module.present / module.total) * 100 : 0} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
