"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { useToast } from "../../hooks/use-toast"
import DashboardLayout from "../../components/dashboard-layout"
 
interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  methodology: string
  team: string[]
}

interface Developer {
  id: string
  name: string
  skills: string[]
}

// Sample data - in a real app, this would come from a database
const sampleProjects: Project[] = [
  {
    id: "1",
    name: "E-commerce Platform",
    description: "A full-featured e-commerce platform with payment integration",
    technologies: [".NET", "React", "SQL Server"],
    methodology: "Agile",
    team: ["Alex Chen", "Maria Garcia", "Sam Wilson"],
  },
  {
    id: "2",
    name: "CRM System",
    description: "Customer relationship management system with analytics",
    technologies: ["Java", "Angular", "PostgreSQL"],
    methodology: "Scrum",
    team: [],
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

export default function FormTeam() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { id } = useParams<{ id: string }>()

  const [project, setProject] = useState<Project | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<string[]>([])
  const [meetingDate, setMeetingDate] = useState<string>("")

  useEffect(() => {
    // In a real app, you would fetch the project data from an API
    const foundProject = sampleProjects.find((p) => p.id === id)
    if (foundProject) {
      setProject(foundProject)
      setSelectedTeam(foundProject.team || [])
    }
  }, [id])

  const addDeveloperToTeam = (developer: Developer) => {
    if (!project || selectedTeam.includes(developer.name)) return

    setSelectedTeam([...selectedTeam, developer.name])
  }

  const removeDeveloperFromTeam = (developerName: string) => {
    setSelectedTeam(selectedTeam.filter((name) => name !== developerName))
  }

  const saveTeam = () => {
    if (!project) return

    // In a real app, you would update the database
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
    if (!meetingDate || !project) {
      toast({
        title: "Meeting date required",
        description: "Please select a date and time for the meeting.",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would update the database
    setProject({
      ...project,
      meetingDate: meetingDate,
    } as Project)

    toast({
      title: "Meeting scheduled",
      description: `Team meeting has been scheduled for ${new Date(meetingDate).toLocaleString()}.`,
    })

    // Navigate to the next step
    navigate(`/manager/projects/assign-tasks/${id}`)
  }

  if (!project) {
    return (
      <DashboardLayout title="Form Team" userRole="manager">
        <div className="flex items-center justify-center h-40">
          <p>Loading project details...</p>
        </div>
      </DashboardLayout>
    )
  }

  // Filter developers based on project technologies
  const matchingDevelopers = availableDevelopers.filter((dev: Developer) =>
    project.technologies.some((tech) => dev.skills.includes(tech)),
  )

  return (
    <DashboardLayout title={`Form Team: ${project.name}`} userRole="manager">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <p className="text-muted-foreground">{project.description}</p>
      </div>

      {project.technologies.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="mb-4 text-center">
              Please add technologies to the project first to see available developers.
            </p>
            <Link to={`/manager/projects/add-technologies/${project.id}`}>
              <Button>Add Technologies</Button>
            </Link>
          </CardContent>
        </Card>
      ) : !project.methodology ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="mb-4 text-center">Please set a methodology for the project before forming a team.</p>
            <Link to={`/manager/projects/add-technologies/${project.id}`}>
              <Button>Set Methodology</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Available Developers</CardTitle>
              <CardDescription>Developers with skills matching project technologies</CardDescription>
            </CardHeader>
            <CardContent>
              {matchingDevelopers.length === 0 ? (
                <p className="text-muted-foreground">No developers found with matching skills.</p>
              ) : (
                <div className="space-y-4">
                  {matchingDevelopers.map((developer: Developer) => (
                    <div key={developer.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">{developer.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {developer.skills
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
                        variant={selectedTeam.includes(developer.name) ? "outline" : "default"}
                        onClick={() => addDeveloperToTeam(developer)}
                        disabled={selectedTeam.includes(developer.name)}
                      >
                        {selectedTeam.includes(developer.name) ? "Added" : "Add"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Selected Team</CardTitle>
                <CardDescription>Team members for this project</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedTeam.length === 0 ? (
                  <p className="text-muted-foreground">No team members selected yet.</p>
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

                <Button onClick={saveTeam} disabled={selectedTeam.length === 0} className="w-full mt-4">
                  Save Team
                </Button>
              </CardContent>
            </Card>

            {selectedTeam.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Schedule Team Meeting</CardTitle>
                  <CardDescription>Set up a meeting to present the project to the team</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meetingDate">Meeting Date and Time</Label>
                    <Input
                      id="meetingDate"
                      type="datetime-local"
                      value={meetingDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeetingDate(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={scheduleMeeting}
                    disabled={!meetingDate || selectedTeam.length === 0}
                    className="w-full"
                  >
                    Schedule Meeting & Continue
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      <div className="mt-6">
        <Link to={`/manager/projects/add-technologies/${project.id}`}>
          <Button variant="outline">Back to Technologies</Button>
        </Link>
      </div>
    </DashboardLayout>
  )
}
