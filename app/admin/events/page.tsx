"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { DatePicker } from "@/components/ui/date-picker"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Mock data for events
const mockEvents = [
  {
    id: "1",
    title: "Career Development Workshop",
    type: "Workshop",
    location: "Student Center Room 101",
    dateTime: new Date("2023-11-15T14:00:00"),
    isActive: true,
  },
  {
    id: "2",
    title: "Resume Building Seminar",
    type: "Seminar",
    location: "Library Conference Room",
    dateTime: new Date("2023-11-20T10:00:00"),
    isActive: false,
  },
  {
    id: "3",
    title: "Fall Career Fair",
    type: "Career Fair",
    location: "Main Gymnasium",
    dateTime: new Date("2023-12-05T09:00:00"),
    isActive: false,
  },
]

export default function EventsPage() {
  const { toast } = useToast()
  const [events, setEvents] = useState(mockEvents)
  const [title, setTitle] = useState("")
  const [eventType, setEventType] = useState("")
  const [customType, setCustomType] = useState("")
  const [location, setLocation] = useState("")
  const [customLocation, setCustomLocation] = useState("")
  const [eventDate, setEventDate] = useState<Date | undefined>(new Date())
  const [eventTime, setEventTime] = useState("12:00")
  const [isActive, setIsActive] = useState(false)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Combine date and time
    const dateTime = eventDate ? new Date(eventDate) : new Date()
    const [hours, minutes] = eventTime.split(":").map(Number)
    dateTime.setHours(hours, minutes)

    if (editingEventId) {
      // Update existing event
      setEvents(
        events.map((event) =>
          event.id === editingEventId
            ? {
                ...event,
                title,
                type: eventType === "other" ? customType : eventType,
                location: location === "other" ? customLocation : location,
                dateTime,
                isActive,
              }
            : event,
        ),
      )

      toast({
        title: "Event updated",
        description: "The event has been updated successfully.",
      })
    } else {
      // Create new event
      const newEvent = {
        id: Date.now().toString(),
        title,
        type: eventType === "other" ? customType : eventType,
        location: location === "other" ? customLocation : location,
        dateTime,
        isActive,
      }

      setEvents([...events, newEvent])

      toast({
        title: "Event created",
        description: "The event has been created successfully.",
      })
    }

    // Reset form
    resetForm()
  }

  const handleEdit = (event: (typeof mockEvents)[0]) => {
    setEditingEventId(event.id)
    setTitle(event.title)
    setEventType(
      event.type === "Workshop" || event.type === "Seminar" || event.type === "Career Fair" ? event.type : "other",
    )
    setCustomType(
      event.type === "Workshop" || event.type === "Seminar" || event.type === "Career Fair" ? "" : event.type,
    )
    setLocation(
      event.location === "Student Center Room 101" ||
        event.location === "Library Conference Room" ||
        event.location === "Main Gymnasium"
        ? event.location
        : "other",
    )
    setCustomLocation(
      event.location === "Student Center Room 101" ||
        event.location === "Library Conference Room" ||
        event.location === "Main Gymnasium"
        ? ""
        : event.location,
    )
    setEventDate(event.dateTime)
    setEventTime(
      `${event.dateTime.getHours().toString().padStart(2, "0")}:${event.dateTime.getMinutes().toString().padStart(2, "0")}`,
    )
    setIsActive(event.isActive)
  }

  const handleDelete = (id: string) => {
    setEvents(events.filter((event) => event.id !== id))

    toast({
      title: "Event deleted",
      description: "The event has been deleted successfully.",
    })
  }

  const resetForm = () => {
    setEditingEventId(null)
    setTitle("")
    setEventType("")
    setCustomType("")
    setLocation("")
    setCustomLocation("")
    setEventDate(new Date())
    setEventTime("12:00")
    setIsActive(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Events</h1>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Event List</TabsTrigger>
          <TabsTrigger value="create">{editingEventId ? "Edit Event" : "Create Event"}</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>All Events</CardTitle>
              <CardDescription>Manage your events and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{event.type}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>
                          {event.dateTime.toLocaleDateString()}{" "}
                          {event.dateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              event.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {event.isActive ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(event)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {events.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No events found. Create your first event.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>{editingEventId ? "Edit Event" : "Create New Event"}</CardTitle>
              <CardDescription>
                {editingEventId
                  ? "Update the details of an existing event"
                  : "Fill in the details to create a new event"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter event title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="eventType">Event Type</Label>
                    <Select value={eventType} onValueChange={setEventType}>
                      <SelectTrigger id="eventType">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                        <SelectItem value="Seminar">Seminar</SelectItem>
                        <SelectItem value="Career Fair">Career Fair</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>

                    {eventType === "other" && (
                      <div className="mt-2">
                        <Input
                          placeholder="Specify event type"
                          value={customType}
                          onChange={(e) => setCustomType(e.target.value)}
                          required
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Student Center Room 101">Student Center Room 101</SelectItem>
                        <SelectItem value="Library Conference Room">Library Conference Room</SelectItem>
                        <SelectItem value="Main Gymnasium">Main Gymnasium</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>

                    {location === "other" && (
                      <div className="mt-2">
                        <Input
                          placeholder="Specify location"
                          value={customLocation}
                          onChange={(e) => setCustomLocation(e.target.value)}
                          required
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Event Date</Label>
                    <DatePicker date={eventDate} setDate={setEventDate} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventTime">Event Time</Label>
                    <Input
                      id="eventTime"
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
                  <Label htmlFor="isActive">{isActive ? "Active (visible for check-in)" : "Inactive"}</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingEventId ? "Update Event" : "Create Event"}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
