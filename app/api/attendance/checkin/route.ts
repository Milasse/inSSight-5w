import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Only allow authenticated users
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { studentId, eventId, role, customRole } = await request.json()

    if (!studentId || !eventId) {
      return NextResponse.json({ error: "Student ID and Event ID are required" }, { status: 400 })
    }

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Check if student already checked in to this event
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        studentId,
        eventId,
      },
    })

    if (existingAttendance) {
      return NextResponse.json(
        { error: "Student already checked in to this event", attendanceId: existingAttendance.id },
        { status: 409 },
      )
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        studentId,
        eventId,
        role,
        customRole,
      },
    })

    return NextResponse.json(attendance)
  } catch (error) {
    console.error("Error checking in:", error)
    return NextResponse.json({ error: "Failed to check in" }, { status: 500 })
  }
}
