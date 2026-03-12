"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

export default function OnboardingPage() {
  const { user } = useUser()
  const router = useRouter()
  const [selected, setSelected] = useState<"male" | "female" | null>(null)
  const [loading, setLoading] = useState(false)

  const handleContinue = async () => {
    if (!selected) return
    setLoading(true)
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gender: selected }),
      })
      if (res.ok) {
        document.documentElement.setAttribute("data-gender", selected)
        router.push("/dashboard")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <User className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Welcome{user?.firstName ? `, ${user.firstName}` : ""}!</h1>
            <p className="text-sm text-muted-foreground">
              Help us personalize your experience. This will customize the app themes for you.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-center">I am...</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelected("male")}
                className={`flex flex-col items-center gap-2 p-6 rounded-xl border-2 transition-all ${
                  selected === "male"
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className="text-4xl">👨</span>
                <span className={`text-sm font-medium ${selected === "male" ? "text-blue-700" : "text-gray-700"}`}>
                  Male
                </span>
              </button>
              <button
                onClick={() => setSelected("female")}
                className={`flex flex-col items-center gap-2 p-6 rounded-xl border-2 transition-all ${
                  selected === "female"
                    ? "border-pink-500 bg-pink-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className="text-4xl">👩</span>
                <span className={`text-sm font-medium ${selected === "female" ? "text-pink-700" : "text-gray-700"}`}>
                  Female
                </span>
              </button>
            </div>
          </div>

          <Button
            onClick={handleContinue}
            disabled={!selected || loading}
            className="w-full"
            size="lg"
          >
            {loading ? "Saving..." : "Continue"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
