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

// GET: list user's saved resumes
export async function GET() {
  const user = await getOrCreateUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const resumes = await prisma.resume.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, theme: true, updatedAt: true },
  })

  return NextResponse.json({ resumes })
}

// POST: save a new resume
export async function POST(req: NextRequest) {
  const user = await getOrCreateUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { title, theme, data } = await req.json()
  if (!title || !data) return NextResponse.json({ error: "Title and data required" }, { status: 400 })

  const resume = await prisma.resume.create({
    data: { userId: user.id, title, theme: theme ?? "classic", data },
  })

  return NextResponse.json({ resume: { id: resume.id, title: resume.title, theme: resume.theme, updatedAt: resume.updatedAt } })
}

// PUT: update existing resume
export async function PUT(req: NextRequest) {
  const user = await getOrCreateUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id, title, theme, data } = await req.json()
  if (!id) return NextResponse.json({ error: "Resume ID required" }, { status: 400 })

  const existing = await prisma.resume.findFirst({ where: { id, userId: user.id } })
  if (!existing) return NextResponse.json({ error: "Resume not found" }, { status: 404 })

  const resume = await prisma.resume.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(theme && { theme }),
      ...(data && { data }),
    },
  })

  return NextResponse.json({ resume: { id: resume.id, title: resume.title, theme: resume.theme, updatedAt: resume.updatedAt } })
}

// DELETE: delete a resume
export async function DELETE(req: NextRequest) {
  const user = await getOrCreateUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: "Resume ID required" }, { status: 400 })

  const existing = await prisma.resume.findFirst({ where: { id, userId: user.id } })
  if (!existing) return NextResponse.json({ error: "Resume not found" }, { status: 404 })

  await prisma.resume.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
