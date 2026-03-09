"use client"
import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react"

type Status = "Not Started" | "In Progress" | "Completed"
type Priority = "Low" | "Medium" | "High"

interface Assignment {
  id: string
  title: string
  subject: string
  dueDate: string
  status: Status
  priority: Priority
  type: "Homework" | "Project" | "Exam" | "Other"
}

const statusColors: Record<Status, string> = {
  "Not Started": "destructive",
  "In Progress": "secondary",
  "Completed": "default",
}

const priorityColors: Record<Priority, string> = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-red-100 text-red-700",
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: "1", title: "Database Design Report", subject: "Database Systems", dueDate: "2026-03-11", status: "In Progress", priority: "High", type: "Project" },
    { id: "2", title: "Algorithm Analysis HW", subject: "Data Structures", dueDate: "2026-03-13", status: "Not Started", priority: "High", type: "Homework" },
    { id: "3", title: "Physics Lab Report", subject: "Physics II", dueDate: "2026-03-14", status: "In Progress", priority: "Medium", type: "Project" },
    { id: "4", title: "Essay - Industrial Revolution", subject: "History", dueDate: "2026-03-20", status: "Not Started", priority: "Low", type: "Homework" },
  ])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: "", subject: "", dueDate: "", status: "Not Started" as Status, priority: "Medium" as Priority, type: "Homework" as Assignment["type"] })
  const [filter, setFilter] = useState<Status | "All">("All")

  const addAssignment = () => {
    if (!form.title || !form.subject || !form.dueDate) return
    setAssignments([...assignments, { ...form, id: Date.now().toString() }])
    setForm({ title: "", subject: "", dueDate: "", status: "Not Started", priority: "Medium", type: "Homework" })
    setShowForm(false)
  }

  const toggleStatus = (id: string) => {
    setAssignments(assignments.map(a => {
      if (a.id !== id) return a
      const next: Status = a.status === "Completed" ? "Not Started" : a.status === "Not Started" ? "In Progress" : "Completed"
      return { ...a, status: next }
    }))
  }

  const filtered = filter === "All" ? assignments : assignments.filter(a => a.status === filter)

  return (
    <div>
      <Header title="Assignment Manager" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(["All", "Not Started", "In Progress", "Completed"] as const).map(s => (
              <Button key={s} variant={filter === s ? "default" : "outline"} size="sm" onClick={() => setFilter(s)}>{s}</Button>
            ))}
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Assignment
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader><CardTitle className="text-base">New Assignment</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="col-span-2" />
              <Input placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
              <Input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Assignment["type"] })}>
                <option>Homework</option><option>Project</option><option>Exam</option><option>Other</option>
              </select>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as Priority })}>
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
              <Button onClick={addAssignment} className="col-span-2">Add Assignment</Button>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {filtered.map((assignment) => (
            <Card key={assignment.id} className={assignment.status === "Completed" ? "opacity-60" : ""}>
              <CardContent className="flex items-center gap-4 p-4">
                <button onClick={() => toggleStatus(assignment.id)}>
                  {assignment.status === "Completed"
                    ? <CheckCircle2 className="h-5 w-5 text-green-500" />
                    : <Circle className="h-5 w-5 text-muted-foreground" />
                  }
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${assignment.status === "Completed" ? "line-through" : ""}`}>{assignment.title}</p>
                  <p className="text-xs text-muted-foreground">{assignment.subject} · Due {new Date(assignment.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[assignment.priority]}`}>{assignment.priority}</span>
                  <Badge variant={statusColors[assignment.status] as any} className="text-xs">{assignment.status}</Badge>
                  <Badge variant="outline" className="text-xs">{assignment.type}</Badge>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setAssignments(assignments.filter(a => a.id !== assignment.id))}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
