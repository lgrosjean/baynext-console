"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from 'next/navigation'

import { ChevronRight } from "lucide-react"

import { getProject } from "@/actions/app/projects"

import { UserMenu } from "./user-menu"
import { useAuth } from "@/contexts/auth-context"

export function AppHeader() {

  // const userId = "1b748588-64c0-4575-8e05-c6bb8ce20024" 

  const { user } = useAuth()

  const userId = user?.id

  const params = useParams<{ projectSlug: string }>()

  const projectSlug = params.projectSlug

  const defaultBreadcrumbs = [
     { name: "Home", href: "/" },
    { name: "Projects", href: "/app/projects" },
  ];

  const [projectName, setProjectName] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<{ name: string; href: string }[]>(defaultBreadcrumbs);

  useEffect(() => {
    if (projectSlug) {
      console.log(`Fetching project name for slug: ${projectSlug} for header`)
      getProject(userId, projectSlug).then(project => {
        if (!project) {
          console.error("Project not found");
          return;
        }
        setProjectName(project.name);
        setBreadcrumbs(prev => [
          ...defaultBreadcrumbs,
          { name: project.name, href: `/app/projects/${projectSlug}` },
        ]);
      }).catch(error => {
        console.error("Error fetching project stats:", error);
      });
    }
    else {
      setProjectName(null);
      setBreadcrumbs(defaultBreadcrumbs);
    }
  }, [projectSlug]);


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

        <UserMenu />


      </div>
    </header>
  )
}
