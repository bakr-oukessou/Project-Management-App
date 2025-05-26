"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { PlusCircle, Search, Eye, Edit, Trash } from "lucide-react"
import DashboardLayout from "../../components/dashboard-layout"

interface Project {
  id: string
  name: string
  client: string
  startDate: string
  endDate: string
  projectManager: string
  status: string
}

const sampleProjects: Project[] = [
  {
    id: "1",
    name: "E-commerce Platform",
    client: "RetailCorp Inc.",
    startDate: "2023-06-15",
    endDate: "2023-12-15",
    projectManager: "Anas Bzioui",
    status: "In Progress",
  },
  {
    id: "2",
    name: "CRM System",
    client: "ServicePro Ltd.",
    startDate: "2023-07-01",
    endDate: "2023-10-30",
    projectManager: "Anas Bzioui",
    status: "Planning",
  },
  {
    id: "3",
    name: "Mobile Banking App",
    client: "FinanceBank",
    startDate: "2023-05-10",
    endDate: "2024-01-20",
    projectManager: "Alice Johnson",
    status: "In Progress",
  },
  {
    id: "4",
    name: "Inventory Management System",
    client: "LogisticsPro",
    startDate: "2023-08-01",
    endDate: "2023-11-30",
    projectManager: "Bob Wilson",
    status: "Planning",
  },
  {
    id: "5",
    name: "Healthcare Portal",
    client: "MediCare",
    startDate: "2023-04-15",
    endDate: "2023-10-15",
    projectManager: "Carol Martinez",
    status: "Completed",
  },
]

export default function ProjectsIndex() {
  const [projects, setProjects] = useState<Project[]>(sampleProjects)
  const [searchTerm, setSearchTerm] = useState<string>("")

  const filteredProjects = projects.filter(
    (project: Project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectManager.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "In Progress":
        return "bg-blue-500"
      case "Planning":
        return "bg-yellow-500"
      case "Completed":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <DashboardLayout title="Projects" userRole="director">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-8"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link to="/director/projects/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Project Manager</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No projects found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project: Project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.client}</TableCell>
                    <TableCell>{project.startDate}</TableCell>
                    <TableCell>{project.endDate}</TableCell>
                    <TableCell>{project.projectManager}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/director/projects/details/${project.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </Link>
                        <Link to={`/director/projects/edit/${project.id}`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </Link>
                        <Link to={`/director/projects/delete/${project.id}`}>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
