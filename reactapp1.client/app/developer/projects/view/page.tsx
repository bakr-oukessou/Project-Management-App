"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Search } from "lucide-react"
import { Input } from "@/src/components/ui/input"
import DashboardLayout from "@/src/components/dashboard-layout"

// Sample data - in a real app, this would come from a database
const sampleProjects = [
  {
    id: "1",
    name: "E-commerce Platform",
    description: "A full-featured e-commerce platform with payment integration",
    client: "RetailCorp Inc.",
    projectManager: "Jane Smith",
    status: "In Progress",
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
    id: "2",
    name: "CRM System",
    description: "Customer relationship management system with analytics",
    client: "ServicePro Ltd.",
    projectManager: "John Doe",
    status: "Planning",
    technologies: ["Java", "Angular", "PostgreSQL"],
    methodology: "Scrum",
    services: [],
  },
]

export default function ViewProjects() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProjects = sampleProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectManager.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center p-6">
              <p className="text-muted-foreground">No projects found</p>
            </CardContent>
          </Card>
        ) : (
          filteredProjects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{project.name}</CardTitle>
                  <Badge className={project.status === "In Progress" ? "bg-blue-500" : "bg-yellow-500"}>
                    {project.status}
                  </Badge>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Client</p>
                    <p>{project.client}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Project Manager</p>
                    <p>{project.projectManager}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Methodology</p>
                    <p>{project.methodology}</p>
                  </div>
                </div>

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

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">My Services</p>
                  {project.services.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No services assigned yet</p>
                  ) : (
                    <div className="space-y-4">
                      {project.services.map((service) => (
                        <div key={service.id} className="rounded-lg border p-4">
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-muted-foreground">{service.description}</p>

                          <div className="mt-4 space-y-2">
                            <p className="text-sm font-medium">Tasks:</p>
                            {service.tasks.map((task) => (
                              <div key={task.id} className="flex items-center justify-between">
                                <p className="text-sm">{task.name}</p>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-secondary h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full" style={{ width: `${task.progress}%` }}></div>
                                  </div>
                                  <span className="text-xs">{task.progress}%</span>
                                  <Link to={`/developer/tasks/update-progress/${task.id}`}>
                                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                                      Update
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
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
