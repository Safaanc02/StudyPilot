"use client"
import { useState } from "react"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Zap, BookOpen, HelpCircle, Brain, Layers, Loader2, Youtube, ExternalLink } from "lucide-react"

interface StudyMaterials {
  summary: string
  keyConcepts: { term: string; definition: string }[]
  multipleChoice: { question: string; options: string[]; answer: string }[]
  shortAnswer: { question: string; answer: string }[]
  flashcards: { front: string; back: string }[]
  topics: string[]
}

interface YoutubeVideo {
  id: string
  title: string
  channel: string
  thumbnail: string
  url: string
}

export default function LessonAIPage() {
  const [inputText, setInputText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [materials, setMaterials] = useState<StudyMaterials | null>(null)
  const [activeFlashcard, setActiveFlashcard] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [videos, setVideos] = useState<YoutubeVideo[]>([])
  const [loadingVideos, setLoadingVideos] = useState(false)

  const handleProcess = async () => {
    if (!inputText.trim()) return
    setIsProcessing(true)
    setVideos([])
    try {
      const res = await fetch("/api/lesson-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        console.error("API error:", data.error)
        return
      }
      setMaterials(data)
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

  const handleLoadVideos = async () => {
    if (!materials?.topics?.length) return
    setLoadingVideos(true)
    try {
      const query = materials.topics.slice(0, 3).join(" ")
      const res = await fetch(`/api/youtube?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      if (data.videos) setVideos(data.videos)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingVideos(false)
    }
  }

  return (
    <div>
      <Header title="AI Lesson Tool" />
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <div>
            <h2 className="font-semibold">AI-Powered Lesson Processor</h2>
            <p className="text-sm text-muted-foreground">Upload or paste your lesson content and get instant study materials</p>
          </div>
          <Badge className="ml-auto">Pro Feature</Badge>
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
          <Tabs defaultValue="summary" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="summary" className="text-xs"><BookOpen className="h-3 w-3 mr-1" />Summary</TabsTrigger>
              <TabsTrigger value="concepts" className="text-xs"><Brain className="h-3 w-3 mr-1" />Concepts</TabsTrigger>
              <TabsTrigger value="questions" className="text-xs"><HelpCircle className="h-3 w-3 mr-1" />Questions</TabsTrigger>
              <TabsTrigger value="flashcards" className="text-xs"><Layers className="h-3 w-3 mr-1" />Flashcards</TabsTrigger>
              <TabsTrigger value="videos" className="text-xs" onClick={handleLoadVideos}><Youtube className="h-3 w-3 mr-1" />Videos</TabsTrigger>
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
                  <CardDescription>Topics: {materials.topics.join(", ")}</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingVideos ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
                            <Image
                              src={video.thumbnail}
                              alt={video.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">{video.title}</p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs text-muted-foreground">{video.channel}</p>
                              <ExternalLink className="h-3 w-3 text-muted-foreground" />
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Youtube className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">Click the Videos tab to load recommendations</p>
                      <Button variant="outline" size="sm" className="mt-3" onClick={handleLoadVideos}>
                        Load Videos
                      </Button>
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
