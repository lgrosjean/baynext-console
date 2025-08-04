"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Mail, Lock, Eye, EyeOff, Github } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push("/app/")
    }
  }, [user, router])

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

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError("")

    try {
      const { error } = await createClient().auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/app/projects`
        }
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    setLoading(true)
    setError("")

    try {
      const { error } = await createClient().auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/app/projects`
        }
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
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
              {/* Social Authentication Buttons */}
              <div className="space-y-3">
                <Button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 h-11 lg:h-12 text-base font-medium"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>

                <Button
                  type="button"
                  onClick={handleGithubLogin}
                  disabled={loading}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white border border-gray-700 h-11 lg:h-12 text-base font-medium"
                >
                  <Github className="w-5 h-5 mr-3" />
                  Continue with GitHub
                </Button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900 px-2 text-slate-400">Or continue with email</span>
                </div>
              </div>

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
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-lg shadow-cyan-500/25 disabled:opacity-50 h-11 lg:h-12 text-base"
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
