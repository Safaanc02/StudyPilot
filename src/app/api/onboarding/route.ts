import { NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// GET: check if user has completed onboarding (has gender set)
export async function GET() {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { clerkId }, select: { gender: true } })
  return NextResponse.json({ gender: user?.gender ?? null })
}

// POST: save gender
export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { gender } = await req.json()
  if (!gender || !["male", "female"].includes(gender)) {
    return NextResponse.json({ error: "Invalid gender" }, { status: 400 })
  }

  const clerkUser = await currentUser()
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? `${clerkId}@unknown.com`
  const name = clerkUser?.fullName ?? clerkUser?.firstName ?? null

  const user = await prisma.user.upsert({
    where: { clerkId },
    update: { gender },
    create: { clerkId, email, name, gender },
  })

  return NextResponse.json({ success: true, gender: user.gender })
}
