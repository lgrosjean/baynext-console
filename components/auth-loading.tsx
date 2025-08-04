import { Zap } from "lucide-react"

export default function Loading() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      <div className="text-center">
        <div className="relative mb-4">
          <Zap className="h-16 w-16 text-cyan-400 mx-auto animate-pulse" />
          <div className="absolute inset-0 h-16 w-16 text-cyan-400 animate-ping opacity-20 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Loading BayNext...
        </h2>
        <p className="text-slate-400 mt-2">Initializing your MMM platform</p>
      </div>
    </div>
  )
}
