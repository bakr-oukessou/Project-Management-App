"use client"

import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Calendar, Clock, Users, GitBranch, Edit, Trash } from "lucide-react"
import DashboardLayout from "../../components/dashboard-layout"

interface Task {
  id: string
  name: string
  progress: number
}

interface Service {
  id: string
  name: string
  description: string
  assignedTo: string
  duration: number
  tasks: Task[]
}

interface Project {
  id: string
  name: string
  description: string
  client: string
  startDate: string
  endDate: string
  developmentDays: number
  projectManager: string
  status: string
  technologies: string[]
  methodology: string
  team: string[]
  meetingDate: string | null
  services: Service[]
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
    projectManager: "Jane Smith",
    status: "In Progress",
    technologies: [".NET", "React", "SQL Server"],
    methodology: "Agile",
    team: ["Alex Chen", "Maria Garcia", "Sam Wilson"],
    meetingDate: "2023-06-20T10:00:00",
    services: [
      {
        id: "s1",
        name: "User Authentication",
        description: "Implement secure user authentication with OAuth",
        assignedTo: "Alex Chen",
        duration: 5,
        tasks: [
          { id: "t1", name: "Setup OAuth providers", progress: 100 },
          { id: "t2", name: "Implement login flow", progress: 80 },
          { id: "t3", name: "Create user profile page", progress: 50 },
        ],
      },
      {
        id: "s2",
        name: "Payment Processing",
        description: "Integrate payment gateway for secure transactions",
        assignedTo: "Maria Garcia",
        duration: 7,
        tasks: [
          { id: "t4", name: "Research payment providers", progress: 100 },
          { id: "t5", name: "Implement payment API", progress: 60 },
          { id: "t6", name: "Create checkout flow", progress: 30 },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "CRM System",
    description: "Customer relationship management system with analytics",
    client: "ServicePro Ltd.",
    startDate: "2023-07-01",
    endDate: "2023-10-30",
    developmentDays: 90,
    projectManager: "John Doe",
    status: "Planning",
    technologies: ["Java", "Angular", "PostgreSQL"],
    methodology: "Scrum",
    team: ["Taylor Johnson", "Jordan Lee"],
    meetingDate: null,
    services: [],
  },
]

export default function ProjectDetails() {
  const [project, setProject] = useState<Project | null>(null)
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    // In a real app, you would fetch the project data from an API
    const foundProject = sampleProjects.find((p) => p.id === id)
    setProject(foundProject || null)
  }, [id])

  if (!project) {
    return (
      <DashboardLayout title="Project Details" userRole="director">
        <div className="flex items-center justify-center h-40">
          <p>Loading project details...</p>
        </div>
      </DashboardLayout>
    )
  }

  const calculateProgress = (): number => {
    if (!project || !project.services.length) return 0

    let totalTasks = 0
    let completedProgress = 0

    project.services.forEach((service: Service) => {
      service.tasks.forEach((task: Task) => {
        totalTasks++
        completedProgress += task.progress
      })
    })

    return totalTasks ? Math.round(completedProgress / totalTasks) : 0
  }

  const progress = calculateProgress()

  return (
    <DashboardLayout title={`Project: ${project.name}`} userRole="director">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <div className="flex gap-2">
          <Link to={`/director/projects/edit/${project.id}`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Project
            </Button>
          </Link>
          <Link to={`/director/projects/delete/${project.id}`}>
            <Button variant="destructive">
              <Trash className="mr-2 h-4 w-4" />
              Delete Project
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>Basic information about the project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p>{project.description}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Client</p>
                    <p>{project.client}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge>{project.status}</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Project Manager</p>
                    <p>{project.projectManager}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
                <CardDescription>Project schedule and duration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                    <p className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {project.startDate}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">End Date</p>
                    <p className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {project.endDate}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Development Days</p>
                    <p className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      {project.developmentDays} days
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Methodology</p>
                    <p className="flex items-center">
                      <GitBranch className="mr-2 h-4 w-4 text-muted-foreground" />
                      {project.methodology || "Not set"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Technologies</CardTitle>
                <CardDescription>Technologies used in this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.length > 0 ? (
                    project.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {tech}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No technologies added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Project Team</CardTitle>
              <CardDescription>Team members working on this project</CardDescription>
            </CardHeader>
            <CardContent>
              {project.team.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Team Size: {project.team.length} members</span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {project.team.map((member, index) => (
                      <div key={index} className="rounded-lg border p-4">
                        <p className="font-medium">{member}</p>
                        <p className="text-sm text-muted-foreground">Developer</p>
                      </div>
                    ))}
                  </div>
                  {project.meetingDate && (
                    <div className="mt-6 rounded-lg border p-4">
                      <p className="font-medium">Team Meeting</p>
                      <p className="text-sm text-muted-foreground">
                        Scheduled for {new Date(project.meetingDate).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No team members assigned yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Project Services</CardTitle>
              <CardDescription>Services and tasks in this project</CardDescription>
            </CardHeader>
            <CardContent>
              {project.services.length > 0 ? (
                <div className="space-y-6">
                  {project.services.map((service) => (
                    <div key={service.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium">{service.name}</h3>
                        <Badge variant="outline">{service.duration} days</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Assigned to:</span> {service.assignedTo}
                      </p>

                      <div className="mt-4 space-y-3">
                        <p className="text-sm font-medium">Tasks:</p>
                        {service.tasks.map((task) => (
                          <div key={task.id} className="rounded-lg bg-muted p-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium">{task.name}</p>
                              <Badge variant="secondary">{task.progress}%</Badge>
                            </div>
                            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                              <div className="bg-primary h-full" style={{ width: `${task.progress}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No services added yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Project Progress</CardTitle>
              <CardDescription>Overall progress of the project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Overall Completion</p>
                    <p className="font-medium">{progress}%</p>
                  </div>
                  <div className="w-full bg-secondary h-4 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Services</p>
                    <p className="text-2xl font-bold">{project.services.length}</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Team Members</p>
                    <p className="text-2xl font-bold">{project.team.length}</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm font-medium text-muted-foreground">Days Remaining</p>
                    <p className="text-2xl font-bold">
                      {project.endDate ? Math.max(0, Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 'N/A'}
                    </p>
                  </div>
                </div>

                {project.services.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Service Progress</h3>
                    {project.services.map((service) => {
                      const serviceProgress =
                        service.tasks.reduce((acc, task) => acc + task.progress, 0) / service.tasks.length

                      return (
                        <div key={service.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p>{service.name}</p>
                            <p className="font-medium">{Math.round(serviceProgress)}%</p>
                          </div>
                          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: `${serviceProgress}%` }}></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
