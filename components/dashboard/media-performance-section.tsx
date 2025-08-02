"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Bar, BarChart } from "recharts"
import { Badge } from "@/components/ui/badge"

interface MediaPerformanceData {
  responseCurves: Array<{
    channel: string
    data: Array<{ spend: number; response: number }>
  }>
  adstocks: Array<{
    channel: string
    halfLife: number
    carryover: number
  }>
}

interface MediaPerformanceSectionProps {
  data: MediaPerformanceData
}

export function MediaPerformanceSection({ data }: MediaPerformanceSectionProps) {
  const colors = {
    TV: "#06b6d4",
    Digital: "#8b5cf6",
    Social: "#10b981",
    Radio: "#f59e0b",
    Search: "#ef4444",
    Print: "#6b7280",
  }

  return (
    <div className="space-y-6">
      {/* Response Curves */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Response Curves</CardTitle>
          <CardDescription className="text-slate-400">
            Diminishing returns analysis showing response vs spend for each channel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              TV: { label: "TV", color: colors.TV },
              Digital: { label: "Digital", color: colors.Digital },
              Social: { label: "Social", color: colors.Social },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart>
                <XAxis
                  type="number"
                  dataKey="spend"
                  domain={[0, "dataMax"]}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  stroke="#64748b"
                />
                <YAxis
                  type="number"
                  domain={[0, "dataMax"]}
                  tickFormatter={(value) => value.toFixed(1)}
                  stroke="#64748b"
                />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
                          <p className="text-slate-300">{`Spend: $${(Number(label) / 1000).toFixed(0)}K`}</p>
                          {payload.map((entry, index) => (
                            <p key={index} style={{ color: entry.color }}>
                              {`${entry.name}: ${Number(entry.value).toFixed(2)}`}
                            </p>
                          ))}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                {data.responseCurves.map((curve) => (
                  <Line
                    key={curve.channel}
                    type="monotone"
                    dataKey="response"
                    data={curve.data}
                    stroke={colors[curve.channel as keyof typeof colors]}
                    strokeWidth={2}
                    dot={false}
                    name={curve.channel}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Adstock Parameters */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Adstock Parameters</CardTitle>
            <CardDescription className="text-slate-400">Half-life and carryover effects by channel</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                halfLife: {
                  label: "Half Life (weeks)",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.adstocks} layout="horizontal">
                  <XAxis type="number" stroke="#64748b" />
                  <YAxis dataKey="channel" type="category" stroke="#64748b" width={60} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="halfLife" fill="var(--color-halfLife)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Carryover Effects */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Carryover Effects</CardTitle>
            <CardDescription className="text-slate-400">Percentage of effect carried to next period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.adstocks.map((adstock) => (
                <div key={adstock.channel} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[adstock.channel as keyof typeof colors] }}
                    />
                    <span className="text-white font-medium">{adstock.channel}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {(adstock.carryover * 100).toFixed(0)}%
                    </Badge>
                    <div className="w-24 bg-slate-800 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                        style={{ width: `${adstock.carryover * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Adstock Summary Table */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Adstock Summary</CardTitle>
          <CardDescription className="text-slate-400">Complete adstock parameters for all channels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Channel</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Half Life (weeks)</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Carryover Rate</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Decay Rate</th>
                </tr>
              </thead>
              <tbody>
                {data.adstocks.map((adstock, index) => (
                  <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: colors[adstock.channel as keyof typeof colors] }}
                        />
                        <span className="text-white font-medium">{adstock.channel}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-cyan-400 font-semibold">{adstock.halfLife.toFixed(1)}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-purple-400 font-semibold">{(adstock.carryover * 100).toFixed(0)}%</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-yellow-400 font-semibold">
                        {((1 - adstock.carryover) * 100).toFixed(0)}%
                      </span>
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
