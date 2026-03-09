import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get("x-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 401 })
  }

  const hmac = crypto
    .createHmac("sha256", process.env.LEMONSQUEEZY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex")

  if (hmac !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const event = JSON.parse(rawBody)
  const eventName = event.meta.event_name
  const userId = event.meta.custom_data?.user_id

  if (!userId) {
    return NextResponse.json({ error: "No user_id in custom data" }, { status: 400 })
  }

  if (eventName === "order_created" || eventName === "subscription_created") {
    await prisma.user.update({
      where: { clerkId: userId },
      data: { plan: "pro" },
    })
  }

  if (eventName === "subscription_expired" || eventName === "subscription_cancelled") {
    await prisma.user.update({
      where: { clerkId: userId },
      data: { plan: "free" },
    })
  }

  return NextResponse.json({ received: true })
}
