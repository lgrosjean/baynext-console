"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Line, LineChart } from "recharts"

interface OverviewData {
  totalROI: number
  incrementalSales: number
  mROI: number
  totalSpend: number
  brands: string[]
  channels: string[]
  metrics: Record<string, { roi: number; incrementalSales: number; mROI: number }>
}

interface OverviewSectionProps {
  data: OverviewData
  selectedBrand: string
  selectedChannel: string
}

export function OverviewSection({ data, selectedBrand, selectedChannel }: OverviewSectionProps) {
  // Filter data based on selections
  const getFilteredData = () => {
    if (selectedBrand !== "all") {
      return [{ name: selectedBrand, ...data.metrics[selectedBrand] }]
    }
    if (selectedChannel !== "all") {
      return [{ name: selectedChannel, ...data.metrics[selectedChannel] }]
    }

    // Show all channels by default
    return data.channels.map((channel) => ({
      name: channel,
      ...data.metrics[channel],
    }))
  }

  const filteredData = getFilteredData()

  // Mock time series data for trends
  const trendData = Array.from({ length: 12 }, (_, i) => ({
    month: `M${i + 1}`,
    roi: 3.5 + Math.random() * 1.5,
    incrementalSales: 200000 + Math.random() * 100000,
    mROI: 3.2 + Math.random() * 1.3,
  }))

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Performance Metrics Bar Chart */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-base sm:text-lg">Performance Metrics</CardTitle>
          <CardDescription className="text-slate-400 text-sm">
            ROI and mROI comparison across{" "}
            {selectedBrand !== "all" ? "brand" : selectedChannel !== "all" ? "channel" : "channels"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              roi: {
                label: "ROI",
                color: "hsl(var(--chart-1))",
              },
              mROI: {
                label: "mROI",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[250px] sm:h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="roi" fill="var(--color-roi)" name="ROI" radius={[4, 4, 0, 0]} />
                <Bar dataKey="mROI" fill="var(--color-mROI)" name="mROI" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* ROI Trend */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-base sm:text-lg">ROI Trend</CardTitle>
            <CardDescription className="text-slate-400 text-sm">12-month ROI performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                roi: {
                  label: "ROI",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[180px] sm:h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="roi"
                    stroke="var(--color-roi)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-roi)", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Incremental Sales Trend */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-base sm:text-lg">Incremental Sales</CardTitle>
            <CardDescription className="text-slate-400 text-sm">Monthly incremental sales generated</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                incrementalSales: {
                  label: "Incremental Sales",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[180px] sm:h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} fontSize={12} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => [`$${(Number(value) / 1000).toFixed(0)}K`, "Incremental Sales"]}
                      />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="incrementalSales"
                    stroke="var(--color-incrementalSales)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-incrementalSales)", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics Table */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-base sm:text-lg">Detailed Metrics</CardTitle>
          <CardDescription className="text-slate-400 text-sm">Comprehensive performance breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-2 sm:px-4 text-slate-300 font-medium text-sm">
                    {selectedBrand !== "all" ? "Brand" : "Channel"}
                  </th>
                  <th className="text-right py-3 px-2 sm:px-4 text-slate-300 font-medium text-sm">ROI</th>
                  <th className="text-right py-3 px-2 sm:px-4 text-slate-300 font-medium text-sm">mROI</th>
                  <th className="text-right py-3 px-2 sm:px-4 text-slate-300 font-medium text-sm">Incremental Sales</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/30">
                    <td className="py-3 px-2 sm:px-4 text-white font-medium text-sm">{item.name}</td>
                    <td className="py-3 px-2 sm:px-4 text-right">
                      <span className="text-green-400 font-semibold text-sm">{item.roi.toFixed(1)}x</span>
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-right">
                      <span className="text-purple-400 font-semibold text-sm">{item.mROI.toFixed(1)}x</span>
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-right">
                      <span className="text-cyan-400 font-semibold text-sm">
                        ${(item.incrementalSales / 1000).toFixed(0)}K
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
