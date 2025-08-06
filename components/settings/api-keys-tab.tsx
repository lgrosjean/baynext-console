import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import {Key } from "lucide-react"

import { getUser } from "@/actions/app/auth"
import { getApiKeys } from "@/actions/app/api-keys"

import { NewApiKeyDialog } from "./new-api-key-dialog"
import { ApiKeyCard } from "./api-key-card"

export async function ApiKeysTab() {

  const user = await getUser()
  const apiKeys = await getApiKeys(user.id)
  
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
            {apiKeys.length > 0 && (<NewApiKeyDialog userId={user.id} />)}
          </div>
        </CardHeader>
      </Card>

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <ApiKeyCard key={apiKey.id}apiKey={apiKey} userId={user.id} />
        ))}

        {apiKeys.length === 0 && (
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="text-center py-12">
              <Key className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">No API Keys</h3>
              <p className="text-slate-400 mb-4">Create your first API key to start accessing the BayNext API</p>
              <NewApiKeyDialog userId={user.id} />
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
              <Link href="https://baynext.mintlify.app/" target="_blank">
                View Full Documentation
              </Link>
            </Button>
            <Button variant="outline" className="border-slate-700 text-slate-300 bg-transparent">
              <Link href="https://baynext.mintlify.app/api-reference/" target="_blank">
                API Reference
              </Link>
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
