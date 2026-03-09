"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  ClipboardList,
  FileText,
  UserCircle,
  Briefcase,
  StickyNote,
  Zap,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/lesson-ai", label: "AI Lesson Tool", icon: Zap },
  { href: "/planner", label: "Study Planner", icon: Calendar },
  { href: "/assignments", label: "Assignments", icon: ClipboardList },
  { href: "/pdf-tools", label: "PDF Tools", icon: FileText },
  { href: "/resume", label: "Resume Builder", icon: UserCircle },
  { href: "/internships", label: "Internship Tracker", icon: Briefcase },
  { href: "/notes", label: "Notes & Flashcards", icon: StickyNote },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Student Toolkit</span>
        </Link>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="absolute bottom-4 left-4 right-4">
        <div className="rounded-lg border bg-muted p-3">
          <p className="text-xs font-medium text-muted-foreground">Free Plan</p>
          <p className="text-xs text-muted-foreground mt-1">Upgrade for AI features</p>
          <Link href="/upgrade" className="mt-2 block w-full rounded-md bg-primary px-3 py-1.5 text-center text-xs font-medium text-primary-foreground hover:bg-primary/90">
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </aside>
  )
}
