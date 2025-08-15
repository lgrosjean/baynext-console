"use client"

import Link from "next/link"
import { useRouter} from "next/router"
import { useAuth } from "@/contexts/auth-context"

import { LogOut, Settings, ArrowUpRight, BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuLabel,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { User } from "@supabase/supabase-js"

export function UserMenu({ user }: { user: User | null }) {

    const {  signOut } = useAuth()

    if (!user) {
        const router = useRouter()
        router.push('/login')
        return null
    }

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
                    <DropdownMenuLabel>
                        <div className="flex flex-col">
                            <span className="font-medium">{user.email}</span>
                            <span className="font-light text-gray-500 text-sm">{user?.user_metadata?.full_name}</span>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuItem asChild className="text-slate-300 focus:bg-slate-800 focus:text-cyan-300">
                        <Link href="https://baynext.mintlify.app">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Documentation 
                            <ArrowUpRight className="h-4 w-4 ml-auto" />
                        </Link>
                    </DropdownMenuItem>
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