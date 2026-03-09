"use client"
import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Merge, Scissors, Minimize2, FileOutput, Upload, Loader2 } from "lucide-react"

const tools = [
  { id: "merge", icon: Merge, title: "Merge PDFs", description: "Combine multiple PDFs into one", endpoint: "/api/pdf/merge", multiple: true },
  { id: "split", icon: Scissors, title: "Split PDF", description: "Extract pages or split into multiple PDFs", endpoint: "/api/pdf/split", multiple: false },
  { id: "compress", icon: Minimize2, title: "Compress PDF", description: "Reduce PDF file size", endpoint: "/api/pdf/compress", multiple: false },
  { id: "convert", icon: FileOutput, title: "PDF to Word", description: "Convert PDF to editable Word document", endpoint: "/api/pdf/convert", multiple: false },
]

export default function PDFToolsPage() {
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const tool = tools.find(t => t.id === activeTool)

  const handleProcess = async () => {
    if (!tool || files.length === 0) return
    setIsProcessing(true)
    try {
      const formData = new FormData()
      files.forEach(f => formData.append("files", f))
      const res = await fetch(tool.endpoint, { method: "POST", body: formData })
      if (res.ok) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        setResult(url)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div>
      <Header title="PDF Tools" />
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Essential PDF tools for students — merge lecture slides, split readings, compress submissions.</p>
          <Badge className="ml-auto">Pro Feature</Badge>
        </div>

        {/* Tool Selection */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {tools.map((t) => {
            const Icon = t.icon
            return (
              <Card
                key={t.id}
                className={`cursor-pointer transition-all ${activeTool === t.id ? "border-primary ring-1 ring-primary" : "hover:border-primary/50"}`}
                onClick={() => { setActiveTool(t.id); setFiles([]); setResult(null) }}
              >
                <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-medium text-sm">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Active Tool */}
        {tool && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{tool.title}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed p-8 hover:border-primary/50 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium">Click to upload PDF{tool.multiple ? "s" : ""}</p>
                  <p className="text-xs text-muted-foreground">{tool.multiple ? "Select multiple files" : "Select one file"}</p>
                </div>
                <input type="file" accept=".pdf" multiple={tool.multiple} className="hidden"
                  onChange={e => setFiles(Array.from(e.target.files || []))} />
              </label>

              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-md border p-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm flex-1 truncate">{f.name}</span>
                      <span className="text-xs text-muted-foreground">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
              )}

              <Button onClick={handleProcess} disabled={files.length === 0 || isProcessing} className="w-full">
                {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</> : `Process with ${tool.title}`}
              </Button>

              {result && (
                <a href={result} download="output.pdf" className="block w-full">
                  <Button variant="outline" className="w-full">Download Result</Button>
                </a>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
