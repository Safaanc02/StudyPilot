"use client"
export const dynamic = "force-dynamic"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap } from "lucide-react"

const proFeatures = [
  "Everything in Free",
  "AI Lesson Processing",
  "Advanced PDF Tools",
  "Resume Builder",
  "Internship Tracker",
]

export default function UpgradePage() {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)

  async function handleUpgrade() {
    setLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          email: user?.primaryEmailAddress?.emailAddress,
        }),
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Upgrade error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl py-12 px-4">
      <div className="text-center mb-10">
        <Badge variant="secondary" className="mb-3">Upgrade</Badge>
        <h1 className="text-3xl font-bold">Unlock all features</h1>
        <p className="text-muted-foreground mt-2">Get access to AI tools, PDF processing, and more.</p>
      </div>

      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Pro Plan
            </CardTitle>
            <Badge>Most Popular</Badge>
          </div>
          <div className="text-4xl font-bold mt-2">
            $9<span className="text-base font-normal text-muted-foreground">/month</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {proFeatures.map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              {feature}
            </div>
          ))}
          <Button
            className="w-full mt-4"
            size="lg"
            onClick={handleUpgrade}
            disabled={loading}
          >
            {loading ? "Redirecting..." : "Upgrade to Pro — $9/mo"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Secure payment via Lemon Squeezy. Cancel anytime.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
