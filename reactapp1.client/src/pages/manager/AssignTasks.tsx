"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Badge } from "../../components/ui/badge"
import { useToast } from "../../hooks/use-toast"
import DashboardLayout from "../../components/dashboard-layout"

interface Service {
  id: string
  name: string
  description: string
  assignedTo: string
  duration: number
  tasks?: any[] // Assuming tasks can be anything for now based on sample
}

interface Project {
  id: string
  name: string
  description: string
  team: string[]
  services: Service[]
}

interface NewServiceFormData {
  name: string
  description: string
  assignedTo: string
  duration: string
}


const sampleProjects: Project[] = [
  {
    id: "1",
    name: "E-commerce Platform",
    description: "A full-featured e-commerce platform with payment integration",
    team: ["Bakr Oukessou", "Anas Bzioui", "Yahya Bennouna"],
    services: [
      {
        id: "s1",
        name: "User Authentication",
        description: "Implement secure user authentication with OAuth",
        assignedTo: "Bakr Oukessou",
        duration: 5,
      },
      {
        id: "s2",
        name: "Payment Processing",
        description: "Integrate payment gateway for secure transactions",
        assignedTo: "Yahya Bennouna",
        duration: 7,
      },
    ],
  },
  {
    id: "2",
    name: "CRM System",
    description: "Customer relationship management system with analytics",
    team: ["Bakr Oukessou", "Jordan Lee"],
    services: [],
  },
]

export default function AssignTasks() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { id } = useParams<{ id: string }>()

  const [project, setProject] = useState<Project | null>(null)
  const [newService, setNewService] = useState<NewServiceFormData>({
    name: "",
    description: "",
    assignedTo: "",
    duration: "",
  })

  useEffect(() => {
    // In a real app, you would fetch the project data from an API
    const foundProject = sampleProjects.find((p) => p.id === id)
    if (foundProject) {
      setProject(foundProject)
    }
  }, [id])

  const handleNewServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewService((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setNewService((prev) => ({ ...prev, assignedTo: value }))
  }

  const addService = () => {
    if (!newService.name || !newService.assignedTo || !newService.duration || !project) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const service: Service = {
      id: `s${project.services.length + 1}`,
      name: newService.name,
      description: newService.description,
      assignedTo: newService.assignedTo,
      duration: Number.parseInt(newService.duration),
      tasks: [], // Initialize with empty tasks array
    }

    // In a real app, you would update the database
    setProject({
      ...project,
      services: [...project.services, service],
    })

    setNewService({
      name: "",
      description: "",
      assignedTo: "",
      duration: "",
    })

    toast({
      title: "Service added",
      description: `${newService.name} has been assigned to ${newService.assignedTo}.`,
    })
  }

  const finishAssignment = () => {
    if (!project || project.services.length === 0) {
      toast({
        title: "No services assigned",
        description: "Please assign at least one service before finishing.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Services assigned",
      description: "All services have been assigned successfully.",
    })

    // In a real app, you would update the database and send notifications
    navigate("/manager/dashboard")
  }

  if (!project) {
    return (
      <DashboardLayout title="Assign Services" userRole="manager">
        <div className="flex items-center justify-center h-40">
          <p>Loading project details...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title={`Assign Services: ${project.name}`} userRole="manager">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <p className="text-muted-foreground">{project.description}</p>
      </div>

      {project.team.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="mb-4 text-center">Please form a team for this project first.</p>
            <Link to={`/manager/projects/form-team/${project.id}`}>
              <Button>Form Team</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Add Service</CardTitle>
              <CardDescription>Assign a new service to a team member</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newService.name}
                  onChange={handleNewServiceChange}
                  placeholder="e.g., User Authentication"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newService.description}
                  onChange={handleNewServiceChange}
                  placeholder="Describe what this service will do"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign To</Label>
                <Select value={newService.assignedTo} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {project.team.map((member: string) => (
                      <SelectItem key={member} value={member}>
                        {member}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="1"
                  value={newService.duration}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewServiceChange(e)}
                  placeholder="Number of days required"
                />
              </div>

              <Button
                onClick={addService}
                disabled={!newService.name || !newService.assignedTo || !newService.duration}
                className="w-full"
              >
                Add Service
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assigned Services</CardTitle>
              <CardDescription>Services assigned to team members</CardDescription>
            </CardHeader>
            <CardContent>
              {project.services.length === 0 ? (
                <p className="text-muted-foreground">No services assigned yet.</p>
              ) : (
                <div className="space-y-4">
                  {project.services.map((service: Service) => (
                    <div key={service.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{service.name}</h3>
                        <Badge variant="outline">{service.duration} days</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                      <p className="text-sm mt-2">
                        <span className="font-medium">Assigned to:</span> {service.assignedTo}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <Link to={`/manager/projects/form-team/${project.id}`}>
          <Button variant="outline">Back to Team Formation</Button>
        </Link>
        <Button onClick={finishAssignment} disabled={!project || project.services.length === 0}>
          Finish & Send Notifications
        </Button>
      </div>
    </DashboardLayout>
  )
}
