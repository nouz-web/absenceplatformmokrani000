"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { QrCode, Camera, AlertTriangle, Loader2, CheckCircle, Info, Smartphone } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { userTypeColors } from "@/lib/theme-config"

// Dynamically import jsQR to avoid SSR issues
let jsQR: any = null
if (typeof window !== "undefined") {
  import("jsqr")
    .then((module) => {
      jsQR = module.default
    })
    .catch((err) => {
      console.error("Failed to load jsQR:", err)
    })
}

export default function ScanQRCodePage() {
  const router = useRouter()
  const [scanning, setScanning] = useState(false)
  const [qrCode, setQrCode] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error" | "warning" | "info"; text: string } | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeTab, setActiveTab] = useState<"camera" | "manual">("manual") // Default to manual entry
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [attendanceResult, setAttendanceResult] = useState<any>(null)
  const [studentId, setStudentId] = useState("S12345") // Will be fetched from session
  const streamRef = useRef<MediaStream | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isCameraAvailable, setIsCameraAvailable] = useState(false)
  const [isEnvironmentSupported, setIsEnvironmentSupported] = useState(false)

  // Get student theme colors
  const userColors = userTypeColors.student

  // Check if camera is available
  const checkCameraAvailability = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        setIsCameraAvailable(false)
        setCameraError("Camera is not available or not supported in this browser")
        return false
      }

      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter((device) => device.kind === "videoinput")

      if (videoDevices.length === 0) {
        setIsCameraAvailable(false)
        setCameraError("No camera found connected to the device")
        return false
      }

      // Check if environment facing camera is available
      const hasEnvironmentCamera = videoDevices.some(
        (device) =>
          device.label.toLowerCase().includes("back") ||
          device.label.toLowerCase().includes("rear") ||
          device.label.toLowerCase().includes("environment"),
      )

      setIsEnvironmentSupported(hasEnvironmentCamera)
      setIsCameraAvailable(true)
      return true
    } catch (error) {
      console.error("Error checking camera:", error)
      setIsCameraAvailable(false)
      setCameraError("Error checking camera availability")
      return false
    }
  }, [])

  // Function to handle QR code detection
  const handleQRCodeDetected = useCallback(
    (code: string) => {
      if (qrCode === code) return

      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current)
        scanIntervalRef.current = null
      }

      setQrCode(code)
      stopScanner()

      // Vibrate if available
      if (navigator.vibrate) {
        navigator.vibrate(200)
      }

      toast({
        title: "QR Code Detected",
        description: `Code: ${code}`,
      })

      setMessage({
        type: "success",
        text: `QR code detected: ${code}. Click Submit Attendance to confirm your presence.`,
      })
    },
    [qrCode],
  )

  // Function to process video frame
  const processVideoFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !jsQR) {
      return false
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d", { willReadFrequently: true })

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) {
      return false
    }

    try {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      })

      if (code) {
        handleQRCodeDetected(code.data)
        return true
      }
    } catch (error) {
      console.error("Error processing video frame:", error)
    }

    return false
  }, [handleQRCodeDetected])

  // Function to stop scanner
  const stopScanner = useCallback(() => {
    setScanning(false)

    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.pause()
      if (videoRef.current.srcObject) {
        videoRef.current.srcObject = null
      }
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [])

  // Function to start scanner
  const startScanner = useCallback(async () => {
    setIsLoading(true)
    setMessage(null)
    setCameraError(null)

    // Check if camera is available first
    const isAvailable = await checkCameraAvailability()
    if (!isAvailable) {
      setIsLoading(false)
      return
    }

    try {
      // Try with environment camera first if supported
      const constraints: MediaStreamConstraints = {
        video: isEnvironmentSupported ? { facingMode: { exact: "environment" } } : true,
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current
                .play()
                .then(() => {
                  setScanning(true)
                  setIsLoading(false)

                  scanIntervalRef.current = setInterval(() => {
                    processVideoFrame()
                  }, 250)
                })
                .catch((error) => {
                  console.error("Error playing video:", error)
                  setIsLoading(false)
                  setCameraError("Failed to start camera")
                  stopScanner()
                })
            }
          }
        }
      } catch (exactError) {
        console.warn("Failed with exact environment camera, trying fallback:", exactError)

        // Fallback to any camera if environment camera fails
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          })

          streamRef.current = fallbackStream

          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream
            videoRef.current.onloadedmetadata = () => {
              if (videoRef.current) {
                videoRef.current
                  .play()
                  .then(() => {
                    setScanning(true)
                    setIsLoading(false)

                    scanIntervalRef.current = setInterval(() => {
                      processVideoFrame()
                    }, 250)
                  })
                  .catch((error) => {
                    console.error("Error playing video:", error)
                    setIsLoading(false)
                    setCameraError("Failed to start camera")
                    stopScanner()
                  })
              }
            }
          }
        } catch (fallbackError) {
          throw fallbackError // Re-throw to be caught by the outer catch
        }
      }
    } catch (error) {
      console.error("Camera error:", error)
      setIsLoading(false)
      setCameraError("Failed to access camera. Make sure you've granted camera permissions.")
      stopScanner()
    }
  }, [checkCameraAvailability, isEnvironmentSupported, processVideoFrame, stopScanner])

  // Function to submit attendance
  const handleSubmitAttendance = async () => {
    if (!qrCode) {
      setMessage({ type: "error", text: "No QR code detected. Please scan a code first." })
      return
    }

    setIsSubmitting(true)
    setMessage({ type: "info", text: "Recording attendance..." })

    try {
      const response = await fetch("/api/student/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qrCode,
          studentId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to record attendance")
      }

      const data = await response.json()

      setAttendanceResult(data)
      setMessage({
        type: "success",
        text: `Your attendance has been successfully recorded for ${data.module.name}!`,
      })

      toast({
        title: "Attendance Recorded!",
        description: `Your attendance has been recorded for ${data.module.name}`,
      })

      // Reset after success
      setTimeout(() => {
        setQrCode("")
        setAttendanceResult(null)
        setMessage(null)
      }, 3000)
    } catch (error: any) {
      console.error("Error submitting attendance:", error)
      setMessage({
        type: "error",
        text: error.message || "Failed to record attendance. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle manual QR code input
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (qrCode.trim()) {
      handleSubmitAttendance()
    }
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as "camera" | "manual")

    if (value === "camera") {
      startScanner()
    } else {
      stopScanner()
    }
  }

  // Initialize and check camera on mount
  useEffect(() => {
    const initCamera = async () => {
      await checkCameraAvailability()

      if (typeof window !== "undefined") {
        import("jsqr")
          .then((module) => {
            jsQR = module.default
          })
          .catch((err) => {
            console.error("Failed to load jsQR:", err)
          })
      }
    }

    initCamera()

    return () => {
      stopScanner()
    }
  }, [checkCameraAvailability, stopScanner])

  // Create a mock QR code for testing
  const createMockQRCode = () => {
    const mockCode = `COURSE-${Math.floor(Math.random() * 1000)}-${new Date().toISOString().split("T")[0]}`
    setQrCode(mockCode)
    setMessage({
      type: "success",
      text: `Test QR code created: ${mockCode}. Click Submit Attendance to confirm.`,
    })
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <Toaster />

      <Card style={{ borderTop: `4px solid ${userColors.primary}` }}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <QrCode className="h-6 w-6" style={{ color: userColors.primary }} />
            Attendance Registration
          </CardTitle>
          <CardDescription>Scan the QR code displayed by your teacher to register your attendance</CardDescription>
        </CardHeader>

        <CardContent>
          {attendanceResult ? (
            <div className="text-center py-8 space-y-4">
              <div className="text-green-500 flex justify-center">
                <CheckCircle className="h-16 w-16" />
              </div>
              <h3 className="text-xl font-medium">Attendance Successfully Recorded!</h3>
              <div className="p-4 rounded-lg" style={{ backgroundColor: userColors.secondary }}>
                <p className="font-medium">{attendanceResult.module.name}</p>
                <p className="text-sm text-gray-600">{attendanceResult.module.code}</p>
                <p className="text-sm text-gray-600">
                  {attendanceResult.session.type} - {attendanceResult.session.room}
                </p>
                <p className="text-sm text-gray-600">{attendanceResult.session.time}</p>
              </div>
              <Button
                onClick={() => {
                  setAttendanceResult(null)
                  setQrCode("")
                  setMessage(null)
                }}
                style={{ backgroundColor: userColors.primary }}
              >
                Scan Another Code
              </Button>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="camera" disabled={!isCameraAvailable}>
                  <Camera className="mr-2 h-4 w-4" />
                  Camera Scan
                </TabsTrigger>
                <TabsTrigger value="manual">
                  <Smartphone className="mr-2 h-4 w-4" />
                  Manual Entry
                </TabsTrigger>
              </TabsList>

              <TabsContent value="camera" className="space-y-4">
                {cameraError ? (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Camera Error</AlertTitle>
                    <AlertDescription>{cameraError}</AlertDescription>
                  </Alert>
                ) : (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      className="w-full rounded-lg"
                      style={{ display: scanning ? "block" : "none" }}
                      muted
                      playsInline
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {!scanning && !isLoading && (
                      <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Camera className="h-16 w-16 text-gray-400" />
                        <p className="text-gray-500">Click the button below to start scanning QR code</p>
                      </div>
                    )}

                    {isLoading && (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span className="ml-2">Starting camera...</span>
                      </div>
                    )}

                    {scanning && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                          className="w-64 h-64 border-2 border-dashed rounded-lg"
                          style={{ borderColor: userColors.primary }}
                        ></div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-center">
                  <Button
                    onClick={scanning ? stopScanner : startScanner}
                    disabled={isLoading || !!cameraError}
                    className="w-full"
                    style={{ backgroundColor: userColors.primary }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : scanning ? (
                      "Stop Camera"
                    ) : (
                      <>
                        <Camera className="mr-2 h-4 w-4" />
                        Start Camera
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="manual" className="space-y-4">
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Enter QR code manually"
                      value={qrCode}
                      onChange={(e) => setQrCode(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!qrCode.trim() || isSubmitting}
                    className="w-full"
                    style={{ backgroundColor: userColors.primary }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Attendance"
                    )}
                  </Button>
                </form>

                {/* Add mock QR code button for testing */}
                {process.env.NODE_ENV !== "production" && (
                  <Button variant="outline" onClick={createMockQRCode} className="w-full mt-2">
                    Create Test QR Code
                  </Button>
                )}
              </TabsContent>
            </Tabs>
          )}

          {message && (
            <Alert className="mt-4" variant={message.type === "error" ? "destructive" : "default"}>
              {message.type === "error" && <AlertTriangle className="h-4 w-4" />}
              {message.type === "success" && <CheckCircle className="h-4 w-4" />}
              {message.type === "info" && <Info className="h-4 w-4" />}
              <AlertTitle>
                {message.type === "success" ? "Success" : message.type === "error" ? "Error" : "Information"}
              </AlertTitle>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        {qrCode && !attendanceResult && (
          <CardFooter>
            <Button
              onClick={handleSubmitAttendance}
              disabled={isSubmitting}
              className="w-full"
              style={{ backgroundColor: userColors.primary }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recording Attendance...
                </>
              ) : (
                "Submit Attendance"
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
