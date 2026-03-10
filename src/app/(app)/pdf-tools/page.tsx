"use client"
import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, Merge, Scissors, Minimize2, BookCopy, Upload, Loader2, Download, X, CheckCircle2 } from "lucide-react"

const tools = [
  {
    id: "merge",
    icon: Merge,
    title: "Merge PDFs",
    description: "Combine multiple PDFs into one file",
    endpoint: "/api/pdf/merge",
    multiple: true,
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
    accent: "border-blue-500",
  },
  {
    id: "split",
    icon: Scissors,
    title: "Split PDF",
    description: "Extract a range of pages from a PDF",
    endpoint: "/api/pdf/split",
    multiple: false,
    color: "bg-purple-500/10 text-purple-600 border-purple-200",
    accent: "border-purple-500",
  },
  {
    id: "compress",
    icon: Minimize2,
    title: "Compress PDF",
    description: "Reduce PDF file size for submissions",
    endpoint: "/api/pdf/compress",
    multiple: false,
    color: "bg-green-500/10 text-green-600 border-green-200",
    accent: "border-green-500",
  },
  {
    id: "extract",
    icon: BookCopy,
    title: "Extract Pages",
    description: "Pick specific pages and save as new PDF",
    endpoint: "/api/pdf/split",
    multiple: false,
    color: "bg-orange-500/10 text-orange-600 border-orange-200",
    accent: "border-orange-500",
  },
]

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default function PDFToolsPage() {
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{ url: string; name: string } | null>(null)
  const [pageRange, setPageRange] = useState("")
  const [error, setError] = useState("")

  const tool = tools.find(t => t.id === activeTool)

  const handleProcess = async () => {
    if (!tool || files.length === 0) return
    setIsProcessing(true)
    setError("")
    setResult(null)
    try {
      const formData = new FormData()
      files.forEach(f => formData.append("files", f))
      if ((activeTool === "split" || activeTool === "extract") && pageRange) {
        formData.append("pages", pageRange)
      }
      const res = await fetch(tool.endpoint, { method: "POST", body: formData })
      if (res.ok) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const name = activeTool === "merge" ? "merged.pdf" : activeTool === "compress" ? "compressed.pdf" : "output.pdf"
        setResult({ url, name })
      } else {
        const data = await res.json()
        setError(data.error ?? "Processing failed")
      }
    } catch {
      setError("An error occurred")
    } finally {
      setIsProcessing(false)
    }
  }

  const removeFile = (i: number) => {
    setFiles(prev => prev.filter((_, idx) => idx !== i))
    setResult(null)
  }

  const selectTool = (id: string) => {
    setActiveTool(id)
    setFiles([])
    setResult(null)
    setError("")
    setPageRange("")
  }

  return (
    <div>
      <Header title="PDF Tools" />
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">PDF Toolkit</h2>
            <p className="text-sm text-muted-foreground">Merge, split, compress and extract pages from your PDF files</p>
          </div>
          <Badge variant="secondary">Free</Badge>
        </div>

        {/* Tool cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {tools.map((t) => {
            const Icon = t.icon
            const isActive = activeTool === t.id
            return (
              <button
                key={t.id}
                onClick={() => selectTool(t.id)}
                className={`group text-left rounded-xl border-2 p-4 transition-all hover:shadow-sm
                  ${isActive ? `${t.accent} shadow-sm` : "border-border hover:border-muted-foreground/30"}`}
              >
                <div className={`h-10 w-10 rounded-lg border flex items-center justify-center mb-3 ${t.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-semibold text-sm">{t.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{t.description}</p>
              </button>
            )
          })}
        </div>

        {/* Active tool panel */}
        {tool && (
          <Card>
            <CardContent className="p-6 space-y-5">
              {/* Title */}
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-lg border flex items-center justify-center ${tool.color}`}>
                  <tool.icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{tool.title}</h3>
                  <p className="text-xs text-muted-foreground">{tool.description}</p>
                </div>
              </div>

              {/* Drop zone */}
              <label className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors
                ${files.length > 0 ? "border-primary/30 bg-primary/2" : "hover:border-primary/40 hover:bg-muted/30"}`}>
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Click to upload PDF{tool.multiple ? "s" : ""}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{tool.multiple ? "Select multiple files" : "Select one file"} · PDF only</p>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  multiple={tool.multiple}
                  className="hidden"
                  onChange={e => { setFiles(Array.from(e.target.files || [])); setResult(null) }}
                />
              </label>

              {/* File list */}
              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                      <div className="h-8 w-8 rounded-md bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{f.name}</p>
                        <p className="text-xs text-muted-foreground">{formatSize(f.size)}</p>
                      </div>
                      <button onClick={() => removeFile(i)} className="h-6 w-6 rounded-md flex items-center justify-center hover:bg-destructive/10 hover:text-destructive transition-colors">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Page range for split/extract */}
              {(activeTool === "split" || activeTool === "extract") && files.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Page range (optional)</label>
                  <Input
                    placeholder="e.g. 1-3, 5, 7-10"
                    value={pageRange}
                    onChange={e => setPageRange(e.target.value)}
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground">Leave empty to extract all pages</p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Success + download */}
              {result && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-green-800">Done! Your file is ready.</p>
                    <p className="text-xs text-green-600">{result.name}</p>
                  </div>
                  <a href={result.url} download={result.name}>
                    <Button size="sm" className="gap-1.5 bg-green-600 hover:bg-green-700 text-white">
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </Button>
                  </a>
                </div>
              )}

              {/* Process button */}
              {!result && (
                <Button
                  onClick={handleProcess}
                  disabled={files.length === 0 || isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>
                  ) : (
                    <><tool.icon className="mr-2 h-4 w-4" />{tool.title}</>
                  )}
                </Button>
              )}

              {result && (
                <Button variant="outline" className="w-full" onClick={() => { setResult(null); setFiles([]) }}>
                  Process another file
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
