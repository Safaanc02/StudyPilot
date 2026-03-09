import { NextRequest, NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("files") as File

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const pdf = await PDFDocument.load(bytes)
    // Split into individual pages, package as first page for demo
    const newPdf = await PDFDocument.create()
    const [firstPage] = await newPdf.copyPages(pdf, [0])
    newPdf.addPage(firstPage)

    const pdfBytes = await newPdf.save()
    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=split.pdf",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to split PDF" }, { status: 500 })
  }
}
