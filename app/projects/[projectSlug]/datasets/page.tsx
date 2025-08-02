"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Upload, Edit, Download, Trash2, FileText, Database, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Dataset {
  id: string
  name: string
  description: string
  size: string
  format: string
  uploadedAt: string
  status: "ready" | "processing" | "error"
  rows?: number
  columns?: number
}

export default function DatasetsPage({ params }: { params: { projectSlug: string } }) {
  const [datasets, setDatasets] = useState<Dataset[]>([
    {
      id: "1",
      name: "Media Spend Data",
      description: "Historical media spend across all channels including TV, Digital, Radio, and Print advertising",
      size: "2.3 MB",
      format: "CSV",
      uploadedAt: "2024-01-15",
      status: "ready",
      rows: 52000,
      columns: 12,
    },
    {
      id: "2",
      name: "Sales Performance",
      description: "Weekly sales data with regional breakdown and product categories",
      size: "1.8 MB",
      format: "CSV",
      uploadedAt: "2024-01-14",
      status: "ready",
      rows: 2600,
      columns: 8,
    },
    {
      id: "3",
      name: "External Factors",
      description: "Weather, holidays, and economic indicators that may impact sales",
      size: "0.5 MB",
      format: "JSON",
      uploadedAt: "2024-01-13",
      status: "processing",
      rows: 1200,
      columns: 15,
    },
  ])

  const [newDataset, setNewDataset] = useState({ name: "", description: "", format: "CSV" })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const projectName = params.projectSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

  const handleCreateDataset = () => {
    if (newDataset.name && newDataset.description) {
      const dataset: Dataset = {
        id: Date.now().toString(),
        name: newDataset.name,
        description: newDataset.description,
        size: "0 MB",
        format: newDataset.format,
        uploadedAt: new Date().toISOString().split("T")[0],
        status: "processing",
      }
      setDatasets([dataset, ...datasets])
      setNewDataset({ name: "", description: "", format: "CSV" })
      setIsDialogOpen(false)
    }
  }

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
        return <FileText className="h-4 w-4" />
      case "json":
        return <Database className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Datasets
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">Manage data sources for {projectName}</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Dataset
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-cyan-500/20 mx-4 sm:mx-0">
            <DialogHeader>
              <DialogTitle className="text-cyan-400">Add New Dataset</DialogTitle>
              <DialogDescription className="text-slate-400">
                Upload a new dataset for your MMM project
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="dataset-name" className="text-slate-300">
                  Dataset Name
                </Label>
                <Input
                  id="dataset-name"
                  value={newDataset.name}
                  onChange={(e) => setNewDataset({ ...newDataset, name: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="Enter dataset name"
                />
              </div>
              <div>
                <Label htmlFor="dataset-description" className="text-slate-300">
                  Description
                </Label>
                <Textarea
                  id="dataset-description"
                  value={newDataset.description}
                  onChange={(e) => setNewDataset({ ...newDataset, description: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="Describe your dataset"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="dataset-format" className="text-slate-300">
                  Format
                </Label>
                <Select
                  value={newDataset.format}
                  onValueChange={(value) => setNewDataset({ ...newDataset, format: value })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="CSV">CSV</SelectItem>
                    <SelectItem value="JSON">JSON</SelectItem>
                    <SelectItem value="Excel">Excel</SelectItem>
                    <SelectItem value="Parquet">Parquet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-slate-700 text-slate-300 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateDataset}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 w-full sm:w-auto"
              >
                Add Dataset
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {datasets.map((dataset) => (
          <Card key={dataset.id} className="bg-slate-900/50 border-slate-700 hover:border-cyan-500/50 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {getFormatIcon(dataset.format)}
                  <CardTitle className="text-white text-base sm:text-lg truncate">{dataset.name}</CardTitle>
                </div>
                <Badge className={`${getStatusColor(dataset.status)} text-xs flex-shrink-0`}>{dataset.status}</Badge>
              </div>
              <CardDescription className="text-slate-400 text-sm line-clamp-2">{dataset.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <Database className="h-3 w-3" />
                  <span>{dataset.size}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(dataset.uploadedAt).toLocaleDateString()}</span>
                </div>
                {dataset.rows && <div className="text-xs text-slate-500">{dataset.rows.toLocaleString()} rows</div>}
                {dataset.columns && <div className="text-xs text-slate-500">{dataset.columns} columns</div>}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:text-cyan-300 bg-transparent flex-1 sm:flex-none"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:text-cyan-300 bg-transparent flex-1 sm:flex-none"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-700 text-red-400 hover:text-red-300 bg-transparent"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {datasets.length === 0 && (
        <div className="text-center py-12">
          <Upload className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-400 mb-2">No datasets yet</h3>
          <p className="text-slate-500 mb-4">Upload your first dataset to get started with MMM modeling</p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Dataset
          </Button>
        </div>
      )}
    </div>
  )
}
