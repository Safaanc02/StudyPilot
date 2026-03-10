"use client"
import { useState, useRef } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Download, UserCircle, Palette, Camera, Loader2 } from "lucide-react"

interface Education { id: string; school: string; degree: string; field: string; startYear: string; endYear: string; gpa: string }
interface Experience { id: string; company: string; role: string; startDate: string; endDate: string; description: string }
interface Project { id: string; name: string; description: string; tech: string; link: string }

const THEMES = [
  { id: "classic", name: "Classic", accent: "#1a1a1a", preview: "bg-gray-900", description: "Clean & traditional" },
  { id: "modern", name: "Modern", accent: "#6366f1", preview: "bg-indigo-500", description: "Bold & colorful" },
  { id: "minimal", name: "Minimal", accent: "#0f172a", preview: "bg-slate-900", description: "Ultra clean" },
  { id: "forest", name: "Forest", accent: "#166534", preview: "bg-green-700", description: "Professional green" },
]

type ThemeId = "classic" | "modern" | "minimal" | "forest"

interface ResumeData {
  personal: { name: string; email: string; phone: string; location: string; linkedin: string; github: string; summary: string; photo: string }
  education: Education[]
  experience: Experience[]
  projects: Project[]
  skills: string
}

function Photo({ src, size = 56 }: { src: string; size?: number }) {
  if (!src) return null
  return (
    <img
      src={src}
      alt="profile"
      width={size}
      height={size}
      style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
    />
  )
}

function ResumePreviewClassic({ data }: { data: ResumeData }) {
  const { personal, education, experience, projects, skills } = data
  return (
    <div className="text-sm space-y-4 font-serif">
      <div className="text-center border-b-2 border-black pb-3 flex flex-col items-center gap-2">
        {personal.photo && <Photo src={personal.photo} size={60} />}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{personal.name || "Your Name"}</h2>
          <p className="text-xs mt-1 text-gray-600">{[personal.email, personal.phone, personal.location].filter(Boolean).join(" · ")}</p>
          <p className="text-xs text-gray-600">{[personal.linkedin, personal.github].filter(Boolean).join(" · ")}</p>
          {personal.summary && <p className="text-xs mt-2 italic text-gray-700">{personal.summary}</p>}
        </div>
      </div>
      {education.some(e => e.school) && (
        <div>
          <h3 className="font-bold text-xs uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">Education</h3>
          {education.filter(e => e.school).map(edu => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between"><p className="font-bold text-xs">{edu.school}</p><p className="text-xs text-gray-500">{edu.startYear}{edu.endYear && ` – ${edu.endYear}`}</p></div>
              <p className="text-xs text-gray-600">{[edu.degree, edu.field].filter(Boolean).join(", ")}{edu.gpa && ` · GPA: ${edu.gpa}`}</p>
            </div>
          ))}
        </div>
      )}
      {experience.some(e => e.company) && (
        <div>
          <h3 className="font-bold text-xs uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">Experience</h3>
          {experience.filter(e => e.company).map(exp => (
            <div key={exp.id} className="mb-2">
              <div className="flex justify-between"><p className="font-bold text-xs">{exp.role}</p><p className="text-xs text-gray-500">{exp.startDate}{exp.endDate && ` – ${exp.endDate}`}</p></div>
              <p className="text-xs text-gray-600 italic">{exp.company}</p>
              {exp.description && <p className="text-xs mt-1">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}
      {projects.some(p => p.name) && (
        <div>
          <h3 className="font-bold text-xs uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">Projects</h3>
          {projects.filter(p => p.name).map(proj => (
            <div key={proj.id} className="mb-2">
              <p className="font-bold text-xs">{proj.name}{proj.tech && <span className="font-normal text-gray-500"> · {proj.tech}</span>}</p>
              {proj.description && <p className="text-xs">{proj.description}</p>}
            </div>
          ))}
        </div>
      )}
      {skills && (
        <div>
          <h3 className="font-bold text-xs uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">Skills</h3>
          <p className="text-xs text-gray-700">{skills}</p>
        </div>
      )}
    </div>
  )
}

function ResumePreviewModern({ data }: { data: ResumeData }) {
  const { personal, education, experience, projects, skills } = data
  const accent = "#6366f1"
  return (
    <div className="text-sm space-y-0">
      <div className="rounded-t-md px-6 py-4 mb-4 flex items-center gap-4" style={{ backgroundColor: accent }}>
        {personal.photo && <Photo src={personal.photo} size={56} />}
        <div>
          <h2 className="text-xl font-bold text-white">{personal.name || "Your Name"}</h2>
          <p className="text-xs text-indigo-200 mt-0.5">{[personal.email, personal.phone, personal.location].filter(Boolean).join(" · ")}</p>
          <p className="text-xs text-indigo-200">{[personal.linkedin, personal.github].filter(Boolean).join(" · ")}</p>
          {personal.summary && <p className="text-xs text-indigo-100 mt-2">{personal.summary}</p>}
        </div>
      </div>
      <div className="space-y-3 px-1">
        {education.some(e => e.school) && (
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
              <span className="inline-block w-3 h-0.5" style={{ backgroundColor: accent }} />Education
            </h3>
            {education.filter(e => e.school).map(edu => (
              <div key={edu.id} className="mb-2 pl-4 border-l-2" style={{ borderColor: `${accent}40` }}>
                <div className="flex justify-between"><p className="font-semibold text-xs">{edu.school}</p><p className="text-xs text-gray-500">{edu.startYear}{edu.endYear && ` – ${edu.endYear}`}</p></div>
                <p className="text-xs text-gray-600">{[edu.degree, edu.field].filter(Boolean).join(", ")}{edu.gpa && ` · GPA: ${edu.gpa}`}</p>
              </div>
            ))}
          </div>
        )}
        {experience.some(e => e.company) && (
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
              <span className="inline-block w-3 h-0.5" style={{ backgroundColor: accent }} />Experience
            </h3>
            {experience.filter(e => e.company).map(exp => (
              <div key={exp.id} className="mb-2 pl-4 border-l-2" style={{ borderColor: `${accent}40` }}>
                <div className="flex justify-between"><p className="font-semibold text-xs">{exp.role}</p><p className="text-xs text-gray-500">{exp.startDate}{exp.endDate && ` – ${exp.endDate}`}</p></div>
                <p className="text-xs" style={{ color: accent }}>{exp.company}</p>
                {exp.description && <p className="text-xs mt-1 text-gray-700">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}
        {projects.some(p => p.name) && (
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
              <span className="inline-block w-3 h-0.5" style={{ backgroundColor: accent }} />Projects
            </h3>
            {projects.filter(p => p.name).map(proj => (
              <div key={proj.id} className="mb-2 pl-4 border-l-2" style={{ borderColor: `${accent}40` }}>
                <p className="font-semibold text-xs">{proj.name}{proj.tech && <span className="font-normal text-gray-500"> · {proj.tech}</span>}</p>
                {proj.description && <p className="text-xs text-gray-700">{proj.description}</p>}
              </div>
            ))}
          </div>
        )}
        {skills && (
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
              <span className="inline-block w-3 h-0.5" style={{ backgroundColor: accent }} />Skills
            </h3>
            <div className="flex flex-wrap gap-1 pl-4">
              {skills.split(",").map(s => s.trim()).filter(Boolean).map(skill => (
                <span key={skill} className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: accent }}>{skill}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ResumePreviewMinimal({ data }: { data: ResumeData }) {
  const { personal, education, experience, projects, skills } = data
  return (
    <div className="text-sm space-y-5">
      <div className="flex items-start gap-4">
        {personal.photo && <Photo src={personal.photo} size={52} />}
        <div>
          <h2 className="text-2xl font-light tracking-tight">{personal.name || "Your Name"}</h2>
          <p className="text-xs mt-1 text-gray-400">{[personal.email, personal.phone, personal.location].filter(Boolean).join("  ·  ")}</p>
          {(personal.linkedin || personal.github) && <p className="text-xs text-gray-400">{[personal.linkedin, personal.github].filter(Boolean).join("  ·  ")}</p>}
          {personal.summary && <p className="text-xs mt-2 text-gray-600 leading-relaxed">{personal.summary}</p>}
        </div>
      </div>
      {education.some(e => e.school) && (
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">Education</p>
          {education.filter(e => e.school).map(edu => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-baseline"><p className="text-xs font-medium">{edu.school}</p><p className="text-[10px] text-gray-400">{edu.startYear}{edu.endYear && `–${edu.endYear}`}</p></div>
              <p className="text-xs text-gray-500">{[edu.degree, edu.field].filter(Boolean).join(", ")}{edu.gpa && `, GPA ${edu.gpa}`}</p>
            </div>
          ))}
        </div>
      )}
      {experience.some(e => e.company) && (
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">Experience</p>
          {experience.filter(e => e.company).map(exp => (
            <div key={exp.id} className="mb-2">
              <div className="flex justify-between items-baseline"><p className="text-xs font-medium">{exp.role} <span className="font-light text-gray-500">@ {exp.company}</span></p><p className="text-[10px] text-gray-400">{exp.startDate}{exp.endDate && `–${exp.endDate}`}</p></div>
              {exp.description && <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}
      {projects.some(p => p.name) && (
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">Projects</p>
          {projects.filter(p => p.name).map(proj => (
            <div key={proj.id} className="mb-2">
              <p className="text-xs font-medium">{proj.name}{proj.tech && <span className="font-light text-gray-500"> — {proj.tech}</span>}</p>
              {proj.description && <p className="text-xs text-gray-600">{proj.description}</p>}
            </div>
          ))}
        </div>
      )}
      {skills && (
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">Skills</p>
          <p className="text-xs text-gray-600 leading-relaxed">{skills}</p>
        </div>
      )}
    </div>
  )
}

function ResumePreviewForest({ data }: { data: ResumeData }) {
  const { personal, education, experience, projects, skills } = data
  const accent = "#166534"
  return (
    <div className="text-sm">
      <div className="flex gap-0">
        <div className="w-2 rounded-l-sm shrink-0" style={{ backgroundColor: accent }} />
        <div className="flex-1 space-y-4 pl-4">
          <div className="pb-3 border-b flex items-start gap-3" style={{ borderColor: `${accent}30` }}>
            {personal.photo && <Photo src={personal.photo} size={52} />}
            <div>
              <h2 className="text-xl font-bold" style={{ color: accent }}>{personal.name || "Your Name"}</h2>
              <p className="text-xs mt-1 text-gray-600">{[personal.email, personal.phone, personal.location].filter(Boolean).join(" · ")}</p>
              <p className="text-xs text-gray-500">{[personal.linkedin, personal.github].filter(Boolean).join(" · ")}</p>
              {personal.summary && <p className="text-xs mt-2 text-gray-700">{personal.summary}</p>}
            </div>
          </div>
          {education.some(e => e.school) && (
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wide mb-2 px-2 py-1 rounded text-white text-[10px]" style={{ backgroundColor: accent }}>Education</h3>
              {education.filter(e => e.school).map(edu => (
                <div key={edu.id} className="mb-2">
                  <div className="flex justify-between"><p className="font-semibold text-xs">{edu.school}</p><p className="text-xs text-gray-500">{edu.startYear}{edu.endYear && ` – ${edu.endYear}`}</p></div>
                  <p className="text-xs text-gray-600">{[edu.degree, edu.field].filter(Boolean).join(", ")}{edu.gpa && ` · GPA: ${edu.gpa}`}</p>
                </div>
              ))}
            </div>
          )}
          {experience.some(e => e.company) && (
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wide mb-2 px-2 py-1 rounded text-white text-[10px]" style={{ backgroundColor: accent }}>Experience</h3>
              {experience.filter(e => e.company).map(exp => (
                <div key={exp.id} className="mb-2">
                  <div className="flex justify-between"><p className="font-semibold text-xs">{exp.role}</p><p className="text-xs text-gray-500">{exp.startDate}{exp.endDate && ` – ${exp.endDate}`}</p></div>
                  <p className="text-xs font-medium" style={{ color: accent }}>{exp.company}</p>
                  {exp.description && <p className="text-xs mt-1 text-gray-700">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}
          {projects.some(p => p.name) && (
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wide mb-2 px-2 py-1 rounded text-white text-[10px]" style={{ backgroundColor: accent }}>Projects</h3>
              {projects.filter(p => p.name).map(proj => (
                <div key={proj.id} className="mb-2">
                  <p className="font-semibold text-xs">{proj.name}{proj.tech && <span className="font-normal text-gray-500"> · {proj.tech}</span>}</p>
                  {proj.description && <p className="text-xs text-gray-700">{proj.description}</p>}
                </div>
              ))}
            </div>
          )}
          {skills && (
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wide mb-2 px-2 py-1 rounded text-white text-[10px]" style={{ backgroundColor: accent }}>Skills</h3>
              <div className="flex flex-wrap gap-1">
                {skills.split(",").map(s => s.trim()).filter(Boolean).map(skill => (
                  <span key={skill} className="text-xs border rounded px-1.5 py-0.5" style={{ borderColor: `${accent}50`, color: accent }}>{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResumePage() {
  const [personal, setPersonal] = useState({ name: "", email: "", phone: "", location: "", linkedin: "", github: "", summary: "", photo: "" })
  const [education, setEducation] = useState<Education[]>([{ id: "1", school: "", degree: "", field: "", startYear: "", endYear: "", gpa: "" }])
  const [experience, setExperience] = useState<Experience[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState("")
  const [activeSection, setActiveSection] = useState("personal")
  const [theme, setTheme] = useState<ThemeId>("classic")
  const [exporting, setExporting] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const sections = ["personal", "education", "experience", "projects", "skills"]
  const data: ResumeData = { personal, education, experience, projects, skills }

  const handleExport = async () => {
    if (!previewRef.current) return
    setExporting(true)
    try {
      const html2canvas = (await import("html2canvas")).default
      const { jsPDF } = await import("jspdf")
      const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff" })
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * pageWidth) / canvas.width
      let y = 0
      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      } else {
        // Multi-page support
        let remaining = imgHeight
        while (remaining > 0) {
          pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight)
          remaining -= pageHeight
          y -= pageHeight
          if (remaining > 0) pdf.addPage()
        }
      }
      pdf.save(`${personal.name || "resume"}_${theme}.pdf`)
    } catch (e) {
      console.error("Export failed:", e)
    } finally {
      setExporting(false)
    }
  }

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setPersonal(p => ({ ...p, photo: ev.target?.result as string }))
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <Header title="Resume Builder" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Build a professional resume with modern templates</p>
            <Badge className="ml-2">Pro Feature</Badge>
          </div>
          <Button className="gap-2" onClick={handleExport} disabled={exporting}>
            {exporting ? <><Loader2 className="h-4 w-4 animate-spin" />Exporting...</> : <><Download className="h-4 w-4" />Export PDF</>}
          </Button>
        </div>

        {/* Theme picker */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><Palette className="h-3.5 w-3.5" />Choose a theme</p>
          <div className="flex gap-2 flex-wrap">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as ThemeId)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-sm transition-all ${theme === t.id ? "border-primary shadow-sm bg-primary/5" : "border-border hover:border-muted-foreground/40"}`}
              >
                <span className={`h-3.5 w-3.5 rounded-full ${t.preview}`} />
                <span className="font-medium text-xs">{t.name}</span>
                <span className="text-xs text-muted-foreground hidden sm:inline">{t.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {sections.map(s => (
            <Button key={s} variant={activeSection === s ? "default" : "outline"} size="sm" onClick={() => setActiveSection(s)} className="capitalize">{s}</Button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Form */}
          <div className="space-y-4">
            {activeSection === "personal" && (
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><UserCircle className="h-4 w-4" />Personal Information</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {/* Photo upload */}
                  <div className="flex items-center gap-4 p-3 border rounded-lg bg-muted/30">
                    {personal.photo ? (
                      <img src={personal.photo} alt="profile" className="h-14 w-14 rounded-full object-cover border-2 border-border shrink-0" />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center shrink-0">
                        <Camera className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-xs font-medium">Profile Photo</p>
                      <p className="text-xs text-muted-foreground mb-2">Optional — JPG or PNG</p>
                      <label className="cursor-pointer">
                        <span className="text-xs px-3 py-1.5 rounded-md border border-border bg-background hover:bg-muted transition-colors">
                          {personal.photo ? "Change photo" : "Upload photo"}
                        </span>
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                      </label>
                      {personal.photo && (
                        <button onClick={() => setPersonal(p => ({ ...p, photo: "" }))} className="ml-2 text-xs text-destructive hover:underline">Remove</button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Full Name" value={personal.name} onChange={e => setPersonal({ ...personal, name: e.target.value })} />
                    <Input placeholder="Email" type="email" value={personal.email} onChange={e => setPersonal({ ...personal, email: e.target.value })} />
                    <Input placeholder="Phone" value={personal.phone} onChange={e => setPersonal({ ...personal, phone: e.target.value })} />
                    <Input placeholder="Location" value={personal.location} onChange={e => setPersonal({ ...personal, location: e.target.value })} />
                    <Input placeholder="LinkedIn URL" value={personal.linkedin} onChange={e => setPersonal({ ...personal, linkedin: e.target.value })} />
                    <Input placeholder="GitHub URL" value={personal.github} onChange={e => setPersonal({ ...personal, github: e.target.value })} />
                  </div>
                  <Textarea placeholder="Professional summary..." value={personal.summary} onChange={e => setPersonal({ ...personal, summary: e.target.value })} />
                </CardContent>
              </Card>
            )}

            {activeSection === "education" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">Education
                    <Button size="sm" variant="outline" onClick={() => setEducation([...education, { id: Date.now().toString(), school: "", degree: "", field: "", startYear: "", endYear: "", gpa: "" }])}>
                      <Plus className="h-3 w-3 mr-1" />Add
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {education.map((edu, i) => (
                    <div key={edu.id} className="space-y-2 border rounded-md p-3">
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="School/University" value={edu.school} onChange={e => { const n = [...education]; n[i].school = e.target.value; setEducation(n) }} className="col-span-2" />
                        <Input placeholder="Degree (e.g. Bachelor's)" value={edu.degree} onChange={e => { const n = [...education]; n[i].degree = e.target.value; setEducation(n) }} />
                        <Input placeholder="Field of Study" value={edu.field} onChange={e => { const n = [...education]; n[i].field = e.target.value; setEducation(n) }} />
                        <Input placeholder="Start Year" value={edu.startYear} onChange={e => { const n = [...education]; n[i].startYear = e.target.value; setEducation(n) }} />
                        <Input placeholder="End Year / Expected" value={edu.endYear} onChange={e => { const n = [...education]; n[i].endYear = e.target.value; setEducation(n) }} />
                        <Input placeholder="GPA (optional)" value={edu.gpa} onChange={e => { const n = [...education]; n[i].gpa = e.target.value; setEducation(n) }} />
                      </div>
                      {education.length > 1 && <Button variant="ghost" size="sm" onClick={() => setEducation(education.filter(e => e.id !== edu.id))} className="text-destructive"><Trash2 className="h-3 w-3 mr-1" />Remove</Button>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeSection === "experience" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">Experience
                    <Button size="sm" variant="outline" onClick={() => setExperience([...experience, { id: Date.now().toString(), company: "", role: "", startDate: "", endDate: "", description: "" }])}>
                      <Plus className="h-3 w-3 mr-1" />Add
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {experience.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No experience added yet. Click Add to add your work experience.</p>}
                  {experience.map((exp, i) => (
                    <div key={exp.id} className="space-y-2 border rounded-md p-3">
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Company" value={exp.company} onChange={e => { const n = [...experience]; n[i].company = e.target.value; setExperience(n) }} />
                        <Input placeholder="Role/Position" value={exp.role} onChange={e => { const n = [...experience]; n[i].role = e.target.value; setExperience(n) }} />
                        <Input placeholder="Start Date" value={exp.startDate} onChange={e => { const n = [...experience]; n[i].startDate = e.target.value; setExperience(n) }} />
                        <Input placeholder="End Date / Present" value={exp.endDate} onChange={e => { const n = [...experience]; n[i].endDate = e.target.value; setExperience(n) }} />
                        <Textarea placeholder="Description, achievements..." value={exp.description} onChange={e => { const n = [...experience]; n[i].description = e.target.value; setExperience(n) }} className="col-span-2" />
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setExperience(experience.filter(e => e.id !== exp.id))} className="text-destructive"><Trash2 className="h-3 w-3 mr-1" />Remove</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeSection === "projects" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">Projects
                    <Button size="sm" variant="outline" onClick={() => setProjects([...projects, { id: Date.now().toString(), name: "", description: "", tech: "", link: "" }])}>
                      <Plus className="h-3 w-3 mr-1" />Add
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {projects.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No projects added yet.</p>}
                  {projects.map((proj, i) => (
                    <div key={proj.id} className="space-y-2 border rounded-md p-3">
                      <Input placeholder="Project Name" value={proj.name} onChange={e => { const n = [...projects]; n[i].name = e.target.value; setProjects(n) }} />
                      <Textarea placeholder="Description" value={proj.description} onChange={e => { const n = [...projects]; n[i].description = e.target.value; setProjects(n) }} />
                      <Input placeholder="Technologies (e.g. React, Node.js, Python)" value={proj.tech} onChange={e => { const n = [...projects]; n[i].tech = e.target.value; setProjects(n) }} />
                      <Input placeholder="Project Link (optional)" value={proj.link} onChange={e => { const n = [...projects]; n[i].link = e.target.value; setProjects(n) }} />
                      <Button variant="ghost" size="sm" onClick={() => setProjects(projects.filter(p => p.id !== proj.id))} className="text-destructive"><Trash2 className="h-3 w-3 mr-1" />Remove</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeSection === "skills" && (
              <Card>
                <CardHeader><CardTitle className="text-base">Skills</CardTitle></CardHeader>
                <CardContent>
                  <Textarea placeholder="List your skills separated by commas (e.g. Python, React, Machine Learning, SQL, Git)" className="min-h-[120px]" value={skills} onChange={e => setSkills(e.target.value)} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                Resume Preview
                <Badge variant="outline" className="text-xs font-normal capitalize">{theme}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={previewRef} className="rounded-md border p-6 min-h-[500px] bg-white">
                {personal.name ? (
                  <>
                    {theme === "classic" && <ResumePreviewClassic data={data} />}
                    {theme === "modern" && <ResumePreviewModern data={data} />}
                    {theme === "minimal" && <ResumePreviewMinimal data={data} />}
                    {theme === "forest" && <ResumePreviewForest data={data} />}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[400px] text-muted-foreground">
                    <p className="text-sm">Fill in your information to see the preview</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
