import { NextRequest, NextResponse } from "next/server"

const PDF_CO_API_KEY = process.env.PDF_CO_API_KEY

export async function POST(req: NextRequest) {
  try {
    if (!PDF_CO_API_KEY) {
      return NextResponse.json({ error: "Compression service not configured" }, { status: 503 })
    }

    const formData = await req.formData()
    const file = formData.get("files") as File

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    const bytes = await file.arrayBuffer()

    // Step 1: Get presigned upload URL from pdf.co
    const presignedRes = await fetch(
      `https://api.pdf.co/v1/file/upload/get-presigned-url?contenttype=application/pdf&name=${encodeURIComponent(file.name)}`,
      { headers: { "x-api-key": PDF_CO_API_KEY } }
    )
    const presignedData = await presignedRes.json()
    if (presignedData.error) {
      return NextResponse.json({ error: "Upload failed: " + presignedData.message }, { status: 500 })
    }

    // Step 2: Upload file to presigned URL
    await fetch(presignedData.presignedUrl, {
      method: "PUT",
      headers: { "content-type": "application/pdf" },
      body: bytes,
    })

    // Step 3: Compress via pdf.co
    const compressRes = await fetch("https://api.pdf.co/v1/pdf/optimize", {
      method: "POST",
      headers: {
        "x-api-key": PDF_CO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        url: presignedData.url,
        async: false,
        name: "compressed.pdf",
      }),
    })
    const compressData = await compressRes.json()
    if (compressData.error) {
      return NextResponse.json({ error: "Compression failed: " + compressData.message }, { status: 500 })
    }

    // Step 4: Download result and return to client
    const resultRes = await fetch(compressData.url)
    const resultBytes = await resultRes.arrayBuffer()

    return new NextResponse(resultBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="compressed.pdf"`,
        "X-Original-Size": String(file.size),
        "X-Compressed-Size": String(resultBytes.byteLength),
      },
    })
  } catch (error) {
    console.error("Compress error:", error)
    return NextResponse.json({ error: "Failed to compress PDF" }, { status: 500 })
  }
}
