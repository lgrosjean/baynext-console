"use client"

import { usePathname } from "next/navigation"
import { ChevronRight, LogOut, Settings } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AppHeader() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbs = [{ name: "Home", href: "/" }]

    let currentPath = ""
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1

      if (segment === "projects" && segments[index + 1]) {
        // Add Projects breadcrumb
        breadcrumbs.push({
          name: "Projects",
          href: "/app/projects",
        })

        // Add Project name breadcrumb
        const projectSlug = segments[index + 1]
        const projectName = projectSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
        breadcrumbs.push({
          name: projectName,
          href: `/app/projects/${projectSlug}`,
        })

        // Handle project sub-sections
        if (segments[index + 2]) {
          const subSection = segments[index + 2]
          let subSectionName = ""
          const subSectionHref = `/projects/${projectSlug}/${subSection}`

          switch (subSection) {
            case "datasets":
              subSectionName = "Datasets"
              break
            case "training":
              subSectionName = "Training Jobs"
              break
            case "models":
              subSectionName = "Models"
              break
            case "dashboard":
              subSectionName = "Dashboard"
              break
            case "scenarios":
              subSectionName = "Scenarios"
              break
            default:
              subSectionName = subSection.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
          }

          breadcrumbs.push({
            name: subSectionName,
            href: subSectionHref,
          })
        }
      } else if (segment === "projects") {
        breadcrumbs.push({
          name: "Projects",
          href: "/app/projects",
        })
      } else if (segment === "settings") {
        breadcrumbs.push({
          name: "Settings",
          href: "/settings",
        })
      }
    })

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <header className="border-b border-cyan-500/20 bg-slate-950/30 backdrop-blur-xl">
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 md:px-6">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">

          <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm min-w-0 flex-1">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center min-w-0">
                {index > 0 && (
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500 mx-1 sm:mx-2 flex-shrink-0" />
                )}
                <Link
                  href={crumb.href}
                  className={`hover:text-cyan-300 transition-colors truncate ${index === breadcrumbs.length - 1 ? "text-cyan-400 font-medium" : "text-slate-400"
                    }`}
                >
                  <span className="hidden sm:inline">{crumb.name}</span>
                  <span className="sm:hidden">
                    {crumb.name.length > 10 ? crumb.name.substring(0, 10) + "..." : crumb.name}
                  </span>
                </Link>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 h-8 sm:h-10 px-2 sm:px-3"
              >
                <Avatar className="h-5 w-5 sm:h-6 sm:w-6 mr-1 sm:mr-2">
                  <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs">
                    {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline truncate max-w-24 md:max-w-none">
                  {user?.user_metadata?.full_name || user?.email}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700">
              <DropdownMenuItem asChild className="text-slate-300 focus:bg-slate-800 focus:text-cyan-300">
                <Link href="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem onClick={signOut} className="text-red-400 focus:bg-red-500/10 focus:text-red-300">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
