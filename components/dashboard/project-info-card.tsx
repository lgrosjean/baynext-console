import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from 'date-fns';
import { capitalize } from "@/lib/utils"

import { ProjectWithQuota } from "@/types/project"

import { FileText, Activity, Calendar, Archive, StickyNote } from "lucide-react"

import { Project } from "@/types/project";

const getStatusBadge = (status: Project["status"]) => {
    const statusMap = {
        deployed: { color: "bg-green-400/10 text-green-400 border-green-400/20", icon: <Activity className="h-3 w-3 mr-1" /> },
        archived: { color: "bg-gray-400/10 text-gray-400 border-gray-400/20", icon: <Archive className="h-3 w-3 mr-1" /> },
        draft: { color: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20", icon: <StickyNote className="h-3 w-3 mr-1" /> },
    };
    return (
        <Badge className={`${statusMap[status]?.color} flex items-center`}>
            {statusMap[status]?.icon}
            {capitalize(status)}
        </Badge>
    )
};

export const ProjectInfoCard = ({ project }: { project: ProjectWithQuota }) => {
    return (
        <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-cyan-400" />
              Project Information
            </span>
            {getStatusBadge(project.status)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Project Type</p>
              <p className="text-white font-medium">Media Mix Modeling</p>
            </div>
            <div>
              <p className="text-slate-400">Created</p>
              <p className="text-white font-medium">{formatDistanceToNow(project.createdAt)}</p>
            </div>
            <div>
              <p className="text-slate-400">Last Updated</p>
              <p className="text-white font-medium flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDistanceToNow(project.updatedAt || project.createdAt, { addSuffix: true })}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Data Sources</p>
              <p className="text-white font-medium">{project.datasets.used} datasets</p>
            </div>
            <div>
              <p className="text-slate-400">Model Status</p>
              <p className="text-white font-medium">Production Ready</p>
            </div>
            <div>
              <p className="text-slate-400">Team Members</p>
              <p className="text-white font-medium">{project.members.used} collaborators</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
}