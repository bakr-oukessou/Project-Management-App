"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Search } from "lucide-react"
import { Input } from "../../components/ui/input"
import DashboardLayout from "../../components/dashboard-layout"
import { tasksApi } from "../../api/authService"

interface Task {
  id: string
  name: string
  description: string
  progress: number
  serviceName: string
  projectName: string
  dueDate: string
}

// Sample data - in a real app, this would come from a database
const sampleTasks: Task[] = [
  {
    id: "t1",
    name: "Setup OAuth providers",
    description: "Configure OAuth providers for Google, Facebook, and GitHub",
    progress: 80,
    serviceName: "User Authentication",
    projectName: "E-commerce Platform",
    dueDate: "2023-07-10",
  },
  {
    id: "t2",
    name: "Implement login flow",
    description: "Create login flow with email/password and OAuth options",
    progress: 50,
    serviceName: "User Authentication",
    projectName: "E-commerce Platform",
    dueDate: "2023-07-15",
  },
  {
    id: "t3",
    name: "Create user profile page",
    description: "Design and implement user profile page with edit functionality",
    progress: 30,
    serviceName: "User Authentication",
    projectName: "E-commerce Platform",
    dueDate: "2023-07-20",
  },
  {
    id: "t4",
    name: "Implement password reset",
    description: "Create password reset functionality with email verification",
    progress: 0,
    serviceName: "User Authentication",
    projectName: "E-commerce Platform",
    dueDate: "2023-07-25",
  },
]

export default function ViewTasks() {
  const [searchTerm, setSearchTerm] = useState("")
  const [userTasks, setUserTasks] = useState<Task[]>([])

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const res = await tasksApi.getMyTasks()
        const backendTasks = res.data.map((t: any): Task => ({
          id: t.id.toString(),
          name: t.title,
          description: t.description,
          progress:
            t.progressUpdates?.[0]?.percentageComplete ?? Math.floor(Math.random() * 100),
          serviceName: t.project?.name || "N/A",
          projectName: t.project?.name || "N/A",
          dueDate: t.dueDate?.split("T")[0] || "N/A"
        }))
        setUserTasks(backendTasks)
      } catch (err) {
        console.error("Error fetching user tasks:", err)
      }
    }

    fetchUserTasks()
  }, [])

  const allTasks = [...userTasks, ...sampleTasks]

  const filteredTasks = allTasks.filter(
    (task) =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-green-500"
    if (progress >= 50) return "bg-blue-500"
    if (progress > 0) return "bg-yellow-500"
    return "bg-gray-500"
  }

  return (
    <DashboardLayout title="My Tasks" userRole="developer">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>Tasks assigned to you across all projects</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No tasks found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">
                      {task.name}
                    </TableCell>
                    <TableCell>{task.serviceName}</TableCell>
                    <TableCell>{task.projectName}</TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-secondary h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor(task.progress)}`}
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                        <span>{task.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/developer/tasks/update-progress/${task.id}`}>
                        <Button size="sm">Update Progress</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 mt-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allTasks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allTasks.filter((task) => task.progress === 100).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allTasks.filter((task) => task.progress > 0 && task.progress < 100).length}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
