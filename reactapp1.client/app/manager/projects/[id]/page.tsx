"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Badge } from "@/src/components/ui/badge"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Textarea } from "@/src/components/ui/textarea"
import { Calendar, Clock, GitBranch, Plus, CalendarIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import DashboardLayout from "@/src/components/dashboard-layout"

type Task = {
  id: string
  name: string
  progress: number
}

type Service = {
  id: string
  name: string
  description: string
  assignedTo: string
  duration: number
  tasks: Task[]
}

type Project = {
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
  meetingDate: string
  services: Service[]
}

type Developer = {
  id: string
  name: string
  skills: string[]
}

type NewService = {
  name: string
  description: string
  assignedTo: string
  duration: string
}

type ProjectDetailsProps = {
  params: { id: string }
}

// Sample data - in a real app, this would come from a database
const sampleProject: Project = {
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
}

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

export default function ProjectDetails({ params }: ProjectDetailsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const projectId = params.id

  // In a real app, you would fetch the project data based on the ID
  const [project, setProject] = useState<Project>(sampleProject)
  const [selectedTech, setSelectedTech] = useState<string>("")
  const [selectedMethodology, setSelectedMethodology] = useState<string>(project.methodology || "")
  const [meetingDate, setMeetingDate] = useState<string>(project.meetingDate || "")
  const [filteredDevelopers, setFilteredDevelopers] = useState<Developer[]>([])
  const [selectedTeam, setSelectedTeam] = useState<string[]>(project.team || [])

  const [newService, setNewService] = useState<NewService>({
    name: "",
    description: "",
    assignedTo: "",
    duration: "",
  })

  const addTechnology = () => {
    if (selectedTech && !project.technologies.includes(selectedTech)) {
      const updatedTechnologies = [...project.technologies, selectedTech]
      setProject({
        ...project,
        technologies: updatedTechnologies,
      })
      setSelectedTech("")

      // Filter developers based on updated technologies
      const devs = availableDevelopers.filter((dev) =>
        updatedTechnologies.some((tech) => dev.skills.includes(tech))
      )
      setFilteredDevelopers(devs)

      toast({
        title: "Technology added",
        description: `${selectedTech} has been added to the project.`,
      })
    }
  }

  const setMethodologyHandler = () => {
    if (selectedMethodology) {
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
    const developer = availableDevelopers.find((dev) => dev.id === developerId)
    if (developer && !selectedTeam.includes(developer.name)) {
      setSelectedTeam([...selectedTeam, developer.name])
    }
  }

  const removeDeveloperFromTeam = (developerName: string) => {
    setSelectedTeam(selectedTeam.filter((name) => name !== developerName))
  }

  const saveTeam = () => {
    setProject({
      ...project,
      team: selectedTeam,
    })

    toast({
      title: "Team saved",
      description: `Development team has been updated.`,
    })
  }

  const scheduleMeeting = () => {
    if (meetingDate) {
      setProject({
        ...project,
        meetingDate,
      })

      toast({
        title: "Meeting scheduled",
        description: `Team meeting has been scheduled.`,
      })
    }
  }

  const handleNewServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewService((prev) => ({ ...prev, [name]: value }))
  }

  const addService = () => {
    if (newService.name && newService.assignedTo && newService.duration) {
      const service: Service = {
        id: `s${project.services.length + 1}`,
        name: newService.name,
        description: newService.description,
        assignedTo: newService.assignedTo,
        duration: Number.parseInt(newService.duration),
        tasks: [],
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
        description: `${newService.name} has been added to the project.`,
      })
    }
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
                ) : (
                  <div className="space-y-4">
                    {availableDevelopers
                      .filter((dev) => project.technologies.some((tech) => dev.skills.includes(tech)))
                      .map((dev) => (
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
                            variant="ghost"
                            onClick={() => addDeveloperToTeam(dev.id)}
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
                <CardTitle>Project Team</CardTitle>
                <CardDescription>Selected developers for this project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTeam.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No team members selected yet</p>
                ) : (
                  <div className="space-y-2">
                    {selectedTeam.map((name, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                        <p>{name}</p>
                        <Button size="sm" variant="ghost" onClick={() => removeDeveloperFromTeam(name)} type="button">
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <Button onClick={saveTeam} disabled={selectedTeam.length === 0} className="w-full" type="button">
                  Save Team
                </Button>

                {selectedTeam.length > 0 && !project.meetingDate && (
                  <div className="space-y-2 pt-4 border-t">
                    <Label htmlFor="meetingDate">Schedule Team Meeting</Label>
                    <Input
                      id="meetingDate"
                      type="datetime-local"
                      value={meetingDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeetingDate(e.target.value)}
                    />
                    <Button onClick={scheduleMeeting} disabled={!meetingDate} className="w-full" type="button">
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
                    onValueChange={(value) => setNewService({ ...newService, assignedTo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {project.team.map((member) => (
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
                    onChange={handleNewServiceChange}
                    placeholder="Number of days required"
                  />
                </div>

                <Button
                  onClick={addService}
                  disabled={!newService.name || !newService.assignedTo || !newService.duration}
                  className="w-full"
                  type="button"
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
                    {project.services.map((service) => (
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
                            {service.tasks.map((task) => (
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
