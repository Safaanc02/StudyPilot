"use client"
import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Briefcase, Building, Calendar } from "lucide-react"

type AppStatus = "Applied" | "Screening" | "Interview" | "Offer" | "Rejected" | "Withdrawn"

interface Application {
  id: string
  company: string
  position: string
  status: AppStatus
  appliedDate: string
  interviewDate: string
  notes: string
}

const statusColors: Record<AppStatus, string> = {
  Applied: "secondary",
  Screening: "secondary",
  Interview: "default",
  Offer: "default",
  Rejected: "destructive",
  Withdrawn: "outline",
}

const statusBg: Record<AppStatus, string> = {
  Applied: "bg-blue-50 text-blue-700",
  Screening: "bg-yellow-50 text-yellow-700",
  Interview: "bg-purple-50 text-purple-700",
  Offer: "bg-green-50 text-green-700",
  Rejected: "bg-red-50 text-red-700",
  Withdrawn: "bg-gray-50 text-gray-700",
}

export default function InternshipsPage() {
  const [apps, setApps] = useState<Application[]>([
    { id: "1", company: "Google", position: "Software Engineer Intern", status: "Interview", appliedDate: "2026-02-01", interviewDate: "2026-03-15", notes: "Technical round scheduled" },
    { id: "2", company: "Meta", position: "Product Management Intern", status: "Screening", appliedDate: "2026-02-10", interviewDate: "", notes: "" },
    { id: "3", company: "Amazon", position: "SDE Intern", status: "Applied", appliedDate: "2026-02-20", interviewDate: "", notes: "" },
  ])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ company: "", position: "", status: "Applied" as AppStatus, appliedDate: "", interviewDate: "", notes: "" })
  const [filter, setFilter] = useState<AppStatus | "All">("All")

  const addApp = () => {
    if (!form.company || !form.position) return
    setApps([...apps, { ...form, id: Date.now().toString() }])
    setForm({ company: "", position: "", status: "Applied", appliedDate: "", interviewDate: "", notes: "" })
    setShowForm(false)
  }

  const updateStatus = (id: string, status: AppStatus) => {
    setApps(apps.map(a => a.id === id ? { ...a, status } : a))
  }

  const filtered = filter === "All" ? apps : apps.filter(a => a.status === filter)
  const stats = { total: apps.length, interviews: apps.filter(a => a.status === "Interview").length, offers: apps.filter(a => a.status === "Offer").length }

  return (
    <div>
      <Header title="Internship Tracker" />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Applications", value: stats.total },
            { label: "Interviews", value: stats.interviews },
            { label: "Offers", value: stats.offers },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {(["All", "Applied", "Screening", "Interview", "Offer", "Rejected"] as const).map(s => (
              <Button key={s} variant={filter === s ? "default" : "outline"} size="sm" onClick={() => setFilter(s)}>{s}</Button>
            ))}
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Application
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader><CardTitle className="text-base">New Application</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Input placeholder="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
              <Input placeholder="Position" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} />
              <Input type="date" placeholder="Applied date" value={form.appliedDate} onChange={e => setForm({ ...form, appliedDate: e.target.value })} />
              <Input type="date" placeholder="Interview date (optional)" value={form.interviewDate} onChange={e => setForm({ ...form, interviewDate: e.target.value })} />
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as AppStatus })}>
                <option>Applied</option><option>Screening</option><option>Interview</option><option>Offer</option><option>Rejected</option><option>Withdrawn</option>
              </select>
              <Input placeholder="Notes (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              <Button onClick={addApp} className="col-span-2">Add Application</Button>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {filtered.map((app) => (
            <Card key={app.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <Building className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{app.position}</p>
                  <p className="text-xs text-muted-foreground">{app.company}</p>
                  {app.notes && <p className="text-xs text-muted-foreground mt-1 truncate">{app.notes}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {app.appliedDate && <span className="text-xs text-muted-foreground hidden sm:block">Applied {new Date(app.appliedDate).toLocaleDateString()}</span>}
                  {app.interviewDate && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" /> {new Date(app.interviewDate).toLocaleDateString()}
                    </span>
                  )}
                  <select
                    className={`rounded-full px-2 py-0.5 text-xs font-medium border-0 ${statusBg[app.status]}`}
                    value={app.status}
                    onChange={e => updateStatus(app.id, e.target.value as AppStatus)}
                  >
                    <option>Applied</option><option>Screening</option><option>Interview</option><option>Offer</option><option>Rejected</option><option>Withdrawn</option>
                  </select>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setApps(apps.filter(a => a.id !== app.id))}>
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
