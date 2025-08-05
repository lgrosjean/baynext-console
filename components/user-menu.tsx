"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

import { LogOut, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserMenu() {
    const { user, signOut } = useAuth()

    return (
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 h-8 sm:h-10 px-2 sm:px-3"
                    >
                        <Avatar className="h-5 w-5 sm:h-6 sm:w-6 mr-1 sm:mr-2">
                            <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs">
                                {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:inline truncate max-w-24 md:max-w-none">
                            {user?.user_metadata?.full_name || user?.email}
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700">
                    <DropdownMenuItem asChild className="text-slate-300 focus:bg-slate-800 focus:text-cyan-300">
                        <Link href="/app/settings">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuItem onClick={signOut} className="text-red-400 focus:bg-red-500/10 focus:text-red-300">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}