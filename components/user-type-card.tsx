import Link from "next/link"
import { GraduationCap, BookOpen, Building, Shield, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface UserTypeCardProps {
  title: string
  description: string
  icon: string
  color: string
  href: string
}

export function UserTypeCard({ title, description, icon, color, href }: UserTypeCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900",
    green:
      "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-950 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-900",
    amber:
      "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800 dark:hover:bg-amber-900",
    red: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900",
  }

  const getIcon = () => {
    switch (icon) {
      case "GraduationCap":
        return <GraduationCap className="h-8 w-8" />
      case "BookOpen":
        return <BookOpen className="h-8 w-8" />
      case "Building":
        return <Building className="h-8 w-8" />
      case "Shield":
        return <Shield className="h-8 w-8" />
      default:
        return <User className="h-8 w-8" />
    }
  }

  return (
    <Card className={`border-2 transition-all duration-300 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <CardHeader>
        <div className="flex items-center justify-center mb-2">{getIcon()}</div>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href={href} className="w-full">
          <Button variant="outline" className="w-full">
            Login
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
