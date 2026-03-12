import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/lesson-ai(.*)",
  "/planner(.*)",
  "/assignments(.*)",
  "/pdf-tools(.*)",
  "/resume(.*)",
  "/internships(.*)",
  "/notes(.*)",
  "/upgrade(.*)",
  "/onboarding(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
