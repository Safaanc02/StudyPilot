import { NextRequest, NextResponse } from "next/server"
import { lemonSqueezySetup, createCheckout } from "@lemonsqueezy/lemonsqueezy.js"

lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! })

export async function POST(req: NextRequest) {
  try {
    const { userId, email } = await req.json()

    const storeId = process.env.LEMONSQUEEZY_STORE_ID!
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID!

    const checkout = await createCheckout(storeId, variantId, {
      checkoutData: {
        email,
        custom: { user_id: userId },
      },
      productOptions: {
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
      },
    })

    const checkoutUrl = checkout.data?.data.attributes.url

    if (!checkoutUrl) {
      throw new Error("Failed to create checkout URL")
    }

    return NextResponse.json({ url: checkoutUrl })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 })
  }
}
