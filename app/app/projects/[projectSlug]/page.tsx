"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  Database,
  Brain,
  Rocket,
  BarChart3,
  Target,
  TrendingUp,
  Calendar,
  Activity,
  ChevronDown,
  FileText,
  Play,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface ProjectStats {
  datasets: { current: number; max: number }
  models: { current: number; max: number }
  monthlyJobs: { current: number; max: number }
  dashboards: { current: number; max: number }
  totalSpend: number
  roi: number
  lastUpdated: string
}

export default async function ProjectPage({ params }: { params: { projectSlug: string } }) {
  const [stats] = useState<ProjectStats>({
    datasets: { current: 3, max: 10 },
    models: { current: 2, max: 5 },
    monthlyJobs: { current: 8, max: 20 },
    dashboards: { current: 1, max: 3 },
    totalSpend: 750000,
    roi: 4.2,
    lastUpdated: "2024-01-16",
  })
  
  const projectSlug = params.projectSlug

  const projectName = projectSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

  const recentActivity = [
    {
      id: "1",
      type: "dataset",
      title: "Media Spend Data uploaded",
      time: "2 hours ago",
      status: "completed",
    },
    {
      id: "2",
      type: "training",
      title: "MMM Model v2 training started",
      time: "4 hours ago",
      status: "running",
    },
    {
      id: "3",
      type: "model",
      title: "MMM Model v1 deployed",
      time: "1 day ago",
      status: "completed",
    },
    {
      id: "4",
      type: "dashboard",
      title: "Performance dashboard updated",
      time: "2 days ago",
      status: "completed",
    },
  ]

  const quickActions = [
    {
      title: "New Dataset",
      description: "Upload data for training",
      icon: Database,
      href: `/projects/${projectSlug}/datasets`,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Training Job",
      description: "Start model training",
      icon: Brain,
      href: `/projects/${projectSlug}/training`,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Deploy Model",
      description: "Deploy trained model",
      icon: Rocket,
      href: `/projects/${projectSlug}/models`,
      color: "from-green-500 to-emerald-500",
    },
  ]

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

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1>{projectName}</h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">Media Mix Modeling project overview and management</p>
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
                <Link href={`/projects/${projectSlug}/datasets`}>
                  <Database className="h-4 w-4 mr-2" />
                  New Dataset
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-slate-300 focus:bg-slate-800 focus:text-cyan-300">
                <Link href={`/projects/${projectSlug}/training`}>
                  <Brain className="h-4 w-4 mr-2" />
                  Training Job
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-slate-300 focus:bg-slate-800 focus:text-cyan-300">
                <Link href={`/projects/${projectSlug}/models`}>
                  <Rocket className="h-4 w-4 mr-2" />
                  Deploy Model
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex gap-2">
            <Link href={`/projects/${projectSlug}/dashboard`}>
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-cyan-300 bg-transparent">
                <BarChart3 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </Link>
            <Link href={`/projects/${projectSlug}/scenarios`}>
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-cyan-300 bg-transparent">
                <Target className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Scenarios</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <Link href={`/projects/${projectSlug}/datasets`}>
          <Card className="bg-slate-900/50 border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer group">
            <CardContent className="p-4 text-center">
              <Database className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium text-white text-sm sm:text-base">Datasets</h3>
              <p className="text-xs text-slate-400 mt-1">
                {stats.datasets.current} of {stats.datasets.max}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/projects/${projectSlug}/training`}>
          <Card className="bg-slate-900/50 border-slate-700 hover:border-purple-500/50 transition-all cursor-pointer group">
            <CardContent className="p-4 text-center">
              <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium text-white text-sm sm:text-base">Training</h3>
              <p className="text-xs text-slate-400 mt-1">{stats.monthlyJobs.current} this month</p>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/projects/${projectSlug}/models`}>
          <Card className="bg-slate-900/50 border-slate-700 hover:border-green-500/50 transition-all cursor-pointer group">
            <CardContent className="p-4 text-center">
              <Rocket className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium text-white text-sm sm:text-base">Models</h3>
              <p className="text-xs text-slate-400 mt-1">{stats.models.current} deployed</p>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/projects/${projectSlug}/dashboard`}>
          <Card className="bg-slate-900/50 border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer group">
            <CardContent className="p-4 text-center">
              <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium text-white text-sm sm:text-base">Dashboard</h3>
              <p className="text-xs text-slate-400 mt-1">{stats.dashboards.current} active</p>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/projects/${projectSlug}/scenarios`}>
          <Card className="bg-slate-900/50 border-slate-700 hover:border-orange-500/50 transition-all cursor-pointer group col-span-2 sm:col-span-1">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium text-white text-sm sm:text-base">Scenarios</h3>
              <p className="text-xs text-slate-400 mt-1">What-if analysis</p>
            </CardContent>
          </Card>
        </Link>
      </div>

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
                  {stats.datasets.current} / {stats.datasets.max}
                </span>
                <span className="text-slate-400">
                  {Math.round((stats.datasets.current / stats.datasets.max) * 100)}%
                </span>
              </div>
              <Progress value={(stats.datasets.current / stats.datasets.max) * 100} className="h-2 bg-slate-800" />
              <p className="text-xs text-slate-500">{stats.datasets.max - stats.datasets.current} slots remaining</p>
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
                  {stats.models.current} / {stats.models.max}
                </span>
                <span className="text-slate-400">{Math.round((stats.models.current / stats.models.max) * 100)}%</span>
              </div>
              <Progress value={(stats.models.current / stats.models.max) * 100} className="h-2 bg-slate-800" />
              <p className="text-xs text-slate-500">{stats.models.max - stats.models.current} slots available</p>
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
                  {stats.monthlyJobs.current} / {stats.monthlyJobs.max}
                </span>
                <span className="text-slate-400">
                  {Math.round((stats.monthlyJobs.current / stats.monthlyJobs.max) * 100)}%
                </span>
              </div>
              <Progress
                value={(stats.monthlyJobs.current / stats.monthlyJobs.max) * 100}
                className="h-2 bg-slate-800"
              />
              <p className="text-xs text-slate-500">
                {stats.monthlyJobs.max - stats.monthlyJobs.current} jobs remaining
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
                    <p className="text-xs text-slate-400">{activity.time}</p>
                    <span className={`text-xs ${getStatusColor(activity.status)}`}>{activity.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Project Info */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-cyan-400" />
              Project Information
            </span>
            <Badge className="bg-green-400/10 text-green-400 border-green-400/20">
              <Activity className="h-3 w-3 mr-1" />
              Active
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
              <p className="text-white font-medium">January 15, 2024</p>
            </div>
            <div>
              <p className="text-slate-400">Last Updated</p>
              <p className="text-white font-medium flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(stats.lastUpdated).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Data Sources</p>
              <p className="text-white font-medium">{stats.datasets.current} datasets</p>
            </div>
            <div>
              <p className="text-slate-400">Model Status</p>
              <p className="text-white font-medium">Production Ready</p>
            </div>
            <div>
              <p className="text-slate-400">Team Members</p>
              <p className="text-white font-medium">3 collaborators</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
