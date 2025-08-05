import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  Database,
  Brain,
  Rocket,
  BarChart3,
  Target,
  TrendingUp,
  ChevronDown,
  Play,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Actions
import { getRecentActivity } from "@/actions/app/activities"
import { getProjectStats } from "@/actions/app/projects"

// Components
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card"
import { ProjectInfoCard } from "@/components/dashboard/project-info-card"

export default async function ProjectPage({ params }: { params: { projectSlug: string } }) {

  const projectSlug = (await params).projectSlug

  const project = await getProjectStats(projectSlug)
  const recentActivity = await getRecentActivity(projectSlug)
  const stats = await getProjectStats(projectSlug)

  const quickActions = [
    {
      title: "New Dataset",
      description: "Upload data for training",
      icon: Database,
      href: `/app/projects/${projectSlug}/datasets`,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Training Job",
      description: "Start model training",
      icon: Brain,
      href: `/app/projects/${projectSlug}/training`,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Deploy Model",
      description: "Deploy trained model",
      icon: Rocket,
      href: `/app/projects/${projectSlug}/models`,
      color: "from-green-500 to-emerald-500",
    },
  ]



  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1>{project.name}</h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Project overview and management.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Create New
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700 w-56">
              <DropdownMenuItem asChild className="text-slate-300 focus:bg-slate-800 focus:text-cyan-300">
                <Link href={`/app/projects/${projectSlug}/datasets`}>
                  <Database className="h-4 w-4 mr-2" />
                  New Dataset
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-slate-300 focus:bg-slate-800 focus:text-cyan-300">
                <Link href={`/app/projects/${projectSlug}/training`}>
                  <Brain className="h-4 w-4 mr-2" />
                  Training Job
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-slate-300 focus:bg-slate-800 focus:text-cyan-300">
                <Link href={`/app/projects/${projectSlug}/models`}>
                  <Rocket className="h-4 w-4 mr-2" />
                  Deploy Model
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex gap-2">
            <Link href={`/app/projects/${projectSlug}/dashboard`}>
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-blue-400 bg-transparent">
                <BarChart3 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </Link>
            <Link href={`/app/projects/${projectSlug}/scenarios`}>
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-orange-400 bg-transparent">
                <Target className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Scenarios</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <Link href={`/app/projects/${projectSlug}/datasets`}>
          <Card className="bg-slate-900/50 border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer group">
            <CardContent className="p-4 text-center">
              <Database className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium text-white text-sm sm:text-base">Datasets</h3>
              <p className="text-xs text-slate-400 mt-1">
                {stats.datasets.used} of {stats.datasets.limit}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/app/projects/${projectSlug}/training`}>
          <Card className="bg-slate-900/50 border-slate-700 hover:border-purple-500/50 transition-all cursor-pointer group">
            <CardContent className="p-4 text-center">
              <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium text-white text-sm sm:text-base">Training</h3>
              <p className="text-xs text-slate-400 mt-1">{stats.jobs.used} this month</p>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/app/projects/${projectSlug}/models`}>
          <Card className="bg-slate-900/50 border-slate-700 hover:border-green-500/50 transition-all cursor-pointer group">
            <CardContent className="p-4 text-center">
              <Rocket className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium text-white text-sm sm:text-base">Models</h3>
              <p className="text-xs text-slate-400 mt-1">{stats.models.used} deployed</p>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/app/projects/${projectSlug}/dashboard`}>
          <Card className="bg-slate-900/50 border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer group">
            <CardContent className="p-4 text-center">
              <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium text-white text-sm sm:text-base">Dashboard</h3>
              <p className="text-xs text-slate-400 mt-1">{stats.dashboards.used} active</p>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/app/projects/${projectSlug}/scenarios`}>
          <Card className="bg-slate-900/50 border-slate-700 hover:border-orange-500/50 transition-all cursor-pointer group col-span-2 sm:col-span-1">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium text-white text-sm sm:text-base">Scenarios</h3>
              <p className="text-xs text-slate-400 mt-1">
                <span className="text-orange-400 font-bold">{stats.scenarios.used} </span>
                this month
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <h2 className="text-lg font-semibold text-white mt-6">Project Overview</h2>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center justify-between">
              Datasets Usage
              <Database className="h-4 w-4 text-cyan-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white font-medium">
                  {stats.datasets.used} / {stats.datasets.limit}
                </span>
                <span className="text-slate-400">
                  {Math.round((stats.datasets.used / stats.datasets.limit) * 100)}%
                </span>
              </div>
              <Progress value={(stats.datasets.used / stats.datasets.limit) * 100} className="h-2 bg-slate-800" />
              <p className="text-xs text-slate-500">{stats.datasets.limit - stats.datasets.used} slots remaining</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center justify-between">
              Models Deployed
              <Rocket className="h-4 w-4 text-green-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white font-medium">
                  {stats.models.used} / {stats.models.limit}
                </span>
                <span className="text-slate-400">{Math.round((stats.models.used / stats.models.limit) * 100)}%</span>
              </div>
              <Progress value={(stats.models.used / stats.models.limit) * 100} className="h-2 bg-slate-800" />
              <p className="text-xs text-slate-500">{stats.models.limit - stats.models.used} slots available</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center justify-between">
              Monthly Jobs
              <Brain className="h-4 w-4 text-purple-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white font-medium">
                  {stats.jobs.used} / {stats.jobs.limit}
                </span>
                <span className="text-slate-400">
                  {Math.round((stats.jobs.used / stats.jobs.limit) * 100)}%
                </span>
              </div>
              <Progress
                value={(stats.jobs.used / stats.jobs.limit) * 100}
                className="h-2 bg-slate-800"
              />
              <p className="text-xs text-slate-500">
                {stats.jobs.limit - stats.jobs.used} jobs remaining
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center justify-between">
              Current ROI
              <TrendingUp className="h-4 w-4 text-yellow-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-yellow-400">{stats.roi}x</div>
              <p className="text-xs text-slate-500">Total spend: ${(stats.totalSpend / 1000).toFixed(0)}K</p>
              <div className="flex items-center text-xs text-green-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% vs last month
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Play className="h-5 w-5 mr-2 text-cyan-400" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-slate-400">Common tasks to get started quickly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <div className="flex items-center p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer group">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-r ${action.color} mr-3 group-hover:scale-110 transition-transform`}
                  >
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white">{action.title}</h4>
                    <p className="text-xs text-slate-400">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <RecentActivityCard recentActivity={recentActivity} />
      </div>

      {/* Project Info */}
      <ProjectInfoCard stats={stats} />

    </div>
  )
}
