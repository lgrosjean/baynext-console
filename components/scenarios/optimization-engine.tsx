"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Zap, Target, TrendingUp, DollarSign, RefreshCw } from "lucide-react"

interface ChannelData {
  currentSpend: number
  currentROI: number
  currentIncremental: number
  responseCurve: Array<{ spend: number; roi: number; incremental: number }>
  minSpend: number
  maxSpend: number
  color: string
}

interface OptimizationEngineProps {
  channelData: Record<string, ChannelData>
  currentAllocation: Record<string, number>
  onOptimizedAllocation: (allocation: Record<string, number>) => void
  optimizationGoal: "roi" | "incremental" | "efficiency"
  onGoalChange: (goal: "roi" | "incremental" | "efficiency") => void
}

export function OptimizationEngine({
  channelData,
  currentAllocation,
  onOptimizedAllocation,
  optimizationGoal,
  onGoalChange,
}: OptimizationEngineProps) {
  const [totalBudget, setTotalBudget] = useState(Object.values(currentAllocation).reduce((sum, val) => sum + val, 0))
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationResults, setOptimizationResults] = useState<{
    allocation: Record<string, number>
    improvement: number
    metric: string
  } | null>(null)

  // Optimization algorithms
  const optimizeForROI = (budget: number): Record<string, number> => {
    const allocation: Record<string, number> = {}
    const channels = Object.keys(channelData)

    // Start with minimum spend for all channels
    channels.forEach((channel) => {
      allocation[channel] = channelData[channel].minSpend
    })

    let remainingBudget = budget - Object.values(allocation).reduce((sum, val) => sum + val, 0)

    // Iteratively allocate budget to channel with highest marginal ROI
    while (remainingBudget > 5000) {
      let bestChannel = ""
      let bestMarginalROI = 0

      channels.forEach((channel) => {
        const currentSpend = allocation[channel]
        const maxSpend = channelData[channel].maxSpend

        if (currentSpend < maxSpend) {
          const currentIndex = Math.floor(currentSpend / 10000)
          const nextIndex = Math.min(currentIndex + 1, channelData[channel].responseCurve.length - 1)
          const currentPoint = channelData[channel].responseCurve[currentIndex]
          const nextPoint = channelData[channel].responseCurve[nextIndex]

          if (currentPoint && nextPoint) {
            const marginalROI = (nextPoint.incremental - currentPoint.incremental) / 10000
            if (marginalROI > bestMarginalROI) {
              bestMarginalROI = marginalROI
              bestChannel = channel
            }
          }
        }
      })

      if (bestChannel && allocation[bestChannel] + 10000 <= channelData[bestChannel].maxSpend) {
        allocation[bestChannel] += 10000
        remainingBudget -= 10000
      } else {
        break
      }
    }

    return allocation
  }

  const optimizeForIncremental = (budget: number): Record<string, number> => {
    // Similar to ROI optimization but focuses on absolute incremental sales
    const allocation: Record<string, number> = {}
    const channels = Object.keys(channelData)

    channels.forEach((channel) => {
      allocation[channel] = channelData[channel].minSpend
    })

    let remainingBudget = budget - Object.values(allocation).reduce((sum, val) => sum + val, 0)

    while (remainingBudget > 5000) {
      let bestChannel = ""
      let bestMarginalIncremental = 0

      channels.forEach((channel) => {
        const currentSpend = allocation[channel]
        const maxSpend = channelData[channel].maxSpend

        if (currentSpend < maxSpend) {
          const currentIndex = Math.floor(currentSpend / 10000)
          const nextIndex = Math.min(currentIndex + 1, channelData[channel].responseCurve.length - 1)
          const currentPoint = channelData[channel].responseCurve[currentIndex]
          const nextPoint = channelData[channel].responseCurve[nextIndex]

          if (currentPoint && nextPoint) {
            const marginalIncremental = nextPoint.incremental - currentPoint.incremental
            if (marginalIncremental > bestMarginalIncremental) {
              bestMarginalIncremental = marginalIncremental
              bestChannel = channel
            }
          }
        }
      })

      if (bestChannel && allocation[bestChannel] + 10000 <= channelData[bestChannel].maxSpend) {
        allocation[bestChannel] += 10000
        remainingBudget -= 10000
      } else {
        break
      }
    }

    return allocation
  }

  const optimizeForEfficiency = (budget: number): Record<string, number> => {
    // Optimize for best efficiency (incremental sales per dollar)
    const allocation: Record<string, number> = {}
    const channels = Object.keys(channelData).sort((a, b) => {
      const aEfficiency = channelData[a].currentIncremental / channelData[a].currentSpend
      const bEfficiency = channelData[b].currentIncremental / channelData[b].currentSpend
      return bEfficiency - aEfficiency
    })

    // Allocate proportionally based on efficiency
    const totalEfficiency = channels.reduce((sum, channel) => {
      return sum + channelData[channel].currentIncremental / channelData[channel].currentSpend
    }, 0)

    channels.forEach((channel) => {
      const efficiency = channelData[channel].currentIncremental / channelData[channel].currentSpend
      const proportion = efficiency / totalEfficiency
      const targetSpend = Math.max(
        channelData[channel].minSpend,
        Math.min(channelData[channel].maxSpend, budget * proportion),
      )
      allocation[channel] = targetSpend
    })

    return allocation
  }

  const runOptimization = async () => {
    setIsOptimizing(true)

    // Simulate optimization delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    let optimizedAllocation: Record<string, number>

    switch (optimizationGoal) {
      case "roi":
        optimizedAllocation = optimizeForROI(totalBudget)
        break
      case "incremental":
        optimizedAllocation = optimizeForIncremental(totalBudget)
        break
      case "efficiency":
        optimizedAllocation = optimizeForEfficiency(totalBudget)
        break
      default:
        optimizedAllocation = currentAllocation
    }

    // Calculate improvement
    const currentMetric = calculateMetric(currentAllocation, optimizationGoal)
    const optimizedMetric = calculateMetric(optimizedAllocation, optimizationGoal)
    const improvement = ((optimizedMetric - currentMetric) / currentMetric) * 100

    setOptimizationResults({
      allocation: optimizedAllocation,
      improvement,
      metric: optimizationGoal,
    })

    setIsOptimizing(false)
  }

  const calculateMetric = (allocation: Record<string, number>, goal: string): number => {
    let totalIncremental = 0
    let totalSpend = 0

    Object.entries(allocation).forEach(([channel, spend]) => {
      const channelInfo = channelData[channel]
      const spendIndex = Math.floor(spend / 10000)
      const curvePoint = channelInfo.responseCurve[Math.min(spendIndex, channelInfo.responseCurve.length - 1)]

      if (curvePoint) {
        totalIncremental += curvePoint.incremental
        totalSpend += spend
      }
    })

    switch (goal) {
      case "roi":
        return totalSpend > 0 ? totalIncremental / totalSpend : 0
      case "incremental":
        return totalIncremental
      case "efficiency":
        return totalSpend > 0 ? totalIncremental / totalSpend : 0
      default:
        return 0
    }
  }

  const applyOptimization = () => {
    if (optimizationResults) {
      onOptimizedAllocation(optimizationResults.allocation)
      setOptimizationResults(null)
    }
  }

  const optimizationData = optimizationResults
    ? Object.entries(optimizationResults.allocation).map(([channel, spend]) => ({
        channel,
        current: currentAllocation[channel],
        optimized: spend,
        change: ((spend - currentAllocation[channel]) / currentAllocation[channel]) * 100,
        color: channelData[channel].color,
      }))
    : []

  return (
    <div className="space-y-6">
      {/* Optimization Settings */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-cyan-400" />
            Optimization Settings
          </CardTitle>
          <CardDescription className="text-slate-400">Configure optimization parameters and goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Optimization Goal</Label>
              <Select value={optimizationGoal} onValueChange={onGoalChange}>
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="roi">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Maximize ROI
                    </div>
                  </SelectItem>
                  <SelectItem value="incremental">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Maximize Sales
                    </div>
                  </SelectItem>
                  <SelectItem value="efficiency">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Maximize Efficiency
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Total Budget</Label>
              <Input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={runOptimization}
                disabled={isOptimizing}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                {isOptimizing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Run Optimization
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Results */}
      {optimizationResults && (
        <Card className="bg-slate-900/50 border-slate-700 border-cyan-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-400" />
                  Optimization Results
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Recommended budget allocation for {optimizationGoal} optimization
                </CardDescription>
              </div>
              <Badge className="bg-green-400/10 text-green-400 border-green-400/20">
                +{optimizationResults.improvement.toFixed(1)}% improvement
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Results Chart */}
            <ChartContainer
              config={{
                current: { label: "Current", color: "hsl(var(--chart-2))" },
                optimized: { label: "Optimized", color: "hsl(var(--chart-1))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={optimizationData}>
                  <XAxis dataKey="channel" stroke="#64748b" />
                  <YAxis stroke="#64748b" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => [
                          `$${(Number(value) / 1000).toFixed(0)}K`,
                          name === "current" ? "Current" : "Optimized",
                        ]}
                      />
                    }
                  />
                  <Bar dataKey="current" fill="var(--color-current)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="optimized" fill="var(--color-optimized)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Results Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Channel</th>
                    <th className="text-right py-3 px-4 text-slate-300 font-medium">Current</th>
                    <th className="text-right py-3 px-4 text-slate-300 font-medium">Optimized</th>
                    <th className="text-right py-3 px-4 text-slate-300 font-medium">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {optimizationData.map((item) => (
                    <tr key={item.channel} className="border-b border-slate-800 hover:bg-slate-800/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-white font-medium">{item.channel}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-slate-400">${(item.current / 1000).toFixed(0)}K</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-cyan-400 font-semibold">${(item.optimized / 1000).toFixed(0)}K</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Badge
                          className={
                            item.change > 0
                              ? "bg-green-400/10 text-green-400"
                              : item.change < 0
                                ? "bg-red-400/10 text-red-400"
                                : "bg-slate-400/10 text-slate-400"
                          }
                        >
                          {item.change > 0 ? "+" : ""}
                          {item.change.toFixed(0)}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setOptimizationResults(null)}
                className="border-slate-700 text-slate-300"
              >
                Discard
              </Button>
              <Button onClick={applyOptimization} className="bg-gradient-to-r from-green-500 to-emerald-500">
                Apply Optimization
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization Strategies */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Optimization Strategies</CardTitle>
          <CardDescription className="text-slate-400">Understanding different optimization approaches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <h3 className="font-semibold text-green-400">Maximize ROI</h3>
              </div>
              <p className="text-sm text-slate-400">
                Allocates budget to channels with the highest return on investment, focusing on efficiency over volume.
              </p>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-cyan-400" />
                <h3 className="font-semibold text-cyan-400">Maximize Sales</h3>
              </div>
              <p className="text-sm text-slate-400">
                Prioritizes absolute incremental sales volume, ideal for growth-focused campaigns.
              </p>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-purple-400" />
                <h3 className="font-semibold text-purple-400">Maximize Efficiency</h3>
              </div>
              <p className="text-sm text-slate-400">
                Balances reach and efficiency, optimizing for the best cost per incremental sale.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
