import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface NotificationBannerProps {
  title: string
  description: string
  variant?: "default" | "destructive"
}

export function NotificationBanner({ title, description, variant = "default" }: NotificationBannerProps) {
  return (
    <Alert variant={variant} className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}
