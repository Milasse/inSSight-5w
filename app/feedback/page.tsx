"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface HeardViaOption {
  id: string
  value: string
}

export default function Feedback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const attendanceId = searchParams.get("attendanceId")
  const { toast } = useToast()

  const [rating, setRating] = useState<number | null>(null)
  const [recommendScore, setRecommendScore] = useState<number | null>(null)
  const [heardVia, setHeardVia] = useState("")
  const [customHeardVia, setCustomHeardVia] = useState("")
  const [openEndedResponse, setOpenEndedResponse] = useState("")
  const [heardViaOptions, setHeardViaOptions] = useState<HeardViaOption[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch heard via options
  useEffect(() => {
    const fetchHeardViaOptions = async () => {
      try {
        // In a real app, you would fetch these from the API
        // For now, we'll use mock data
        setHeardViaOptions([
          { id: "1", value: "Email" },
          { id: "2", value: "Social Media" },
          { id: "3", value: "Friend" },
          { id: "4", value: "Professor" },
          { id: "5", value: "Flyer" },
          { id: "other", value: "Other" },
        ])
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching options:", error)
        toast({
          title: "Error",
          description: "Failed to load form options.",
          variant: "destructive",
        })
      }
    }

    fetchHeardViaOptions()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!attendanceId) {
      toast({
        title: "Error",
        description: "Attendance ID is missing.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attendanceId,
          rating,
          recommendScore,
          heardViaOptionId: heardVia === "other" ? null : heardVia,
          customHeardVia: heardVia === "other" ? customHeardVia : null,
          openEnded: {
            generalFeedback: openEndedResponse,
          },
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Feedback submitted",
          description: "Thank you for your feedback!",
        })

        // Redirect to home page
        router.push("/")
      } else {
        toast({
          title: "Submission failed",
          description: data.error || "Failed to submit feedback.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
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
        <p>Loading feedback form...</p>
      </div>
    )
  }

  if (!attendanceId) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid Request</CardTitle>
            <CardDescription>No attendance record specified.</CardDescription>
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
          <CardTitle>Event Feedback</CardTitle>
          <CardDescription>Please share your thoughts about the event</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label>How would you rate this event?</Label>
              <RadioGroup
                value={rating?.toString() || ""}
                onValueChange={(value) => setRating(Number.parseInt(value))}
                className="flex space-x-2"
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex flex-col items-center">
                    <RadioGroupItem value={value.toString()} id={`rating-${value}`} className="sr-only" />
                    <Label
                      htmlFor={`rating-${value}`}
                      className={`cursor-pointer rounded-full p-2 ${
                        rating === value ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      {value}
                    </Label>
                    <span className="text-xs mt-1">{value === 1 ? "Poor" : value === 5 ? "Excellent" : ""}</span>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>How likely are you to recommend this event to others?</Label>
              <RadioGroup
                value={recommendScore?.toString() || ""}
                onValueChange={(value) => setRecommendScore(Number.parseInt(value))}
                className="grid grid-cols-10 gap-1"
              >
                {Array.from({ length: 11 }, (_, i) => i).map((value) => (
                  <div key={value} className="flex flex-col items-center">
                    <RadioGroupItem value={value.toString()} id={`nps-${value}`} className="sr-only" />
                    <Label
                      htmlFor={`nps-${value}`}
                      className={`cursor-pointer rounded-full w-8 h-8 flex items-center justify-center ${
                        recommendScore === value ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      {value}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Not likely</span>
                <span>Very likely</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="heardVia">How did you hear about this event?</Label>
              <Select value={heardVia} onValueChange={setHeardVia}>
                <SelectTrigger id="heardVia">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {heardViaOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {heardVia === "other" && (
              <div className="space-y-2">
                <Label htmlFor="customHeardVia">Please specify</Label>
                <Input
                  id="customHeardVia"
                  placeholder="How did you hear about this event?"
                  value={customHeardVia}
                  onChange={(e) => setCustomHeardVia(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="openEndedResponse">Additional comments or suggestions</Label>
              <Textarea
                id="openEndedResponse"
                placeholder="Share your thoughts..."
                value={openEndedResponse}
                onChange={(e) => setOpenEndedResponse(e.target.value)}
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
