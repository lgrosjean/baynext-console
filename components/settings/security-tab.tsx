"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Shield, Key, Smartphone, AlertTriangle, Save, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SecurityTab() {
  const { toast } = useToast()

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: "24",
    loginNotifications: true,
    passwordLastChanged: "2024-01-15",
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [sessions] = useState([
    {
      id: "1",
      device: "Chrome on MacOS",
      location: "San Francisco, CA",
      lastActive: "2024-01-20T10:30:00Z",
      current: true,
    },
    {
      id: "2",
      device: "Safari on iPhone",
      location: "San Francisco, CA",
      lastActive: "2024-01-19T15:45:00Z",
      current: false,
    },
    {
      id: "3",
      device: "Chrome on Windows",
      location: "New York, NY",
      lastActive: "2024-01-18T09:15:00Z",
      current: false,
    },
  ])

  const handlePasswordChange = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      })
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      })
      return
    }

    // Here you would typically call your API to change the password
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully",
    })

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const handleSecuritySave = () => {
    toast({
      title: "Security Settings Updated",
      description: "Your security preferences have been saved",
    })
  }

  const revokeSession = (sessionId: string) => {
    toast({
      title: "Session Revoked",
      description: "The session has been terminated",
    })
  }

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] })
  }

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Key className="h-5 w-5 text-cyan-400" />
            Change Password
          </CardTitle>
          <CardDescription className="text-slate-400">Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-slate-300">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-slate-300"
                onClick={() => togglePasswordVisibility("current")}
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-slate-300">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-slate-300"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-slate-300">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-slate-300"
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="text-sm text-slate-500">
            Password last changed: {new Date(security.passwordLastChanged).toLocaleDateString()}
          </div>

          <Button onClick={handlePasswordChange} className="bg-gradient-to-r from-cyan-500 to-purple-500">
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-green-400" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription className="text-slate-400">Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">Enable 2FA</span>
                {security.twoFactorEnabled ? (
                  <Badge className="bg-green-400/10 text-green-400">Enabled</Badge>
                ) : (
                  <Badge className="bg-red-400/10 text-red-400">Disabled</Badge>
                )}
              </div>
              <p className="text-sm text-slate-500">
                {security.twoFactorEnabled
                  ? "Your account is protected with two-factor authentication"
                  : "Secure your account with an authenticator app"}
              </p>
            </div>
            <Switch
              checked={security.twoFactorEnabled}
              onCheckedChange={(checked) => setSecurity({ ...security, twoFactorEnabled: checked })}
            />
          </div>

          {!security.twoFactorEnabled && (
            <div className="p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="text-yellow-400 font-medium">Recommended Security Enhancement</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Enable two-factor authentication to significantly improve your account security.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-400" />
            Security Settings
          </CardTitle>
          <CardDescription className="text-slate-400">Configure additional security preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-slate-300">Login Notifications</Label>
              <p className="text-sm text-slate-500">Get notified when someone logs into your account</p>
            </div>
            <Switch
              checked={security.loginNotifications}
              onCheckedChange={(checked) => setSecurity({ ...security, loginNotifications: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Session Timeout</Label>
            <select
              value={security.sessionTimeout}
              onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
              className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white w-48"
            >
              <option value="1">1 hour</option>
              <option value="8">8 hours</option>
              <option value="24">24 hours</option>
              <option value="168">1 week</option>
              <option value="never">Never</option>
            </select>
            <p className="text-sm text-slate-500">Automatically log out after period of inactivity</p>
          </div>

          <Button onClick={handleSecuritySave} className="bg-gradient-to-r from-cyan-500 to-purple-500">
            <Save className="h-4 w-4 mr-2" />
            Save Security Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
