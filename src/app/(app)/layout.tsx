import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { userId: clerkId } = await auth()

  if (clerkId) {
    const user = await prisma.user.findUnique({ where: { clerkId }, select: { gender: true } })
    if (!user || !user.gender) {
      redirect("/onboarding")
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 pl-64">
        {children}
      </main>
    </div>
  )
}
