"use client"

import { Brain, FolderOpen, Settings, BarChart3, Zap } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Projects",
    url: "/projects",
    icon: FolderOpen,
  },
  {
    title: "Models",
    url: "/models",
    icon: Brain,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

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

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-cyan-400/80 font-semibold">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="hover:bg-cyan-500/10 hover:text-cyan-300 data-[active=true]:bg-gradient-to-r data-[active=true]:from-cyan-500/20 data-[active=true]:to-purple-500/20 data-[active=true]:text-cyan-300 data-[active=true]:border-r-2 data-[active=true]:border-cyan-400"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-cyan-500/20 p-4">
        <div className="text-xs text-slate-500 text-center">v2.1.0 • Neural Engine</div>
      </SidebarFooter>
    </Sidebar>
  )
}
