"use client"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from "@clerk/nextjs"
import { useGender } from "@/components/gender-provider"

const pageEmojis: Record<string, { male: string; female: string }> = {
  "Dashboard": { male: "🏠", female: "🏡" },
  "AI Lesson Tool": { male: "⚡", female: "✨" },
  "Study Planner": { male: "📅", female: "🗓️" },
  "Assignments": { male: "📋", female: "📝" },
  "PDF Tools": { male: "📄", female: "🌷" },
  "Resume Builder": { male: "👔", female: "👗" },
  "Internship Tracker": { male: "💼", female: "👜" },
  "Notes & Flashcards": { male: "📝", female: "🦋" },
}

export function Header({ title }: { title: string }) {
  const { user } = useUser()
  const gender = useGender()
  const initials = user?.firstName?.[0]?.toUpperCase() ?? user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? "?"
  const emoji = gender && pageEmojis[title] ? pageEmojis[title][gender] : ""

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <h1 className="text-xl font-semibold">{emoji ? `${emoji} ` : ""}{title}</h1>
      <div className="flex items-center gap-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9" />
        </div>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        {user?.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.imageUrl} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
            {initials}
          </div>
        )}
      </div>
    </header>
  )
}
