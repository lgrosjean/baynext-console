"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Edit, Trash2, FileText, Database, Calendar, Users, TrendingUp, AlertTriangle, CheckCircle, Clock, BarChart3, Table, Info } from 'lucide-react'
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Dataset {
  id: string
  name: string
  description: string
  size: string
  format: string
  uploadedAt: string
  status: "ready" | "processing" | "error"
  rows: number
  columns: number
  lastModified: string
  uploadedBy: string
  tags: string[]
  dataQuality: {
    completeness: number
    accuracy: number
    consistency: number
    validity: number
  }
  schema: {
    name: string
    type: string
    nullable: boolean
    description: string
  }[]
  sampleData: Record<string, any>[]
  usage: {
    modelsUsing: number
    lastUsed: string
    totalDownloads: number
  }
}

// Mock dataset data
const mockDatasets: Record<string, Dataset> = {
  "1": {
    id: "1",
    name: "Media Spend Data",
    description: "Historical media spend across all channels including TV, Digital, Radio, and Print advertising with weekly granularity from 2020-2024",
    size: "2.3 MB",
    format: "CSV",
    uploadedAt: "2024-01-15",
    status: "ready",
    rows: 52000,
    columns: 12,
    lastModified: "2024-01-20",
    uploadedBy: "Sarah Johnson",
    tags: ["media", "spend", "advertising", "historical"],
    dataQuality: {
      completeness: 98,
      accuracy: 95,
      consistency: 92,
      validity: 97
    },
    schema: [
      { name: "date", type: "DATE", nullable: false, description: "Week ending date" },
      { name: "channel", type: "STRING", nullable: false, description: "Media channel (TV, Digital, Radio, Print)" },
      { name: "campaign", type: "STRING", nullable: false, description: "Campaign name" },
      { name: "spend", type: "DECIMAL", nullable: false, description: "Media spend in USD" },
      { name: "impressions", type: "INTEGER", nullable: true, description: "Total impressions" },
      { name: "clicks", type: "INTEGER", nullable: true, description: "Total clicks" },
      { name: "conversions", type: "INTEGER", nullable: true, description: "Total conversions" },
      { name: "region", type: "STRING", nullable: false, description: "Geographic region" },
      { name: "audience_segment", type: "STRING", nullable: true, description: "Target audience segment" },
      { name: "creative_type", type: "STRING", nullable: true, description: "Type of creative used" },
      { name: "placement", type: "STRING", nullable: true, description: "Ad placement details" },
      { name: "cost_per_click", type: "DECIMAL", nullable: true, description: "Average cost per click" }
    ],
    sampleData: [
      {
        date: "2024-01-07",
        channel: "TV",
        campaign: "Brand Awareness Q1",
        spend: 125000,
        impressions: 2500000,
        clicks: null,
        conversions: 1250,
        region: "Northeast",
        audience_segment: "Adults 25-54",
        creative_type: "30s Commercial",
        placement: "Prime Time",
        cost_per_click: null
      },
      {
        date: "2024-01-07",
        channel: "Digital",
        campaign: "Performance Marketing",
        spend: 45000,
        impressions: 850000,
        clicks: 12500,
        conversions: 875,
        region: "West Coast",
        audience_segment: "Millennials",
        creative_type: "Video Ad",
        placement: "Social Media",
        cost_per_click: 3.60
      },
      {
        date: "2024-01-07",
        channel: "Radio",
        campaign: "Local Promotion",
        spend: 15000,
        impressions: 450000,
        clicks: null,
        conversions: 225,
        region: "Midwest",
        audience_segment: "Commuters",
        creative_type: "30s Spot",
        placement: "Drive Time",
        cost_per_click: null
      }
    ],
    usage: {
      modelsUsing: 3,
      lastUsed: "2024-01-22",
      totalDownloads: 47
    }
  },
  "2": {
    id: "2",
    name: "Sales Performance",
    description: "Weekly sales data with regional breakdown and product categories, including revenue, units sold, and customer metrics",
    size: "1.8 MB",
    format: "CSV",
    uploadedAt: "2024-01-14",
    status: "ready",
    rows: 2600,
    columns: 8,
    lastModified: "2024-01-18",
    uploadedBy: "Mike Chen",
    tags: ["sales", "revenue", "performance", "regional"],
    dataQuality: {
      completeness: 100,
      accuracy: 98,
      consistency: 96,
      validity: 99
    },
    schema: [
      { name: "date", type: "DATE", nullable: false, description: "Week ending date" },
      { name: "region", type: "STRING", nullable: false, description: "Sales region" },
      { name: "product_category", type: "STRING", nullable: false, description: "Product category" },
      { name: "revenue", type: "DECIMAL", nullable: false, description: "Total revenue in USD" },
      { name: "units_sold", type: "INTEGER", nullable: false, description: "Number of units sold" },
      { name: "avg_order_value", type: "DECIMAL", nullable: false, description: "Average order value" },
      { name: "new_customers", type: "INTEGER", nullable: false, description: "Number of new customers" },
      { name: "returning_customers", type: "INTEGER", nullable: false, description: "Number of returning customers" }
    ],
    sampleData: [
      {
        date: "2024-01-07",
        region: "Northeast",
        product_category: "Electronics",
        revenue: 245000,
        units_sold: 1250,
        avg_order_value: 196.00,
        new_customers: 320,
        returning_customers: 930
      },
      {
        date: "2024-01-07",
        region: "West Coast",
        product_category: "Apparel",
        revenue: 180000,
        units_sold: 2400,
        avg_order_value: 75.00,
        new_customers: 480,
        returning_customers: 1920
      },
      {
        date: "2024-01-07",
        region: "Southeast",
        product_category: "Home & Garden",
        revenue: 125000,
        units_sold: 850,
        avg_order_value: 147.06,
        new_customers: 210,
        returning_customers: 640
      }
    ],
    usage: {
      modelsUsing: 5,
      lastUsed: "2024-01-21",
      totalDownloads: 32
    }
  },
  "3": {
    id: "3",
    name: "External Factors",
    description: "Weather, holidays, and economic indicators that may impact sales including temperature, precipitation, consumer confidence, and market events",
    size: "0.5 MB",
    format: "JSON",
    uploadedAt: "2024-01-13",
    status: "processing",
    rows: 1200,
    columns: 15,
    lastModified: "2024-01-13",
    uploadedBy: "Emma Rodriguez",
    tags: ["external", "weather", "economic", "holidays"],
    dataQuality: {
      completeness: 85,
      accuracy: 90,
      consistency: 88,
      validity: 92
    },
    schema: [
      { name: "date", type: "DATE", nullable: false, description: "Date of observation" },
      { name: "region", type: "STRING", nullable: false, description: "Geographic region" },
      { name: "temperature_avg", type: "DECIMAL", nullable: true, description: "Average temperature (°F)" },
      { name: "precipitation", type: "DECIMAL", nullable: true, description: "Precipitation (inches)" },
      { name: "is_holiday", type: "BOOLEAN", nullable: false, description: "Whether date is a holiday" },
      { name: "holiday_name", type: "STRING", nullable: true, description: "Name of holiday if applicable" },
      { name: "consumer_confidence", type: "DECIMAL", nullable: true, description: "Consumer confidence index" },
      { name: "unemployment_rate", type: "DECIMAL", nullable: true, description: "Regional unemployment rate" },
      { name: "gas_price", type: "DECIMAL", nullable: true, description: "Average gas price per gallon" },
      { name: "stock_market_close", type: "DECIMAL", nullable: true, description: "Stock market closing value" },
      { name: "season", type: "STRING", nullable: false, description: "Season (Spring, Summer, Fall, Winter)" },
      { name: "day_of_week", type: "STRING", nullable: false, description: "Day of the week" },
      { name: "week_of_year", type: "INTEGER", nullable: false, description: "Week number of the year" },
      { name: "major_event", type: "STRING", nullable: true, description: "Major events affecting market" },
      { name: "covid_restrictions", type: "STRING", nullable: true, description: "COVID-19 restriction level" }
    ],
    sampleData: [
      {
        date: "2024-01-07",
        region: "Northeast",
        temperature_avg: 32.5,
        precipitation: 0.2,
        is_holiday: false,
        holiday_name: null,
        consumer_confidence: 102.3,
        unemployment_rate: 3.8,
        gas_price: 3.45,
        stock_market_close: 4750.2,
        season: "Winter",
        day_of_week: "Sunday",
        week_of_year: 1,
        major_event: null,
        covid_restrictions: "None"
      }
    ],
    usage: {
      modelsUsing: 2,
      lastUsed: "2024-01-19",
      totalDownloads: 15
    }
  }
}

export default function DatasetDetailPage({ 
  params 
}: { 
  params: { projectSlug: string; datasetId: string } 
}) {
  const router = useRouter()
  const dataset = mockDatasets[params.datasetId]

  if (!dataset) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Database className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-400 mb-2">Dataset not found</h3>
          <p className="text-slate-500 mb-4">The requested dataset could not be found.</p>
          <Button 
            onClick={() => router.back()}
            variant="outline"
            className="border-slate-700 text-slate-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const projectName = params.projectSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-400/10 text-green-400 border-green-400/20"
      case "processing":
        return "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
      case "error":
        return "bg-red-400/10 text-red-400 border-red-400/20"
      default:
        return "bg-slate-400/10 text-slate-400 border-slate-400/20"
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case "csv":
        return <FileText className="h-5 w-5" />
      case "json":
        return <Database className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getQualityColor = (score: number) => {
    if (score >= 95) return "text-green-400"
    if (score >= 85) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/app/projects/${params.projectSlug}/datasets`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-slate-400 hover:text-cyan-300"
          >
            
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Datasets
            
          </Button>
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="border-slate-700 text-slate-300 hover:text-cyan-300 bg-transparent"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            className="border-slate-700 text-slate-300 hover:text-cyan-300 bg-transparent"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="border-red-700 text-red-400 hover:text-red-300 bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-900 border-red-500/20">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-400">Delete Dataset</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  Are you sure you want to delete "{dataset.name}"? This action cannot be undone and will affect {dataset.usage.modelsUsing} models currently using this dataset.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-slate-700 text-slate-300">Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Dataset Header */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          {getFormatIcon(dataset.format)}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">{dataset.name}</h1>
              <Badge className={`${getStatusColor(dataset.status)} flex-shrink-0`}>{dataset.status}</Badge>
            </div>
            <p className="text-slate-400 text-sm sm:text-base">{dataset.description}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
            <div className="text-xs text-slate-500 mb-1">Size</div>
            <div className="text-sm font-medium text-white">{dataset.size}</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
            <div className="text-xs text-slate-500 mb-1">Rows</div>
            <div className="text-sm font-medium text-white">{dataset.rows.toLocaleString()}</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
            <div className="text-xs text-slate-500 mb-1">Columns</div>
            <div className="text-sm font-medium text-white">{dataset.columns}</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
            <div className="text-xs text-slate-500 mb-1">Format</div>
            <div className="text-sm font-medium text-white">{dataset.format}</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
            <div className="text-xs text-slate-500 mb-1">Models Using</div>
            <div className="text-sm font-medium text-cyan-400">{dataset.usage.modelsUsing}</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
            <div className="text-xs text-slate-500 mb-1">Downloads</div>
            <div className="text-sm font-medium text-white">{dataset.usage.totalDownloads}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-900 border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-slate-800">Overview</TabsTrigger>
          <TabsTrigger value="schema" className="data-[state=active]:bg-slate-800">Schema</TabsTrigger>
          <TabsTrigger value="preview" className="data-[state=active]:bg-slate-800">Data Preview</TabsTrigger>
          <TabsTrigger value="quality" className="data-[state=active]:bg-slate-800">Data Quality</TabsTrigger>
          <TabsTrigger value="usage" className="data-[state=active]:bg-slate-800">Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dataset Information */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Dataset Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-500 mb-1">Uploaded By</div>
                    <div className="text-white">{dataset.uploadedBy}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Upload Date</div>
                    <div className="text-white">{new Date(dataset.uploadedAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Last Modified</div>
                    <div className="text-white">{new Date(dataset.lastModified).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Last Used</div>
                    <div className="text-white">{new Date(dataset.usage.lastUsed).toLocaleDateString()}</div>
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {dataset.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-slate-800 text-slate-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Statistics */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Usage Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Models Using Dataset</span>
                    <span className="text-cyan-400 font-medium">{dataset.usage.modelsUsing}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total Downloads</span>
                    <span className="text-white font-medium">{dataset.usage.totalDownloads}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Data Completeness</span>
                    <span className={`font-medium ${getQualityColor(dataset.dataQuality.completeness)}`}>
                      {dataset.dataQuality.completeness}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schema" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Table className="h-5 w-5" />
                Schema ({dataset.columns} columns)
              </CardTitle>
              <CardDescription className="text-slate-400">
                Data structure and column definitions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <UITable>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Column Name</TableHead>
                      <TableHead className="text-slate-300">Type</TableHead>
                      <TableHead className="text-slate-300">Nullable</TableHead>
                      <TableHead className="text-slate-300">Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataset.schema.map((column, index) => (
                      <TableRow key={index} className="border-slate-700">
                        <TableCell className="text-white font-medium">{column.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {column.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {column.nullable ? (
                            <Badge variant="outline" className="border-yellow-600 text-yellow-400">
                              Yes
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-green-600 text-green-400">
                              No
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-400 text-sm">{column.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </UITable>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Table className="h-5 w-5" />
                Data Preview
              </CardTitle>
              <CardDescription className="text-slate-400">
                Sample rows from the dataset
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <UITable>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      {dataset.schema.slice(0, 6).map((column) => (
                        <TableHead key={column.name} className="text-slate-300">
                          {column.name}
                        </TableHead>
                      ))}
                      {dataset.schema.length > 6 && (
                        <TableHead className="text-slate-300">...</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataset.sampleData.map((row, index) => (
                      <TableRow key={index} className="border-slate-700">
                        {dataset.schema.slice(0, 6).map((column) => (
                          <TableCell key={column.name} className="text-slate-300 text-sm">
                            {row[column.name] !== null && row[column.name] !== undefined 
                              ? String(row[column.name]) 
                              : <span className="text-slate-500 italic">null</span>
                            }
                          </TableCell>
                        ))}
                        {dataset.schema.length > 6 && (
                          <TableCell className="text-slate-500">...</TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </UITable>
              </div>
              {dataset.sampleData.length > 0 && (
                <div className="mt-4 text-sm text-slate-500">
                  Showing {dataset.sampleData.length} sample rows of {dataset.rows.toLocaleString()} total rows
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(dataset.dataQuality).map(([metric, score]) => (
              <Card key={metric} className="bg-slate-900/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg capitalize flex items-center justify-between">
                    {metric.replace(/([A-Z])/g, ' $1').trim()}
                    <span className={`text-2xl font-bold ${getQualityColor(score)}`}>
                      {score}%
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress 
                    value={score} 
                    className="h-2"
                  />
                  <div className="mt-2 text-sm text-slate-400">
                    {score >= 95 && "Excellent"}
                    {score >= 85 && score < 95 && "Good"}
                    {score < 85 && "Needs Improvement"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                Models Using This Dataset
              </CardTitle>
              <CardDescription className="text-slate-400">
                {dataset.usage.modelsUsing} models are currently using this dataset
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Mock model usage data */}
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Brand Attribution Model v2.1</div>
                    <div className="text-slate-400 text-sm">Last trained: 2 days ago</div>
                  </div>
                  <Badge className="bg-green-400/10 text-green-400 border-green-400/20">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Media Mix Model Q1 2024</div>
                    <div className="text-slate-400 text-sm">Last trained: 1 week ago</div>
                  </div>
                  <Badge className="bg-green-400/10 text-green-400 border-green-400/20">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Experimental ROI Model</div>
                    <div className="text-slate-400 text-sm">Last trained: 3 weeks ago</div>
                  </div>
                  <Badge className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20">Training</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
