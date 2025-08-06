"use client"

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
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import { Trash2 } from "lucide-react"

import { ApiKey } from "@/types/api-keys.types";

import { deleteApiKey } from "@/actions/app/api-keys";

export const DeleteApiKeyAlert = ({ apiKey, userId }: { apiKey: ApiKey; userId: string }) => {

    const handleDeleteApiKey = async () => {
        try {
            await deleteApiKey(apiKey.id, userId)
            toast.success("The API key has been permanently deleted")
        } catch (error) {
            toast.error("Failed to delete the API key")
            console.error("Error deleting API key:", error)
        }
    }

    return (
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
                        onClick={() => handleDeleteApiKey()}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Delete API Key
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}