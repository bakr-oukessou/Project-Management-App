"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Textarea } from "../../components/ui/textarea"
import { Calendar, Clock, GitBranch, Plus, CalendarIcon } from "lucide-react"
import { useToast } from "../../hooks/use-toast"
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
  status: string
  technologies: string[]
  methodology: string
  team: string[]
  meetingDate: string | null
  services: Service[]
}

interface Developer {
  id: string
  name: string
  skills: string[]
}

interface NewServiceFormData {
  name: string
  description: string
  assignedTo: string
  duration: string
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
    status: "Planning",
    technologies: ["Java", "Angular", "PostgreSQL"],
    methodology: "Scrum",
    team: ["Taylor Johnson", "Jordan Lee"],
    meetingDate: null,
    services: [],
  },
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

const availableDevelopers: Developer[] = [
  { id: "d1", name: "Alex Chen", skills: [".NET", "React", "SQL Server"] },
  { id: "d2", name: "Maria Garcia", skills: ["Java", "Angular", "MySQL"] },
  { id: "d3", name: "Sam Wilson", skills: ["Python", "React", "MongoDB"] },
  { id: "d4", name: "Taylor Johnson", skills: [".NET", "Vue.js", "SQL Server"] },
  { id: "d5", name: "Jordan Lee", skills: ["PHP", "JavaScript", "MySQL"] },
  { id: "d6", name: "Casey Martinez", skills: ["Java", "React", "PostgreSQL"] },
]

export default function ManagerProjectDetails() {
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()

  // In a real app, you would fetch the project data based on the ID
  // Using sample data for now, but handling potential null for type safety
  const [project, setProject] = useState<Project | null>(sampleProjects.find(p => p.id === id) || null)
  const [selectedTech, setSelectedTech] = useState<string>("")
  const [selectedMethodology, setSelectedMethodology] = useState<string>(project?.methodology || "")
  const [meetingDate, setMeetingDate] = useState<string>(project?.meetingDate || "")
  const [filteredDevelopers, setFilteredDevelopers] = useState<Developer[]>([])
  const [selectedTeam, setSelectedTeam] = useState<string[]>(project?.team || [])

  const [newService, setNewService] = useState<NewServiceFormData>({
    name: "",
    description: "",
    assignedTo: "",
    duration: "",
  })

  useEffect(() => {
    // Filter developers based on project technologies
    if (project) {
      const devs = availableDevelopers.filter((dev: Developer) => project.technologies.some((tech: string) => dev.skills.includes(tech)))
      setFilteredDevelopers(devs)
    }
  }, [project?.technologies]) // Added project?.technologies to dependencies

  const addTechnology = () => {
    if (selectedTech && project && !project.technologies.includes(selectedTech)) {
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
  }

  const setMethodology = () => {
    if (selectedMethodology && project) {
      setProject({
        ...project,
        methodology: selectedMethodology,
      })

      toast({
        title: "Methodology set",
        description: `${selectedMethodology} has been set as the project methodology.`,
      })
    }
  }

  const addDeveloperToTeam = (developerId: string) => {
    if (!project) return;
    const developer = availableDevelopers.find((dev) => dev.id === developerId)
    if (developer && !selectedTeam.includes(developer.name)) {
      setSelectedTeam([...selectedTeam, developer.name])
    }
  }

  const removeDeveloperFromTeam = (developerName: string) => {
    setSelectedTeam(selectedTeam.filter((name) => name !== developerName))
  }

  const saveTeam = () => {
    if (!project) return;
    setProject({
      ...project,
      team: selectedTeam,
    })

    toast({
      title: "Team saved",
      description: `Development team has been updated.`, // Using backticks for template literal
    })
  }

  const scheduleMeeting = () => {
    if (meetingDate && project) {
      setProject({
        ...project,
        meetingDate: meetingDate,
      })

      toast({
        title: "Meeting scheduled",
        description: `Team meeting has been scheduled.`, // Using backticks for template literal
      })
    }
  }

  const handleNewServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewService((prev) => ({ ...prev, [name]: value }))
  }

  const addService = () => {
    if (newService.name && newService.assignedTo && newService.duration && project) {
      const service: Service = {
        id: `s${project.services.length + 1}`,
        name: newService.name,
        description: newService.description,
        assignedTo: newService.assignedTo,
        duration: Number.parseInt(newService.duration),
        tasks: [], // Initialize with empty tasks array
      }

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
        description: `${newService.name} has been added to the project.`, // Using backticks for template literal
      })
    }
  }

  if (!project) {
    return (
      <DashboardLayout title="Project Details" userRole="manager">
        <div className="flex items-center justify-center h-40">
          <p>Loading project details...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title={`Project: ${project.name}`} userRole="manager">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <p className="text-muted-foreground">{project.description}</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="technologies">Technologies</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Basic information about the project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Client</p>
                  <p>{project.client}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge>{project.status}</Badge>
                </div>
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

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Technologies</p>
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

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Team</p>
                <div className="flex flex-wrap gap-2">
                  {project.team.length > 0 ? (
                    project.team.map((member, index) => (
                      <Badge key={index} variant="outline">
                        {member}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No team members assigned yet</p>
                  )}
                </div>
              </div>

              {project.meetingDate && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Team Meeting</p>
                  <p className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {new Date(project.meetingDate).toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technologies">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Add Technologies</CardTitle>
                <CardDescription>Select technologies that will be used in this project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="technology">Technology</Label>
                  <Select value={selectedTech} onValueChange={(value: string) => setSelectedTech(value)}>
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
                  <Select value={selectedMethodology} onValueChange={(value: string) => setSelectedMethodology(value)}>
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

                <Button onClick={setMethodology} disabled={!selectedMethodology}>
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
        </TabsContent>

        <TabsContent value="team">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Available Developers</CardTitle>
                <CardDescription>Developers with skills matching project technologies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.technologies.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Add technologies first to see available developers</p>
                ) : (filteredDevelopers.length === 0 ? (
                  <p className="text-muted-foreground">No developers found with matching skills.</p>
                ) : (
                  <div className="space-y-4">
                    {filteredDevelopers
                      .map((dev: Developer) => (
                        <div key={dev.id} className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <p className="font-medium">{dev.name}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {dev.skills
                                .filter((skill: string) => project.technologies.includes(skill))
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
                            onClick={() => addDeveloperToTeam(dev.id)}
                            disabled={selectedTeam.includes(dev.name)}
                          >
                            {selectedTeam.includes(dev.name) ? "Added" : "Add"}
                          </Button>
                        </div>
                      ))}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Team</CardTitle>
                <CardDescription>Selected developers for this project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTeam.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No team members selected yet</p>
                ) : (
                  <div className="space-y-2">
                    {selectedTeam.map((name: string, index: number) => (
                      <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                        <p>{name}</p>
                        <Button size="sm" variant="ghost" onClick={() => removeDeveloperFromTeam(name)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <Button onClick={saveTeam} disabled={selectedTeam.length === 0} className="w-full">
                  Save Team
                </Button>

                {selectedTeam.length > 0 && ( // Only show meeting scheduling if team is not empty
                  <div className="space-y-2 pt-4 border-t">
                    <Label htmlFor="meetingDate">Schedule Team Meeting</Label>
                    <Input
                      id="meetingDate"
                      type="datetime-local"
                      value={meetingDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeetingDate(e.target.value)}
                    />
                    <Button onClick={scheduleMeeting} disabled={!meetingDate} className="w-full">
                      Schedule Meeting
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Add Service</CardTitle>
                <CardDescription>Create a new service for this project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceName">Service Name</Label>
                  <Input
                    id="serviceName"
                    name="name"
                    value={newService.name}
                    onChange={handleNewServiceChange}
                    placeholder="e.g., User Authentication"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceDescription">Description</Label>
                  <Textarea
                    id="serviceDescription"
                    name="description"
                    value={newService.description}
                    onChange={handleNewServiceChange}
                    placeholder="Describe what this service will do"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assign To</Label>
                  <Select
                    value={newService.assignedTo}
                    onValueChange={(value: string) => setNewService({ ...newService, assignedTo: value })}
                  >
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
                  disabled={!newService.name || !newService.assignedTo || !newService.duration || !project}
                  className="w-full"
                >
                  Add Service
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Services</CardTitle>
                <CardDescription>Services assigned to team members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.services.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No services added yet</p>
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

                        {service.tasks.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="text-sm font-medium">Tasks:</p>
                            {service.tasks.map((task: Task) => (
                              <div key={task.id} className="flex items-center justify-between text-sm">
                                <span>{task.name}</span>
                                <span className="font-medium">{task.progress}%</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
