"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Save, RefreshCw, Target, TrendingUp, DollarSign } from "lucide-react"
import { BudgetAllocator } from "@/components/scenarios/budget-allocator"
import { ScenarioComparison } from "@/components/scenarios/scenario-comparison"
import { OptimizationEngine } from "@/components/scenarios/optimization-engine"
import { ScenarioResults } from "@/components/scenarios/scenario-results"

// Mock response curves and baseline data
const mockChannelData = {
  TV: {
    currentSpend: 250000,
    currentROI: 3.2,
    currentIncremental: 850000,
    responseCurve: Array.from({ length: 50 }, (_, i) => ({
      spend: i * 10000,
      roi: Math.max(0.5, 5.5 - Math.log(i + 1) * 0.8),
      incremental: i * 10000 * Math.max(0.5, 5.5 - Math.log(i + 1) * 0.8),
    })),
    minSpend: 50000,
    maxSpend: 500000,
    color: "#06b6d4",
  },
  Digital: {
    currentSpend: 180000,
    currentROI: 5.1,
    currentIncremental: 720000,
    responseCurve: Array.from({ length: 50 }, (_, i) => ({
      spend: i * 8000,
      roi: Math.max(0.8, 7.2 - Math.log(i + 1) * 0.9),
      incremental: i * 8000 * Math.max(0.8, 7.2 - Math.log(i + 1) * 0.9),
    })),
    minSpend: 30000,
    maxSpend: 400000,
    color: "#8b5cf6",
  },
  Social: {
    currentSpend: 95000,
    currentROI: 6.2,
    currentIncremental: 380000,
    responseCurve: Array.from({ length: 50 }, (_, i) => ({
      spend: i * 5000,
      roi: Math.max(1.0, 8.5 - Math.log(i + 1) * 1.1),
      incremental: i * 5000 * Math.max(1.0, 8.5 - Math.log(i + 1) * 1.1),
    })),
    minSpend: 20000,
    maxSpend: 250000,
    color: "#10b981",
  },
  Search: {
    currentSpend: 75000,
    currentROI: 7.8,
    currentIncremental: 200000,
    responseCurve: Array.from({ length: 50 }, (_, i) => ({
      spend: i * 4000,
      roi: Math.max(1.2, 9.8 - Math.log(i + 1) * 1.3),
      incremental: i * 4000 * Math.max(1.2, 9.8 - Math.log(i + 1) * 1.3),
    })),
    minSpend: 15000,
    maxSpend: 200000,
    color: "#ef4444",
  },
  Radio: {
    currentSpend: 85000,
    currentROI: 2.8,
    currentIncremental: 420000,
    responseCurve: Array.from({ length: 50 }, (_, i) => ({
      spend: i * 6000,
      roi: Math.max(0.4, 4.2 - Math.log(i + 1) * 0.7),
      incremental: i * 6000 * Math.max(0.4, 4.2 - Math.log(i + 1) * 0.7),
    })),
    minSpend: 25000,
    maxSpend: 300000,
    color: "#f59e0b",
  },
  Print: {
    currentSpend: 65000,
    currentROI: 2.1,
    currentIncremental: 280000,
    responseCurve: Array.from({ length: 50 }, (_, i) => ({
      spend: i * 7000,
      roi: Math.max(0.3, 3.5 - Math.log(i + 1) * 0.6),
      incremental: i * 7000 * Math.max(0.3, 3.5 - Math.log(i + 1) * 0.6),
    })),
    minSpend: 20000,
    maxSpend: 200000,
    color: "#6b7280",
  },
}

interface Scenario {
  id: string
  name: string
  budgetAllocation: Record<string, number>
  totalBudget: number
  predictedROI: number
  predictedIncremental: number
  createdAt: string
}

export default function ScenariosPage({ params }: { params: { projectSlug: string } }) {
  const [currentScenario, setCurrentScenario] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    Object.keys(mockChannelData).forEach((channel) => {
      initial[channel] = mockChannelData[channel as keyof typeof mockChannelData].currentSpend
    })
    return initial
  })

  const [savedScenarios, setSavedScenarios] = useState<Scenario[]>([
    {
      id: "baseline",
      name: "Current Baseline",
      budgetAllocation: currentScenario,
      totalBudget: Object.values(currentScenario).reduce((sum, val) => sum + val, 0),
      predictedROI: 4.2,
      predictedIncremental: 2850000,
      createdAt: "2024-01-15",
    },
  ])

  const [activeScenario, setActiveScenario] = useState<string>("baseline")
  const [optimizationGoal, setOptimizationGoal] = useState<"roi" | "incremental" | "efficiency">("roi")

  const projectName = params.projectSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

  // Calculate predictions based on response curves
  const calculatePredictions = (allocation: Record<string, number>) => {
    let totalROI = 0
    let totalIncremental = 0
    let totalSpend = 0

    Object.entries(allocation).forEach(([channel, spend]) => {
      const channelData = mockChannelData[channel as keyof typeof mockChannelData]
      const spendIndex = Math.floor(
        spend /
          (channel === "Digital"
            ? 8000
            : channel === "Social"
              ? 5000
              : channel === "Search"
                ? 4000
                : channel === "Radio"
                  ? 6000
                  : channel === "Print"
                    ? 7000
                    : 10000),
      )
      const curvePoint = channelData.responseCurve[Math.min(spendIndex, channelData.responseCurve.length - 1)]

      if (curvePoint) {
        totalIncremental += curvePoint.incremental
        totalSpend += spend
      }
    })

    totalROI = totalSpend > 0 ? totalIncremental / totalSpend : 0

    return {
      totalROI,
      totalIncremental,
      totalSpend,
    }
  }

  const currentPredictions = calculatePredictions(currentScenario)

  const handleSaveScenario = (name: string) => {
    const newScenario: Scenario = {
      id: Date.now().toString(),
      name,
      budgetAllocation: { ...currentScenario },
      totalBudget: currentPredictions.totalSpend,
      predictedROI: currentPredictions.totalROI,
      predictedIncremental: currentPredictions.totalIncremental,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setSavedScenarios([...savedScenarios, newScenario])
  }

  const handleLoadScenario = (scenarioId: string) => {
    const scenario = savedScenarios.find((s) => s.id === scenarioId)
    if (scenario) {
      setCurrentScenario(scenario.budgetAllocation)
      setActiveScenario(scenarioId)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Scenario Planning
          </h1>
          <p className="text-slate-400 mt-1 sm:mt-2 text-sm sm:text-base">
            Optimize budget allocation for <span className="text-cyan-400">{projectName}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-blue-400/10 text-blue-400 border-blue-400/20 justify-center sm:justify-start">
            <Target className="h-3 w-3 mr-1" />
            What-If Analysis
          </Badge>
        </div>
      </div>

      {/* Current Scenario Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-300">Total Budget</CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-yellow-400">
              ${(currentPredictions.totalSpend / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-slate-500">
              {currentPredictions.totalSpend >
              Object.values(mockChannelData).reduce((sum, ch) => sum + ch.currentSpend, 0)
                ? "+"
                : ""}
              {(
                ((currentPredictions.totalSpend -
                  Object.values(mockChannelData).reduce((sum, ch) => sum + ch.currentSpend, 0)) /
                  Object.values(mockChannelData).reduce((sum, ch) => sum + ch.currentSpend, 0)) *
                100
              ).toFixed(1)}
              % vs baseline
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-300">Predicted ROI</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-green-400">
              {currentPredictions.totalROI.toFixed(1)}x
            </div>
            <p className="text-xs text-slate-500">
              {currentPredictions.totalROI > 4.2 ? "+" : ""}
              {(((currentPredictions.totalROI - 4.2) / 4.2) * 100).toFixed(1)}% vs baseline
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-300">Predicted Sales</CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-cyan-400">
              ${(currentPredictions.totalIncremental / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-slate-500">
              {currentPredictions.totalIncremental > 2850000 ? "+" : ""}
              {(((currentPredictions.totalIncremental - 2850000) / 2850000) * 100).toFixed(1)}% vs baseline
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="allocator" className="space-y-4 sm:space-y-6">
        <TabsList className="bg-slate-800/50 border-slate-700 grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger
            value="allocator"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-xs sm:text-sm"
          >
            <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Budget Allocator</span>
            <span className="sm:hidden">Allocator</span>
          </TabsTrigger>
          <TabsTrigger
            value="optimizer"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-xs sm:text-sm"
          >
            <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Auto Optimizer</span>
            <span className="sm:hidden">Optimizer</span>
          </TabsTrigger>
          <TabsTrigger
            value="comparison"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-xs sm:text-sm"
          >
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Scenario Comparison</span>
            <span className="sm:hidden">Compare</span>
          </TabsTrigger>
          <TabsTrigger
            value="results"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-xs sm:text-sm col-span-2 sm:col-span-1"
          >
            <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Results & Export</span>
            <span className="sm:hidden">Results</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="allocator">
          <BudgetAllocator
            channelData={mockChannelData}
            currentAllocation={currentScenario}
            onAllocationChange={setCurrentScenario}
            predictions={currentPredictions}
          />
        </TabsContent>

        <TabsContent value="optimizer">
          <OptimizationEngine
            channelData={mockChannelData}
            currentAllocation={currentScenario}
            onOptimizedAllocation={setCurrentScenario}
            optimizationGoal={optimizationGoal}
            onGoalChange={setOptimizationGoal}
          />
        </TabsContent>

        <TabsContent value="comparison">
          <ScenarioComparison
            scenarios={savedScenarios}
            currentScenario={{
              id: "current",
              name: "Current Scenario",
              budgetAllocation: currentScenario,
              totalBudget: currentPredictions.totalSpend,
              predictedROI: currentPredictions.totalROI,
              predictedIncremental: currentPredictions.totalIncremental,
              createdAt: new Date().toISOString().split("T")[0],
            }}
            onLoadScenario={handleLoadScenario}
          />
        </TabsContent>

        <TabsContent value="results">
          <ScenarioResults
            currentScenario={{
              id: "current",
              name: "Current Scenario",
              budgetAllocation: currentScenario,
              totalBudget: currentPredictions.totalSpend,
              predictedROI: currentPredictions.totalROI,
              predictedIncremental: currentPredictions.totalIncremental,
              createdAt: new Date().toISOString().split("T")[0],
            }}
            channelData={mockChannelData}
            onSaveScenario={handleSaveScenario}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
