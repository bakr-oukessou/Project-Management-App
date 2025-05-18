"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { useToast } from "../../hooks/use-toast"
import DashboardLayout from "../../components/dashboard-layout"

interface ProjectFormData {
  id?: string
  name: string
  description: string
  client: string
  startDate: string
  endDate: string
  developmentDays: string
  projectManagerId: string
}

interface ProjectFormErrors {
  name?: string
  description?: string
  client?: string
  startDate?: string
  endDate?: string
  developmentDays?: string
  projectManagerId?: string
}

interface Project {
  id: string
  name: string
  description: string
  client: string
  startDate: string
  endDate: string
  developmentDays: number
  projectManagerId: string
}

// Sample data - in a real app, this would come from a database
const sampleProjects: Project[] = [
  {
    id: "1",
    name: "E-commerce Platform",
    description: "A full-featured e-commerce platform with payment integration",
    client: "RetailCorp Inc.",
    startDate: "2023-06-15",
    endDate: "2023-12-15",
    developmentDays: 120,
    projectManagerId: "1",
  },
  {
    id: "2",
    name: "CRM System",
    description: "Customer relationship management system with analytics",
    client: "ServicePro Ltd.",
    startDate: "2023-07-01",
    endDate: "2023-10-30",
    developmentDays: 90,
    projectManagerId: "2",
  },
]

// Sample project managers
const projectManagers: { id: string; name: string }[] = [
  { id: "1", name: "Jane Smith" },
  { id: "2", name: "John Doe" },
  { id: "3", name: "Alice Johnson" },
  { id: "4", name: "Bob Wilson" },
  { id: "5", name: "Carol Martinez" },
]

export default function EditProject() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { id } = useParams()

  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    client: "",
    startDate: "",
    endDate: "",
    developmentDays: "",
    projectManagerId: "",
  })

  const [errors, setErrors] = useState<ProjectFormErrors>({})

  useEffect(() => {
    // In a real app, you would fetch the project data from an API
    const foundProject = sampleProjects.find((p) => p.id === id)
    if (foundProject) {
      setFormData({
        id: foundProject.id,
        name: foundProject.name,
        description: foundProject.description,
        client: foundProject.client,
        startDate: foundProject.startDate,
        endDate: foundProject.endDate,
        developmentDays: String(foundProject.developmentDays),
        projectManagerId: foundProject.projectManagerId,
      })
    }
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name as keyof ProjectFormErrors]) {
      setErrors((prev) => ({ ...prev, [name as keyof ProjectFormErrors]: undefined }))
    }
  }

  const handleSelectChange = (name: keyof ProjectFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name as keyof ProjectFormErrors]) {
      setErrors((prev) => ({ ...prev, [name as keyof ProjectFormErrors]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: ProjectFormErrors = {}

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
      Number(formData.developmentDays) <= 0
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

    // In a real application, you would update the project in the database
    // For demo purposes, we'll just simulate a successful update

    toast({
      title: "Project updated",
      description: `Project "${formData.name}" has been updated successfully.`,
    })

    navigate("/director/projects/index")
  }

  return (
    <DashboardLayout title="Edit Project" userRole="director">
      <Card>
        <CardHeader>
          <CardTitle>Edit Project</CardTitle>
          <CardDescription>Update the details for this project</CardDescription>
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
            <Button type="button" variant="outline" onClick={() => navigate("/director/projects/index")}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardLayout>
  )
}
