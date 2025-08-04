"use client"

import { useState } from "react"
import { Plus, Search, Calendar, BarChart3, Filter, Grid3X3, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

interface Project {
  id: string
  name: string
  description: string
  createdAt: string
  status: "active" | "training" | "deployed"
  datasets: number
  models: number
  user_id: string
}

export default function ProjectsPage() {
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Update the projects state to include user_id
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Q4 Campaign Analysis",
      description: "Mix marketing model for Q4 holiday campaigns across digital and traditional channels",
      createdAt: "2024-01-15",
      status: "deployed",
      datasets: 5,
      models: 2,
      user_id: user?.id || "",
    },
    {
      id: "2",
      name: "Brand Awareness Study",
      description: "Attribution modeling for brand awareness campaigns with focus on upper-funnel metrics",
      createdAt: "2024-01-10",
      status: "training",
      datasets: 3,
      models: 1,
      user_id: user?.id || "",
    },
    {
      id: "3",
      name: "Multi-Channel Attribution",
      description: "Cross-channel attribution analysis for integrated marketing campaigns",
      createdAt: "2024-01-08",
      status: "active",
      datasets: 7,
      models: 0,
      user_id: user?.id || "",
    },
    {
      id: "4",
      name: "Social Media ROI Analysis",
      description: "Comprehensive analysis of social media campaign performance and attribution",
      createdAt: "2024-01-05",
      status: "deployed",
      datasets: 4,
      models: 3,
      user_id: user?.id || "",
    },
    {
      id: "5",
      name: "Email Marketing Attribution",
      description: "Email campaign attribution modeling with customer journey mapping",
      createdAt: "2024-01-03",
      status: "active",
      datasets: 2,
      models: 1,
      user_id: user?.id || "",
    },
    {
      id: "6",
      name: "Cross-Platform Analytics",
      description: "Unified analytics across web, mobile, and offline touchpoints",
      createdAt: "2024-01-01",
      status: "training",
      datasets: 8,
      models: 0,
      user_id: user?.id || "",
    },
  ])

  const [newProject, setNewProject] = useState({ name: "", description: "" })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreateProject = () => {
    if (newProject.name && newProject.description && user) {
      const project: Project = {
        id: Date.now().toString(),
        name: newProject.name,
        description: newProject.description,
        createdAt: new Date().toISOString().split("T")[0],
        status: "active",
        datasets: 0,
        models: 0,
        user_id: user.id,
      }
      setProjects([project, ...projects])
      setNewProject({ name: "", description: "" })
      setIsDialogOpen(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "deployed":
        return "text-green-400 bg-green-400/10"
      case "training":
        return "text-yellow-400 bg-yellow-400/10"
      case "active":
        return "text-cyan-400 bg-cyan-400/10"
      default:
        return "text-slate-400 bg-slate-400/10"
    }
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
        <div>
          <h1>Projects</h1>
          <p className="text-slate-400 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">
            Manage your mix marketing model projects
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-lg shadow-cyan-500/25 w-full sm:w-auto lg:px-6 lg:py-3 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-cyan-500/20 mx-4 sm:mx-0 lg:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-cyan-400 lg:text-xl">Create New Project</DialogTitle>
              <DialogDescription className="text-slate-400 lg:text-base">
                Set up a new mix marketing model project
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 lg:space-y-6">
              <div>
                <Label htmlFor="name" className="text-slate-300 lg:text-base">
                  Project Name
                </Label>
                <Input
                  id="name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white lg:h-11"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-slate-300 lg:text-base">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="Describe your project"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-slate-700 text-slate-300 w-full sm:w-auto lg:px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateProject}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 w-full sm:w-auto lg:px-6"
              >
                Create Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-cyan-500" : "border-slate-700 text-slate-300"}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-cyan-500" : "border-slate-700 text-slate-300"}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Projects Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {projects.map((project) => (
            <Link key={project.id} href={`/app/projects/${project.name.toLowerCase().replace(/\s+/g, "-")}`}>
              <Card className="bg-slate-900/50 border-slate-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer group h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0 flex-1">
                      <CardTitle className="text-white group-hover:text-cyan-300 transition-colors text-base lg:text-lg line-clamp-2">
                        {project.name}
                      </CardTitle>
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}
                      >
                        {project.status}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-slate-400 line-clamp-2 text-sm lg:text-base">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-slate-400">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-1">
                        <BarChart3 className="h-4 w-4" />
                        <span>{project.datasets} datasets</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{project.models} models</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-slate-500">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.name.toLowerCase().replace(/\s+/g, "-")}`}>
              <Card className="bg-slate-900/50 border-slate-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer group">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white group-hover:text-cyan-300 transition-colors text-lg lg:text-xl font-semibold truncate">
                          {project.name}
                        </h3>
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}
                        >
                          {project.status}
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm lg:text-base line-clamp-1 mb-3">{project.description}</p>
                      <div className="flex items-center gap-6 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <BarChart3 className="h-4 w-4" />
                          <span>{project.datasets} datasets</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{project.models} models</span>
                        </div>
                        <div className="text-xs">Created {new Date(project.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
