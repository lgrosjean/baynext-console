"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

import { Dataset } from "@/types/dataset"
import { createDataset } from "@/actions/app/datasets"

export const NewDatasetDialog = () => {

    const [isOpen, setIsOpen] = useState(false)
    const [newDataset, setNewDataset] = useState<Dataset>({
        id: "",
        name: "",
        description: "",
        size: 0,
        format: "CSV",
        uploadedAt: new Date().toISOString().split("T")[0],
        status: "processing",
      })

      const handleCreateDataset = () => {
      if (!newDataset.name || !newDataset.description) {
        alert("Please fill in all fields")
        return
      }

      createDataset(newDataset).then(() => {
        setIsOpen(false)
      })
  }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                onClick={() => setIsOpen(false)}
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
    )
}