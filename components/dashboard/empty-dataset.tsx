import { Upload, Plus } from "lucide-react"

import { NewDatasetDialog } from "./new-dataset-dialog"

export const EmptyDataset = () => (
    <div className="text-center py-12">
          <Upload className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-400 mb-2">No datasets yet</h3>
          <p className="text-slate-500 mb-4">Upload your first dataset to get started with MMM modeling</p>
          <NewDatasetDialog />
        </div>
)