"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Link } from "react-router-dom"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import DashboardLayout from "@/src/components/dashboard-layout"

type Project = {
  id: string
  name: string
  client: string
  projectManager: string
}

type DeleteProjectProps = { params: { id: string } }

// Sample data - in a real app, this would come from a database
const sampleProjects: Project[] = [
  {
    id: "1",
    name: "E-commerce Platform",
    client: "RetailCorp Inc.",
    projectManager: "Jane Smith",
  },
  {
    id: "2",
    name: "CRM System",
    client: "ServicePro Ltd.",
    projectManager: "John Doe",
  },
]

export default function DeleteProject({ params }: DeleteProjectProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const projectId = params.id

  useEffect(() => {
    // In a real app, you would fetch the project data from an API
    const foundProject = sampleProjects.find((p) => p.id === projectId) || null
    setProject(foundProject)
  }, [projectId])

  const handleDelete = () => {
    // In a real application, you would delete the project from the database
    // For demo purposes, we'll just simulate a successful deletion

    if (!project) return

    toast({
      title: "Project deleted",
      description: `Project "${project.name}" has been deleted successfully.`,
    })

    router.push("/director/projects/index")
  }

  if (!project) {
    return (
      <DashboardLayout title="Delete Project" userRole="director">
        <div className="flex items-center justify-center h-40">
          <p>Loading project details...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Delete Project" userRole="director">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-2" />
          <CardTitle>Confirm Deletion</CardTitle>
          <CardDescription>Are you sure you want to delete this project? This action cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <p className="font-medium text-lg">{project.name}</p>
            <p className="text-sm text-muted-foreground">Client: {project.client}</p>
            <p className="text-sm text-muted-foreground">Project Manager: {project.projectManager}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link to="/director/projects/index">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            Delete Project
          </Button>
        </CardFooter>
      </Card>
    </DashboardLayout>
  )
}
