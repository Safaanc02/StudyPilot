"use client"
import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, StickyNote, Layers, Edit2, Save } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  subject: string
  createdAt: string
}

interface Flashcard {
  id: string
  front: string
  back: string
  subject: string
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([
    { id: "1", title: "Newton's Laws of Motion", content: "1. An object at rest stays at rest...\n2. F = ma\n3. Every action has an equal and opposite reaction.", subject: "Physics", createdAt: "2026-03-08" },
    { id: "2", title: "Binary Search Trees", content: "A BST is a binary tree where each node has a value greater than all nodes in its left subtree and less than all nodes in its right subtree.", subject: "Data Structures", createdAt: "2026-03-07" },
  ])
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    { id: "1", front: "What is Newton's First Law?", back: "An object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force.", subject: "Physics" },
    { id: "2", front: "Time complexity of BST search?", back: "O(log n) average case, O(n) worst case", subject: "Data Structures" },
  ])
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [newNote, setNewNote] = useState({ title: "", content: "", subject: "" })
  const [newCard, setNewCard] = useState({ front: "", back: "", subject: "" })
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [showCardForm, setShowCardForm] = useState(false)
  const [activeCard, setActiveCard] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const addNote = () => {
    if (!newNote.title || !newNote.content) return
    setNotes([...notes, { ...newNote, id: Date.now().toString(), createdAt: new Date().toISOString().split("T")[0] }])
    setNewNote({ title: "", content: "", subject: "" })
    setShowNoteForm(false)
  }

  const addCard = () => {
    if (!newCard.front || !newCard.back) return
    setFlashcards([...flashcards, { ...newCard, id: Date.now().toString() }])
    setNewCard({ front: "", back: "", subject: "" })
    setShowCardForm(false)
  }

  return (
    <div>
      <Header title="Notes & Flashcards" />
      <div className="p-6">
        <Tabs defaultValue="notes">
          <TabsList>
            <TabsTrigger value="notes" className="gap-2"><StickyNote className="h-4 w-4" />Notes</TabsTrigger>
            <TabsTrigger value="flashcards" className="gap-2"><Layers className="h-4 w-4" />Flashcards</TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="mt-4 space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowNoteForm(!showNoteForm)} className="gap-2">
                <Plus className="h-4 w-4" /> New Note
              </Button>
            </div>
            {showNoteForm && (
              <Card>
                <CardContent className="space-y-3 p-4">
                  <Input placeholder="Note title" value={newNote.title} onChange={e => setNewNote({ ...newNote, title: e.target.value })} />
                  <Input placeholder="Subject" value={newNote.subject} onChange={e => setNewNote({ ...newNote, subject: e.target.value })} />
                  <Textarea placeholder="Write your notes..." className="min-h-[120px]" value={newNote.content} onChange={e => setNewNote({ ...newNote, content: e.target.value })} />
                  <Button onClick={addNote} className="w-full">Save Note</Button>
                </CardContent>
              </Card>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              {notes.map((note) => (
                <Card key={note.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{note.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          {note.subject && <Badge variant="secondary" className="text-xs">{note.subject}</Badge>}
                          <span className="text-xs text-muted-foreground">{note.createdAt}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setNotes(notes.filter(n => n.id !== note.id))}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-4">{note.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="flashcards" className="mt-4 space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowCardForm(!showCardForm)} className="gap-2">
                <Plus className="h-4 w-4" /> New Flashcard
              </Button>
            </div>
            {showCardForm && (
              <Card>
                <CardContent className="space-y-3 p-4">
                  <Input placeholder="Subject" value={newCard.subject} onChange={e => setNewCard({ ...newCard, subject: e.target.value })} />
                  <Textarea placeholder="Front (question or term)" value={newCard.front} onChange={e => setNewCard({ ...newCard, front: e.target.value })} />
                  <Textarea placeholder="Back (answer or definition)" value={newCard.back} onChange={e => setNewCard({ ...newCard, back: e.target.value })} />
                  <Button onClick={addCard} className="w-full">Add Flashcard</Button>
                </CardContent>
              </Card>
            )}
            {flashcards.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">Card {activeCard + 1} of {flashcards.length} · {flashcards[activeCard].subject}</p>
                    <p className="text-xs text-muted-foreground">Click to flip</p>
                  </div>
                  <div
                    className="min-h-[180px] rounded-lg border-2 border-primary/20 bg-primary/5 flex items-center justify-center p-8 cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => setFlipped(!flipped)}
                  >
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-2">{flipped ? "Answer" : "Question"}</p>
                      <p className="text-lg font-medium">{flipped ? flashcards[activeCard].back : flashcards[activeCard].front}</p>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={() => { setActiveCard(Math.max(0, activeCard - 1)); setFlipped(false) }} disabled={activeCard === 0}>Previous</Button>
                    <Button variant="outline" onClick={() => { setActiveCard(Math.min(flashcards.length - 1, activeCard + 1)); setFlipped(false) }} disabled={activeCard === flashcards.length - 1}>Next</Button>
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              {flashcards.map((card, i) => (
                <Card key={card.id} className="cursor-pointer" onClick={() => { setActiveCard(i); setFlipped(false) }}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{card.front}</p>
                        <p className="text-xs text-muted-foreground mt-1 truncate">{card.back}</p>
                        {card.subject && <Badge variant="outline" className="text-xs mt-2">{card.subject}</Badge>}
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={e => { e.stopPropagation(); setFlashcards(flashcards.filter(c => c.id !== card.id)) }}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
