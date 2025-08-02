"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Mail, Smartphone, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function NotificationsTab() {
  const { toast } = useToast()

  const [notifications, setNotifications] = useState({
    email: {
      modelTraining: true,
      optimizationComplete: true,
      weeklyReports: false,
      systemUpdates: true,
      securityAlerts: true,
    },
    push: {
      modelTraining: false,
      optimizationComplete: true,
      weeklyReports: false,
      systemUpdates: false,
      securityAlerts: true,
    },
    frequency: "immediate",
    quietHours: {
      enabled: true,
      start: "22:00",
      end: "08:00",
    },
  })

  const handleSave = () => {
    toast({
      title: "Notifications Updated",
      description: "Your notification preferences have been saved",
    })
  }

  const updateEmailNotification = (key: string, value: boolean) => {
    setNotifications({
      ...notifications,
      email: { ...notifications.email, [key]: value },
    })
  }

  const updatePushNotification = (key: string, value: boolean) => {
    setNotifications({
      ...notifications,
      push: { ...notifications.push, [key]: value },
    })
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Notification Preferences</CardTitle>
          <CardDescription className="text-slate-400">
            Choose how and when you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">Email Notifications</h3>
            </div>

            <div className="space-y-4 ml-7">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-300">Model Training Complete</Label>
                  <p className="text-sm text-slate-500">Get notified when your models finish training</p>
                </div>
                <Switch
                  checked={notifications.email.modelTraining}
                  onCheckedChange={(checked) => updateEmailNotification("modelTraining", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-300">Optimization Complete</Label>
                  <p className="text-sm text-slate-500">Notifications for completed budget optimizations</p>
                </div>
                <Switch
                  checked={notifications.email.optimizationComplete}
                  onCheckedChange={(checked) => updateEmailNotification("optimizationComplete", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-300">Weekly Reports</Label>
                  <p className="text-sm text-slate-500">Weekly summary of your MMM performance</p>
                </div>
                <Switch
                  checked={notifications.email.weeklyReports}
                  onCheckedChange={(checked) => updateEmailNotification("weeklyReports", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-300">System Updates</Label>
                  <p className="text-sm text-slate-500">Platform updates and new features</p>
                </div>
                <Switch
                  checked={notifications.email.systemUpdates}
                  onCheckedChange={(checked) => updateEmailNotification("systemUpdates", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-300">Security Alerts</Label>
                  <p className="text-sm text-slate-500">Important security notifications</p>
                </div>
                <Switch
                  checked={notifications.email.securityAlerts}
                  onCheckedChange={(checked) => updateEmailNotification("securityAlerts", checked)}
                />
              </div>
            </div>
          </div>

          {/* Push Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Push Notifications</h3>
            </div>

            <div className="space-y-4 ml-7">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-300">Model Training Complete</Label>
                  <p className="text-sm text-slate-500">Browser notifications for training completion</p>
                </div>
                <Switch
                  checked={notifications.push.modelTraining}
                  onCheckedChange={(checked) => updatePushNotification("modelTraining", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-300">Optimization Complete</Label>
                  <p className="text-sm text-slate-500">Instant notifications for optimization results</p>
                </div>
                <Switch
                  checked={notifications.push.optimizationComplete}
                  onCheckedChange={(checked) => updatePushNotification("optimizationComplete", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-300">Security Alerts</Label>
                  <p className="text-sm text-slate-500">Critical security notifications</p>
                </div>
                <Switch
                  checked={notifications.push.securityAlerts}
                  onCheckedChange={(checked) => updatePushNotification("securityAlerts", checked)}
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Notification Settings</h3>
            </div>

            <div className="space-y-4 ml-7">
              <div className="space-y-2">
                <Label className="text-slate-300">Notification Frequency</Label>
                <Select
                  value={notifications.frequency}
                  onValueChange={(value) => setNotifications({ ...notifications, frequency: value })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="hourly">Hourly Digest</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Digest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-300">Quiet Hours</Label>
                    <p className="text-sm text-slate-500">Pause notifications during specified hours</p>
                  </div>
                  <Switch
                    checked={notifications.quietHours.enabled}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        quietHours: { ...notifications.quietHours, enabled: checked },
                      })
                    }
                  />
                </div>

                {notifications.quietHours.enabled && (
                  <div className="flex items-center gap-4 ml-4">
                    <div className="space-y-1">
                      <Label className="text-slate-400 text-sm">From</Label>
                      <input
                        type="time"
                        value={notifications.quietHours.start}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            quietHours: { ...notifications.quietHours, start: e.target.value },
                          })
                        }
                        className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-slate-400 text-sm">To</Label>
                      <input
                        type="time"
                        value={notifications.quietHours.end}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            quietHours: { ...notifications.quietHours, end: e.target.value },
                          })
                        }
                        className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} className="bg-gradient-to-r from-cyan-500 to-purple-500">
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
