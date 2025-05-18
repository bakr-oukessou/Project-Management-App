"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Bell } from "lucide-react"
import DashboardLayout from "@/src/components/dashboard-layout"
import { Badge } from "@/src/components/ui/badge"
import { Link } from "react-router-dom"

// Sample data - in a real app, this would come from a database
const sampleProjects = [
  {
    id: "1",
    name: "E-commerce Platform",
    description: "A full-featured e-commerce platform with payment integration",
    client: "RetailCorp Inc.",
    projectManager: "Jane Smith",
    services: [
      {
        id: "s1",
        name: "User Authentication",
        description: "Implement secure user authentication with OAuth",
        duration: 5,
        tasks: [
          { id: "t1", name: "Setup OAuth providers", progress: 100 },
          { id: "t2", name: "Implement login flow", progress: 80 },
          { id: "t3", name: "Create user profile page", progress: 50 },
        ],
      },
    ],
  },
]

const sampleNotifications = [
  {
    id: "1",
    message: "You have been assigned to a new project: E-commerce Platform",
    date: "2023-06-15",
    read: false,
  },
  {
    id: "2",
    message: "Team meeting for E-commerce Platform scheduled for tomorrow at 10:00 AM",
    date: "2023-06-19",
    read: true,
  },
]

const developerProfile = {
  name: "Alex Chen",
  email: "alex.chen@example.com",
  skills: [".NET", "React", "SQL Server", "JavaScript"],
  experience: "5 years",
}

export default function DeveloperDashboard() {
  const [projects, setProjects] = useState(sampleProjects)
  const [notifications, setNotifications] = useState(sampleNotifications)
  const [showNotifications, setShowNotifications] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id:string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <DashboardLayout title="Developer Dashboard" userRole="developer">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                variant="destructive"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>

          {showNotifications && (
            <Card className="absolute right-0 mt-2 w-80 z-50">
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="max-h-80 overflow-auto p-0">
                {notifications.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-muted-foreground">No notifications</p>
                ) : (
                  <ul className="divide-y">
                    {notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className={`px-4 py-3 text-sm ${notification.read ? "bg-background" : "bg-muted/50"}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <p className="font-medium">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>My Projects</CardTitle>
            <CardDescription>Projects you are currently working on</CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <p className="text-muted-foreground">You are not assigned to any projects yet.</p>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-lg">{project.name}</h3>
                      <Link to={`/developer/projects/${project.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                    <p className="text-sm mt-2">
                      <span className="font-medium">Project Manager:</span> {project.projectManager}
                    </p>

                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Assigned Services:</p>
                      {project.services.map((service) => (
                        <div key={service.id} className="rounded-lg bg-muted p-3 mt-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{service.name}</h4>
                            <Badge variant="outline">{service.duration} days</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{service.description}</p>

                          <div className="mt-3 space-y-2">
                            <p className="text-sm font-medium">Tasks:</p>
                            {service.tasks.map((task) => (
                              <div key={task.id} className="flex items-center justify-between text-sm">
                                <span>{task.name}</span>
                                <span className="font-medium">{task.progress}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>Your skills and information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p>{developerProfile.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{developerProfile.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Experience</p>
              <p>{developerProfile.experience}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Skills</p>
              <div className="flex flex-wrap gap-2">
                {developerProfile.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <Link to="/developer/profile">
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
