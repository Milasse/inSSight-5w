"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface Event {
  id: string
  title: string
  dateTime: string
  typeOption?: { value: string } | null
  customType?: string | null
  locationOption?: { value: string } | null
  customLocation?: string | null
}

export default function CheckIn() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()

  const [studentId, setStudentId] = useState("")
  const [role, setRole] = useState("attendee")
  const [customRole, setCustomRole] = useState("")
  const [activeEvent, setActiveEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch active event
  useEffect(() => {
    const fetchActiveEvent = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/events/active")
        if (response.ok) {
          const data = await response.json()
          setActiveEvent(data)
        } else {
          toast({
            title: "No active events",
            description: "There are no active events at this time.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching active event:", error)
        toast({
          title: "Error",
          description: "Failed to fetch active events.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchActiveEvent()
  }, [toast])

  // Pre-fill student ID if logged in
  useEffect(() => {
    if (session?.user?.studentId) {
      setStudentId(session.user.studentId)
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!activeEvent) {
      toast({
        title: "No active event",
        description: "There is no active event to check in to.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/attendance/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          eventId: activeEvent.id,
          role,
          customRole: role === "other" ? customRole : null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Check-in successful",
          description: "You have been checked in to the event.",
        })

        // Redirect to feedback page
        router.push(`/feedback?attendanceId=${data.id}`)
      } else if (response.status === 409) {
        // Already checked in, redirect to feedback
        toast({
          title: "Already checked in",
          description: "You have already checked in to this event.",
        })
        router.push(`/feedback?attendanceId=${data.attendanceId}`)
      } else {
        toast({
          title: "Check-in failed",
          description: data.error || "Failed to check in to the event.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error checking in:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading active event...</p>
      </div>
    )
  }

  if (!activeEvent) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Active Events</CardTitle>
            <CardDescription>There are no active events at this time.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/")} className="w-full">
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Event Check-In</CardTitle>
          <CardDescription>{activeEvent.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID (S#)</Label>
              <Input
                id="studentId"
                placeholder="S12345678"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                disabled={!!session?.user?.studentId}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Your Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attendee">Attendee</SelectItem>
                  <SelectItem value="presenter">Presenter</SelectItem>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {role === "other" && (
              <div className="space-y-2">
                <Label htmlFor="customRole">Specify Role</Label>
                <Input
                  id="customRole"
                  placeholder="Your specific role"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Checking in..." : "Check In"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground">
            <p>
              <strong>Event:</strong> {activeEvent.title}
            </p>
            <p>
              <strong>Type:</strong> {activeEvent.typeOption?.value || activeEvent.customType || "N/A"}
            </p>
            <p>
              <strong>Location:</strong> {activeEvent.locationOption?.value || activeEvent.customLocation || "N/A"}
            </p>
            <p>
              <strong>Date/Time:</strong> {new Date(activeEvent.dateTime).toLocaleString()}
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
