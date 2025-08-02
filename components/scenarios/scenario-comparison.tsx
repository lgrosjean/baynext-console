"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Play, Trash2, Copy } from "lucide-react"

interface Scenario {
  id: string
  name: string
  budgetAllocation: Record<string, number>
  totalBudget: number
  predictedROI: number
  predictedIncremental: number
  createdAt: string
}

interface ScenarioComparisonProps {
  scenarios: Scenario[]
  currentScenario: Scenario
  onLoadScenario: (scenarioId: string) => void
}

export function ScenarioComparison({ scenarios, currentScenario, onLoadScenario }: ScenarioComparisonProps) {
  const allScenarios = [currentScenario, ...scenarios.filter((s) => s.id !== "current")]

  const comparisonData = allScenarios.map((scenario) => ({
    name: scenario.name,
    roi: scenario.predictedROI,
    incremental: scenario.predictedIncremental / 1000000, // Convert to millions
    budget: scenario.totalBudget / 1000, // Convert to thousands
    id: scenario.id,
  }))

  const channelComparisonData = Object.keys(currentScenario.budgetAllocation).map((channel) => {
    const data: any = { channel }
    allScenarios.forEach((scenario) => {
      data[scenario.name] = scenario.budgetAllocation[channel] / 1000 // Convert to thousands
    })
    return data
  })

  const getScenarioColor = (index: number) => {
    const colors = ["#06b6d4", "#8b5cf6", "#10b981", "#ef4444", "#f59e0b", "#6b7280"]
    return colors[index % colors.length]
  }

  return (
    <div className="space-y-6">
      {/* Scenario Overview */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Scenario Overview</CardTitle>
          <CardDescription className="text-slate-400">Compare key metrics across all scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Scenario</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Total Budget</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Predicted ROI</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Incremental Sales</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Created</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allScenarios.map((scenario, index) => (
                  <tr key={scenario.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getScenarioColor(index) }} />
                        <span className="text-white font-medium">{scenario.name}</span>
                        {scenario.id === "current" && (
                          <Badge className="bg-cyan-400/10 text-cyan-400 border-cyan-400/20">Current</Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-yellow-400 font-semibold">
                        ${(scenario.totalBudget / 1000).toFixed(0)}K
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-green-400 font-semibold">{scenario.predictedROI.toFixed(1)}x</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-cyan-400 font-semibold">
                        ${(scenario.predictedIncremental / 1000000).toFixed(1)}M
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400 text-sm">
                      {new Date(scenario.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        {scenario.id !== "current" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onLoadScenario(scenario.id)}
                              className="border-slate-700 text-slate-300 hover:text-cyan-300 bg-transparent"
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Load
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-700 text-slate-300 hover:text-cyan-300 bg-transparent"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-700 text-red-400 hover:text-red-300 bg-transparent"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROI Comparison */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">ROI Comparison</CardTitle>
            <CardDescription className="text-slate-400">Compare predicted ROI across scenarios</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                roi: { label: "ROI", color: "hsl(var(--chart-1))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <ChartTooltip
                    content={<ChartTooltipContent formatter={(value) => [`${Number(value).toFixed(1)}x`, "ROI"]} />}
                  />
                  <Bar dataKey="roi" fill="var(--color-roi)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Incremental Sales Comparison */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Incremental Sales</CardTitle>
            <CardDescription className="text-slate-400">Compare predicted sales across scenarios</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                incremental: { label: "Incremental Sales", color: "hsl(var(--chart-2))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" tickFormatter={(value) => `$${value.toFixed(1)}M`} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => [`$${Number(value).toFixed(1)}M`, "Incremental Sales"]}
                      />
                    }
                  />
                  <Bar dataKey="incremental" fill="var(--color-incremental)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Channel Allocation Comparison */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Channel Allocation Comparison</CardTitle>
          <CardDescription className="text-slate-400">
            Compare budget allocation across channels and scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={Object.fromEntries(
              allScenarios.map((scenario, index) => [
                scenario.name,
                { label: scenario.name, color: getScenarioColor(index) },
              ]),
            )}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelComparisonData}>
                <XAxis dataKey="channel" stroke="#64748b" />
                <YAxis stroke="#64748b" tickFormatter={(value) => `$${value}K`} />
                <ChartTooltip
                  content={<ChartTooltipContent formatter={(value, name) => [`$${Number(value).toFixed(0)}K`, name]} />}
                />
                {allScenarios.map((scenario, index) => (
                  <Bar
                    key={scenario.name}
                    dataKey={scenario.name}
                    fill={getScenarioColor(index)}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
