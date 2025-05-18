"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Bell } from "lucide-react"
import DashboardLayout from "@/src/components/dashboard-layout"
import ProjectList from "@/src/components/project-list"
import { Badge } from "@/src/components/ui/badge"

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
]

export default function ManagerDashboard() {
  const [projects, setProjects] = useState(sampleProjects)
  const [notifications, setNotifications] = useState(sampleNotifications)
  const [showNotifications, setShowNotifications] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id:string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <DashboardLayout title="Project Manager Dashboard" userRole="manager">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Projects</h1>
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

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Statistics</CardTitle>
            <CardDescription>Overview of your assigned projects</CardDescription>
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
            <ProjectList projects={projects} userRole="manager" />
          </TabsContent>

          <TabsContent value="inProgress">
            <ProjectList projects={projects.filter((p) => p.status === "In Progress")} userRole="manager" />
          </TabsContent>

          <TabsContent value="planning">
            <ProjectList projects={projects.filter((p) => p.status === "Planning")} userRole="manager" />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
