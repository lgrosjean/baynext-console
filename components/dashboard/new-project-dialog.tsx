"use client"

import { useState } from "react"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { ProjectCreate } from "@/types/project"
import { createProject } from "@/actions/app/projects"

export const NewProjectDialog = ({ userId } : { userId: string }) => {

    const [newProject, setNewProject] = useState({ name: "", description: "" })
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleCreateProject = async () => {
        if (newProject.name && newProject.description) {
            const project = {
                name: newProject.name,
                description: newProject.description,
                user_id: userId,
            }
            await createProject(project)
            // Optionally, you can refresh the project list or show a success message here
            setIsDialogOpen(false)
            // Reset the form
            setNewProject({ name: "", description: "" })
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-lg shadow-cyan-500/25 w-full sm:w-auto lg:px-6 lg:py-3 transition-colors">
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-cyan-500/20 mx-4 sm:mx-0 lg:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-cyan-400 lg:text-xl">Create New Project</DialogTitle>
                    <DialogDescription className="text-slate-400 lg:text-base">
                        Set up a new mix marketing model project
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 lg:space-y-6">
                    <div>
                        <Label htmlFor="name" className="text-slate-300 lg:text-base">
                            Project Name
                        </Label>
                        <Input
                            id="name"
                            value={newProject.name}
                            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                            className="bg-slate-800 border-slate-700 text-white lg:h-11"
                            placeholder="Enter project name"
                        />
                    </div>
                    <div>
                        <Label htmlFor="description" className="text-slate-300 lg:text-base">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            value={newProject.description}
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                            className="bg-slate-800 border-slate-700 text-white"
                            placeholder="Describe your project"
                            rows={3}
                        />
                    </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        className="border-slate-700 text-slate-300 w-full sm:w-auto lg:px-6"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateProject}
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 w-full sm:w-auto lg:px-6"
                    >
                        Create Project
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}