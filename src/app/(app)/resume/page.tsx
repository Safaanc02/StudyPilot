"use client"
import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Download, UserCircle } from "lucide-react"

interface Education { id: string; school: string; degree: string; field: string; startYear: string; endYear: string; gpa: string }
interface Experience { id: string; company: string; role: string; startDate: string; endDate: string; description: string }
interface Project { id: string; name: string; description: string; tech: string; link: string }

export default function ResumePage() {
  const [personal, setPersonal] = useState({ name: "", email: "", phone: "", location: "", linkedin: "", github: "", summary: "" })
  const [education, setEducation] = useState<Education[]>([{ id: "1", school: "", degree: "", field: "", startYear: "", endYear: "", gpa: "" }])
  const [experience, setExperience] = useState<Experience[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState("")
  const [activeSection, setActiveSection] = useState("personal")

  const sections = ["personal", "education", "experience", "projects", "skills"]

  return (
    <div>
      <Header title="Resume Builder" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Build a professional resume with modern templates</p>
            <Badge className="ml-2">Pro Feature</Badge>
          </div>
          <Button className="gap-2"><Download className="h-4 w-4" />Export PDF</Button>
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
            <CardHeader><CardTitle className="text-base">Resume Preview</CardTitle></CardHeader>
            <CardContent>
              <div className="rounded-md border p-6 text-sm space-y-4 min-h-[500px]">
                {personal.name ? (
                  <>
                    <div className="text-center border-b pb-4">
                      <h2 className="text-xl font-bold">{personal.name}</h2>
                      <p className="text-muted-foreground text-xs mt-1">{[personal.email, personal.phone, personal.location].filter(Boolean).join(" · ")}</p>
                      <p className="text-muted-foreground text-xs">{[personal.linkedin, personal.github].filter(Boolean).join(" · ")}</p>
                      {personal.summary && <p className="text-xs mt-2">{personal.summary}</p>}
                    </div>
                    {education.some(e => e.school) && (
                      <div>
                        <h3 className="font-bold text-xs uppercase tracking-wide mb-2">Education</h3>
                        {education.filter(e => e.school).map(edu => (
                          <div key={edu.id} className="mb-2">
                            <p className="font-semibold text-xs">{edu.school}</p>
                            <p className="text-muted-foreground text-xs">{edu.degree} {edu.field} {edu.startYear && `· ${edu.startYear} – ${edu.endYear}`} {edu.gpa && `· GPA: ${edu.gpa}`}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {experience.some(e => e.company) && (
                      <div>
                        <h3 className="font-bold text-xs uppercase tracking-wide mb-2">Experience</h3>
                        {experience.filter(e => e.company).map(exp => (
                          <div key={exp.id} className="mb-2">
                            <div className="flex justify-between"><p className="font-semibold text-xs">{exp.role}</p><p className="text-muted-foreground text-xs">{exp.startDate} – {exp.endDate}</p></div>
                            <p className="text-muted-foreground text-xs">{exp.company}</p>
                            {exp.description && <p className="text-xs mt-1">{exp.description}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                    {projects.some(p => p.name) && (
                      <div>
                        <h3 className="font-bold text-xs uppercase tracking-wide mb-2">Projects</h3>
                        {projects.filter(p => p.name).map(proj => (
                          <div key={proj.id} className="mb-2">
                            <p className="font-semibold text-xs">{proj.name} {proj.tech && <span className="font-normal text-muted-foreground">· {proj.tech}</span>}</p>
                            {proj.description && <p className="text-xs">{proj.description}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                    {skills && (
                      <div>
                        <h3 className="font-bold text-xs uppercase tracking-wide mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-1">
                          {skills.split(",").map(s => s.trim()).filter(Boolean).map(skill => (
                            <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
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
