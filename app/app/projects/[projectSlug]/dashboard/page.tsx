"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, Target, Activity } from "lucide-react"
import { OverviewSection } from "@/components/dashboard/overview-section"
import { MediaPerformanceSection } from "@/components/dashboard/media-performance-section"
import { ContributionSection } from "@/components/dashboard/contribution-section"

// Mock data for the dashboard
const mockModelData = {
  overview: {
    totalROI: 4.2,
    incrementalSales: 2850000,
    mROI: 3.8,
    totalSpend: 750000,
    brands: ["Brand A", "Brand B", "Brand C"],
    channels: ["TV", "Digital", "Radio", "Print", "Social", "Search"],
    metrics: {
      "Brand A": { roi: 4.5, incrementalSales: 1200000, mROI: 4.1 },
      "Brand B": { roi: 3.8, incrementalSales: 950000, mROI: 3.4 },
      "Brand C": { roi: 4.3, incrementalSales: 700000, mROI: 3.9 },
      TV: { roi: 3.2, incrementalSales: 850000, mROI: 2.8 },
      Digital: { roi: 5.1, incrementalSales: 720000, mROI: 4.7 },
      Radio: { roi: 2.8, incrementalSales: 420000, mROI: 2.4 },
      Print: { roi: 2.1, incrementalSales: 280000, mROI: 1.9 },
      Social: { roi: 6.2, incrementalSales: 380000, mROI: 5.8 },
      Search: { roi: 7.8, incrementalSales: 200000, mROI: 7.2 },
    },
  },
  mediaPerformance: {
    responseCurves: [
      {
        channel: "TV",
        data: Array.from({ length: 20 }, (_, i) => ({ spend: i * 50000, response: Math.log(i + 1) * 0.3 })),
      },
      {
        channel: "Digital",
        data: Array.from({ length: 20 }, (_, i) => ({ spend: i * 30000, response: Math.log(i + 1) * 0.45 })),
      },
      {
        channel: "Social",
        data: Array.from({ length: 20 }, (_, i) => ({ spend: i * 20000, response: Math.log(i + 1) * 0.6 })),
      },
    ],
    adstocks: [
      { channel: "TV", halfLife: 8.5, carryover: 0.65 },
      { channel: "Digital", halfLife: 2.1, carryover: 0.25 },
      { channel: "Radio", halfLife: 5.2, carryover: 0.45 },
      { channel: "Social", halfLife: 1.8, carryover: 0.2 },
      { channel: "Search", halfLife: 0.5, carryover: 0.05 },
      { channel: "Print", halfLife: 12.0, carryover: 0.75 },
    ],
  },
  contribution: {
    byChannel: [
      { channel: "TV", contribution: 28.5, spend: 250000, efficiency: 1.14 },
      { channel: "Digital", contribution: 22.8, spend: 180000, efficiency: 1.27 },
      { channel: "Social", contribution: 18.2, spend: 95000, efficiency: 1.92 },
      { channel: "Search", contribution: 12.1, spend: 75000, efficiency: 1.61 },
      { channel: "Radio", contribution: 10.8, spend: 85000, efficiency: 1.27 },
      { channel: "Print", contribution: 7.6, spend: 65000, efficiency: 1.17 },
    ],
    timeline: Array.from({ length: 12 }, (_, i) => ({
      month: `Month ${i + 1}`,
      TV: Math.random() * 30 + 20,
      Digital: Math.random() * 25 + 15,
      Social: Math.random() * 20 + 10,
      Search: Math.random() * 15 + 8,
      Radio: Math.random() * 12 + 6,
      Print: Math.random() * 10 + 4,
    })),
  },
}

export default function DashboardPage({ params }: { params: { projectSlug: string } }) {
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [selectedChannel, setSelectedChannel] = useState<string>("all")
  const [timeRange, setTimeRange] = useState<string>("12m")

  const projectName = params.projectSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Model Dashboard
          </h1>
          <p className="text-slate-400 mt-1 sm:mt-2 text-sm sm:text-base">
            Analyze performance and insights for <span className="text-cyan-400">{projectName}</span>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Badge className="bg-green-400/10 text-green-400 border-green-400/20 justify-center sm:justify-start">
            <Activity className="h-3 w-3 mr-1" />
            Model Active
          </Badge>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-32 bg-slate-800 border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="3m">Last 3M</SelectItem>
              <SelectItem value="6m">Last 6M</SelectItem>
              <SelectItem value="12m">Last 12M</SelectItem>
              <SelectItem value="24m">Last 24M</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-300">Total ROI</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-green-400">{mockModelData.overview.totalROI}x</div>
            <p className="text-xs text-slate-500">+12% from last period</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-300">Incremental Sales</CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-cyan-400">
              ${(mockModelData.overview.incrementalSales / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-slate-500">+8% from last period</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-300">mROI</CardTitle>
            <Target className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-purple-400">{mockModelData.overview.mROI}x</div>
            <p className="text-xs text-slate-500">+5% from last period</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-300">Total Spend</CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-yellow-400">
              ${(mockModelData.overview.totalSpend / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-slate-500">-3% from last period</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-base sm:text-lg">Filters</CardTitle>
          <CardDescription className="text-slate-400 text-sm">Customize your analysis view</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium text-slate-300">Brand</label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-full sm:w-40 bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Brands</SelectItem>
                  {mockModelData.overview.brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium text-slate-300">Channel</label>
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger className="w-full sm:w-40 bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Channels</SelectItem>
                  {mockModelData.overview.channels.map((channel) => (
                    <SelectItem key={channel} value={channel}>
                      {channel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        <TabsList className="bg-slate-800/50 border-slate-700 grid w-full grid-cols-3">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-xs sm:text-sm"
          >
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Overview</span>
            <span className="sm:hidden">Overview</span>
          </TabsTrigger>
          <TabsTrigger
            value="media-performance"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-xs sm:text-sm"
          >
            <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Media Performance</span>
            <span className="sm:hidden">Media</span>
          </TabsTrigger>
          <TabsTrigger
            value="contribution"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-xs sm:text-sm"
          >
            <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Contribution</span>
            <span className="sm:hidden">Contrib</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewSection
            data={mockModelData.overview}
            selectedBrand={selectedBrand}
            selectedChannel={selectedChannel}
          />
        </TabsContent>

        <TabsContent value="media-performance">
          <MediaPerformanceSection data={mockModelData.mediaPerformance} />
        </TabsContent>

        <TabsContent value="contribution">
          <ContributionSection data={mockModelData.contribution} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
