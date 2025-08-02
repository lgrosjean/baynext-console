import { AlertTriangle, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DevModeNotice() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 p-4">
      <Card className="w-full max-w-2xl bg-slate-900/50 border-yellow-500/20 backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-yellow-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-yellow-400">Development Mode</CardTitle>
          <CardDescription className="text-slate-400">
            Supabase authentication is not configured. The app is running in development mode.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">To enable authentication:</h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-300">
              <li>Create a Supabase project at supabase.com</li>
              <li>Add your Supabase URL and Anon Key to your environment variables:</li>
            </ol>
            <div className="mt-4 bg-slate-900 border border-slate-600 rounded p-3 font-mono text-sm text-green-400">
              <div>NEXT_PUBLIC_SUPABASE_URL=your_supabase_url</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key</div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              asChild
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            >
              <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Supabase Dashboard
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
            >
              <a href="/projects">Continue in Dev Mode</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
