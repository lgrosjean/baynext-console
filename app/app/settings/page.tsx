import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Key, Bell, Shield } from "lucide-react"
import { ApiKeysTab } from "@/components/settings/api-keys-tab"
import { ProfileTab } from "@/components/settings/profile-tab"
import { NotificationsTab } from "@/components/settings/notifications-tab"
import { SecurityTab } from "@/components/settings/security-tab"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1>Settings</h1>
        <p className="text-slate-400 mt-2">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-slate-800/50 border-slate-700">
          <TabsTrigger value="profile" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="api-keys"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
          >
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </TabsTrigger>
          {/* <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
          >
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>

        <TabsContent value="api-keys">
          <ApiKeysTab />
        </TabsContent>

        {/* <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab />
        </TabsContent> */}
      </Tabs>
    </div>
  )
}
