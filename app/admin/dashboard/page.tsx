"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Mock data for charts
const mockAttendanceData = [
  { name: "Workshop", value: 45 },
  { name: "Seminar", value: 30 },
  { name: "Career Fair", value: 60 },
  { name: "Social", value: 25 },
  { name: "Other", value: 15 },
]

const mockFeedbackData = [
  { name: "Very Satisfied", value: 35 },
  { name: "Satisfied", value: 40 },
  { name: "Neutral", value: 15 },
  { name: "Dissatisfied", value: 7 },
  { name: "Very Dissatisfied", value: 3 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function Dashboard() {
  const { toast } = useToast()
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().setMonth(new Date().getMonth() - 1)))
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [eventType, setEventType] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState({
    totalEvents: 0,
    totalAttendees: 0,
    feedbackMetrics: {
      count: 0,
      responseRate: 0,
      averageRating: 0,
      npsScore: 0,
    },
  })

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)

      try {
        // In a real app, you would fetch data from the API
        // For now, we'll use mock data
        setTimeout(() => {
          setDashboardData({
            totalEvents: 12,
            totalAttendees: 175,
            feedbackMetrics: {
              count: 120,
              responseRate: 0.68,
              averageRating: 4.2,
              npsScore: 65,
            },
          })
          setIsLoading(false)
        }, 500)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [startDate, endDate, eventType, toast])

  const handleGenerateReport = () => {
    // In a real app, this would generate a PDF report
    toast({
      title: "Generating report",
      description: "Your report is being generated and will download shortly.",
    })

    // Simulate PDF download
    setTimeout(() => {
      toast({
        title: "Report ready",
        description: "Your report has been generated.",
      })
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={handleGenerateReport}>Generate Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.totalEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.totalAttendees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Feedback Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Math.round(dashboardData.feedbackMetrics.responseRate * 100)}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter dashboard data by date range and event type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium">Start Date</label>
                <DatePicker date={startDate} setDate={setStartDate} />
              </div>

              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium">End Date</label>
                <DatePicker date={endDate} setDate={setEndDate} />
              </div>

              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium">Event Type</label>
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
                    <SelectItem value="career_fair">Career Fair</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button className="w-full md:w-auto" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Apply Filters"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendance">
        <TabsList className="mb-4">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance by Event Type</CardTitle>
              <CardDescription>Distribution of attendees across different event types</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockAttendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Attendees" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Satisfaction Ratings</CardTitle>
                <CardDescription>Overall satisfaction with events</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockFeedbackData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {mockFeedbackData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Net Promoter Score</CardTitle>
                <CardDescription>Likelihood to recommend events to others</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex flex-col justify-center items-center">
                <div className="text-6xl font-bold">{dashboardData.feedbackMetrics.npsScore}</div>
                <div className="text-muted-foreground mt-2">NPS Score</div>
                <div className="mt-6 w-full max-w-xs bg-muted rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${Math.min(100, Math.max(0, dashboardData.feedbackMetrics.npsScore))}%` }}
                  />
                </div>
                <div className="flex justify-between w-full max-w-xs mt-2 text-xs text-muted-foreground">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
