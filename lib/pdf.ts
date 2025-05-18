import puppeteer from "puppeteer"

export async function generatePdf(url: string, options: any = {}) {
  // Launch a headless browser
  const browser = await puppeteer.launch({
    headless: "new",
  })

  try {
    // Create a new page
    const page = await browser.newPage()

    // Navigate to the URL
    await page.goto(url, { waitUntil: "networkidle2" })

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
      ...options,
    })

    return pdf
  } finally {
    // Close the browser
    await browser.close()
  }
}
