import { SidebarHeader } from "@/components/ui/sidebar";
import { Zap } from "lucide-react";

export function HeaderSidebar() {
    return (
    <SidebarHeader className="border-b border-cyan-500/20 p-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Zap className="h-8 w-8 text-cyan-400" />
            <div className="absolute inset-0 h-8 w-8 text-cyan-400 animate-pulse opacity-50" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              BayNext
            </h1>
            <p className="text-xs text-slate-400">MMM Platform</p>
          </div>
        </div>
      </SidebarHeader>
    );
}