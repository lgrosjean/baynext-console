import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Database, Brain } from "lucide-react"
import { formatDistanceToNow } from 'date-fns';
import { capitalize } from "@/lib/utils";

import { ProjectDetails, ProjectStatus } from "@/types/project"

const getStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case "deployed":
      return "text-green-400 bg-green-400/10"
    case "draft":
      return "text-yellow-400 bg-yellow-400/10"
    case "archived":
      return "text-slate-400 bg-slate-400/10"
    default:
      return "text-slate-400 bg-slate-400/10"
  }
}

export const ProjectsCardList = ({ projects }: { projects: ProjectDetails[] }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {projects.map((project) => (
          <Link key={project.id} href={`/app/projects/${project.slug}`}>
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
                      {capitalize(project.status)}
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
                      <Database className="h-4 w-4" />
                      <span>{project.datasets} datasets</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Brain className="h-4 w-4" />
                      <span>{project.models} models</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-500">
                  Created {formatDistanceToNow(project.createdAt, { addSuffix: true })}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    )
}