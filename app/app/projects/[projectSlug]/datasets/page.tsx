import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Download, Trash2, FileText, Database, Calendar , ArrowLeft} from "lucide-react"
import { getDatasets } from "@/actions/app/datasets"
import bytes from 'bytes';

import { EmptyDataset } from "@/components/dashboard/empty-dataset"
import { NewDatasetDialog } from "@/components/dashboard/new-dataset-dialog"

import MeridianDatasetCreator from "@/components/datasets/new-dataset-dialog"

export default async function DatasetsPage({ params }: { params: { projectSlug: string } }) {
  
  const projectSlug = (await params).projectSlug

  const datasets = await getDatasets()
  
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
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-6">
      <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white p-0"
            asChild
          >
            <a href={`/app/projects/${projectSlug}`} className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </a>
          </Button>
        </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div>
          <h1>Datasets</h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">Manage data sources for your project.</p>
        </div>

        <NewDatasetDialog />
        <MeridianDatasetCreator />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {datasets.map((dataset) => (
          <Link key={dataset.id} href={`/app/projects/${projectSlug}/datasets/${dataset.id}`}>
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
                  <span>{bytes(dataset.size)}</span>
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
          </Link>
        ))}
      </div>

      {datasets.length === 0 && (
          <EmptyDataset />
      )}
    </div>
  )
}
