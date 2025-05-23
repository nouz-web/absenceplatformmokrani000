"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Clock, MapPin, User } from "lucide-react"

export default function StudentTimetablePage() {
  const [timetable, setTimetable] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeDay, setActiveDay] = useState<string>("1") // الاثنين كيوم افتراضي

  // أيام الأسبوع بالعربية
  const weekDays = {
    "1": "الاثنين",
    "2": "الثلاثاء",
    "3": "الأربعاء",
    "4": "الخميس",
    "5": "الجمعة",
    "6": "السبت",
    "7": "الأحد",
  }

  // ألوان لأنواع الجلسات
  const sessionColors = {
    محاضرة: "bg-blue-100 text-blue-800 border-blue-200",
    "أعمال موجهة": "bg-green-100 text-green-800 border-green-200",
    "أعمال تطبيقية": "bg-amber-100 text-amber-800 border-amber-200",
  }

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true)
        // في التطبيق الحقيقي، سنحصل على معرف الطالب من الجلسة
        const studentId = "student1"
        const response = await fetch(`/api/student/timetable?studentId=${studentId}`)

        if (!response.ok) {
          throw new Error("فشل في جلب الجدول الزمني")
        }

        const data = await response.json()
        setTimetable(data)
      } catch (error) {
        console.error("Error fetching timetable:", error)
        setError("حدث خطأ أثناء جلب الجدول الزمني. يرجى المحاولة مرة أخرى.")
      } finally {
        setLoading(false)
      }
    }

    fetchTimetable()
  }, [])

  // تحويل الوقت من تنسيق 24 ساعة إلى تنسيق 12 ساعة مع صباحاً/مساءً
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "م" : "ص"
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${minutes} ${ampm}`
  }

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold mb-6">الجدول الزمني</h1>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="mt-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4 mt-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // عرض رسالة الخطأ
  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold mb-6">الجدول الزمني</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-red-500">{error}</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // عرض الجدول الزمني
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-6">الجدول الزمني</h1>

      {timetable && (
        <>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>معلومات المجموعة</CardTitle>
              <CardDescription>
                {timetable.group.name} - {timetable.group.specializations.name}
              </CardDescription>
            </CardHeader>
          </Card>

          <Tabs defaultValue="1" value={activeDay} onValueChange={setActiveDay}>
            <TabsList className="grid grid-cols-5 mb-4">
              {Object.entries(weekDays)
                .slice(0, 5)
                .map(([value, day]) => (
                  <TabsTrigger key={value} value={value}>
                    {day}
                  </TabsTrigger>
                ))}
            </TabsList>

            {Object.entries(weekDays)
              .slice(0, 5)
              .map(([value, day]) => (
                <TabsContent key={value} value={value}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="mr-2 h-5 w-5" />
                        جدول يوم {day}
                      </CardTitle>
                      <CardDescription>
                        {timetable.timetable[value]?.length
                          ? `${timetable.timetable[value].length} حصص مبرمجة`
                          : "لا توجد حصص مبرمجة لهذا اليوم"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {timetable.timetable[value]?.length ? (
                          timetable.timetable[value]
                            .sort((a: any, b: any) => a.start_time.localeCompare(b.start_time))
                            .map((session: any, index: number) => (
                              <div key={index} className="border rounded-lg overflow-hidden">
                                <div
                                  className={`p-4 ${
                                    sessionColors[session.session_type as keyof typeof sessionColors] ||
                                    "bg-gray-100 text-gray-800 border-gray-200"
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <h3 className="font-medium text-lg">{session.modules.name}</h3>
                                    <Badge variant="outline">{session.session_type}</Badge>
                                  </div>
                                  <div className="mt-2 space-y-1 text-sm">
                                    <div className="flex items-center">
                                      <Clock className="mr-2 h-4 w-4" />
                                      <span>
                                        {formatTime(session.start_time)} - {formatTime(session.end_time)}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <MapPin className="mr-2 h-4 w-4" />
                                      <span>{session.room}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <User className="mr-2 h-4 w-4" />
                                      <span>{session.users?.name || "غير محدد"}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">لا توجد حصص مبرمجة لهذا اليوم</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
          </Tabs>
        </>
      )}
    </div>
  )
}
