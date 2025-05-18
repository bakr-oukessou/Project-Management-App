"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Link } from "react-router-dom"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Badge } from "@/src/components/ui/badge"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import DashboardLayout from "@/src/components/dashboard-layout"

type Project = {
  id: string
  name: string
  description: string
  client: string
  technologies: string[]
  methodology: string
}

type AddTechnologiesProps = {
  params: { id: string }
}

// Sample data - in a real app, this would come from a database
const sampleProjects: Project[] = [
  {
    id: "1",
    name: "E-commerce Platform",
    description: "A full-featured e-commerce platform with payment integration",
    client: "RetailCorp Inc.",
    technologies: [".NET", "React", "SQL Server"],
    methodology: "Agile",
  },
  {
    id: "2",
    name: "CRM System",
    description: "Customer relationship management system with analytics",
    client: "ServicePro Ltd.",
    technologies: [],
    methodology: "",
  },
]

const availableTechnologies = [
  ".NET",
  "Java",
  "PHP",
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "Angular",
  "Vue.js",
  "Node.js",
  "SQL Server",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Azure",
  "Docker",
  "Kubernetes",
]

const methodologies = ["Agile", "Scrum", "Kanban", "Waterfall", "XP", "Lean", "DevOps"]

export default function AddTechnologies({ params }: AddTechnologiesProps) {
  const router = useRouter()
  const { toast } = useToast()
  const projectId = params.id

  const [project, setProject] = useState<Project | null>(null)
  const [selectedTech, setSelectedTech] = useState<string>("")
  const [selectedMethodology, setSelectedMethodology] = useState<string>("")

  useEffect(() => {
    // In a real app, you would fetch the project data from an API
    const foundProject = sampleProjects.find((p) => p.id === projectId) || null
    if (foundProject) {
      setProject(foundProject)
      setSelectedMethodology(foundProject.methodology || "")
    }
  }, [projectId])

  const addTechnology = () => {
    if (!selectedTech || !project) return

    if (project.technologies.includes(selectedTech)) {
      toast({
        title: "Technology already added",
        description: `${selectedTech} is already part of this project.`,
        variant: "destructive",
      })
      return
    }

    setProject({
      ...project,
      technologies: [...project.technologies, selectedTech],
    })

    toast({
      title: "Technology added",
      description: `${selectedTech} has been added to the project.`,
    })

    setSelectedTech("")
  }

  const setMethodologyHandler = () => {
    if (!selectedMethodology || !project) return

    setProject({
      ...project,
      methodology: selectedMethodology,
    })

    toast({
      title: "Methodology set",
      description: `${selectedMethodology} has been set as the project methodology.`,
    })
  }

  if (!project) {
    return (
      <DashboardLayout title="Add Technologies" userRole="manager">
        <div className="flex items-center justify-center h-40">
          <p>Loading project details...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title={`Add Technologies: ${project.name}`} userRole="manager">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <p className="text-muted-foreground">{project.description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add Technologies</CardTitle>
            <CardDescription>Select technologies that will be used in this project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="technology">Technology</Label>
              <Select value={selectedTech} onValueChange={setSelectedTech}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a technology" />
                </SelectTrigger>
                <SelectContent>
                  {availableTechnologies.map((tech) => (
                    <SelectItem key={tech} value={tech}>
                      {tech}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={addTechnology} disabled={!selectedTech}>
              <Plus className="mr-2 h-4 w-4" />
              Add Technology
            </Button>

            <div className="space-y-2">
              <Label>Current Technologies</Label>
              <div className="flex flex-wrap gap-2">
                {project.technologies.length > 0 ? (
                  project.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary">
                      {tech}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No technologies added yet</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Set Methodology</CardTitle>
            <CardDescription>Choose the development methodology for this project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="methodology">Methodology</Label>
              <Select value={selectedMethodology} onValueChange={setSelectedMethodology}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a methodology" />
                </SelectTrigger>
                <SelectContent>
                  {methodologies.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={setMethodologyHandler} disabled={!selectedMethodology}>
              Set Methodology
            </Button>

            <div className="space-y-2">
              <Label>Current Methodology</Label>
              <p>
                {project.methodology ? (
                  <Badge>{project.methodology}</Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">No methodology set</span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-between">
        <Link to={`/manager/projects/manage/${project.id}`}>
          <Button variant="outline">Back to Project</Button>
        </Link>
        <Link to={`/manager/projects/form-team/${project.id}`}>
          <Button>Continue to Form Team</Button>
        </Link>
      </div>
    </DashboardLayout>
  )
}
