import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()

    if (!text || text.trim().length < 50) {
      return NextResponse.json({ error: "Text too short" }, { status: 400 })
    }

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 8000,
      messages: [
        {
          role: "user",
          content: `You are an expert study assistant. Analyze the following lesson/text and generate comprehensive study materials in JSON format.

Return ONLY a valid JSON object with this exact structure:
{
  "summary": "A comprehensive 2-3 paragraph summary of the lesson",
  "keyConcepts": [
    { "term": "Term Name", "definition": "Clear definition" }
  ],
  "multipleChoice": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "The correct option text"
    }
  ],
  "shortAnswer": [
    { "question": "Question text", "answer": "Detailed answer" }
  ],
  "flashcards": [
    { "front": "Term or question", "back": "Definition or answer" }
  ],
  "topics": ["topic1", "topic2", "topic3"]
}

Generate at least:
- 5 key concepts
- 5 multiple choice questions
- 3 short answer questions
- 8 flashcards
- 3-5 topics for video search

LESSON CONTENT:
${text}`,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== "text") {
      throw new Error("Unexpected response type")
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No JSON found in response")
    }

    const materials = JSON.parse(jsonMatch[0])
    return NextResponse.json(materials)
  } catch (error) {
    console.error("Lesson AI error:", error)
    return NextResponse.json({ error: "Failed to process lesson" }, { status: 500 })
  }
}
