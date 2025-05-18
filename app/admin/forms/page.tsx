"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Edit, GripVertical, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Mock data for field options
const mockFieldOptions = [
  {
    id: "1",
    fieldName: "event_type",
    value: "Workshop",
    isActive: true,
  },
  {
    id: "2",
    fieldName: "event_type",
    value: "Seminar",
    isActive: true,
  },
  {
    id: "3",
    fieldName: "event_type",
    value: "Career Fair",
    isActive: true,
  },
  {
    id: "4",
    fieldName: "location",
    value: "Student Center Room 101",
    isActive: true,
  },
  {
    id: "5",
    fieldName: "location",
    value: "Library Conference Room",
    isActive: true,
  },
  {
    id: "6",
    fieldName: "heard_via",
    value: "Email",
    isActive: true,
  },
  {
    id: "7",
    fieldName: "heard_via",
    value: "Social Media",
    isActive: true,
  },
]

export default function FormsPage() {
  const { toast } = useToast()
  const [fieldOptions, setFieldOptions] = useState(mockFieldOptions)
  const [fieldName, setFieldName] = useState("event_type")
  const [optionValue, setOptionValue] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingOptionId) {
      // Update existing option
      setFieldOptions(
        fieldOptions.map((option) =>
          option.id === editingOptionId
            ? {
                ...option,
                fieldName,
                value: optionValue,
                isActive,
              }
            : option,
        ),
      )

      toast({
        title: "Option updated",
        description: "The field option has been updated successfully.",
      })
    } else {
      // Create new option
      const newOption = {
        id: Date.now().toString(),
        fieldName,
        value: optionValue,
        isActive,
      }

      setFieldOptions([...fieldOptions, newOption])

      toast({
        title: "Option created",
        description: "The field option has been created successfully.",
      })
    }

    // Reset form
    resetForm()
  }

  const handleEdit = (option: (typeof mockFieldOptions)[0]) => {
    setEditingOptionId(option.id)
    setFieldName(option.fieldName)
    setOptionValue(option.value)
    setIsActive(option.isActive)
  }

  const handleDelete = (id: string) => {
    setFieldOptions(fieldOptions.filter((option) => option.id !== id))

    toast({
      title: "Option deleted",
      description: "The field option has been deleted successfully.",
    })
  }

  const resetForm = () => {
    setEditingOptionId(null)
    setFieldName("event_type")
    setOptionValue("")
    setIsActive(true)
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(fieldOptions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setFieldOptions(items)
  }

  const getFilteredOptions = (fieldNameFilter: string) => {
    return fieldOptions.filter((option) => option.fieldName === fieldNameFilter)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Form Builder</h1>
      </div>

      <Tabs defaultValue="event_type">
        <TabsList>
          <TabsTrigger value="event_type">Event Types</TabsTrigger>
          <TabsTrigger value="location">Locations</TabsTrigger>
          <TabsTrigger value="heard_via">Heard Via</TabsTrigger>
          <TabsTrigger value="add">Add Option</TabsTrigger>
        </TabsList>

        {["event_type", "location", "heard_via"].map((fieldNameTab) => (
          <TabsContent key={fieldNameTab} value={fieldNameTab}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {fieldNameTab === "event_type"
                    ? "Event Types"
                    : fieldNameTab === "location"
                      ? "Locations"
                      : "Heard Via Options"}
                </CardTitle>
                <CardDescription>Manage options for {fieldNameTab.replace("_", " ")} field</CardDescription>
              </CardHeader>
              <CardContent>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="options">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead style={{ width: 50 }}></TableHead>
                              <TableHead>Value</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {getFilteredOptions(fieldNameTab).map((option, index) => (
                              <Draggable key={option.id} draggableId={option.id} index={index}>
                                {(provided) => (
                                  <TableRow ref={provided.innerRef} {...provided.draggableProps}>
                                    <TableCell>
                                      <div {...provided.dragHandleProps} className="flex items-center justify-center">
                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{option.value}</TableCell>
                                    <TableCell>
                                      <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                          option.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                        }`}
                                      >
                                        {option.isActive ? "Active" : "Inactive"}
                                      </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(option)}>
                                          <Edit className="h-4 w-4" />
                                          <span className="sr-only">Edit</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(option.id)}>
                                          <Trash2 className="h-4 w-4" />
                                          <span className="sr-only">Delete</span>
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </Draggable>
                            ))}
                            {getFilteredOptions(fieldNameTab).length === 0 && (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-4">
                                  No options found. Add your first option.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={() => {
                    setFieldName(fieldNameTab)
                    document
                      .querySelector('[data-value="add"]')
                      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>{editingOptionId ? "Edit Option" : "Add New Option"}</CardTitle>
              <CardDescription>
                {editingOptionId ? "Update an existing field option" : "Create a new field option for forms"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fieldName">Field Name</Label>
                  <Select value={fieldName} onValueChange={setFieldName}>
                    <SelectTrigger id="fieldName">
                      <SelectValue placeholder="Select field name" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="event_type">Event Type</SelectItem>
                      <SelectItem value="location">Location</SelectItem>
                      <SelectItem value="heard_via">Heard Via</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="optionValue">Option Value</Label>
                  <Input
                    id="optionValue"
                    placeholder="Enter option value"
                    value={optionValue}
                    onChange={(e) => setOptionValue(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
                  <Label htmlFor="isActive">{isActive ? "Active" : "Inactive"}</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingOptionId ? "Update Option" : "Add Option"}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
