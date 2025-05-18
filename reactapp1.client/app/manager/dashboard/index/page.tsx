"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Bell, Calendar, Users, CheckCircle } from "lucide-react"
import { Badge } from "@/src/components/ui/badge"
import DashboardLayout from "@/src/components/dashboard-layout"

// Sample data - in a real app, this would come from a database
const sampleProjects = [
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
    progress: 65,
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
    technologies: [],
    methodology: "",
    team: [],
    progress: 10,
  },
]

const sampleNotifications = [
  {
    id: "1",
    message: "You have been assigned to a new project: CRM System",
    date: "2023-07-01",
    read: false,
  },
  {
    id: "2",
    message: "Team meeting for E-commerce Platform scheduled for tomorrow at 10:00 AM",
    date: "2023-06-20",
    read: true,
  },
  {
    id: "3",
    message: "Alex Chen has completed the 'Setup OAuth providers' task",
    date: "2023-06-18",
    read: true,
  },
  {
    id: "4",
    message: "Maria Garcia has updated progress on 'Implement payment API' to 60%",
    date: "2023-06-17",
    read: true,
  },
]

const upcomingMeetings = [
  {
    id: "1",
    project: "E-commerce Platform",
    date: "2023-07-05T10:00:00",
    description: "Weekly sprint review",
  },
  {
    id: "2",
    project: "CRM System",
    date: "2023-07-07T14:00:00",
    description: "Project kickoff meeting",
  },
]

export default function ManagerDashboard() {
  const [notifications, setNotifications] = useState(sampleNotifications)
  const [showNotifications, setShowNotifications] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id:string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <DashboardLayout title="Project Manager Dashboard" userRole="manager">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
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
            <Card className="absolute right-0 mt-2 w-96 z-50">
              <CardHeader className="py-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all as read
                  </Button>
                )}
              </CardHeader>
              <CardContent className="max-h-96 overflow-auto p-0">
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleProjects.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {sampleProjects.filter((p) => p.status === "In Progress").length} in progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.from(new Set(sampleProjects.flatMap((p) => p.team))).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingMeetings.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Next: {new Date(upcomingMeetings[0].date).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Projects</CardTitle>
            <CardDescription>Projects you are managing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <p className="font-medium">{project.name}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-1 h-4 w-4" />
                      <span>{project.team.length} team members</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge className={project.status === "In Progress" ? "bg-blue-500" : "bg-yellow-500"}>
                      {project.status}
                    </Badge>
                    <div className="mt-2 flex items-center text-sm">
                      <span className="mr-2">{project.progress}%</span>
                      <div className="h-2 w-20 rounded-full bg-secondary">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${project.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-center">
                <Link to="/manager/projects/index">
                  <Button variant="outline">View All Projects</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Meetings</CardTitle>
            <CardDescription>Scheduled meetings for your projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{meeting.project}</p>
                    <Badge variant="outline">
                      {new Date(meeting.date).toLocaleDateString()} at{" "}
                      {new Date(meeting.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{meeting.description}</p>
                </div>
              ))}
              <div className="flex justify-center">
                <Link to="/manager/projects/schedule">
                  <Button variant="outline">Schedule Meeting</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Recent updates from your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.slice(0, 5).map((notification, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="rounded-full bg-primary/10 p-2">
                  {index % 3 === 0 ? (
                    <Users className="h-4 w-4 text-primary" />
                  ) : index % 3 === 1 ? (
                    <Calendar className="h-4 w-4 text-primary" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
