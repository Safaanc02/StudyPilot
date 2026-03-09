import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen, Zap, Calendar, ClipboardList, FileText,
  UserCircle, Briefcase, StickyNote, ArrowRight, Check
} from "lucide-react"

const features = [
  { icon: Zap, title: "AI Lesson Tool", description: "Upload PDFs and get summaries, flashcards, and exam questions instantly", premium: true },
  { icon: Calendar, title: "Study Planner", description: "Plan your study sessions with exam countdowns and Pomodoro timer", premium: false },
  { icon: ClipboardList, title: "Assignment Manager", description: "Track homework, projects, and deadlines in one place", premium: false },
  { icon: FileText, title: "PDF Tools", description: "Merge, split, compress, and convert PDFs effortlessly", premium: true },
  { icon: UserCircle, title: "Resume Builder", description: "Create professional CVs with modern templates", premium: true },
  { icon: Briefcase, title: "Internship Tracker", description: "Track job applications, interviews, and offer statuses", premium: true },
  { icon: StickyNote, title: "Notes & Flashcards", description: "Create notes and auto-generate flashcards for revision", premium: false },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Student Toolkit</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/dashboard">
                <Button>Get Started Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <Badge variant="secondary" className="mb-4">AI-Powered Student Platform</Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Study smarter,{" "}
          <span className="text-primary">not harder</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Upload your lessons and let AI generate summaries, flashcards, and exam questions.
          Manage assignments, track internships, and build your resume — all in one place.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2">
              Start for Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/lesson-ai">
            <Button size="lg" variant="outline">
              Try AI Lesson Tool
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="relative">
                {feature.premium && (
                  <Badge className="absolute right-4 top-4" variant="secondary">Pro</Badge>
                )}
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t bg-muted/50 py-24">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-3xl font-bold mb-12">Simple Pricing</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <div className="text-3xl font-bold">$0<span className="text-base font-normal text-muted-foreground">/mo</span></div>
              </CardHeader>
              <CardContent className="space-y-2">
                {["Study Planner", "Assignment Manager", "Basic Notes", "Flashcards"].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" /> {f}
                  </div>
                ))}
                <Link href="/dashboard" className="block mt-4">
                  <Button variant="outline" className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="border-primary">
              <CardHeader>
                <Badge className="w-fit mb-2">Most Popular</Badge>
                <CardTitle>Pro</CardTitle>
                <div className="text-3xl font-bold">$9<span className="text-base font-normal text-muted-foreground">/mo</span></div>
              </CardHeader>
              <CardContent className="space-y-2">
                {["Everything in Free", "AI Lesson Processing", "Advanced PDF Tools", "Resume Builder", "Internship Tracker"].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" /> {f}
                  </div>
                ))}
                <Link href="/upgrade" className="block mt-4">
                  <Button className="w-full">Upgrade to Pro</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
