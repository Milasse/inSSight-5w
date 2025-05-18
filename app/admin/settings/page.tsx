"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"

export default function SettingsPage() {
  const { data: session } = useSession()
  const { toast } = useToast()

  // Profile settings
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Email settings
  const [sendEventReminders, setSendEventReminders] = useState(true)
  const [sendFeedbackRequests, setSendFeedbackRequests] = useState(true)
  const [sendReports, setSendReports] = useState(true)

  // System settings
  const [siteTitle, setSiteTitle] = useState("inSSIght - SSI Platform")
  const [feedbackEnabled, setFeedbackEnabled] = useState(true)
  const [autoActivateEvents, setAutoActivateEvents] = useState(false)

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation password must match.",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would update the profile via API
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    })

    // Reset form
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleEmailSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would update the email settings via API
    toast({
      title: "Email settings updated",
      description: "Your email settings have been updated successfully.",
    })
  }

  const handleSystemSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would update the system settings via API
    toast({
      title: "System settings updated",
      description: "System settings have been updated successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          {session?.user.role === "admin" && <TabsTrigger value="system">System</TabsTrigger>}
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your account settings</CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={session?.user.email || "admin@example.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure email notifications</CardDescription>
            </CardHeader>
            <form onSubmit={handleEmailSettingsSubmit}>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Event Reminders</p>
                    <p className="text-sm text-muted-foreground">Receive email reminders before events</p>
                  </div>
                  <Switch checked={sendEventReminders} onCheckedChange={setSendEventReminders} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Feedback Requests</p>
                    <p className="text-sm text-muted-foreground">
                      Send feedback request emails to students after events
                    </p>
                  </div>
                  <Switch checked={sendFeedbackRequests} onCheckedChange={setSendFeedbackRequests} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Reports</p>
                    <p className="text-sm text-muted-foreground">Receive weekly and monthly reports via email</p>
                  </div>
                  <Switch checked={sendReports} onCheckedChange={setSendReports} />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {session?.user.role === "admin" && (
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system-wide settings</CardDescription>
              </CardHeader>
              <form onSubmit={handleSystemSettingsSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteTitle">Site Title</Label>
                    <Input id="siteTitle" value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Feedback System</p>
                      <p className="text-sm text-muted-foreground">Enable or disable the feedback collection system</p>
                    </div>
                    <Switch checked={feedbackEnabled} onCheckedChange={setFeedbackEnabled} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-activate Events</p>
                      <p className="text-sm text-muted-foreground">
                        Automatically activate events 1 hour before start time
                      </p>
                    </div>
                    <Switch checked={autoActivateEvents} onCheckedChange={setAutoActivateEvents} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Save Changes</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
