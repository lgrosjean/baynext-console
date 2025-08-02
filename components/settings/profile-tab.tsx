"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Save } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export function ProfileTab() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [profile, setProfile] = useState({
    fullName: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    company: "",
    jobTitle: "",
    bio: "",
    timezone: "UTC",
    language: "en",
  })

  const handleSave = () => {
    // Here you would typically save to your backend
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    })
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Profile Information</CardTitle>
          <CardDescription className="text-slate-400">Update your personal information and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xl">
                  {profile.fullName?.charAt(0) || user?.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-cyan-500 hover:bg-cyan-600"
              >
                <Camera className="h-3 w-3" />
              </Button>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{profile.fullName || "User"}</h3>
              <p className="text-slate-400">{profile.email}</p>
              <Button variant="outline" size="sm" className="mt-2 border-slate-700 text-slate-300 bg-transparent">
                Change Avatar
              </Button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-slate-300">
                Full Name
              </Label>
              <Input
                id="fullName"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
                disabled
              />
              <p className="text-xs text-slate-500">Email cannot be changed here</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-slate-300">
                Company
              </Label>
              <Input
                id="company"
                value={profile.company}
                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Your company name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-slate-300">
                Job Title
              </Label>
              <Input
                id="jobTitle"
                value={profile.jobTitle}
                onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Your job title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone" className="text-slate-300">
                Timezone
              </Label>
              <Select value={profile.timezone} onValueChange={(value) => setProfile({ ...profile, timezone: value })}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Europe/Paris">Paris</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="text-slate-300">
                Language
              </Label>
              <Select value={profile.language} onValueChange={(value) => setProfile({ ...profile, language: value })}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-slate-300">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} className="bg-gradient-to-r from-cyan-500 to-purple-500">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
