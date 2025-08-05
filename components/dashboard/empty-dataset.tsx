import { Upload, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export const EmptyDataset = ({ setIsDialogOpen } ) => (
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
)