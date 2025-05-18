import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html: string
  text: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Email not sent.")
    return
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "inSSIght <no-reply@insight.yourdomain.com>",
      to,
      subject,
      html,
      text,
    })

    if (error) {
      console.error("Error sending email:", error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error("Error sending email:", error)
    throw new Error("Failed to send email")
  }
}

export function generateEventReminderEmail(eventTitle: string, eventDate: Date, eventLocation: string) {
  const formattedDate = eventDate.toLocaleDateString()
  const formattedTime = eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Event Reminder</h1>
      <p>Don't forget about the upcoming event:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
        <h2 style="margin-top: 0;">${eventTitle}</h2>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${formattedTime}</p>
        <p><strong>Location:</strong> ${eventLocation}</p>
      </div>
      <p style="margin-top: 20px;">We look forward to seeing you there!</p>
      <p>Best regards,<br>The inSSIght Team</p>
    </div>
  `

  const text = `
    Event Reminder
    
    Don't forget about the upcoming event:
    
    ${eventTitle}
    Date: ${formattedDate}
    Time: ${formattedTime}
    Location: ${eventLocation}
    
    We look forward to seeing you there!
    
    Best regards,
    The inSSIght Team
  `

  return { html, text }
}

export function generateFeedbackRequestEmail(studentName: string, eventTitle: string, feedbackUrl: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Feedback Request</h1>
      <p>Hello ${studentName},</p>
      <p>Thank you for attending our event: <strong>${eventTitle}</strong>.</p>
      <p>We would appreciate your feedback to help us improve future events.</p>
      <p style="margin: 25px 0;">
        <a href="${feedbackUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Provide Feedback
        </a>
      </p>
      <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
      <p>${feedbackUrl}</p>
      <p>Thank you for your time!</p>
      <p>Best regards,<br>The inSSIght Team</p>
    </div>
  `

  const text = `
    Feedback Request
    
    Hello ${studentName},
    
    Thank you for attending our event: ${eventTitle}.
    
    We would appreciate your feedback to help us improve future events.
    
    Please visit the following link to provide your feedback:
    ${feedbackUrl}
    
    Thank you for your time!
    
    Best regards,
    The inSSIght Team
  `

  return { html, text }
}
