import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Activity, Database, Brain, Rocket, BarChart3 } from "lucide-react"
import { Activity as ActivityType } from "@/types/activity"
import { formatDistanceToNow} from "date-fns"

const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400"
      case "running":
        return "text-yellow-400"
      case "failed":
        return "text-red-400"
      default:
        return "text-slate-400"
    }
  }

const getActivityIcon = (type: string) => {
    switch (type) {
      case "dataset":
        return <Database className="h-4 w-4" />
      case "training":
        return <Brain className="h-4 w-4" />
      case "model":
        return <Rocket className="h-4 w-4" />
      case "dashboard":
        return <BarChart3 className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

export const RecentActivityCard = (
    { recentActivity } : { recentActivity: ActivityType[] }) => {

  return (
    <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="h-5 w-5 mr-2 text-cyan-400" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-slate-400">Latest updates and changes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center p-3 rounded-lg bg-slate-800/30">
                <div className="p-2 rounded-lg bg-slate-700 mr-3">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white">{activity.title}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-slate-400">{formatDistanceToNow(activity.time, { addSuffix: true })}</p>
                    <span className={`text-xs ${getStatusColor(activity.status)}`}>{activity.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
    )
}