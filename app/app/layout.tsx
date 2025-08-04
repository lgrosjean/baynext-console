import type React from "react"
import type { Metadata } from "next"
import "@/styles/globals.css"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"


export const metadata: Metadata = {
  title: "BayNext - MMM Management Platform",
  description: "Advanced Mix Marketing Model management platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
          <SidebarProvider defaultOpen={true} >
            <AppSidebar />
            <SidebarInset>
              <div className="flex flex-col">
                <AppHeader />
                <main className="p-3 sm:p-4 md:p-6 overflow-x-hidden">{children}</main>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
  )
}
