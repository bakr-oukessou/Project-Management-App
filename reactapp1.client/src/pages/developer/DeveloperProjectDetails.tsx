"use client"

import { useState } from "react"
import { useParams } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Badge } from "../../components/ui/badge"
import { Slider } from "../../components/ui/slider"
import { useToast } from "../../hooks/use-toast"
import DashboardLayout from "../../components/dashboard-layout"

// Sample data - in a real app, this would come from a database
const sampleProject = {
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
}

export default function DeveloperProjectDetails() {
  const { toast } = useToast()
  const { id } = useParams()

  // In a real app, you would fetch the project data based on the ID
  const [project, setProject] = useState(sampleProject)
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    serviceId: "",
    progress: 0,
  })

  const handleNewTaskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewTask((prev) => ({ ...prev, [name]: value }))
  }

  const addTask = () => {
    if (newTask.name && newTask.serviceId) {
      const updatedProject = { ...project }
      const serviceIndex = updatedProject.services.findIndex((s) => s.id === newTask.serviceId)

      if (serviceIndex !== -1) {
        const newTaskObj = {
          id: `t${updatedProject.services[serviceIndex].tasks.length + 1}`,
          name: newTask.name,
          description: newTask.description,
          progress: newTask.progress,
        }

        updatedProject.services[serviceIndex].tasks.push(newTaskObj)
        setProject(updatedProject)

        setNewTask({
          name: "",
          description: "",
          serviceId: "",
          progress: 0,
        })

        toast({
          title: "Task added",
          description: `${newTask.name} has been added to the service.`,
        })
      }
    }
  }

  const updateTaskProgress = (serviceId: string, taskId: string, progress: number) => {
    const updatedProject = { ...project }
    const serviceIndex = updatedProject.services.findIndex((s) => s.id === serviceId)

    if (serviceIndex !== -1) {
      const taskIndex = updatedProject.services[serviceIndex].tasks.findIndex((t) => t.id === taskId)

      if (taskIndex !== -1) {
        updatedProject.services[serviceIndex].tasks[taskIndex].progress = progress
        setProject(updatedProject)
      }
    }
  }

  const saveProgress = () => {
    // In a real app, you would save the progress to a database
    toast({
      title: "Progress saved",
      description: "Your task progress has been updated successfully.",
    })
  }

  return (
    <DashboardLayout title={`Project: ${project.name}`} userRole="developer">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <p className="text-muted-foreground">{project.description}</p>
      </div>

      <div className="grid gap-6">
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
                <p className="text-sm font-medium text-muted-foreground">Project Manager</p>
                <p>{project.projectManager}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Services</CardTitle>
            <CardDescription>Services assigned to you in this project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {project.services.map((service) => (
              <div key={service.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{service.name}</h3>
                  <Badge variant="outline">{service.duration} days</Badge>
                </div>
                <p className="text-muted-foreground">{service.description}</p>

                <div className="space-y-4">
                  <h4 className="font-medium">Tasks</h4>
                  {service.tasks.map((task) => (
                    <div key={task.id} className="space-y-2 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">{task.name}</h5>
                        <span className="text-sm">{task.progress}% complete</span>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`progress-${task.id}`}>Update Progress</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            id={`progress-${task.id}`}
                            min={0}
                            max={100}
                            step={5}
                            value={[task.progress]}
                            onValueChange={([value]) => updateTaskProgress(service.id, task.id, value)}
                            className="flex-1"
                          />
                          <span className="w-12 text-right">{task.progress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border p-4 space-y-4">
                  <h4 className="font-medium">Add New Task</h4>
                  <div className="space-y-2">
                    <Label htmlFor="taskName">Task Name</Label>
                    <Input
                      id="taskName"
                      name="name"
                      value={newTask.name}
                      onChange={handleNewTaskChange}
                      placeholder="e.g., Implement feature X"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taskDescription">Description</Label>
                    <Textarea
                      id="taskDescription"
                      name="description"
                      value={newTask.description}
                      onChange={handleNewTaskChange}
                      placeholder="Describe what this task involves"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taskProgress">Initial Progress</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="taskProgress"
                        min={0}
                        max={100}
                        step={5}
                        value={[newTask.progress]}
                        onValueChange={([value]) => setNewTask({ ...newTask, progress: value, serviceId: service.id })}
                        className="flex-1"
                      />
                      <span className="w-12 text-right">{newTask.progress}%</span>
                    </div>
                  </div>

                  <Button onClick={addTask} disabled={!newTask.name}>
                    Add Task
                  </Button>
                </div>
              </div>
            ))}

            <Button onClick={saveProgress} className="w-full">
              Save All Progress
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
