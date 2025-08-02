import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Check if Supabase environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured, allow all requests to pass through
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not found. Authentication middleware disabled.")
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    })

    // Refresh session if expired - required for Server Components
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    // If there's an error getting the user, log it but don't block the request
    if (error) {
      console.warn("Error getting user in middleware:", error.message)
    }

    // Protected routes
    const protectedRoutes = ["/projects", "/models", "/analytics", "/settings"]
    const authRoutes = ["/login", "/signup"]

    const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
    const isAuthRoute = authRoutes.includes(request.nextUrl.pathname)

    // Redirect to login if accessing protected route without authentication
    if (isProtectedRoute && !user) {
      const redirectUrl = new URL("/login", request.url)
      redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Redirect to projects if accessing auth routes while authenticated
    if (isAuthRoute && user) {
      return NextResponse.redirect(new URL("/projects", request.url))
    }

    return supabaseResponse
  } catch (error) {
    console.error("Middleware error:", error)
    // If there's any error in the middleware, allow the request to continue
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
