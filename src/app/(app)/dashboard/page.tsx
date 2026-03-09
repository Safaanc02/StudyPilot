import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  BookOpen, Calendar, ClipboardList, Zap,
  TrendingUp, Clock, Target, Bell
} from "lucide-react"
import Link from "next/link"

const stats = [
  { label: "Study Hours This Week", value: "12.5h", icon: Clock, change: "+2h from last week" },
  { label: "Assignments Due", value: "3", icon: ClipboardList, change: "2 this week" },
  { label: "Exams Coming Up", value: "2", icon: Target, change: "Next in 5 days" },
  { label: "Flashcards Reviewed", value: "48", icon: BookOpen, change: "+12 today" },
]

const upcomingExams = [
  { subject: "Calculus II", date: "Mar 15, 2026", daysLeft: 6, progress: 65 },
  { subject: "Data Structures", date: "Mar 22, 2026", daysLeft: 13, progress: 40 },
  { subject: "Linear Algebra", date: "Apr 1, 2026", daysLeft: 23, progress: 20 },
]

const assignments = [
  { title: "Database Design Report", subject: "Database Systems", due: "Mar 11", status: "In Progress" },
  { title: "Algorithm Analysis", subject: "Data Structures", due: "Mar 13", status: "Not Started" },
  { title: "Physics Lab Report", subject: "Physics II", due: "Mar 14", status: "In Progress" },
]

const quickActions = [
  { label: "Process New Lesson", href: "/lesson-ai", icon: Zap, color: "bg-purple-500" },
  { label: "Add Assignment", href: "/assignments", icon: ClipboardList, color: "bg-blue-500" },
  { label: "Study Session", href: "/planner", icon: Clock, color: "bg-green-500" },
  { label: "Add Exam Date", href: "/planner", icon: Calendar, color: "bg-orange-500" },
]

export default function DashboardPage() {
  return (
    <div>
      <Header title="Dashboard" />
      <div className="p-6 space-y-6">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold">Good morning, Student!</h2>
          <p className="text-muted-foreground">You have 3 assignments due this week and 2 upcoming exams.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.label} href={action.href}>
                  <Card className="cursor-pointer hover:border-primary transition-colors">
                    <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                      <div className={`h-10 w-10 rounded-full ${action.color} flex items-center justify-center`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <p className="text-sm font-medium">{action.label}</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Upcoming Exams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Upcoming Exams
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingExams.map((exam) => (
                <div key={exam.subject} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{exam.subject}</p>
                      <p className="text-xs text-muted-foreground">{exam.date}</p>
                    </div>
                    <Badge variant={exam.daysLeft <= 7 ? "destructive" : "secondary"}>
                      {exam.daysLeft}d left
                    </Badge>
                  </div>
                  <Progress value={exam.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">{exam.progress}% prepared</p>
                </div>
              ))}
              <Link href="/planner">
                <Button variant="outline" size="sm" className="w-full mt-2">View All Exams</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Assignments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                Upcoming Assignments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {assignments.map((assignment) => (
                <div key={assignment.title} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium text-sm">{assignment.title}</p>
                    <p className="text-xs text-muted-foreground">{assignment.subject} · Due {assignment.due}</p>
                  </div>
                  <Badge variant={assignment.status === "Not Started" ? "destructive" : "secondary"}>
                    {assignment.status}
                  </Badge>
                </div>
              ))}
              <Link href="/assignments">
                <Button variant="outline" size="sm" className="w-full mt-2">View All Assignments</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
