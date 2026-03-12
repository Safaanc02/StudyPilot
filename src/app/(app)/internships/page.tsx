"use client"
import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Briefcase, Building, Calendar, Search, ExternalLink, Globe } from "lucide-react"

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
  const [searchDomain, setSearchDomain] = useState("")
  const [searchCity, setSearchCity] = useState("")

  const searchLinks = searchDomain.trim() ? [
    {
      name: "Google",
      icon: Globe,
      color: "bg-blue-50 text-blue-700 hover:bg-blue-100",
      url: `https://www.google.com/search?q=stage+${encodeURIComponent(searchDomain)}+${encodeURIComponent(searchCity)}+site:linkedin.com+OR+site:indeed.fr+OR+site:welcometothejungle.com`,
    },
    {
      name: "LinkedIn",
      icon: Briefcase,
      color: "bg-sky-50 text-sky-700 hover:bg-sky-100",
      url: `https://www.linkedin.com/jobs/search/?keywords=stage+${encodeURIComponent(searchDomain)}&location=${encodeURIComponent(searchCity)}`,
    },
    {
      name: "Indeed",
      icon: Search,
      color: "bg-purple-50 text-purple-700 hover:bg-purple-100",
      url: `https://fr.indeed.com/jobs?q=stage+${encodeURIComponent(searchDomain)}&l=${encodeURIComponent(searchCity)}`,
    },
    {
      name: "Welcome to the Jungle",
      icon: Building,
      color: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
      url: `https://www.welcometothejungle.com/fr/jobs?query=stage+${encodeURIComponent(searchDomain)}&page=1&aroundQuery=${encodeURIComponent(searchCity)}`,
    },
  ] : []

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

        {/* Search Internships */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Search className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Find Internships</p>
                <p className="text-xs text-muted-foreground">Enter your field and city to search across platforms</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Domain (e.g. Développement Web, Data Science...)"
                value={searchDomain}
                onChange={e => setSearchDomain(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="City (e.g. Casablanca, Paris...)"
                value={searchCity}
                onChange={e => setSearchCity(e.target.value)}
                className="w-48"
              />
            </div>
            {searchLinks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {searchLinks.map(link => {
                  const Icon = link.icon
                  return (
                    <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className={`gap-1.5 ${link.color} border-0`}>
                        <Icon className="h-3.5 w-3.5" />
                        {link.name}
                        <ExternalLink className="h-3 w-3 opacity-50" />
                      </Button>
                    </a>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

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
