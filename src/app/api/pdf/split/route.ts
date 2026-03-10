import { NextRequest, NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

function parsePageRange(input: string, total: number): number[] {
  const pages = new Set<number>()
  const parts = input.split(",").map(p => p.trim())
  for (const part of parts) {
    if (part.includes("-")) {
      const [start, end] = part.split("-").map(n => parseInt(n.trim()))
      for (let i = start; i <= Math.min(end, total); i++) {
        if (i >= 1) pages.add(i - 1) // 0-indexed
      }
    } else {
      const n = parseInt(part)
      if (!isNaN(n) && n >= 1 && n <= total) pages.add(n - 1)
    }
  }
  return Array.from(pages).sort((a, b) => a - b)
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("files") as File
    const pagesInput = formData.get("pages") as string | null

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const pdf = await PDFDocument.load(bytes)
    const total = pdf.getPageCount()

    const pageIndices = pagesInput?.trim()
      ? parsePageRange(pagesInput, total)
      : pdf.getPageIndices()

    if (pageIndices.length === 0) {
      return NextResponse.json({ error: "No valid pages found in range" }, { status: 400 })
    }

    const newPdf = await PDFDocument.create()
    const copied = await newPdf.copyPages(pdf, pageIndices)
    copied.forEach(p => newPdf.addPage(p))

    const pdfBytes = await newPdf.save()
    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=output.pdf",
      },
    })
  } catch (error) {
    console.error("Split error:", error)
    return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 })
  }
}
