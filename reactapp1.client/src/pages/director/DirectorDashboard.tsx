/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { PlusCircle } from "lucide-react"
import DashboardLayout from "../../components/dashboard-layout"
import ProjectList from "../../components/project-list"

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
}

const sampleProjects: Project[] = [
  {
    id: "1",
    name: "E-commerce Platform",
    description: "A full-featured e-commerce platform with payment integration",
    client: "RetailCorp Inc.",
    startDate: "2023-06-15",
    endDate: "2023-12-15",
    developmentDays: 120,
    projectManager: "Riad Elmoudden",
    status: "In Progress",
  },
  {
    id: "2",
    name: "CRM System",
    description: "Customer relationship management system with analytics",
    client: "ServicePro Ltd.",
    startDate: "2023-07-01",
    endDate: "2023-10-30",
    developmentDays: 90,
    projectManager: "Riad Elmoudden",
    status: "Planning",
  },
  {
    id: "3",
    name: "Mobile Banking App",
    description: "Secure mobile banking application with biometric authentication",
    client: "FinanceBank",
    startDate: "2023-05-10",
    endDate: "2024-01-20",
    developmentDays: 180,
    projectManager: "Alice Johnson",
    status: "In Progress",
  },
]

export default function DirectorDashboard() {
  const [projects, setProjects] = useState<Project[]>(sampleProjects)

  return (
    <DashboardLayout title="IT Director Dashboard" userRole="director">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Projects Overview</h1>
        <Link to="/director/projects/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Statistics</CardTitle>
            <CardDescription>Overview of all projects in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1 rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Total Projects</div>
                <div className="text-2xl font-bold">{projects.length}</div>
              </div>
              <div className="flex flex-col gap-1 rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">In Progress</div>
                <div className="text-2xl font-bold">{projects.filter((p) => p.status === "In Progress").length}</div>
              </div>
              <div className="flex flex-col gap-1 rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Planning</div>
                <div className="text-2xl font-bold">{projects.filter((p) => p.status === "Planning").length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="inProgress">In Progress</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ProjectList projects={projects} userRole="director" />
          </TabsContent>

          <TabsContent value="inProgress">
            <ProjectList projects={projects.filter((p) => p.status === "In Progress")} userRole="director" />
          </TabsContent>

          <TabsContent value="planning">
            <ProjectList projects={projects.filter((p) => p.status === "Planning")} userRole="director" />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
