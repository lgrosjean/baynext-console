import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from 'date-fns';
import { capitalize } from "@/lib/utils"

import { ProjectStats } from "@/types/project"

import { FileText, Activity, Calendar } from "lucide-react"

export const ProjectInfoCard = ({ stats }: { stats: ProjectStats }) => {
    return (
        <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-cyan-400" />
              Project Information
            </span>
            <Badge className="bg-green-400/10 text-green-400 border-green-400/20">
              <Activity className="h-3 w-3 mr-1" />
              {capitalize(stats.status)}
            </Badge>
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
              <p className="text-white font-medium">{formatDistanceToNow(stats.createdAt)}</p>
            </div>
            <div>
              <p className="text-slate-400">Last Updated</p>
              <p className="text-white font-medium flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDistanceToNow(stats.updatedAt)}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Data Sources</p>
              <p className="text-white font-medium">{stats.datasets.used} datasets</p>
            </div>
            <div>
              <p className="text-slate-400">Model Status</p>
              <p className="text-white font-medium">Production Ready</p>
            </div>
            <div>
              <p className="text-slate-400">Team Members</p>
              <p className="text-white font-medium">{stats.members.used} collaborators</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
}