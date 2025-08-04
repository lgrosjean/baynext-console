"use client"

import { useAuth } from "@/contexts/auth-context"
import AuthLoading from "@/components/auth-loading"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const { user, loading, isSupabaseConfigured } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isSupabaseConfigured) {
      if (user) {
        router.push("/app/projects")
      } else {
        router.push("/login")
      }
    }
  }, [user, loading, isSupabaseConfigured, router])

  if (loading) {
    return <AuthLoading />
  }
  return <AuthLoading />
}
