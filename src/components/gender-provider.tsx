"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

type Gender = "male" | "female" | null

const GenderContext = createContext<Gender>(null)

export function useGender() {
  return useContext(GenderContext)
}

export function GenderProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useUser()
  const [gender, setGender] = useState<Gender>(null)

  useEffect(() => {
    if (!isSignedIn) {
      document.documentElement.removeAttribute("data-gender")
      setGender(null)
      return
    }

    fetch("/api/onboarding")
      .then(res => res.json())
      .then(data => {
        if (data.gender) {
          document.documentElement.setAttribute("data-gender", data.gender)
          setGender(data.gender)
        } else {
          document.documentElement.removeAttribute("data-gender")
          setGender(null)
        }
      })
      .catch(() => {})
  }, [isSignedIn])

  return <GenderContext.Provider value={gender}>{children}</GenderContext.Provider>
}
