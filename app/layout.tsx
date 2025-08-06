import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import "@/styles/globals.css"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BayNext - MMMOps Platform",
  description: "Advanced Mix Marketing Model Operations platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        { process.env.VERCEL && <Analytics/> }
        <AuthProvider>
                <main>{children}</main>
                <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
