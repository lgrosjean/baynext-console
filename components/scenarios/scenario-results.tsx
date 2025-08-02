"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Bar, BarChart, XAxis, YAxis } from "recharts"
import { Save, Download, FileText, Share2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Scenario {
  id: string
  name: string
  budgetAllocation: Record<string, number>
  totalBudget: number
  predictedROI: number
  predictedIncremental: number
  createdAt: string
}

interface ChannelData {
  currentSpend: number
  currentROI: number
  currentIncremental: number
  responseCurve: Array<{ spend: number; roi: number; incremental: number }>
  minSpend: number
  maxSpend: number
  color: string
}

interface ScenarioResultsProps {
  currentScenario: Scenario
  channelData: Record<string, ChannelData>
  onSaveScenario: (name: string) => void
}

export function ScenarioResults({ currentScenario, channelData, onSaveScenario }: ScenarioResultsProps) {
  const [scenarioName, setScenarioName] = useState("")
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)

  const handleSave = () => {
    if (scenarioName.trim()) {
      onSaveScenario(scenarioName.trim())
      setScenarioName("")
      setIsSaveDialogOpen(false)
    }
  }

  const exportToPDF = () => {
    // Simulate PDF export
    console.log("Exporting scenario to PDF...")
  }

  const exportToExcel = () => {
    // Simulate Excel export
    console.log("Exporting scenario to Excel...")
  }

  const shareScenario = () => {
    // Simulate sharing functionality
    console.log("Sharing scenario...")
  }

  // Prepare data for visualizations
  const allocationData = Object.entries(currentScenario.budgetAllocation).map(([channel, spend]) => ({
    channel,
    spend,
    percentage: (spend / currentScenario.totalBudget) * 100,
    color: channelData[channel].color,
  }))

  const impactData = Object.entries(currentScenario.budgetAllocation).map(([channel, spend]) => {
    const channelInfo = channelData[channel]
    const spendIndex = Math.floor(spend / 10000)
    const curvePoint = channelInfo.responseCurve[Math.min(spendIndex, channelInfo.responseCurve.length - 1)]

    return {
      channel,
      currentSpend: channelInfo.currentSpend,
      newSpend: spend,
      currentIncremental: channelInfo.currentIncremental,
      newIncremental: curvePoint?.incremental || 0,
      change: ((spend - channelInfo.currentSpend) / channelInfo.currentSpend) * 100,
      incrementalChange: curvePoint
        ? ((curvePoint.incremental - channelInfo.currentIncremental) / channelInfo.currentIncremental) * 100
        : 0,
      color: channelInfo.color,
    }
  })

  const totalCurrentIncremental = Object.values(channelData).reduce((sum, ch) => sum + ch.currentIncremental, 0)
  const totalCurrentSpend = Object.values(channelData).reduce((sum, ch) => sum + ch.currentSpend, 0)
  const currentROI = totalCurrentIncremental / totalCurrentSpend

  return (
    <div className="space-y-6">
      {/* Scenario Summary */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Scenario Summary</CardTitle>
              <CardDescription className="text-slate-400">Complete analysis of your budget scenario</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-cyan-500 to-purple-500">
                    <Save className="h-4 w-4 mr-2" />
                    Save Scenario
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-cyan-500/20">
                  <DialogHeader>
                    <DialogTitle className="text-cyan-400">Save Scenario</DialogTitle>
                    <DialogDescription className="text-slate-400">
                      Give your scenario a name to save it for future reference
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="scenario-name" className="text-slate-300">
                        Scenario Name
                      </Label>
                      <Input
                        id="scenario-name"
                        value={scenarioName}
                        onChange={(e) => setScenarioName(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white"
                        placeholder="Enter scenario name"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsSaveDialogOpen(false)}
                      className="border-slate-700 text-slate-300"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-gradient-to-r from-cyan-500 to-purple-500">
                      Save Scenario
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                ${(currentScenario.totalBudget / 1000).toFixed(0)}K
              </div>
              <div className="text-sm text-slate-400">Total Budget</div>
              <Badge
                className={
                  currentScenario.totalBudget > totalCurrentSpend
                    ? "bg-red-400/10 text-red-400 mt-1"
                    : currentScenario.totalBudget < totalCurrentSpend
                      ? "bg-green-400/10 text-green-400 mt-1"
                      : "bg-slate-400/10 text-slate-400 mt-1"
                }
              >
                {currentScenario.totalBudget > totalCurrentSpend ? "+" : ""}
                {(((currentScenario.totalBudget - totalCurrentSpend) / totalCurrentSpend) * 100).toFixed(0)}%
              </Badge>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{currentScenario.predictedROI.toFixed(1)}x</div>
              <div className="text-sm text-slate-400">Predicted ROI</div>
              <Badge
                className={
                  currentScenario.predictedROI > currentROI
                    ? "bg-green-400/10 text-green-400 mt-1"
                    : currentScenario.predictedROI < currentROI
                      ? "bg-red-400/10 text-red-400 mt-1"
                      : "bg-slate-400/10 text-slate-400 mt-1"
                }
              >
                {currentScenario.predictedROI > currentROI ? "+" : ""}
                {(((currentScenario.predictedROI - currentROI) / currentROI) * 100).toFixed(0)}%
              </Badge>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">
                ${(currentScenario.predictedIncremental / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-slate-400">Incremental Sales</div>
              <Badge
                className={
                  currentScenario.predictedIncremental > totalCurrentIncremental
                    ? "bg-green-400/10 text-green-400 mt-1"
                    : currentScenario.predictedIncremental < totalCurrentIncremental
                      ? "bg-red-400/10 text-red-400 mt-1"
                      : "bg-slate-400/10 text-slate-400 mt-1"
                }
              >
                {currentScenario.predictedIncremental > totalCurrentIncremental ? "+" : ""}
                {(
                  ((currentScenario.predictedIncremental - totalCurrentIncremental) / totalCurrentIncremental) *
                  100
                ).toFixed(0)}
                %
              </Badge>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {(currentScenario.predictedIncremental / currentScenario.totalBudget).toFixed(1)}
              </div>
              <div className="text-sm text-slate-400">Efficiency Ratio</div>
              <Badge className="bg-purple-400/10 text-purple-400 mt-1">Sales per $1</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Allocation Pie Chart */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Budget Allocation</CardTitle>
            <CardDescription className="text-slate-400">Distribution of budget across channels</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={Object.fromEntries(
                Object.entries(channelData).map(([key, value]) => [key, { label: key, color: value.color }]),
              )}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="spend"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
                            <p className="text-white font-medium">{data.channel}</p>
                            <p className="text-slate-300">{`Budget: $${(data.spend / 1000).toFixed(0)}K`}</p>
                            <p className="text-slate-300">{`Share: ${data.percentage.toFixed(1)}%`}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Impact Analysis */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Impact Analysis</CardTitle>
            <CardDescription className="text-slate-400">Change in incremental sales by channel</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                incrementalChange: { label: "Incremental Change", color: "hsl(var(--chart-1))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactData} layout="horizontal">
                  <XAxis type="number" stroke="#64748b" tickFormatter={(value) => `${value.toFixed(0)}%`} />
                  <YAxis dataKey="channel" type="category" stroke="#64748b" width={60} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => [`${Number(value).toFixed(1)}%`, "Change in Incremental Sales"]}
                      />
                    }
                  />
                  <Bar dataKey="incrementalChange" fill="var(--color-incrementalChange)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results Table */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Detailed Channel Results</CardTitle>
          <CardDescription className="text-slate-400">Complete breakdown of changes by channel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Channel</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Current Spend</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">New Spend</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Spend Change</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Current Sales</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">New Sales</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Sales Change</th>
                </tr>
              </thead>
              <tbody>
                {impactData.map((item) => (
                  <tr key={item.channel} className="border-b border-slate-800 hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-white font-medium">{item.channel}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400">${(item.currentSpend / 1000).toFixed(0)}K</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-cyan-400 font-semibold">${(item.newSpend / 1000).toFixed(0)}K</span>
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
                    <td className="py-3 px-4 text-right text-slate-400">
                      ${(item.currentIncremental / 1000).toFixed(0)}K
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-green-400 font-semibold">${(item.newIncremental / 1000).toFixed(0)}K</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Badge
                        className={
                          item.incrementalChange > 0
                            ? "bg-green-400/10 text-green-400"
                            : item.incrementalChange < 0
                              ? "bg-red-400/10 text-red-400"
                              : "bg-slate-400/10 text-slate-400"
                        }
                      >
                        {item.incrementalChange > 0 ? "+" : ""}
                        {item.incrementalChange.toFixed(0)}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Export & Share</CardTitle>
          <CardDescription className="text-slate-400">Export your scenario results or share with team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={exportToPDF} variant="outline" className="border-slate-700 text-slate-300 bg-transparent">
              <FileText className="h-4 w-4 mr-2" />
              Export PDF Report
            </Button>
            <Button
              onClick={exportToExcel}
              variant="outline"
              className="border-slate-700 text-slate-300 bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            <Button
              onClick={shareScenario}
              variant="outline"
              className="border-slate-700 text-slate-300 bg-transparent"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Scenario
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
