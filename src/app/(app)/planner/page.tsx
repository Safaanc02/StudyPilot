"use client"
import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, Play, Pause, RotateCcw, Plus, Trash2 } from "lucide-react"

interface Exam {
  id: string
  subject: string
  date: string
  notes: string
}

export default function PlannerPage() {
  const [exams, setExams] = useState<Exam[]>([
    { id: "1", subject: "Calculus II", date: "2026-03-15", notes: "" },
    { id: "2", subject: "Data Structures", date: "2026-03-22", notes: "" },
  ])
  const [newExam, setNewExam] = useState({ subject: "", date: "", notes: "" })
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [pomodoroMode, setPomodoroMode] = useState<"work" | "break">("work")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setPomodoroTime(t => {
          if (t <= 1) {
            setIsRunning(false)
            if (pomodoroMode === "work") {
              setPomodoroMode("break")
              return 5 * 60
            } else {
              setPomodoroMode("work")
              return 25 * 60
            }
          }
          return t - 1
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning, pomodoroMode])

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`

  const getDaysLeft = (date: string) => {
    const diff = Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const addExam = () => {
    if (!newExam.subject || !newExam.date) return
    setExams([...exams, { ...newExam, id: Date.now().toString() }])
    setNewExam({ subject: "", date: "", notes: "" })
  }

  const progress = pomodoroMode === "work"
    ? ((25 * 60 - pomodoroTime) / (25 * 60)) * 100
    : ((5 * 60 - pomodoroTime) / (5 * 60)) * 100

  return (
    <div>
      <Header title="Study Planner" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Pomodoro Timer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Pomodoro Focus Timer
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              <div className="flex gap-2">
                <Button
                  variant={pomodoroMode === "work" ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setPomodoroMode("work"); setPomodoroTime(25 * 60); setIsRunning(false) }}
                >
                  Work (25m)
                </Button>
                <Button
                  variant={pomodoroMode === "break" ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setPomodoroMode("break"); setPomodoroTime(5 * 60); setIsRunning(false) }}
                >
                  Break (5m)
                </Button>
              </div>
              <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-4 border-primary/20">
                <div className="text-5xl font-bold tabular-nums">{formatTime(pomodoroTime)}</div>
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="4" className="text-primary/20" />
                  <circle
                    cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="4"
                    className="text-primary transition-all"
                    strokeDasharray={`${2 * Math.PI * 90}`}
                    strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <Badge variant="secondary">{pomodoroMode === "work" ? "Focus Time" : "Break Time"}</Badge>
              <div className="flex gap-3">
                <Button onClick={() => setIsRunning(!isRunning)} className="gap-2">
                  {isRunning ? <><Pause className="h-4 w-4" />Pause</> : <><Play className="h-4 w-4" />Start</>}
                </Button>
                <Button variant="outline" onClick={() => { setIsRunning(false); setPomodoroTime(pomodoroMode === "work" ? 25 * 60 : 5 * 60) }}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Add Exam */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Add Exam Date
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Subject name" value={newExam.subject} onChange={e => setNewExam({ ...newExam, subject: e.target.value })} />
              <Input type="date" value={newExam.date} onChange={e => setNewExam({ ...newExam, date: e.target.value })} />
              <Input placeholder="Notes (optional)" value={newExam.notes} onChange={e => setNewExam({ ...newExam, notes: e.target.value })} />
              <Button onClick={addExam} className="w-full">Add Exam</Button>
            </CardContent>
          </Card>
        </div>

        {/* Exam Countdowns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Exam Countdown
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {exams.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((exam) => {
              const days = getDaysLeft(exam.date)
              return (
                <div key={exam.id} className="relative rounded-lg border p-4 space-y-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-6 w-6"
                    onClick={() => setExams(exams.filter(e => e.id !== exam.id))}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <p className="font-semibold">{exam.subject}</p>
                  <p className="text-sm text-muted-foreground">{new Date(exam.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={days <= 7 ? "destructive" : days <= 14 ? "secondary" : "outline"}>
                      {days > 0 ? `${days} days left` : days === 0 ? "Today!" : "Past"}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
