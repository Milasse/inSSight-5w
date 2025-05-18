import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Only allow admin users
    if (!session || !["admin", "dept_head"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const params = url.searchParams
    const startDate = params.get("startDate")
    const endDate = params.get("endDate")
    const eventType = params.get("eventType")

    // Build the query filters
    const dateFilter: any = {}
    if (startDate) {
      dateFilter.gte = new Date(startDate)
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate)
    }

    // Get events data
    const eventsQuery: any = {
      where: {},
      include: {
        typeOption: true,
        attendances: {
          include: {
            student: true,
            feedback: true,
          },
        },
      },
    }

    if (Object.keys(dateFilter).length > 0) {
      eventsQuery.where.dateTime = dateFilter
    }

    if (eventType) {
      eventsQuery.where.typeOptionId = eventType
    }

    const events = await prisma.event.findMany(eventsQuery)

    // Calculate metrics
    const totalEvents = events.length
    const totalAttendees = events.reduce((sum, event) => sum + event.attendances.length, 0)

    // Attendance by event type
    const attendanceByType = events.reduce((acc: any, event) => {
      const typeName = event.typeOption?.value || event.customType || "Unknown"
      if (!acc[typeName]) {
        acc[typeName] = 0
      }
      acc[typeName] += event.attendances.length
      return acc
    }, {})

    // Feedback metrics
    const feedbackCount = events.reduce((sum, event) => {
      return sum + event.attendances.filter((a) => a.feedback).length
    }, 0)

    const averageRating =
      events.reduce((sum, event) => {
        const ratings = event.attendances.filter((a) => a.feedback && a.feedback.rating).map((a) => a.feedback!.rating!)

        return ratings.length > 0 ? sum + ratings.reduce((a, b) => a + b, 0) / ratings.length : sum
      }, 0) / (totalEvents || 1)

    // NPS calculation
    const allScores = events.flatMap((event) =>
      event.attendances
        .filter((a) => a.feedback && a.feedback.recommendScore !== null)
        .map((a) => a.feedback!.recommendScore!),
    )

    const promoters = allScores.filter((score) => score >= 9).length
    const detractors = allScores.filter((score) => score <= 6).length
    const npsScore =
      allScores.length > 0 ? Math.round((promoters / allScores.length - detractors / allScores.length) * 100) : 0

    // Return dashboard data
    return NextResponse.json({
      totalEvents,
      totalAttendees,
      attendanceByType,
      feedbackMetrics: {
        count: feedbackCount,
        responseRate: totalAttendees > 0 ? feedbackCount / totalAttendees : 0,
        averageRating,
        npsScore,
      },
      // Add more metrics as needed
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
