import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { attendanceId, rating, recommendScore, heardViaOptionId, customHeardVia, openEnded } = await request.json()

    if (!attendanceId) {
      return NextResponse.json({ error: "Attendance ID is required" }, { status: 400 })
    }

    // Check if attendance exists
    const attendance = await prisma.attendance.findUnique({
      where: { id: attendanceId },
    })

    if (!attendance) {
      return NextResponse.json({ error: "Attendance record not found" }, { status: 404 })
    }

    // Check if feedback already exists for this attendance
    const existingFeedback = await prisma.feedback.findUnique({
      where: { attendanceId },
    })

    if (existingFeedback) {
      return NextResponse.json({ error: "Feedback already submitted for this attendance" }, { status: 409 })
    }

    // Create feedback record
    const feedback = await prisma.feedback.create({
      data: {
        attendanceId,
        rating,
        recommendScore,
        heardViaOptionId,
        customHeardVia,
        openEnded: openEnded || {},
      },
    })

    return NextResponse.json(feedback)
  } catch (error) {
    console.error("Error submitting feedback:", error)
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 })
  }
}
