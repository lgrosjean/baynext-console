"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Checkbox } from "@/components/ui/checkbox"
import { Globe, Lock, Plus } from "lucide-react"

import { toast } from "sonner"
import { createApiKey } from "@/actions/app/api-keys"
import { getUserProjects } from "@/actions/app/projects"
import { Project } from "@/types/project"
import { ApiKey, ApiKeyCreate } from "@/types/api-keys.types"

const generateApiKey = () => {
  const prefix = "bn_key_"
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let key = prefix
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  const start = key.substring(0, 12)
  return { key, start }
}

type ExpirationValue = "empty" | "1month" | "6months" | "1year"

export const NewApiKeyDialog = ({ userId }: { userId: string }) => {

  const [isOpened, setIsOpened] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [scope, setScope] = useState<"all" | "selected">("all")
  const [selectedProjects, setSelectedProjects] = useState<string[] | null>(null)
  const [expiresAt, setExpiresAt] = useState<ExpirationValue>("empty")

  const [newApiKey, setNewApiKey] = useState({
    name: "",
    expiresAt: "empty",
    selectedProjects: null,
  })

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await getUserProjects(userId)
        if (!projects) {
          setProjects([])
        }
        else setProjects(projects)
      } catch (error) {
        console.error("Error fetching projects:", error)
        toast.error("Failed to load projects")
      }
    }

    fetchProjects()
  }, [userId])

  const handleCreateApiKey = async () => {
    if (!newApiKey.name.trim()) {
      toast.error("Please enter a name for the API key")
      return
    }

    const { key, start } = generateApiKey()

    const expirationMap: Record<ExpirationValue, Date | null> = {
      empty: null,
      "1month": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      "6months": new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      "1year": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    }

    const apiKey: ApiKeyCreate = {
      userId: userId,
      name: newApiKey.name,
      start: start,
      key: key,
      permissions: selectedProjects && selectedProjects.join(","),
      expiresAt: expirationMap[expiresAt],
    }

    try {
      await createApiKey(apiKey, userId)
      setIsOpened(false)
      toast.success("Your new API key has been created successfully")
    }
    catch (error) {
      console.error("Error creating API key:", error)
      toast.error("Failed to create API key")
    }
  }

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          Create API Key
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-cyan-500/20 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-cyan-400">Create New API Key</DialogTitle>
          <DialogDescription className="text-slate-400">
            Configure access permissions and expiration for your new API key
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="key-name" className="text-slate-300">
              API Key Name
            </Label>
            <Input
              id="key-name"
              value={newApiKey.name}
              onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="e.g., Production API, Analytics Dashboard"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-slate-300">Project Access</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all"
                  checked={scope === "all"}
                  onCheckedChange={(checked) =>
                    setScope(checked ? "all" : "selected")
                  }
                />
                <Label htmlFor="all-projects" className="text-slate-300 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  All Projects (Full Access)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="selected"
                  checked={scope === "selected"}
                  onCheckedChange={(checked) =>
                    setScope(checked ? "selected" : "all")
                  }
                />
                <Label htmlFor="selected-projects" className="text-slate-300 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Selected Projects Only
                </Label>
              </div>
            </div>

            {scope === "selected" && (
              <div className="ml-6 space-y-2">
                <Label className="text-slate-300 text-sm">Select Projects:</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`project-${project.id}`}
                        checked={selectedProjects?.includes(project.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            if (selectedProjects) {
                              setSelectedProjects([...selectedProjects, project.id])
                            }
                            else {
                              setSelectedProjects([project.id])
                            }
                          } else {
                            setSelectedProjects(selectedProjects?.filter((id) => id !== project.id) || null)
                          }
                        }}
                      />
                      <Label htmlFor={`project-${project.id}`} className="text-slate-400 text-sm">
                        {project.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expires-at" className="text-slate-300">
              Expiration Date (Optional)
            </Label>
            <Select
              value={expiresAt}
              onValueChange={(value) => setExpiresAt(value as ExpirationValue)}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select expiration period" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="empty" className="text-slate-300">No expiration</SelectItem>
                <SelectItem value="1month" className="text-slate-300">1 month</SelectItem>
                <SelectItem value="6months" className="text-slate-300">6 months</SelectItem>
                <SelectItem value="1year" className="text-slate-300">1 year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpened(false)}
            className="border-slate-700 text-slate-300"
          >
            Cancel
          </Button>
          <Button onClick={handleCreateApiKey} className="bg-gradient-to-r from-cyan-500 to-purple-500">
            Create API Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}