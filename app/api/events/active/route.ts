import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    // Get current time
    const now = new Date()

    // Find events that are active and within ±2 hours of current time
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000)

    const activeEvent = await prisma.event.findFirst({
      where: {
        isActive: true,
        dateTime: {
          gte: twoHoursAgo,
          lte: twoHoursFromNow,
        },
      },
      include: {
        typeOption: true,
        locationOption: true,
        timeOption: true,
      },
    })

    if (!activeEvent) {
      return NextResponse.json({ message: "No active events found" }, { status: 404 })
    }

    return NextResponse.json(activeEvent)
  } catch (error) {
    console.error("Error fetching active event:", error)
    return NextResponse.json({ error: "Failed to fetch active event" }, { status: 500 })
  }
}
