"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Badge } from "../../components/ui/badge"
import { Plus } from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import DashboardLayout from "../../components/dashboard-layout"

interface Project {
  id: string
  name: string
  description: string
  client: string
  technologies: string[]
  methodology: string
}

interface Developer {
  id: string
  name: string
  skills: string[]
}

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

const availableDevelopers: Developer[] = [
  { id: "d1", name: "Alex Chen", skills: [".NET", "React", "SQL Server"] },
  { id: "d2", name: "Maria Garcia", skills: ["Java", "Angular", "MySQL"] },
  { id: "d3", name: "Sam Wilson", skills: ["Python", "React", "MongoDB"] },
  { id: "d4", name: "Taylor Johnson", skills: [".NET", "Vue.js", "SQL Server"] },
  { id: "d5", name: "Jordan Lee", skills: ["PHP", "JavaScript", "MySQL"] },
  { id: "d6", name: "Casey Martinez", skills: ["Java", "React", "PostgreSQL"] },
]

const availableTechnologies: string[] = [
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

const methodologies: string[] = ["Agile", "Scrum", "Kanban", "Waterfall", "XP", "Lean", "DevOps"]

export default function AddTechnologies() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [selectedTech, setSelectedTech] = useState<string>("")
  const [selectedMethodology, setSelectedMethodology] = useState<string>("")
  const [filteredDevelopers, setFilteredDevelopers] = useState<Developer[]>([])
  const [selectedTeam, setSelectedTeam] = useState<string[]>([])

  useEffect(() => {
    const foundProject = sampleProjects.find((p) => p.id === id)
    if (foundProject) {
      setProject(foundProject)
      setSelectedMethodology(foundProject.methodology || "")
      setSelectedTeam([]) // Reset team on project change
      // Initial filtering of developers
      const devs = availableDevelopers.filter((dev) =>
        foundProject.technologies.some((tech) => dev.skills.includes(tech))
      )
      setFilteredDevelopers(devs)
    }
  }, [id])

  useEffect(() => {
    if (project) {
      const devs = availableDevelopers.filter((dev) =>
        project.technologies.some((tech) => dev.skills.includes(tech))
      )
      setFilteredDevelopers(devs)
    }
  }, [project?.technologies])

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

    const updatedProject = {
      ...project,
      technologies: [...project.technologies, selectedTech],
    }
    setProject(updatedProject)
    setSelectedTech("")
    toast({
      title: "Technology added",
      description: `${selectedTech} has been added to the project.`,
    })
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

  const addDeveloperToTeam = (developerName: string) => {
    if (!selectedTeam.includes(developerName)) {
      setSelectedTeam([...selectedTeam, developerName])
    }
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

            <Button onClick={addTechnology} disabled={!selectedTech} type="button">
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

            <Button onClick={setMethodologyHandler} disabled={!selectedMethodology} type="button">
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

        <Card>
          <CardHeader>
            <CardTitle>Available Developers</CardTitle>
            <CardDescription>Developers with skills matching project technologies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!project || project.technologies.length === 0 ? (
              <p className="text-sm text-muted-foreground">Add technologies first to see available developers</p>
            ) : filteredDevelopers.length === 0 ? (
              <p className="text-muted-foreground">No developers found with matching skills.</p>
            ) : (
              <div className="space-y-4">
                {filteredDevelopers.map((dev) => (
                  <div key={dev.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{dev.name}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {dev.skills
                          .filter((skill) => project.technologies.includes(skill))
                          .map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={selectedTeam.includes(dev.name) ? "outline" : "default"}
                      onClick={() => addDeveloperToTeam(dev.name)}
                      disabled={selectedTeam.includes(dev.name)}
                      type="button"
                    >
                      {selectedTeam.includes(dev.name) ? "Added" : "Add"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Selected Team</CardTitle>
            <CardDescription>Team members for this project</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedTeam.length === 0 ? (
              <p className="text-muted-foreground">No team members selected</p>
            ) : (
              <div className="space-y-4">
                {selectedTeam.map((member) => (
                  <Badge key={member} variant="secondary">
                    {member}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-between">
        <Link to={`/manager/projects/${project.id}`}>
          <Button variant="outline" type="button">Back to Project</Button>
        </Link>
        <Link to={`/manager/projects/form-team/${project.id}`}>
          <Button type="button">Continue to Form Team</Button>
        </Link>
      </div>
    </DashboardLayout>
  )
}
