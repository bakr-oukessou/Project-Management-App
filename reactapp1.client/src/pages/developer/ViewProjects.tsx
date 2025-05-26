"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Search } from "lucide-react"
import { Input } from "../../components/ui/input"
import DashboardLayout from "../../components/dashboard-layout"
import { projectsApi, authApi } from "../../api/authService"
// Sample data - in a real app, this would come from a database
const sampleProjects = [
  {
    id: "sample-1",
    name: "E-commerce Platform",
    description: "A full-featured e-commerce platform with payment integration",
    client: "RetailCorp Inc.",
    projectManager: "Jane Smith",
    status: { name: "In Progress" },
    technologies: [".NET", "React", "SQL Server"],
    methodology: "Agile",
    services: [
      {
        id: "s1",
        name: "User Authentication",
        description: "Implement secure user authentication with OAuth",
        tasks: [
          { id: "t1", name: "Setup OAuth providers", progress: 80 },
          { id: "t2", name: "Implement login flow", progress: 50 },
          { id: "t3", name: "Create user profile page", progress: 30 },
        ],
      },
    ],
  },
  {
    id: "sample-2",
    name: "CRM System",
    description: "Customer relationship management system with analytics",
    client: "ServicePro Ltd.",
    projectManager: "John Doe",
    status: { name: "Planning" },
    technologies: ["Java", "Angular", "PostgreSQL"],
    methodology: "Scrum",
    services: [],
  },
  {
    id: "sample-3",
    name: "Mobile Banking App",
    description: "Secure mobile banking application with biometric authentication",
    client: "FinanceBank Ltd.",
    projectManager: "Sarah Wilson",
    status: { name: "In Progress" },
    technologies: ["React Native", "Node.js", "MongoDB"],
    methodology: "Kanban",
    services: [
      {
        id: "s2",
        name: "Payment Processing",
        description: "Implement secure payment processing system",
        tasks: [
          { id: "t4", name: "Setup payment gateway", progress: 90 },
          { id: "t5", name: "Implement transaction validation", progress: 70 },
          { id: "t6", name: "Add security features", progress: 40 },
        ],
      },
    ],
  },
]

interface Project {
  id: string | number
  name: string
  description: string
  client?: string
  projectManager?: string
  status: { name: string }
  technologies?: string[]
  methodology?: string
  services?: any[]
  tasks?: any[]
}

export default function ViewProjects() {
  const [searchTerm, setSearchTerm] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await authApi.me()
          setCurrentUserId(response.data.id)
          console.log('Current user fetched:', response.data.id)
      } catch (error) {
        console.error('Error fetching current user:', error)
      }
    }

    fetchCurrentUser()
  }, [])

  useEffect(() => {
    const fetchProjects = async () => {
      if (!currentUserId) return
      try {
        
        // Fetch real projects from API
        const response = await projectsApi.getDeveloperProjectsById(currentUserId)
        const realProjects = response.data || []
        
        // Transform real projects to match our interface
        const transformedRealProjects = realProjects.map((project: any) => ({
          id: project.id,
          name: project.name,
          description: project.description,
          client: "Client Name", // Add client info to your API if needed
          projectManager: project.manager 
            ? `${project.manager.firstName} ${project.manager.lastName}`
            : "Project Manager",
          status: project.status || { name: "Active" },
          technologies: project.technologies?.map((tech: any) => tech.name) || ["Technology"],
          methodology: "Agile", // Add methodology to your API if needed
          tasks: project.tasks || [],
          services: project.tasks && project.tasks.length > 0 ? [{
            id: `service-${project.id}`,
            name: "Development Tasks",
            description: "All development tasks for this project",
            tasks: project.tasks.map((task: any) => ({
              id: task.id,
              name: task.title,
              progress: task.progressUpdates?.length > 0 
                ? task.progressUpdates[task.progressUpdates.length - 1].percentageComplete 
                : Math.floor(Math.random() * 100) // Random progress for demo
            }))
          }] : [],
        }))

        // Combine real projects with sample projects for a fuller look
        const allProjects = [...transformedRealProjects, ...sampleProjects]
        
          setProjects(allProjects)
          console.log('Projects fetched:', allProjects)
      } catch (error) {
        console.error('Error fetching projects:', error)
        // Fall back to sample data if API fails
        setProjects(sampleProjects)
      }
    }

    fetchProjects()
  }, [currentUserId])


  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.client && project.client.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (project.projectManager && project.projectManager.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress':
      case 'active':
        return 'bg-blue-500'
      case 'completed':
        return 'bg-green-500'
      case 'planning':
        return 'bg-yellow-500'
      case 'on hold':
        return 'bg-orange-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <DashboardLayout title="My Projects" userRole="developer">
    <div className="flex items-center justify-between mb-6">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search projects..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>

    <div className="grid gap-6">
      { filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <p className="text-muted-foreground">
              {searchTerm ? "No projects found matching your search" : "No projects found"}
            </p>
          </CardContent>
        </Card>
      ) : (
        filteredProjects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{project.name}</CardTitle>
                <Badge className={getStatusColor(project.status.name)}>
                  {project.status.name}
                </Badge>
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {project.client && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Client</p>
                    <p>{project.client}</p>
                  </div>
                )}
                {project.projectManager && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Project Manager</p>
                    <p>{project.projectManager}</p>
                  </div>
                )}
                {project.methodology && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Methodology</p>
                    <p>{project.methodology}</p>
                  </div>
                )}
              </div>

              {project.technologies && project.technologies.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Technologies</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">My Work</p>
                {(project.services && project.services.length > 0) ? (
                  <div className="space-y-4">
                    {project.services.map((service) => (
                      <div key={service.id} className="rounded-lg border p-4">
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                        
                        {service.tasks && service.tasks.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {service.tasks.map((task: any) => (
                              <div key={task.id}>
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-sm">{task.name}</p>
                                  <span className="text-sm text-muted-foreground">{task.progress}%</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary transition-all duration-300"
                                    style={{ width: `${task.progress}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : project.tasks && project.tasks.length > 0 ? (
                  <div className="space-y-2">
                    {project.tasks.slice(0, 5).map((task: any) => (
                      <div key={task.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">{task.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {task.status?.name || "Active"}
                        </Badge>
                      </div>
                    ))}
                    {project.tasks.length > 5 && (
                      <p className="text-xs text-muted-foreground">
                        +{project.tasks.length - 5} more tasks
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No work assigned yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  </DashboardLayout>
)
}
