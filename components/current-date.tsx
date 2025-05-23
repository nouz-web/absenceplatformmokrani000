"use client"

import { useState, useEffect } from "react"

export function CurrentDate() {
  const [date, setDate] = useState<Date>(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date())
    }, 60000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date)

  return (
    <div className="text-sm text-muted-foreground">
      <span>{formattedDate}</span>
      <span className="mx-1">|</span>
      <span>{formattedTime}</span>
    </div>
  )
}
