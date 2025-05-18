"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function SignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const { toast } = useToast()

  // Student sign-in state
  const [studentId, setStudentId] = useState("")
  const [isStudentLoading, setIsStudentLoading] = useState(false)

  // Admin sign-in state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isAdminLoading, setIsAdminLoading] = useState(false)

  const handleStudentSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsStudentLoading(true)

    try {
      const result = await signIn("student-credentials", {
        studentId,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: "Sign in failed",
          description: result.error,
          variant: "destructive",
        })
      } else {
        router.push(callbackUrl)
      }
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsStudentLoading(false)
    }
  }

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdminLoading(true)

    try {
      const result = await signIn("admin-credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: "Sign in failed",
          description: result.error,
          variant: "destructive",
        })
      } else {
        router.push(callbackUrl)
      }
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsAdminLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In to inSSIght</CardTitle>
          <CardDescription>Student Success Initiative Platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <form onSubmit={handleStudentSignIn} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID (S#)</Label>
                  <Input
                    id="studentId"
                    placeholder="S12345678"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isStudentLoading}>
                  {isStudentLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={handleAdminSignIn} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isAdminLoading}>
                  {isAdminLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">inSSIght - Student Success Initiative</p>
        </CardFooter>
      </Card>
    </div>
  )
}
