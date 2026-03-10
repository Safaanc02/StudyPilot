"use client"
import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Clock, Play, Pause, RotateCcw, Plus, Trash2, ChevronLeft, ChevronRight, X, CalendarDays } from "lucide-react"

interface Exam {
  id: string
  subject: string
  date: string
  notes: string
  color: string
}

const COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-green-500",
  "bg-orange-500", "bg-red-500", "bg-pink-500", "bg-teal-500"
]

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  // 0=Sun → convert to Mon-based (0=Mon)
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1
}

export default function PlannerPage() {
  const today = new Date()
  const [exams, setExams] = useState<Exam[]>([])
  const [loadingExams, setLoadingExams] = useState(true)
  const [newExam, setNewExam] = useState({ subject: "", date: "", notes: "" })
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [pomodoroMode, setPomodoroMode] = useState<"work" | "break">("work")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Calendar state
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // Load exams from DB
  useEffect(() => {
    fetch("/api/exams")
      .then(r => r.json())
      .then(d => { if (d.exams) setExams(d.exams) })
      .catch(() => {})
      .finally(() => setLoadingExams(false))
  }, [])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setPomodoroTime(t => {
          if (t <= 1) {
            setIsRunning(false)
            if (pomodoroMode === "work") { setPomodoroMode("break"); return 5 * 60 }
            else { setPomodoroMode("work"); return 25 * 60 }
          }
          return t - 1
        })
      }, 1000)
    } else if (intervalRef.current) clearInterval(intervalRef.current)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning, pomodoroMode])

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`
  const getDaysLeft = (date: string) => Math.ceil((new Date(date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const progress = pomodoroMode === "work" ? ((25 * 60 - pomodoroTime) / (25 * 60)) * 100 : ((5 * 60 - pomodoroTime) / (5 * 60)) * 100

  const addExam = async () => {
    if (!newExam.subject || !newExam.date) return
    const color = COLORS[exams.length % COLORS.length]
    const res = await fetch("/api/exams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newExam, color }),
    })
    const data = await res.json()
    if (data.id) setExams(prev => [...prev, data])
    setNewExam({ subject: "", date: "", notes: "" })
    setShowAddModal(false)
  }

  const deleteExam = async (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id))
    await fetch("/api/exams", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
  }

  const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) } else setCalMonth(m => m - 1) }
  const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) } else setCalMonth(m => m + 1) }

  const daysInMonth = getDaysInMonth(calYear, calMonth)
  const firstDay = getFirstDayOfMonth(calYear, calMonth)
  const daysInPrev = getDaysInMonth(calYear, calMonth === 0 ? 11 : calMonth - 1)

  // Build grid cells
  const cells: { day: number; isCurrentMonth: boolean; dateStr: string }[] = []
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrev - i
    const m = calMonth === 0 ? 11 : calMonth - 1
    const y = calMonth === 0 ? calYear - 1 : calYear
    cells.push({ day: d, isCurrentMonth: false, dateStr: `${y}-${String(m + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}` })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, isCurrentMonth: true, dateStr: `${calYear}-${String(calMonth + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}` })
  }
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    const m = calMonth === 11 ? 0 : calMonth + 1
    const y = calMonth === 11 ? calYear + 1 : calYear
    cells.push({ day: d, isCurrentMonth: false, dateStr: `${y}-${String(m + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}` })
  }

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`

  const getExamsForDate = (dateStr: string) => exams.filter(e => e.date === dateStr)

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr)
    setNewExam(prev => ({ ...prev, date: dateStr }))
    setShowAddModal(true)
  }

  return (
    <div>
      <Header title="Study Planner" />
      <div className="p-6 space-y-6">

        {/* Add Exam Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            <div className="relative bg-background rounded-2xl shadow-2xl border p-6 w-full max-w-sm mx-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-base">Add Exam</h3>
                  {selectedDate && <p className="text-xs text-muted-foreground mt-0.5">{new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>}
                </div>
                <button onClick={() => setShowAddModal(false)} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-accent">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-3">
                <Input placeholder="Subject name (e.g. Calculus II)" value={newExam.subject} onChange={e => setNewExam({ ...newExam, subject: e.target.value })} autoFocus />
                <Input type="date" value={newExam.date} onChange={e => setNewExam({ ...newExam, date: e.target.value })} />
                <Input placeholder="Notes (optional)" value={newExam.notes} onChange={e => setNewExam({ ...newExam, notes: e.target.value })} />
                <Button onClick={addExam} className="w-full mt-1" disabled={!newExam.subject || !newExam.date}>
                  <Plus className="h-4 w-4 mr-2" /> Add Exam
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Calendar */}
        <Card className="overflow-hidden">
          {/* Calendar toolbar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold">
                <span className="text-primary">{MONTHS[calMonth]}</span>{" "}
                <span className="text-muted-foreground font-normal">{calYear}</span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => { setCalYear(today.getFullYear()); setCalMonth(today.getMonth()) }} className="text-xs h-8">
                Today
              </Button>
              <div className="flex border rounded-lg overflow-hidden">
                <button onClick={prevMonth} className="h-8 w-8 flex items-center justify-center hover:bg-accent transition-colors border-r">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={nextMonth} className="h-8 w-8 flex items-center justify-center hover:bg-accent transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <Button size="sm" onClick={() => { setNewExam({ subject: "", date: todayStr, notes: "" }); setSelectedDate(todayStr); setShowAddModal(true) }} className="h-8 gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" /> Add Exam
              </Button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b">
            {DAYS.map(d => (
              <div key={d} className={`py-2 text-center text-xs font-semibold text-muted-foreground ${d === "Sat" || d === "Sun" ? "text-muted-foreground/50" : ""}`}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {cells.map((cell, i) => {
              const isToday = cell.dateStr === todayStr
              const cellExams = getExamsForDate(cell.dateStr)
              const isWeekend = (i % 7) === 5 || (i % 7) === 6
              const isLastRow = i >= 35

              return (
                <div
                  key={i}
                  onClick={() => handleDayClick(cell.dateStr)}
                  className={`min-h-[90px] p-1.5 border-b border-r cursor-pointer transition-colors group
                    ${!isLastRow ? "" : "border-b-0"}
                    ${(i + 1) % 7 === 0 ? "border-r-0" : ""}
                    ${cell.isCurrentMonth ? "bg-background hover:bg-accent/50" : "bg-muted/20 hover:bg-muted/40"}
                    ${isWeekend && cell.isCurrentMonth ? "bg-muted/10" : ""}
                  `}
                >
                  {/* Day number */}
                  <div className="flex justify-end mb-1">
                    <span className={`h-6 w-6 flex items-center justify-center text-xs font-medium rounded-full transition-colors
                      ${isToday ? "bg-primary text-primary-foreground font-bold" : ""}
                      ${!cell.isCurrentMonth ? "text-muted-foreground/40" : isWeekend ? "text-muted-foreground/60" : "text-foreground"}
                      ${!isToday && cell.isCurrentMonth ? "group-hover:bg-accent" : ""}
                    `}>
                      {cell.day}
                    </span>
                  </div>

                  {/* Events */}
                  <div className="space-y-0.5">
                    {cellExams.slice(0, 2).map(exam => (
                      <div
                        key={exam.id}
                        onClick={e => { e.stopPropagation() }}
                        className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-white text-xs font-medium truncate cursor-default ${exam.color}`}
                        title={exam.subject}
                      >
                        <span className="truncate">{exam.subject}</span>
                      </div>
                    ))}
                    {cellExams.length > 2 && (
                      <div className="text-xs text-muted-foreground px-1.5">+{cellExams.length - 2} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Bottom row: Pomodoro + Upcoming */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Pomodoro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Pomodoro Focus Timer
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              <div className="flex gap-2">
                <Button variant={pomodoroMode === "work" ? "default" : "outline"} size="sm" onClick={() => { setPomodoroMode("work"); setPomodoroTime(25 * 60); setIsRunning(false) }}>Work (25m)</Button>
                <Button variant={pomodoroMode === "break" ? "default" : "outline"} size="sm" onClick={() => { setPomodoroMode("break"); setPomodoroTime(5 * 60); setIsRunning(false) }}>Break (5m)</Button>
              </div>
              <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-4 border-primary/20">
                <div className="text-5xl font-bold tabular-nums">{formatTime(pomodoroTime)}</div>
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="4" className="text-primary/20" />
                  <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="4" className="text-primary transition-all" strokeDasharray={`${2 * Math.PI * 90}`} strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`} strokeLinecap="round" />
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

          {/* Upcoming Exams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                Upcoming Exams
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingExams ? (
                <p className="text-sm text-muted-foreground text-center py-6">Loading...</p>
              ) : exams.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No exams added yet. Click on a date to add one.</p>
              ) : (
                exams.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(exam => {
                  const days = getDaysLeft(exam.date)
                  return (
                    <div key={exam.id} className="flex items-center gap-3 rounded-xl border p-3 group">
                      <div className={`h-10 w-1.5 rounded-full shrink-0 ${exam.color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{exam.subject}</p>
                        <p className="text-xs text-muted-foreground">{new Date(exam.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
                      </div>
                      <Badge variant={days <= 7 ? "destructive" : days <= 14 ? "secondary" : "outline"} className="shrink-0 text-xs">
                        {days > 0 ? `${days}d` : days === 0 ? "Today" : "Past"}
                      </Badge>
                      <button onClick={() => deleteExam(exam.id)} className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 rounded-md flex items-center justify-center hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
