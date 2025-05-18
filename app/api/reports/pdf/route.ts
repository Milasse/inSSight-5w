import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import puppeteer from "puppeteer"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Only allow admin users
    if (!session || !["admin", "dept_head"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const params = url.searchParams
    const reportType = params.get("type") || "attendance"
    const eventId = params.get("eventId")
    const startDate = params.get("startDate")
    const endDate = params.get("endDate")

    if (!eventId && (!startDate || !endDate)) {
      return NextResponse.json(
        { error: "Either eventId or date range (startDate and endDate) is required" },
        { status: 400 },
      )
    }

    // Construct the URL for the printable report
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    let reportUrl = `${baseUrl}/reports/printable?type=${reportType}`

    if (eventId) {
      reportUrl += `&eventId=${eventId}`
    }

    if (startDate && endDate) {
      reportUrl += `&startDate=${startDate}&endDate=${endDate}`
    }

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: "new",
    })

    const page = await browser.newPage()
    await page.goto(reportUrl, { waitUntil: "networkidle2" })

    // Generate PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "1cm",
        right: "1cm",
        bottom: "1cm",
        left: "1cm",
      },
    })

    await browser.close()

    // Return PDF
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${reportType}_report_${new Date().toISOString().split("T")[0]}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
