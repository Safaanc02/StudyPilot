import { NextRequest, NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("files") as File

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const pdf = await PDFDocument.load(bytes)
    const pdfBytes = await pdf.save({ useObjectStreams: true })

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=compressed.pdf",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to compress PDF" }, { status: 500 })
  }
}
