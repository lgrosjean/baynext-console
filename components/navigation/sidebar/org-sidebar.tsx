import Link from "next/link"
import { usePathname } from "next/navigation"

import {
    FolderTree,
    Settings
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

const menuItems = [
  {
    title: "Projects",
    url: "/app/projects",
    icon: FolderTree,
  },
    {
        title: "Settings",
        url: "/app/settings",
        icon: Settings,
    },
]

export function OrgSidebar() {

    const pathname = usePathname()
  
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
    