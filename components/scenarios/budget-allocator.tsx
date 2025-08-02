"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { RotateCcw, Lock, Unlock } from "lucide-react"

interface ChannelData {
  currentSpend: number
  currentROI: number
  currentIncremental: number
  responseCurve: Array<{ spend: number; roi: number; incremental: number }>
  minSpend: number
  maxSpend: number
  color: string
}

interface BudgetAllocatorProps {
  channelData: Record<string, ChannelData>
  currentAllocation: Record<string, number>
  onAllocationChange: (allocation: Record<string, number>) => void
  predictions: {
    totalROI: number
    totalIncremental: number
    totalSpend: number
  }
}

export function BudgetAllocator({
  channelData,
  currentAllocation,
  onAllocationChange,
  predictions,
}: BudgetAllocatorProps) {
  const [lockedChannels, setLockedChannels] = useState<Set<string>>(new Set())
  const [totalBudgetConstraint, setTotalBudgetConstraint] = useState<number>(
    Object.values(currentAllocation).reduce((sum, val) => sum + val, 0),
  )

  const handleChannelChange = (channel: string, value: number) => {
    const newAllocation = { ...currentAllocation, [channel]: value }
    onAllocationChange(newAllocation)
  }

  const handleSliderChange = (channel: string, values: number[]) => {
    handleChannelChange(channel, values[0])
  }

  const resetToBaseline = () => {
    const baseline: Record<string, number> = {}
    Object.entries(channelData).forEach(([channel, data]) => {
      baseline[channel] = data.currentSpend
    })
    onAllocationChange(baseline)
  }

  const toggleChannelLock = (channel: string) => {
    const newLocked = new Set(lockedChannels)
    if (newLocked.has(channel)) {
      newLocked.delete(channel)
    } else {
      newLocked.add(channel)
    }
    setLockedChannels(newLocked)
  }

  const redistributeBudget = () => {
    const unlockedChannels = Object.keys(channelData).filter((ch) => !lockedChannels.has(ch))
    if (unlockedChannels.length === 0) return

    const lockedBudget = Array.from(lockedChannels).reduce((sum, ch) => sum + currentAllocation[ch], 0)
    const remainingBudget = totalBudgetConstraint - lockedBudget
    const budgetPerChannel = remainingBudget / unlockedChannels.length

    const newAllocation = { ...currentAllocation }
    unlockedChannels.forEach((channel) => {
      const channelInfo = channelData[channel]
      newAllocation[channel] = Math.max(channelInfo.minSpend, Math.min(channelInfo.maxSpend, budgetPerChannel))
    })

    onAllocationChange(newAllocation)
  }

  const allocationData = Object.entries(currentAllocation).map(([channel, spend]) => {
    const channelInfo = channelData[channel]
    const spendIndex = Math.floor(spend / 10000) // Simplified for demo
    const curvePoint = channelInfo.responseCurve[Math.min(spendIndex, channelInfo.responseCurve.length - 1)]

    return {
      channel,
      spend,
      currentSpend: channelInfo.currentSpend,
      predictedROI: curvePoint?.roi || 0,
      currentROI: channelInfo.currentROI,
      change: ((spend - channelInfo.currentSpend) / channelInfo.currentSpend) * 100,
      color: channelInfo.color,
    }
  })

  return (
    <div className="space-y-6">
      {/* Budget Constraint Controls */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Budget Constraints</CardTitle>
          <CardDescription className="text-slate-400">Set total budget and channel constraints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Total Budget</label>
              <Input
                type="number"
                value={totalBudgetConstraint}
                onChange={(e) => setTotalBudgetConstraint(Number(e.target.value))}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Current Total</label>
              <div className="text-lg font-semibold text-cyan-400">${(predictions.totalSpend / 1000).toFixed(0)}K</div>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={redistributeBudget} className="bg-gradient-to-r from-cyan-500 to-purple-500">
                Redistribute
              </Button>
              <Button
                onClick={resetToBaseline}
                variant="outline"
                className="border-slate-700 text-slate-300 bg-transparent"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Channel Allocation Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Channel Budget Allocation</CardTitle>
            <CardDescription className="text-slate-400">Adjust spend for each channel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(channelData).map(([channel, data]) => (
              <div key={channel} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
                    <span className="font-medium text-white">{channel}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleChannelLock(channel)}
                      className="h-6 w-6 p-0"
                    >
                      {lockedChannels.has(channel) ? (
                        <Lock className="h-3 w-3 text-yellow-400" />
                      ) : (
                        <Unlock className="h-3 w-3 text-slate-400" />
                      )}
                    </Button>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-cyan-400">
                      ${(currentAllocation[channel] / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-slate-500">
                      {(((currentAllocation[channel] - data.currentSpend) / data.currentSpend) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                <Slider
                  value={[currentAllocation[channel]]}
                  onValueChange={(values) => handleSliderChange(channel, values)}
                  min={data.minSpend}
                  max={data.maxSpend}
                  step={5000}
                  disabled={lockedChannels.has(channel)}
                  className="w-full"
                />

                <div className="flex justify-between text-xs text-slate-500">
                  <span>${(data.minSpend / 1000).toFixed(0)}K</span>
                  <span>Current: ${(data.currentSpend / 1000).toFixed(0)}K</span>
                  <span>${(data.maxSpend / 1000).toFixed(0)}K</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Allocation Visualization */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Budget vs Current</CardTitle>
            <CardDescription className="text-slate-400">Compare new allocation with current spend</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                spend: { label: "New Allocation", color: "hsl(var(--chart-1))" },
                currentSpend: { label: "Current Spend", color: "hsl(var(--chart-2))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={allocationData}>
                  <XAxis dataKey="channel" stroke="#64748b" />
                  <YAxis stroke="#64748b" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => [
                          `$${(Number(value) / 1000).toFixed(0)}K`,
                          name === "spend" ? "New Allocation" : "Current Spend",
                        ]}
                      />
                    }
                  />
                  <Bar dataKey="currentSpend" fill="var(--color-currentSpend)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="spend" fill="var(--color-spend)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Impact Summary */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Allocation Impact</CardTitle>
          <CardDescription className="text-slate-400">Predicted changes by channel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Channel</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">New Budget</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Change</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Predicted ROI</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">ROI Change</th>
                </tr>
              </thead>
              <tbody>
                {allocationData.map((item) => (
                  <tr key={item.channel} className="border-b border-slate-800 hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-white font-medium">{item.channel}</span>
                        {lockedChannels.has(item.channel) && <Lock className="h-3 w-3 text-yellow-400" />}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-cyan-400 font-semibold">${(item.spend / 1000).toFixed(0)}K</span>
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
                    <td className="py-3 px-4 text-right">
                      <span className="text-purple-400 font-semibold">{item.predictedROI.toFixed(1)}x</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Badge
                        className={
                          item.predictedROI > item.currentROI
                            ? "bg-green-400/10 text-green-400"
                            : item.predictedROI < item.currentROI
                              ? "bg-red-400/10 text-red-400"
                              : "bg-slate-400/10 text-slate-400"
                        }
                      >
                        {item.predictedROI > item.currentROI ? "+" : ""}
                        {(((item.predictedROI - item.currentROI) / item.currentROI) * 100).toFixed(0)}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
