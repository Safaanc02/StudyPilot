import { NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

async function getOrCreateUser() {
  const { userId: clerkId } = await auth()
  if (!clerkId) return null
  const clerkUser = await currentUser()
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? `${clerkId}@unknown.com`
  const name = clerkUser?.fullName ?? clerkUser?.firstName ?? null
  return prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: { clerkId, email, name },
  })
}

export async function GET() {
  const user = await getOrCreateUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const exams = await prisma.exam.findMany({
    where: { userId: user.id },
    orderBy: { date: "asc" },
  })

  return NextResponse.json({ exams: exams.map(e => ({
    id: e.id,
    subject: e.subject,
    date: e.date.toISOString().split("T")[0],
    notes: e.notes ?? "",
    color: e.color ?? "bg-blue-500",
  })) })
}

export async function POST(req: NextRequest) {
  const user = await getOrCreateUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { subject, date, notes, color } = await req.json()
  if (!subject || !date) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

  const exam = await prisma.exam.create({
    data: {
      userId: user.id,
      subject,
      date: new Date(date + "T12:00:00"),
      notes: notes ?? "",
      color: color ?? "bg-blue-500",
    },
  })

  return NextResponse.json({
    id: exam.id,
    subject: exam.subject,
    date: exam.date.toISOString().split("T")[0],
    notes: exam.notes ?? "",
    color: exam.color,
  })
}

export async function DELETE(req: NextRequest) {
  const user = await getOrCreateUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await req.json()
  await prisma.exam.deleteMany({ where: { id, userId: user.id } })
  return NextResponse.json({ success: true })
}
