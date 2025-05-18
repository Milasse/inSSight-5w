import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash: adminPassword,
      role: "admin",
    },
  })

  // Create department head user
  const deptHeadPassword = await bcrypt.hash("depthead123", 10)
  const deptHead = await prisma.user.upsert({
    where: { email: "depthead@example.com" },
    update: {},
    create: {
      email: "depthead@example.com",
      passwordHash: deptHeadPassword,
      role: "dept_head",
    },
  })

  console.log({ admin, deptHead })

  // Create field options
  const eventTypes = [
    { fieldName: "event_type", value: "Workshop" },
    { fieldName: "event_type", value: "Seminar" },
    { fieldName: "event_type", value: "Career Fair" },
    { fieldName: "event_type", value: "Social" },
    { fieldName: "event_type", value: "Info Session" },
  ]

  const locations = [
    { fieldName: "location", value: "Student Center Room 101" },
    { fieldName: "location", value: "Library Conference Room" },
    { fieldName: "location", value: "Main Gymnasium" },
    { fieldName: "location", value: "Auditorium" },
    { fieldName: "location", value: "Cafeteria" },
  ]

  const times = [
    { fieldName: "time", value: "Morning (9-12)" },
    { fieldName: "time", value: "Afternoon (1-5)" },
    { fieldName: "time", value: "Evening (6-9)" },
  ]

  const heardVia = [
    { fieldName: "heard_via", value: "Email" },
    { fieldName: "heard_via", value: "Social Media" },
    { fieldName: "heard_via", value: "Friend" },
    { fieldName: "heard_via", value: "Professor" },
    { fieldName: "heard_via", value: "Flyer" },
  ]

  // Combine all field options
  const fieldOptions = [...eventTypes, ...locations, ...times, ...heardVia]

  // Create field options in database
  for (const option of fieldOptions) {
    await prisma.fieldOption.upsert({
      where: {
        id: `${option.fieldName}-${option.value}`.replace(/\s+/g, "-").toLowerCase(),
      },
      update: {},
      create: {
        id: `${option.fieldName}-${option.value}`.replace(/\s+/g, "-").toLowerCase(),
        fieldName: option.fieldName,
        value: option.value,
        isActive: true,
      },
    })
  }

  console.log("Field options created")

  // Create sample events
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const nextWeek = new Date(now)
  nextWeek.setDate(nextWeek.getDate() + 7)

  const eventTypeOption = await prisma.fieldOption.findFirst({
    where: { fieldName: "event_type", value: "Workshop" },
  })

  const locationOption = await prisma.fieldOption.findFirst({
    where: { fieldName: "location", value: "Student Center Room 101" },
  })

  const timeOption = await prisma.fieldOption.findFirst({
    where: { fieldName: "time", value: "Afternoon (1-5)" },
  })

  if (eventTypeOption && locationOption && timeOption) {
    // Create active event (happening now)
    await prisma.event.create({
      data: {
        title: "Career Development Workshop",
        typeOptionId: eventTypeOption.id,
        locationOptionId: locationOption.id,
        timeOptionId: timeOption.id,
        dateTime: now,
        isActive: true,
        createdById: admin.id,
      },
    })

    // Create upcoming event
    await prisma.event.create({
      data: {
        title: "Resume Building Seminar",
        typeOptionId: eventTypeOption.id,
        locationOptionId: locationOption.id,
        timeOptionId: timeOption.id,
        dateTime: tomorrow,
        isActive: false,
        createdById: admin.id,
      },
    })

    // Create future event
    await prisma.event.create({
      data: {
        title: "Fall Career Fair",
        typeOptionId: eventTypeOption.id,
        locationOptionId: locationOption.id,
        timeOptionId: timeOption.id,
        dateTime: nextWeek,
        isActive: false,
        createdById: deptHead.id,
      },
    })
  }

  console.log("Sample events created")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
