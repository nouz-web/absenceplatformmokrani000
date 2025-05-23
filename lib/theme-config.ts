export const userTypeColors = {
  student: {
    primary: "#26ae99", // Teal
    secondary: "#e0f7f2",
    accent: "#1a8a7a",
  },
  teacher: {
    primary: "#2563eb", // Blue
    secondary: "#e0f2fe",
    accent: "#1d4ed8",
  },
  admin: {
    primary: "#f59e0b", // Amber
    secondary: "#fef3c7",
    accent: "#d97706",
  },
  "tech-admin": {
    primary: "#6366f1", // Indigo
    secondary: "#e0e7ff",
    accent: "#4f46e5",
  },
}

export const getUserTypeLabel = (userType: string): string => {
  switch (userType) {
    case "student":
      return "Student"
    case "teacher":
      return "Teacher"
    case "admin":
      return "Administrator"
    case "tech-admin":
      return "Technical Administrator"
    default:
      return "User"
  }
}

export const getUserTypeIcon = (userType: string): string => {
  switch (userType) {
    case "student":
      return "/images/student-icon.png"
    case "teacher":
      return "/images/teacher-icon.png"
    case "admin":
      return "/images/admin-icon.png"
    case "tech-admin":
      return "/images/tech-admin-icon.png"
    default:
      return "/images/user-icon.png"
  }
}
