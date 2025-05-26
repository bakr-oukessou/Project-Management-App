"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { AlertTriangle } from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import DashboardLayout from "../../components/dashboard-layout"
import { projectsApi } from "../../api/authService"

interface Project {
  id: number
  name: string
  clientName: string | null
  manager: {
    firstName: string
    lastName: string
  } | null
}

export default function DeleteProject() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const { id } = useParams()

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const response = await projectsApi.getById(Number(id))
        setProject(response.data)
      } catch (error) {
        console.error("Failed to fetch project:", error)
        toast({
          title: "Error",
          description: "Failed to load project details",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  const handleDelete = async () => {
    if (!project) return

    try {
      setIsDeleting(true)
      await projectsApi.delete(Number(id))
      
      toast({
        title: "Project deleted",
        description: `Project "${project.name}" has been deleted successfully.`,
      })

      navigate("/director/projects/index")
    } catch (error) {
      console.error("Failed to delete project:", error)
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Delete Project" userRole="director">
        <div className="flex items-center justify-center h-40">
          <p>Loading project details...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!project) {
    return (
      <DashboardLayout title="Delete Project" userRole="director">
        <div className="flex items-center justify-center h-40">
          <p>Project not found</p>
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
            <p className="text-sm text-muted-foreground">Client: {project.clientName || "N/A"}</p>
            <p className="text-sm text-muted-foreground">Project Manager: {project.manager ? `${project.manager.firstName} ${project.manager.lastName}` : "Unassigned"}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link to="/director/projects/index">
            <Button variant="outline" disabled={isDeleting}>Cancel</Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Project"}
          </Button>
        </CardFooter>
      </Card>
    </DashboardLayout>
  )
}
