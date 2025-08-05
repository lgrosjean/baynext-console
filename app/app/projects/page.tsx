import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { getProjectsWithCount } from "@/actions/app/projects"

import { NewProjectDialog } from "@/components/dashboard/new-project-dialog"
import { ProjectsCardList } from "@/components/dashboard/projects-card-list"

import { getUser } from "@/actions/app/auth"

export default async function ProjectsPage() {

  const user = await getUser() // Fetch the user from the server
  const userId = user.id 

  // Update the projects state to include user_id
  const projects = await getProjectsWithCount(userId)

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
        <div>
          <h1>Projects</h1>
          <p className="text-slate-400 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">
            Manage your mix marketing model projects.
          </p>
        </div>

        <NewProjectDialog userId={userId} />
      </div>

      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-80 lg:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search projects..."
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 lg:h-11"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-slate-700 text-slate-300 lg:px-4 bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 border-slate-700">
              <DropdownMenuItem className="text-slate-300">All Projects</DropdownMenuItem>
              <DropdownMenuItem className="text-slate-300">Active</DropdownMenuItem>
              <DropdownMenuItem className="text-slate-300">Training</DropdownMenuItem>
              <DropdownMenuItem className="text-slate-300">Deployed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>

      {/* Projects Grid */}
      <ProjectsCardList projects={projects} />
    </div>
  )
}
