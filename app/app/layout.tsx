import type React from "react"
import type { Metadata } from "next"
import "@/styles/globals.css"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"

import { getUser } from "@/actions/app/auth"

export const metadata: Metadata = {
  title: "BayNext - MMMOps Platform",
  description: "Advanced Mix Marketing Model operations platform",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  // Fetch the user data
  const user = await getUser()

  return (
    <div className="bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
          <SidebarProvider defaultOpen={true} >
            <AppSidebar />
            <SidebarInset>
              <div className="flex flex-col">
                <AppHeader user={user}  />
                <main className="p-3 sm:p-4 md:p-6 overflow-x-hidden">{children}</main>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
  )
}
