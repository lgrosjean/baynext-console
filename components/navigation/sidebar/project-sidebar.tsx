"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

import {
    Database,
    Settings,
    Brain,
    Rocket,
    Target,
    BarChart3,
} from "lucide-react"

import {
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"



export function ProjectSidebar() {

    const { projectSlug } = useParams()
    const pathname = usePathname()

    const menuItems = [
        {
            title: "Datasets",
            url: `/app/projects/${projectSlug}/datasets`,
            icon: Database,
        },
        {
            title: "Models",
            url: `/app/projects/${projectSlug}/models`,
            icon: Brain,
        },
        {
            title: "Jobs",
            url: `/app/projects/${projectSlug}/training`,
            icon: Rocket,
        },
        {
            title: "Dashboard",
            url: `/app/projects/${projectSlug}/dashboard`,
            icon: BarChart3,
        },
        {
            title: "Scenarios",
            url: `/app/projects/${projectSlug}/scenarios`,
            icon: Target,
        },
        {
            title: "Settings",
            url: `/app/projects/${projectSlug}/settings`,
            icon: Settings,
        },
    ]

    return (
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
    )
}
