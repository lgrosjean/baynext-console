"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Plus, Copy, Trash2, Eye, EyeOff, Globe, Lock, Key } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ApiKey {
  id: string
  name: string
  key: string
  scope: "all" | "selected"
  selectedProjects: string[]
  expiresAt: string | null
  createdAt: string
  lastUsed: string | null
  isActive: boolean
}

interface Project {
  id: string
  name: string
}

export function ApiKeysTab() {
  const { toast } = useToast()

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Production API",
      key: "sk_live_1234567890abcdef1234567890abcdef",
      scope: "all",
      selectedProjects: [],
      expiresAt: null,
      createdAt: "2024-01-15",
      lastUsed: "2024-01-20",
      isActive: true,
    },
    {
      id: "2",
      name: "Development Key",
      key: "sk_test_abcdef1234567890abcdef1234567890",
      scope: "selected",
      selectedProjects: ["1", "2"],
      expiresAt: "2024-06-15",
      createdAt: "2024-01-10",
      lastUsed: "2024-01-19",
      isActive: true,
    },
    {
      id: "3",
      name: "Analytics Dashboard",
      key: "sk_live_fedcba0987654321fedcba0987654321",
      scope: "selected",
      selectedProjects: ["1"],
      expiresAt: "2024-03-15",
      createdAt: "2024-01-05",
      lastUsed: null,
      isActive: false,
    },
  ])

  const [projects] = useState<Project[]>([
    { id: "1", name: "Q4 Campaign Analysis" },
    { id: "2", name: "Brand Awareness Study" },
    { id: "3", name: "Multi-Channel Attribution" },
  ])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newApiKey, setNewApiKey] = useState({
    name: "",
    scope: "all" as "all" | "selected",
    selectedProjects: [] as string[],
    expiresAt: "" as string,
  })
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())

  const generateApiKey = () => {
    const prefix = "sk_live_"
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
    let result = prefix
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const handleCreateApiKey = () => {
    if (!newApiKey.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the API key",
        variant: "destructive",
      })
      return
    }

    if (newApiKey.scope === "selected" && newApiKey.selectedProjects.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one project",
        variant: "destructive",
      })
      return
    }

    const apiKey: ApiKey = {
      id: Date.now().toString(),
      name: newApiKey.name,
      key: generateApiKey(),
      scope: newApiKey.scope,
      selectedProjects: newApiKey.selectedProjects,
      expiresAt: newApiKey.expiresAt || null,
      createdAt: new Date().toISOString().split("T")[0],
      lastUsed: null,
      isActive: true,
    }

    setApiKeys([apiKey, ...apiKeys])
    setNewApiKey({
      name: "",
      scope: "all",
      selectedProjects: [],
      expiresAt: "",
    })
    setIsCreateDialogOpen(false)

    toast({
      title: "API Key Created",
      description: "Your new API key has been created successfully",
    })
  }

  const handleDeleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id))
    toast({
      title: "API Key Deleted",
      description: "The API key has been permanently deleted",
    })
  }

  const toggleKeyVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys)
    if (newVisible.has(id)) {
      newVisible.delete(id)
    } else {
      newVisible.add(id)
    }
    setVisibleKeys(newVisible)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    })
  }

  const toggleApiKeyStatus = (id: string) => {
    setApiKeys(apiKeys.map((key) => (key.id === id ? { ...key, isActive: !key.isActive } : key)))
  }

  const maskApiKey = (key: string) => {
    if (key.length <= 12) return key
    return key.substring(0, 12) + "•".repeat(key.length - 16) + key.substring(key.length - 4)
  }

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  const getStatusBadge = (apiKey: ApiKey) => {
    if (!apiKey.isActive) {
      return <Badge className="bg-slate-400/10 text-slate-400">Inactive</Badge>
    }
    if (isExpired(apiKey.expiresAt)) {
      return <Badge className="bg-red-400/10 text-red-400">Expired</Badge>
    }
    return <Badge className="bg-green-400/10 text-green-400">Active</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">API Keys</CardTitle>
              <CardDescription className="text-slate-400">
                Manage API keys for programmatic access to your MMM data and models
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                          id="all-projects"
                          checked={newApiKey.scope === "all"}
                          onCheckedChange={(checked) =>
                            setNewApiKey({
                              ...newApiKey,
                              scope: checked ? "all" : "selected",
                              selectedProjects: checked ? [] : newApiKey.selectedProjects,
                            })
                          }
                        />
                        <Label htmlFor="all-projects" className="text-slate-300 flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          All Projects (Full Access)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="selected-projects"
                          checked={newApiKey.scope === "selected"}
                          onCheckedChange={(checked) =>
                            setNewApiKey({
                              ...newApiKey,
                              scope: checked ? "selected" : "all",
                              selectedProjects: checked ? newApiKey.selectedProjects : [],
                            })
                          }
                        />
                        <Label htmlFor="selected-projects" className="text-slate-300 flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Selected Projects Only
                        </Label>
                      </div>
                    </div>

                    {newApiKey.scope === "selected" && (
                      <div className="ml-6 space-y-2">
                        <Label className="text-slate-300 text-sm">Select Projects:</Label>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {projects.map((project) => (
                            <div key={project.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`project-${project.id}`}
                                checked={newApiKey.selectedProjects.includes(project.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setNewApiKey({
                                      ...newApiKey,
                                      selectedProjects: [...newApiKey.selectedProjects, project.id],
                                    })
                                  } else {
                                    setNewApiKey({
                                      ...newApiKey,
                                      selectedProjects: newApiKey.selectedProjects.filter((id) => id !== project.id),
                                    })
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
                    <Input
                      id="expires-at"
                      type="date"
                      value={newApiKey.expiresAt}
                      onChange={(e) => setNewApiKey({ ...newApiKey, expiresAt: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white"
                      min={new Date().toISOString().split("T")[0]}
                    />
                    <p className="text-xs text-slate-500">Leave empty for no expiration</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
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
          </div>
        </CardHeader>
      </Card>

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <Card key={apiKey.id} className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-white text-lg">{apiKey.name}</CardTitle>
                    {getStatusBadge(apiKey)}
                    {apiKey.scope === "all" ? (
                      <Badge className="bg-blue-400/10 text-blue-400 border-blue-400/20">
                        <Globe className="h-3 w-3 mr-1" />
                        All Projects
                      </Badge>
                    ) : (
                      <Badge className="bg-purple-400/10 text-purple-400 border-purple-400/20">
                        <Lock className="h-3 w-3 mr-1" />
                        {apiKey.selectedProjects.length} Project{apiKey.selectedProjects.length !== 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-slate-400">
                    Created {new Date(apiKey.createdAt).toLocaleDateString()}
                    {apiKey.lastUsed && ` • Last used ${new Date(apiKey.lastUsed).toLocaleDateString()}`}
                    {apiKey.expiresAt && (
                      <>
                        {" • "}
                        <span className={isExpired(apiKey.expiresAt) ? "text-red-400" : "text-slate-400"}>
                          {isExpired(apiKey.expiresAt) ? "Expired" : "Expires"}{" "}
                          {new Date(apiKey.expiresAt).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleApiKeyStatus(apiKey.id)}
                    className={`border-slate-700 ${
                      apiKey.isActive ? "text-yellow-400 hover:text-yellow-300" : "text-green-400 hover:text-green-300"
                    } bg-transparent`}
                  >
                    {apiKey.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-700 text-red-400 hover:text-red-300 bg-transparent"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-900 border-red-500/20">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-400">Delete API Key</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                          Are you sure you want to delete "{apiKey.name}"? This action cannot be undone and will
                          immediately revoke access for any applications using this key.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-slate-700 text-slate-300">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteApiKey(apiKey.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete API Key
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* API Key Display */}
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">API Key</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 font-mono text-sm">
                      <span className="text-slate-300">
                        {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                      className="border-slate-700 text-slate-300 bg-transparent"
                    >
                      {visibleKeys.has(apiKey.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(apiKey.key)}
                      className="border-slate-700 text-slate-300 bg-transparent"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Project Access Details */}
                {apiKey.scope === "selected" && apiKey.selectedProjects.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm">Accessible Projects</Label>
                    <div className="flex flex-wrap gap-2">
                      {apiKey.selectedProjects.map((projectId) => {
                        const project = projects.find((p) => p.id === projectId)
                        return (
                          <Badge key={projectId} className="bg-slate-800 text-slate-300 border-slate-600">
                            {project?.name || `Project ${projectId}`}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {apiKeys.length === 0 && (
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="text-center py-12">
              <Key className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">No API Keys</h3>
              <p className="text-slate-400 mb-4">Create your first API key to start accessing the BayNext API</p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-cyan-500 to-purple-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create API Key
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* API Documentation */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">API Documentation</CardTitle>
          <CardDescription className="text-slate-400">
            Learn how to use your API keys to access BayNext programmatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <h4 className="font-semibold text-cyan-400 mb-2">Authentication</h4>
              <p className="text-sm text-slate-400 mb-3">Include your API key in the Authorization header:</p>
              <div className="bg-slate-900 border border-slate-600 rounded p-3 font-mono text-xs text-green-400">
                Authorization: Bearer sk_live_your_api_key
              </div>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <h4 className="font-semibold text-purple-400 mb-2">Base URL</h4>
              <p className="text-sm text-slate-400 mb-3">All API requests should be made to:</p>
              <div className="bg-slate-900 border border-slate-600 rounded p-3 font-mono text-xs text-cyan-400">
                https://api.baynext.com/v1/
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-700 text-slate-300 bg-transparent">
              View Full Documentation
            </Button>
            <Button variant="outline" className="border-slate-700 text-slate-300 bg-transparent">
              API Reference
            </Button>
            <Button variant="outline" className="border-slate-700 text-slate-300 bg-transparent">
              Code Examples
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
