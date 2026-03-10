"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Upload, FileText, Zap, BookOpen, HelpCircle, Brain, Layers,
  Loader2, Youtube, ExternalLink, Library, X, Clock, BookMarked, Sparkles
} from "lucide-react"

interface StudyMaterials {
  summary: string
  keyConcepts: { term: string; definition: string }[]
  multipleChoice: { question: string; options: string[]; answer: string }[]
  shortAnswer: { question: string; answer: string }[]
  flashcards: { front: string; back: string }[]
  topics: string[]
}

interface HistoryItem {
  id: string
  title: string
  inputText: string
  result: StudyMaterials
  createdAt: string
}

interface YoutubeVideo {
  id: string
  title: string
  channel: string
  thumbnail: string
  url: string
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
}

export default function LessonAIPage() {
  const [inputText, setInputText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [materials, setMaterials] = useState<StudyMaterials | null>(null)
  const [activeFlashcard, setActiveFlashcard] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [videos, setVideos] = useState<YoutubeVideo[]>([])
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [videoError, setVideoError] = useState("")
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    fetch("/api/lesson-ai")
      .then((r) => r.json())
      .then((d) => { if (d.analyses) setHistory(d.analyses) })
      .catch(() => {})
  }, [])

  const handleProcess = async () => {
    if (!inputText.trim()) return
    setIsProcessing(true)
    setVideos([])
    setVideoError("")
    setMaterials(null)
    try {
      const res = await fetch("/api/lesson-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      })
      const data = await res.json()
      if (!res.ok || data.error) { console.error("API error:", data.error); return }
      setMaterials(data)
      fetch("/api/lesson-ai").then((r) => r.json()).then((d) => { if (d.analyses) setHistory(d.analyses) }).catch(() => {})
    } catch (err) {
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append("file", file)
    setIsProcessing(true)
    try {
      const res = await fetch("/api/lesson-ai/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (data.text) setInputText(data.text)
    } finally {
      setIsProcessing(false)
    }
  }

  const loadFromHistory = (item: HistoryItem) => {
    setMaterials(item.result)
    setInputText(item.inputText)
    setVideos([])
    setVideoError("")
    setShowHistory(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleLoadVideos = async () => {
    if (!materials?.topics?.length) return
    setLoadingVideos(true)
    setVideoError("")
    setVideos([])
    try {
      const query = materials.topics[0].split(" ").slice(0, 5).join(" ")
      const res = await fetch(`/api/youtube?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      if (data.error) setVideoError(data.error)
      else if (data.videos) setVideos(data.videos)
    } catch {
      setVideoError("Failed to load videos")
    } finally {
      setLoadingVideos(false)
    }
  }

  const handleTabChange = (value: string) => {
    if (value === "videos" && videos.length === 0 && !loadingVideos) handleLoadVideos()
  }

  return (
    <div className="relative">
      <Header title="AI Lesson Tool" />

      {/* My Library Drawer */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
          <div className="w-96 bg-background border-l shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Library className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm">My Library</h2>
                    <p className="text-xs text-muted-foreground">{history.length} saved {history.length === 1 ? "lesson" : "lessons"}</p>
                  </div>
                </div>
                <button onClick={() => setShowHistory(false)} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20 gap-3">
                  <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                    <BookMarked className="h-7 w-7 text-muted-foreground/40" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Library is empty</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Analyses you generate will be saved here</p>
                  </div>
                </div>
              ) : (
                history.map((item, index) => {
                  const result = item.result as StudyMaterials
                  return (
                    <button
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className="w-full text-left rounded-xl border bg-card hover:border-primary/40 hover:shadow-sm transition-all p-4 group relative overflow-hidden"
                    >
                      {/* Accent bar */}
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/0 group-hover:bg-primary/60 transition-all rounded-l-xl" />

                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="h-9 w-9 rounded-lg bg-primary/8 border border-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/15 transition-colors">
                          <Sparkles className="h-4 w-4 text-primary/70" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <p className="text-sm font-semibold leading-tight line-clamp-1 group-hover:text-primary transition-colors">{item.title}</p>
                            <span className="text-xs text-muted-foreground/50 shrink-0 mt-0.5">#{history.length - index}</span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2">{item.inputText}</p>

                          {/* Meta pills */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground/70">
                              <Clock className="h-2.5 w-2.5" />
                              {timeAgo(item.createdAt)}
                            </span>
                            <span className="text-muted-foreground/30 text-xs">·</span>
                            <span className="inline-flex items-center gap-1 bg-primary/6 text-primary/70 text-xs px-1.5 py-0.5 rounded-full font-medium">
                              <Layers className="h-2.5 w-2.5" />
                              {result.flashcards?.length ?? 0} cards
                            </span>
                            <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground text-xs px-1.5 py-0.5 rounded-full">
                              <Brain className="h-2.5 w-2.5" />
                              {result.keyConcepts?.length ?? 0} concepts
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}

      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <div>
            <h2 className="font-semibold">AI-Powered Lesson Processor</h2>
            <p className="text-sm text-muted-foreground">Upload or paste your lesson content and get instant study materials</p>
          </div>
          <Badge className="ml-auto">Pro Feature</Badge>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 shrink-0 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
            onClick={() => setShowHistory(true)}
          >
            <Library className="h-4 w-4 text-primary" />
            <span className="font-medium">My Library</span>
            {history.length > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded-full leading-none min-w-[18px] text-center">
                {history.length}
              </span>
            )}
          </Button>
        </div>

        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upload Your Lesson</CardTitle>
            <CardDescription>Paste text, upload a PDF, or type your notes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-accent transition-colors">
                <Upload className="h-4 w-4" />
                Upload PDF
                <input type="file" accept=".pdf,.txt" className="hidden" onChange={handleFileUpload} />
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-accent transition-colors">
                <FileText className="h-4 w-4" />
                Upload Text File
                <input type="file" accept=".txt,.md" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-x-0 top-0 flex items-center">
                <div className="w-full border-t" />
                <span className="bg-background px-2 text-xs text-muted-foreground whitespace-nowrap">or paste text</span>
                <div className="w-full border-t" />
              </div>
            </div>
            <Textarea
              placeholder="Paste your lesson content, notes, or study material here..."
              className="min-h-[200px] mt-4"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <Button onClick={handleProcess} disabled={!inputText.trim() || isProcessing} className="w-full">
              {isProcessing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing with AI...</>
              ) : (
                <><Zap className="mr-2 h-4 w-4" /> Generate Study Materials</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {materials && (
          <Tabs defaultValue="summary" className="space-y-4" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="summary" className="text-xs"><BookOpen className="h-3 w-3 mr-1" />Summary</TabsTrigger>
              <TabsTrigger value="concepts" className="text-xs"><Brain className="h-3 w-3 mr-1" />Concepts</TabsTrigger>
              <TabsTrigger value="questions" className="text-xs"><HelpCircle className="h-3 w-3 mr-1" />Questions</TabsTrigger>
              <TabsTrigger value="flashcards" className="text-xs"><Layers className="h-3 w-3 mr-1" />Flashcards</TabsTrigger>
              <TabsTrigger value="videos" className="text-xs"><Youtube className="h-3 w-3 mr-1" />Videos</TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <Card>
                <CardHeader><CardTitle className="text-base">Lesson Summary</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{materials.summary}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="concepts">
              <div className="grid gap-3">
                {materials.keyConcepts.map((concept, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <p className="font-semibold text-sm text-primary">{concept.term}</p>
                      <p className="text-sm text-muted-foreground mt-1">{concept.definition}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="questions">
              <div className="space-y-4">
                <h3 className="font-semibold">Multiple Choice Questions</h3>
                {materials.multipleChoice.map((q, i) => (
                  <Card key={i}>
                    <CardContent className="p-4 space-y-2">
                      <p className="font-medium text-sm">{i + 1}. {q.question}</p>
                      {q.options.map((opt, j) => (
                        <p key={j} className={`text-sm pl-4 ${opt === q.answer ? "text-green-600 font-medium" : "text-muted-foreground"}`}>
                          {String.fromCharCode(65 + j)}. {opt}
                        </p>
                      ))}
                    </CardContent>
                  </Card>
                ))}
                <h3 className="font-semibold mt-4">Short Answer Questions</h3>
                {materials.shortAnswer.map((q, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <p className="font-medium text-sm">{q.question}</p>
                      <p className="text-sm text-muted-foreground mt-2 pl-4 border-l-2 border-primary">{q.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="flashcards">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">Card {activeFlashcard + 1} of {materials.flashcards.length}</p>
                    <p className="text-xs text-muted-foreground">Click card to flip</p>
                  </div>
                  <div
                    className="min-h-[200px] rounded-lg border-2 border-primary/20 bg-primary/5 flex items-center justify-center p-8 cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => setFlipped(!flipped)}
                  >
                    <p className="text-center text-lg font-medium">
                      {flipped ? materials.flashcards[activeFlashcard].back : materials.flashcards[activeFlashcard].front}
                    </p>
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={() => { setActiveFlashcard(Math.max(0, activeFlashcard - 1)); setFlipped(false) }} disabled={activeFlashcard === 0}>Previous</Button>
                    <Button variant="outline" onClick={() => { setActiveFlashcard(Math.min(materials.flashcards.length - 1, activeFlashcard + 1)); setFlipped(false) }} disabled={activeFlashcard === materials.flashcards.length - 1}>Next</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="videos">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Youtube className="h-4 w-4 text-red-500" />
                    Recommended Learning Videos
                  </CardTitle>
                  <CardDescription>Based on: {materials.topics[0]}</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingVideos ? (
                    <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="text-sm">Loading videos...</span>
                    </div>
                  ) : videoError ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-destructive mb-3">{videoError}</p>
                      <Button variant="outline" size="sm" onClick={handleLoadVideos}>Retry</Button>
                    </div>
                  ) : videos.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {videos.map((video) => (
                        <a
                          key={video.id}
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group rounded-lg border overflow-hidden hover:border-primary transition-colors"
                        >
                          <div className="relative aspect-video bg-muted">
                            <Image src={video.thumbnail} alt={video.title} fill className="object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Youtube className="h-8 w-8 text-white" />
                            </div>
                          </div>
                          <div className="p-3">
                            <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">{video.title}</p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs text-muted-foreground truncate">{video.channel}</p>
                              <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0 ml-1" />
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
