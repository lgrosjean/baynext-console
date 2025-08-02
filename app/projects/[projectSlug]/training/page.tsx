"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Play, Pause, Trash2, Eye, Brain, Clock, Zap, TrendingUp } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TrainingJob {
  id: string
  name: string
  model: string
  status: "pending" | "running" | "completed" | "failed" | "paused"
  progress: number
  accuracy: number | null
  createdAt: string
  duration?: string
  estimatedTime?: string
}

export default function TrainingPage({ params }: { params: { projectSlug: string } }) {
  const [trainingJobs, setTrainingJobs] = useState<TrainingJob[]>([
    {
      id: "1",
      name: "MMM Model v1",
      model: "Bayesian Ridge",
      status: "completed",
      progress: 100,
      accuracy: 0.87,
      createdAt: "2024-01-15",
      duration: "45m",
    },
    {
      id: "2",
      name: "MMM Model v2",
      model: "Random Forest",
      status: "running",
      progress: 65,
      accuracy: null,
      createdAt: "2024-01-16",
      estimatedTime: "15m remaining",
    },
    {
      id: "3",
      name: "MMM Model v3",
      model: "XGBoost",
      status: "pending",
      progress: 0,
      accuracy: null,
      createdAt: "2024-01-16",
    },
  ])

  const [newJob, setNewJob] = useState({ name: "", model: "" })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const projectName = params.projectSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

  const handleCreateJob = () => {
    if (newJob.name && newJob.model) {
      const job: TrainingJob = {
        id: Date.now().toString(),
        name: newJob.name,
        model: newJob.model,
        status: "pending",
        progress: 0,
        accuracy: null,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setTrainingJobs([job, ...trainingJobs])
      setNewJob({ name: "", model: "" })
      setIsDialogOpen(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-400/10 text-green-400 border-green-400/20"
      case "running":
        return "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
      case "pending":
        return "bg-blue-400/10 text-blue-400 border-blue-400/20"
      case "failed":
        return "bg-red-400/10 text-red-400 border-red-400/20"
      case "paused":
        return "bg-slate-400/10 text-slate-400 border-slate-400/20"
      default:
        return "bg-slate-400/10 text-slate-400 border-slate-400/20"
    }
  }

  const getModelIcon = (model: string) => {
    switch (model.toLowerCase()) {
      case "bayesian ridge":
        return <Brain className="h-4 w-4" />
      case "random forest":
        return <TrendingUp className="h-4 w-4" />
      case "xgboost":
        return <Zap className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const runningJobs = trainingJobs.filter((job) => job.status === "running").length
  const completedJobs = trainingJobs.filter((job) => job.status === "completed").length
  const pendingJobs = trainingJobs.filter((job) => job.status === "pending").length

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Training Jobs
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">Manage model training for {projectName}</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              New Training Job
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-cyan-500/20 mx-4 sm:mx-0">
            <DialogHeader>
              <DialogTitle className="text-cyan-400">Create Training Job</DialogTitle>
              <DialogDescription className="text-slate-400">Configure a new model training job</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="job-name" className="text-slate-300">
                  Job Name
                </Label>
                <Input
                  id="job-name"
                  value={newJob.name}
                  onChange={(e) => setNewJob({ ...newJob, name: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="Enter job name"
                />
              </div>
              <div>
                <Label htmlFor="model-type" className="text-slate-300">
                  Model Type
                </Label>
                <Select value={newJob.model} onValueChange={(value) => setNewJob({ ...newJob, model: value })}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select model type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="Bayesian Ridge">Bayesian Ridge</SelectItem>
                    <SelectItem value="Random Forest">Random Forest</SelectItem>
                    <SelectItem value="XGBoost">XGBoost</SelectItem>
                    <SelectItem value="Neural Network">Neural Network</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-slate-700 text-slate-300 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateJob}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 w-full sm:w-auto"
              >
                Start Training
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-slate-400">Running</p>
                <p className="text-lg sm:text-2xl font-bold text-yellow-400">{runningJobs}</p>
              </div>
              <Play className="h-6 w-6 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-slate-400">Completed</p>
                <p className="text-lg sm:text-2xl font-bold text-green-400">{completedJobs}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-slate-400">Pending</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-400">{pendingJobs}</p>
              </div>
              <Clock className="h-6 w-6 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-slate-400">Total Jobs</p>
                <p className="text-lg sm:text-2xl font-bold text-cyan-400">{trainingJobs.length}</p>
              </div>
              <Brain className="h-6 w-6 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Jobs List */}
      <div className="space-y-4">
        {trainingJobs.map((job) => (
          <Card key={job.id} className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800">{getModelIcon(job.model)}</div>
                  <div>
                    <CardTitle className="text-white text-base sm:text-lg">{job.name}</CardTitle>
                    <CardDescription className="text-slate-400">
                      Model: {job.model} • Created {new Date(job.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                  <div className="flex gap-2">
                    {job.status === "pending" && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </Button>
                    )}
                    {job.status === "running" && (
                      <Button size="sm" variant="outline" className="border-yellow-600 text-yellow-400 bg-transparent">
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 bg-transparent">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-700 text-red-400 bg-transparent">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress Bar */}
                {job.status === "running" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-white">{job.progress}%</span>
                    </div>
                    <Progress value={job.progress} className="h-2 bg-slate-800" />
                    {job.estimatedTime && <p className="text-xs text-slate-500">{job.estimatedTime}</p>}
                  </div>
                )}

                {/* Job Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Status</p>
                    <p className="text-white font-medium capitalize">{job.status}</p>
                  </div>
                  {job.accuracy && (
                    <div>
                      <p className="text-slate-400">Accuracy</p>
                      <p className="text-green-400 font-medium">{(job.accuracy * 100).toFixed(1)}%</p>
                    </div>
                  )}
                  {job.duration && (
                    <div>
                      <p className="text-slate-400">Duration</p>
                      <p className="text-white font-medium">{job.duration}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-slate-400">Model Type</p>
                    <p className="text-white font-medium">{job.model}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {trainingJobs.length === 0 && (
        <div className="text-center py-12">
          <Brain className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-400 mb-2">No training jobs yet</h3>
          <p className="text-slate-500 mb-4">Create your first training job to start building models</p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Training Job
          </Button>
        </div>
      )}
    </div>
  )
}
