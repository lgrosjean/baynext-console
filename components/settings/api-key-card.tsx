"use client"

import { useState, useEffect, use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

import { Globe, Lock, Eye, EyeOff, Copy } from "lucide-react"

import { ApiKey } from "@/types/api-keys.types"
import { Project } from "@/types/project"

import { DeleteApiKeyAlert } from "./delete-api-key-alert"
import { updateApiKeyStatus } from "@/actions/app/api-keys"
import { getProjectById, getUserProjects } from "@/actions/app/projects"

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("API key copied to clipboard")
}

const maskApiKey = (key: string) => {
    return key.substring(0, 12) + "•".repeat(key.length - 12)
}

const getStatusBadge = (apiKey: ApiKey) => {
    if (!apiKey.enabled) {
        return <Badge className="bg-slate-400/10 text-slate-400">Inactive</Badge>
    }
    if (isExpired(apiKey)) {
        return <Badge className="bg-red-400/10 text-red-400">Expired</Badge>
    }
    return <Badge className="bg-green-400/10 text-green-400">Active</Badge>
}

const isExpired = (apiKey: ApiKey) => {
    if (!apiKey.expiresAt) return false
    return new Date(apiKey.expiresAt) < new Date()
}

export const ApiKeyCard = ({
    apiKey,
    userId
}: {
    apiKey: ApiKey,
    userId: string
}) => {

    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [projects, setProjects] = useState<Project[]>([])

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                if (apiKey.permissions) {
                    const projectIds = apiKey.permissions.split(",")
                    const projectPromises = projectIds.map(projectId => getProjectById({userId, projectId}))
                    const fetchedProjects = await Promise.all(projectPromises)
                    console.log("Fetched projects:", fetchedProjects)
                    setProjects(fetchedProjects.filter(p => p !== null) as Project[])
                }
            } catch (error) {
                console.error("Error fetching projects:", error)
                toast.error("Failed to fetch projects for this API key")
            }
        }
        fetchProjects()
    }, [apiKey, userId])

    const handleToggleApiKeyStatus = async () => {
        try {
            await updateApiKeyStatus(apiKey, userId)
            toast.success(`API key status updated to ${apiKey.enabled ? "active" : "inactive"}`)
        } catch (error) {
            toast.error("Failed to update API key status")
            console.error("Error updating API key status:", error)
        }
    }

    return (
        <Card key={apiKey.id} className="bg-slate-900/50 border-slate-700">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <CardTitle className="text-white text-lg">{apiKey.name}</CardTitle>
                            {getStatusBadge(apiKey)}
                            {!apiKey.permissions ? (
                                <Badge className="bg-blue-400/10 text-blue-400 border-blue-400/20">
                                    <Globe className="h-3 w-3 mr-1" />
                                    All Projects
                                </Badge>
                            ) : (
                                <Badge className="bg-purple-400/10 text-purple-400 border-purple-400/20">
                                    <Lock className="h-3 w-3 mr-1" />
                                    {projects.length} Project{projects.length !== 1 ? "s" : ""}
                                </Badge>
                            )}
                        </div>
                        <CardDescription className="text-slate-400">
                            Created {new Date(apiKey.createdAt).toLocaleDateString()}
                            {apiKey.lastUsed && ` • Last used ${new Date(apiKey.lastUsed).toLocaleDateString()}`}
                            {apiKey.expiresAt && (
                                <>
                                    {" • "}
                                    <span className={isExpired(apiKey) ? "text-red-400" : "text-slate-400"}>
                                        {isExpired(apiKey) ? "Expired" : "Expires"}{" "}
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
                            onClick={handleToggleApiKeyStatus}
                            className={`border-slate-700 ${apiKey.enabled ? "text-yellow-400 hover:text-yellow-300" : "text-green-400 hover:text-green-300"
                                } bg-transparent`}
                        >
                            {apiKey.enabled ? "Deactivate" : "Activate"}
                        </Button>
                        <DeleteApiKeyAlert apiKey={apiKey} userId={userId} />
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
                                    {isVisible ? apiKey.key : maskApiKey(apiKey.key)}
                                </span>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setIsVisible(!isVisible)}
                                className="border-slate-700 text-slate-300 bg-transparent"
                            >
                                {isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
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
                    {apiKey.permissions && (
                        <div className="space-y-2">
                            <Label className="text-slate-300 text-sm">Accessible Projects</Label>
                            <div className="flex flex-wrap gap-2">
                                {projects.map((project) => {
                                    return (
                                        <Badge key={project.id} className="bg-slate-800 text-slate-300 border-slate-600">
                                            {project.name || `Project ${project.id}`}
                                        </Badge>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}