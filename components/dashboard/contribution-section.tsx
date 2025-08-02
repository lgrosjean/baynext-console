"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line } from "recharts"

interface ContributionData {
  byChannel: Array<{
    channel: string
    contribution: number
    spend: number
    efficiency: number
  }>
  timeline: Array<{
    month: string
    TV: number
    Digital: number
    Social: number
    Search: number
    Radio: number
    Print: number
  }>
}

interface ContributionSectionProps {
  data: ContributionData
}

export function ContributionSection({ data }: ContributionSectionProps) {
  const colors = {
    TV: "#06b6d4",
    Digital: "#8b5cf6",
    Social: "#10b981",
    Search: "#ef4444",
    Radio: "#f59e0b",
    Print: "#6b7280",
  }

  const pieData = data.byChannel.map((item) => ({
    name: item.channel,
    value: item.contribution,
    color: colors[item.channel as keyof typeof colors],
  }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contribution Pie Chart */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Channel Contribution</CardTitle>
            <CardDescription className="text-slate-400">Total contribution breakdown by channel</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={Object.fromEntries(
                Object.entries(colors).map(([key, value]) => [key, { label: key, color: value }]),
              )}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
                            <p className="text-white font-medium">{data.name}</p>
                            <p className="text-slate-300">{`Contribution: ${data.value.toFixed(1)}%`}</p>
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

        {/* Efficiency Bar Chart */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Channel Efficiency</CardTitle>
            <CardDescription className="text-slate-400">Contribution per dollar spent</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                efficiency: {
                  label: "Efficiency",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byChannel} layout="horizontal">
                  <XAxis type="number" stroke="#64748b" />
                  <YAxis dataKey="channel" type="category" stroke="#64748b" width={60} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="efficiency" fill="var(--color-efficiency)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Contribution Over Time */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Contribution Timeline</CardTitle>
          <CardDescription className="text-slate-400">Monthly contribution trends by channel</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={Object.fromEntries(
              Object.entries(colors).map(([key, value]) => [key, { label: key, color: value }]),
            )}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.timeline}>
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <ChartTooltip content={<ChartTooltipContent />} />
                {Object.keys(colors).map((channel) => (
                  <Line
                    key={channel}
                    type="monotone"
                    dataKey={channel}
                    stroke={colors[channel as keyof typeof colors]}
                    strokeWidth={2}
                    dot={{ fill: colors[channel as keyof typeof colors], strokeWidth: 2, r: 3 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Detailed Contribution Table */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Detailed Channel Analysis</CardTitle>
          <CardDescription className="text-slate-400">Complete breakdown of channel performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Channel</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Contribution %</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Spend</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Efficiency</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Rank</th>
                </tr>
              </thead>
              <tbody>
                {data.byChannel
                  .sort((a, b) => b.contribution - a.contribution)
                  .map((item, index) => (
                    <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: colors[item.channel as keyof typeof colors] }}
                          />
                          <span className="text-white font-medium">{item.channel}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-cyan-400 font-semibold">{item.contribution.toFixed(1)}%</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-yellow-400 font-semibold">${(item.spend / 1000).toFixed(0)}K</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-green-400 font-semibold">{item.efficiency.toFixed(2)}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-purple-400 font-semibold">#{index + 1}</span>
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
