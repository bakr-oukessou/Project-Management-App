"use client"

import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Bell } from "lucide-react"
import DashboardLayout from "../../components/dashboard-layout"
import ProjectList from "../../components/project-list"
import { Badge } from "../../components/ui/badge"
import { projectsApi, getCurrentUser } from "../../api/authService"

type Notification = {
    id: string
    message: string
    date: string
    read: boolean
}

type Project = {
    id: number
    name: string
    description?: string
    client?: string
    status: { name: string } | string
    startDate?: string
    endDate?: string
    developmentDays?: number
    manager?: { firstName: string; lastName: string } | string
}

export default function ManagerProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [showNotifications, setShowNotifications] = useState(false)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const user = await getCurrentUser()
                const res = await projectsApi.getManagerProjectsById(user.id)
                setProjects(res.data)

                setNotifications([
                    {
                        id: "1",
                        message: "You have been assigned a new project",
                        date: "2023-10-01",
                        read: false,
                    },
                ])
            } catch (err) {
                console.error("Failed to fetch manager projects", err)
            }
        }

        fetchProjects()
    }, [])

    const unreadCount = notifications.filter((n) => !n.read).length

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        )
    }

    const filterProjectsByStatus = (status: string) =>
        projects.filter((p) =>
            typeof p.status === "string"
                ? p.status === status
                : p.status?.name === status
        )

    return (
        <DashboardLayout title="My Projects" userRole="manager">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Projects</h1>
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
                    <ProjectList projects={filterProjectsByStatus("InProgress")} userRole="manager" />
                </TabsContent>

                <TabsContent value="planning">
                    <ProjectList projects={filterProjectsByStatus("Planning")} userRole="manager" />
                </TabsContent>
            </Tabs>
        </DashboardLayout>
    )
}
