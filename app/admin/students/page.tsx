"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Search } from "lucide-react"
import type { Student } from "@/types"

// Mock data for students
const mockStudents = [
  {
    id: "1",
    studentId: "S12345678",
    name: "John Doe",
    email: "john.doe@example.com",
    major: "Computer Science",
    year: "Junior",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  {
    id: "2",
    studentId: "S23456789",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    major: "Business Administration",
    year: "Senior",
    createdAt: new Date("2023-02-20"),
    updatedAt: new Date("2023-02-20"),
  },
  {
    id: "3",
    studentId: "S34567890",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    major: "Electrical Engineering",
    year: "Sophomore",
    createdAt: new Date("2023-03-10"),
    updatedAt: new Date("2023-03-10"),
  },
]

export default function StudentsPage() {
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true)

      try {
        // In a real app, you would fetch data from the API
        // For now, we'll use mock data
        setTimeout(() => {
          setStudents(mockStudents)
          setIsLoading(false)
        }, 500)
      } catch (error) {
        console.error("Error fetching students:", error)
        toast({
          title: "Error",
          description: "Failed to load students.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchStudents()
  }, [toast])

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.email && student.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (student.major && student.major.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Students</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Directory</CardTitle>
          <CardDescription>View and search for students in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, name, email, or major..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="ml-2" disabled={isLoading}>
              {isLoading ? "Loading..." : "Search"}
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Major</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Registered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.studentId}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email || "N/A"}</TableCell>
                    <TableCell>{student.major || "N/A"}</TableCell>
                    <TableCell>{student.year || "N/A"}</TableCell>
                    <TableCell>{student.createdAt.toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
                {filteredStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      {searchQuery ? "No students found matching your search." : "No students found."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
