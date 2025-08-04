"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Rocket, Eye, Trash2, Settings, Activity, TrendingUp, Zap } from "lucide-react"

interface Model {
  id: string
  name: string
  version: string
  accuracy: number
  status: "training" | "ready" | "deployed" | "failed"
  deployedAt?: string
  modelType: string
  performance: {
    mape: number
    r2: number
    rmse: number
  }
}

export default function ModelsPage({ params }: { params: { projectSlug: string } }) {
  const [models] = useState<Model[]>([
    {
      id: "1",
      name: "MMM Model v1",
      version: "1.0.0",
      accuracy: 0.87,
      status: "deployed",
      deployedAt: "2024-01-15",
      modelType: "Bayesian Ridge",
      performance: {
        mape: 12.5,
        r2: 0.87,
        rmse: 0.23,
      },
    },
    {
      id: "2",
      name: "MMM Model v2",
      version: "1.1.0",
      accuracy: 0.91,
      status: "ready",
      modelType: "Random Forest",
      performance: {
        mape: 9.8,
        r2: 0.91,
        rmse: 0.18,
      },
    },
    {
      id: "3",
      name: "MMM Model v3",
      version: "1.2.0",
      accuracy: 0.89,
      status: "training",
      modelType: "XGBoost",
      performance: {
        mape: 11.2,
        r2: 0.89,
        rmse: 0.21,
      },
    },
  ])

  const projectName = params.projectSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

  const getStatusColor = (status: string) => {
    switch (status) {
      case "deployed":
        return "bg-green-400/10 text-green-400 border-green-400/20"
      case "ready":
        return "bg-blue-400/10 text-blue-400 border-blue-400/20"
      case "training":
        return "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
      case "failed":
        return "bg-red-400/10 text-red-400 border-red-400/20"
      default:
        return "bg-slate-400/10 text-slate-400 border-slate-400/20"
    }
  }

  const getModelIcon = (modelType: string) => {
    switch (modelType.toLowerCase()) {
      case "bayesian ridge":
        return <TrendingUp className="h-4 w-4" />
      case "random forest":
        return <Activity className="h-4 w-4" />
      case "xgboost":
        return <Zap className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const deployedModels = models.filter((model) => model.status === "deployed").length
  const readyModels = models.filter((model) => model.status === "ready").length
  const trainingModels = models.filter((model) => model.status === "training").length

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Models
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">Manage deployed models for {projectName}</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Deployed</p>
                <p className="text-2xl font-bold text-green-400">{deployedModels}</p>
              </div>
              <Rocket className="h-6 w-6 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Ready to Deploy</p>
                <p className="text-2xl font-bold text-blue-400">{readyModels}</p>
              </div>
              <Activity className="h-6 w-6 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Training</p>
                <p className="text-2xl font-bold text-yellow-400">{trainingModels}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Models List */}
      <div className="space-y-4">
        {models.map((model) => (
          <Card key={model.id} className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800">{getModelIcon(model.modelType)}</div>
                  <div>
                    <CardTitle className="text-white text-base sm:text-lg">{model.name}</CardTitle>
                    <CardDescription className="text-slate-400">
                      Version {model.version} • {model.modelType} • Accuracy: {(model.accuracy * 100).toFixed(1)}%
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(model.status)}>{model.status}</Badge>
                  <div className="flex gap-2">
                    {model.status === "ready" && (
                      <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-purple-500">
                        <Rocket className="h-3 w-3 mr-1" />
                        Deploy
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 bg-transparent">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 bg-transparent">
                      <Settings className="h-3 w-3 mr-1" />
                      Config
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-700 text-red-400 bg-transparent">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-slate-400">MAPE</p>
                  <p className="text-lg font-bold text-cyan-400">{model.performance.mape}%</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">R²</p>
                  <p className="text-lg font-bold text-green-400">{model.performance.r2}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">RMSE</p>
                  <p className="text-lg font-bold text-purple-400">{model.performance.rmse}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Status</p>
                  <p className="text-lg font-bold text-white capitalize">{model.status}</p>
                </div>
              </div>
              {model.deployedAt && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <p className="text-sm text-slate-400">
                    Deployed on {new Date(model.deployedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {models.length === 0 && (
        <div className="text-center py-12">
          <Rocket className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-400 mb-2">No models yet</h3>
          <p className="text-slate-500 mb-4">Train your first model to get started</p>
        </div>
      )}
    </div>
  )
}
