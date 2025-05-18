"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import DashboardLayout from "@/src/components/dashboard-layout"

type ProjectManager = { id: string; name: string }
type FormData = {
  name: string
  description: string
  client: string
  startDate: string
  endDate: string
  developmentDays: string
  projectManagerId: string
}
type Errors = Partial<Record<keyof FormData, string>>

// Sample data - in a real app, this would come from a database
const projectManagers: ProjectManager[] = [
  { id: "1", name: "Jane Smith" },
  { id: "2", name: "John Doe" },
  { id: "3", name: "Alice Johnson" },
  { id: "4", name: "Bob Wilson" },
  { id: "5", name: "Carol Martinez" },
]

export default function CreateProject() {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    client: "",
    startDate: "",
    endDate: "",
    developmentDays: "",
    projectManagerId: "",
  })

  const [errors, setErrors] = useState<Errors>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = () => {
    const newErrors: Errors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required"
    }

    if (!formData.client.trim()) {
      newErrors.client = "Client name is required"
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required"
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required"
    } else if (formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = "End date must be after start date"
    }

    if (
      !formData.developmentDays ||
      isNaN(Number(formData.developmentDays)) ||
      Number.parseInt(formData.developmentDays) <= 0
    ) {
      newErrors.developmentDays = "Valid development days are required"
    }

    if (!formData.projectManagerId) {
      newErrors.projectManagerId = "Project manager is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    toast({
      title: "Project created",
      description: `Project "${formData.name}" has been created successfully.`,
    })

    router.push("/director/projects/index")
  }

  return (
    <DashboardLayout title="Create New Project" userRole="director">
      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
          <CardDescription>Enter the details for the new project</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter a unique project name"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the project"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Input
                id="client"
                name="client"
                value={formData.client}
                onChange={handleChange}
                placeholder="Client name or organization"
              />
              {errors.client && <p className="text-sm text-destructive">{errors.client}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleChange} />
                {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
                {errors.endDate && <p className="text-sm text-destructive">{errors.endDate}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="developmentDays">Development Days</Label>
              <Input
                id="developmentDays"
                name="developmentDays"
                type="number"
                min="1"
                value={formData.developmentDays}
                onChange={handleChange}
                placeholder="Number of days required for development"
              />
              {errors.developmentDays && <p className="text-sm text-destructive">{errors.developmentDays}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectManagerId">Project Manager</Label>
              <Select
                value={formData.projectManagerId}
                onValueChange={(value) => handleSelectChange("projectManagerId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project manager" />
                </SelectTrigger>
                <SelectContent>
                  {projectManagers.map((manager) => (
                    <SelectItem key={manager.id} value={manager.id}>
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.projectManagerId && <p className="text-sm text-destructive">{errors.projectManagerId}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/director/projects/index")}>
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardLayout>
  )
}
