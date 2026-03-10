"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser, useClerk } from "@clerk/nextjs"
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
  LogOut,
  Settings,
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
  const { user } = useUser()
  const { signOut, openUserProfile } = useClerk()

  const initials = user?.firstName?.[0]?.toUpperCase() ?? user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? "?"
  const displayName = user?.fullName ?? user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress ?? "Student"
  const email = user?.emailAddresses?.[0]?.emailAddress ?? ""

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card flex flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Student Toolkit</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
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

      {/* Bottom section */}
      <div className="p-4 space-y-3 shrink-0 border-t">
        {/* Upgrade card */}
        <div className="rounded-lg border bg-muted p-3">
          <p className="text-xs font-medium text-muted-foreground">Free Plan</p>
          <p className="text-xs text-muted-foreground mt-1">Upgrade for AI features</p>
          <Link href="/upgrade" className="mt-2 block w-full rounded-md bg-primary px-3 py-1.5 text-center text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Upgrade to Pro
          </Link>
        </div>

        {/* User profile */}
        <div className="rounded-lg border bg-background p-3">
          <div className="flex items-center gap-3 mb-3">
            {user?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.imageUrl} alt={displayName} className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => openUserProfile()}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Settings className="h-3.5 w-3.5" />
              Profile
            </button>
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
