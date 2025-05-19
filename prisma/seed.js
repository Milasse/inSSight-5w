// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Upsert admin
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash: adminPassword,
      role: "admin",
    },
  });

  // Upsert dept head
  const deptHeadPassword = await bcrypt.hash("depthead123", 10);
  const deptHead = await prisma.user.upsert({
    where: { email: "depthead@example.com" },
    update: {},
    create: {
      email: "depthead@example.com",
      passwordHash: deptHeadPassword,
      role: "dept_head",
    },
  });

  console.log({ admin: admin.email, deptHead: deptHead.email });

  // FieldOptions arrays
  const eventTypes = [
    "Workshop", "Seminar", "Career Fair", "Social", "Info Session"
  ];
  const locations = [
    "Student Center Room 101","Library Conference Room",
    "Main Gymnasium","Auditorium","Cafeteria"
  ];
  const times = [
    "Morning (9-12)","Afternoon (1-5)","Evening (6-9)"
  ];
  const heardVia = [
    "Email","Social Media","Friend","Professor","Flyer"
  ];

  const buildOptions = (fieldName, values) =>
    values.map((value) => ({
      id: `${fieldName}-${value}`.replace(/\s+/g, "-").toLowerCase(),
      fieldName,
      value,
      isActive: true,
    }));

  const allOptions = [
    ...buildOptions("event_type", eventTypes),
    ...buildOptions("location", locations),
    ...buildOptions("time_of_day", times),
    ...buildOptions("heard_via", heardVia),
  ];

  for (const option of allOptions) {
    await prisma.fieldOption.upsert({
      where: { id: option.id },
      update: {},
      create: option,
    });
  }

  console.log("Field options seeded");

  // Create sample events
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const workshopOption = await prisma.fieldOption.findFirst({
    where: { fieldName: "event_type", value: "Workshop" },
  });
  const locationOption = await prisma.fieldOption.findFirst({
    where: { fieldName: "location", value: "Student Center Room 101" },
  });
  const timeOption = await prisma.fieldOption.findFirst({
    where: { fieldName: "time_of_day", value: "Afternoon (1-5)" },
  });

  if (workshopOption && locationOption && timeOption) {
  // (Optionally delete any existing test event to avoid duplicates)
  await prisma.event.deleteMany({
    where: { title: "Career Development Workshop" },
  });

  // Now create the test event
  await prisma.event.create({
    data: {
      title: "Career Development Workshop",
      typeOptionId: workshopOption.id,
      locationOptionId: locationOption.id,
      timeOptionId: timeOption.id,
      dateTime: new Date(),
      isActive: true,
      createdById: admin.id,
    },
  });
}

  console.log("Sample event seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
