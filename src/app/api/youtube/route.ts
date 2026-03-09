import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 })
  }

  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "YouTube API key not configured" }, { status: 500 })
  }

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=6&relevanceLanguage=fr&key=${apiKey}`

  const res = await fetch(url)
  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json({ error: data.error?.message ?? "YouTube API error" }, { status: 500 })
  }

  const videos = data.items.map((item: {
    id: { videoId: string }
    snippet: { title: string; channelTitle: string; thumbnails: { medium: { url: string } } }
  }) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails.medium.url,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
  }))

  return NextResponse.json({ videos })
}
