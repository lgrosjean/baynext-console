"use client"

import { useParams } from "next/navigation"

import { Zap } from "lucide-react"

import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

import { OrgSidebar } from "./sidebar/org-sidebar"
import { ProjectSidebar } from "./sidebar/project-sidebar"

export function AppSidebar() {

  const { projectSlug } = useParams<{ projectSlug: string }>()

  return (
    <Sidebar className="border-r border-cyan-500/20 bg-slate-950/50 backdrop-blur-xl">
      <SidebarHeader className="border-b border-cyan-500/20 p-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Zap className="h-8 w-8 text-cyan-400" />
            <div className="absolute inset-0 h-8 w-8 text-cyan-400 animate-pulse opacity-50" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              BayNext
            </h1>
            <p className="text-xs text-slate-400">MMM Platform</p>
          </div>
        </div>
      </SidebarHeader>

      { !projectSlug ? <OrgSidebar /> : <ProjectSidebar /> }

      <SidebarFooter className="border-t border-cyan-500/20 p-4">
        <div className="text-xs text-slate-500 text-center">v2.1.0 • BayNext</div>
      </SidebarFooter>
    </Sidebar>
  )
}
