"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import AuthLoading from "@/components/auth-loading"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { user, isSupabaseConfigured } = useAuth()

  useEffect(() => {
    if (user) {
      router.push("/projects")
    }
  }, [user, router])

  // If Supabase is not configured, redirect to home
  useEffect(() => {
    if (!isSupabaseConfigured) {
      router.push("/")
    }
  }, [isSupabaseConfigured, router])

  if (!isSupabaseConfigured) {
    return <AuthLoading />
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error } = await createClient().auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push("/projects")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      {/* Left side - Hero section for desktop */}
      <div className="hidden lg:flex lg:flex-1 flex-col justify-center px-8 xl:px-12">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="relative">
              <Zap className="h-10 w-10 text-cyan-400" />
              <div className="absolute inset-0 h-10 w-10 text-cyan-400 animate-pulse opacity-50" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              BayNext
            </h1>
          </div>

          <h2 className="text-4xl font-bold text-white mb-6">Welcome back to your MMM platform</h2>

          <p className="text-xl text-slate-400 mb-8">
            Analyze, optimize, and scale your marketing mix models with advanced analytics and AI-powered insights.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-300">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span>Advanced attribution modeling</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Real-time campaign optimization</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span>Cross-channel performance insights</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 lg:max-w-md xl:max-w-lg flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] opacity-5 lg:hidden" />

          <Card className="w-full bg-slate-900/50 border-cyan-500/20 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />

            <CardHeader className="text-center space-y-4 relative">
              <div className="flex justify-center lg:hidden">
                <div className="relative">
                  <Zap className="h-12 w-12 text-cyan-400" />
                  <div className="absolute inset-0 h-12 w-12 text-cyan-400 animate-pulse opacity-50" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Sign In
                </CardTitle>
                <CardDescription className="text-slate-400 mt-2 lg:text-lg">
                  Access your MMM management platform
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 relative">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300 text-sm lg:text-base">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-cyan-500/50 focus:ring-cyan-500/20 h-11 lg:h-12"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300 text-sm lg:text-base">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-cyan-500/50 focus:ring-cyan-500/20 h-11 lg:h-12"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-md p-3">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-lg shadow-cyan-500/25 disabled:opacity-50 h-11 lg:h-12 text-base lg:text-lg"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-slate-400 text-sm lg:text-base">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
