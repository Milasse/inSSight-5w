import { getServerSession } from "next-auth"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function PrintableReport({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getServerSession(authOptions)

  // Only allow admin users
  if (!session || !["admin", "dept_head"].includes(session.user.role as string)) {
    redirect("/auth/signin?callbackUrl=/admin/dashboard")
  }

  const reportType = (searchParams.type as string) || "attendance"
  const eventId = searchParams.eventId as string
  const startDate = searchParams.startDate as string
  const endDate = searchParams.endDate as string

  // Fetch data based on parameters
  let event = null
  let attendances = []
  let feedbacks = []

  if (eventId) {
    // Fetch single event data
    event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        typeOption: true,
        locationOption: true,
        timeOption: true,
        createdBy: true,
      },
    })

    if (!event) {
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p>The requested event could not be found.</p>
        </div>
      )
    }

    // Fetch attendances for this event
    attendances = await prisma.attendance.findMany({
      where: { eventId },
      include: {
        student: true,
        feedback: {
          include: {
            heardViaOption: true,
          },
        },
      },
      orderBy: { signedInAt: "asc" },
    })
  } else if (startDate && endDate) {
    // Fetch data for date range
    const dateFilter = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    }

    // Fetch events in date range
    const events = await prisma.event.findMany({
      where: {
        dateTime: dateFilter,
      },
      include: {
        typeOption: true,
        locationOption: true,
        timeOption: true,
      },
      orderBy: { dateTime: "asc" },
    })

    // Fetch attendances for these events
    attendances = await prisma.attendance.findMany({
      where: {
        event: {
          dateTime: dateFilter,
        },
      },
      include: {
        student: true,
        event: {
          include: {
            typeOption: true,
          },
        },
        feedback: true,
      },
      orderBy: { signedInAt: "asc" },
    })

    // Fetch feedbacks for these attendances
    feedbacks = await prisma.feedback.findMany({
      where: {
        attendance: {
          event: {
            dateTime: dateFilter,
          },
        },
      },
      include: {
        attendance: {
          include: {
            student: true,
            event: true,
          },
        },
        heardViaOption: true,
      },
      orderBy: { submittedAt: "asc" },
    })
  } else {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Invalid Report Parameters</h1>
        <p>Please specify either an event ID or a date range.</p>
      </div>
    )
  }

  // Render report based on type
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">inSSIght Report</h1>
        <p className="text-lg text-gray-600">{reportType === "attendance" ? "Attendance Report" : "Feedback Report"}</p>
        <p className="text-sm text-gray-500 mt-2">
          {event
            ? `Event: ${event.title} (${new Date(event.dateTime).toLocaleDateString()})`
            : `Date Range: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`}
        </p>
        <p className="text-sm text-gray-500">Generated on: {new Date().toLocaleString()}</p>
      </div>

      {reportType === "attendance" ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Attendance Summary</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border rounded p-4">
              <p className="text-sm text-gray-500">Total Attendees</p>
              <p className="text-2xl font-bold">{attendances.length}</p>
            </div>
            <div className="border rounded p-4">
              <p className="text-sm text-gray-500">Feedback Response Rate</p>
              <p className="text-2xl font-bold">
                {attendances.length > 0
                  ? `${Math.round((attendances.filter((a) => a.feedback).length / attendances.length) * 100)}%`
                  : "0%"}
              </p>
            </div>
          </div>

          <h3 className="text-lg font-bold mb-2">Attendee List</h3>
          <table className="min-w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Student ID</th>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Role</th>
                <th className="border p-2 text-left">Sign-in Time</th>
                <th className="border p-2 text-left">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {attendances.map((attendance) => (
                <tr key={attendance.id}>
                  <td className="border p-2">{attendance.student.studentId}</td>
                  <td className="border p-2">{attendance.student.name}</td>
                  <td className="border p-2">{attendance.customRole || attendance.role || "Attendee"}</td>
                  <td className="border p-2">{new Date(attendance.signedInAt).toLocaleString()}</td>
                  <td className="border p-2">{attendance.feedback ? "Submitted" : "Not Submitted"}</td>
                </tr>
              ))}
              {attendances.length === 0 && (
                <tr>
                  <td colSpan={5} className="border p-2 text-center">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">Feedback Summary</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border rounded p-4">
              <p className="text-sm text-gray-500">Total Feedback Submissions</p>
              <p className="text-2xl font-bold">
                {event ? attendances.filter((a) => a.feedback).length : feedbacks.length}
              </p>
            </div>
            <div className="border rounded p-4">
              <p className="text-sm text-gray-500">Average Rating</p>
              <p className="text-2xl font-bold">
                {event
                  ? attendances.filter((a) => a.feedback && a.feedback.rating).length > 0
                    ? (
                        attendances.reduce((sum, a) => sum + (a.feedback?.rating || 0), 0) /
                        attendances.filter((a) => a.feedback && a.feedback.rating).length
                      ).toFixed(1)
                    : "N/A"
                  : feedbacks.filter((f) => f.rating).length > 0
                    ? (
                        feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) /
                        feedbacks.filter((f) => f.rating).length
                      ).toFixed(1)
                    : "N/A"}
              </p>
            </div>
          </div>

          <h3 className="text-lg font-bold mb-2">Feedback Details</h3>
          <table className="min-w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Student ID</th>
                {!event && <th className="border p-2 text-left">Event</th>}
                <th className="border p-2 text-left">Rating</th>
                <th className="border p-2 text-left">Recommend Score</th>
                <th className="border p-2 text-left">Heard Via</th>
                <th className="border p-2 text-left">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {(event ? attendances.filter((a) => a.feedback) : feedbacks).map((item) => {
                const feedback = event ? item.feedback : item
                const student = event ? item.student : item.attendance.student

                return (
                  <tr key={feedback.id}>
                    <td className="border p-2">{student.studentId}</td>
                    {!event && <td className="border p-2">{item.attendance.event.title}</td>}
                    <td className="border p-2">{feedback.rating || "N/A"}</td>
                    <td className="border p-2">{feedback.recommendScore || "N/A"}</td>
                    <td className="border p-2">
                      {feedback.heardViaOption ? feedback.heardViaOption.value : feedback.customHeardVia || "N/A"}
                    </td>
                    <td className="border p-2">{new Date(feedback.submittedAt).toLocaleString()}</td>
                  </tr>
                )
              })}
              {(event ? attendances.filter((a) => a.feedback).length === 0 : feedbacks.length === 0) && (
                <tr>
                  <td colSpan={event ? 5 : 6} className="border p-2 text-center">
                    No feedback records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
