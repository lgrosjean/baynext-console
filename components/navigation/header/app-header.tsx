"use client"

import { useEffect, useState } from "react"
import { useParams } from 'next/navigation'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { ChevronRight } from "lucide-react"

import { getProject } from "@/actions/app/projects"

import { UserMenu } from "./user-menu"

import { User } from "@supabase/supabase-js"

export function AppHeader({ user }: { user: User | null }) {

  const params = useParams<{ projectSlug: string }>()

  const [projectName, setProjectName] = useState<string | null>(null);

  const projectSlug = params.projectSlug
  const userId = user?.id

  useEffect(() => {

    if (projectSlug && userId) {
      getProject(userId, projectSlug)
        .then(project => {
          if (!project) {
            console.error("Project not found");
            return;
          }
          setProjectName(project.name);
        })
        .catch(error => {
          console.error("Error fetching project stats:", error);
        });
    }

  }, [userId, projectSlug]);

  return (
    <header className="border-b border-cyan-500/20 bg-slate-950/30 backdrop-blur-xl">
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 md:px-6">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">

          <Breadcrumb className="text-xs sm:text-sm">
            <BreadcrumbList>

              <BreadcrumbItem>
                <BreadcrumbLink href="/app/projects" className="text-cyan-400 hover:text-cyan-300">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>

              {projectSlug && (
                <>
                <BreadcrumbSeparator>
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500 mx-1 sm:mx-2 flex-shrink-0" />
                  </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/app/projects/${projectSlug}`} className="text-cyan-400 hover:text-cyan-300 truncate transition-colors">
                    {projectName}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                </>
              )}

            </BreadcrumbList>
          </Breadcrumb>

        </div>

        <UserMenu user={user} />

      </div>
    </header>
  )
}
