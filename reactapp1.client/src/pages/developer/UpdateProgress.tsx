"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Slider } from "../../components/ui/slider"
import { Badge } from "../../components/ui/badge"
import { useToast } from "../../hooks/use-toast"
import DashboardLayout from "../../components/dashboard-layout"

interface TaskHistory {
  date: string
  progress: number
  comment: string
}

interface Task {
  id: string
  name: string
  description: string
  progress: number
  serviceName: string
  projectName: string
  history: TaskHistory[]
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
    history: [
      { date: "2023-06-15", progress: 30, comment: "Started implementation" },
      { date: "2023-06-16", progress: 60, comment: "Completed Google OAuth" },
    ],
  },
  {
    id: "t2",
    name: "Implement login flow",
    description: "Create login flow with email/password and OAuth options",
    progress: 50,
    serviceName: "User Authentication",
    projectName: "E-commerce Platform",
    history: [
      { date: "2023-06-17", progress: 20, comment: "Created login UI" },
      { date: "2023-06-18", progress: 50, comment: "Implemented email/password login" },
    ],
  },
]

export default function UpdateProgress() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { id } = useParams()

  const [task, setTask] = useState<Task | null>(null)
  const [progress, setProgress] = useState(0)
  const [comment, setComment] = useState("")

  useEffect(() => {
    // In a real app, you would fetch the task data from an API
    const foundTask = sampleTasks.find((t) => t.id === id)
    if (foundTask) {
      setTask(foundTask)
      setProgress(foundTask.progress)
    }
  }, [id])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!comment.trim()) {
      toast({
        title: "Comment required",
        description: "Please provide a comment about your progress.",
        variant: "destructive",
      })
      return
    }

    if (!task) return

    // In a real app, you would update the database
    const newHistory: TaskHistory = {
      date: new Date().toISOString().split("T")[0],
      progress,
      comment,
    }

    setTask({
      ...task,
      progress,
      history: [...task.history, newHistory],
    })

    toast({
      title: "Progress updated",
      description: `Task progress has been updated to ${progress}%.`,
    })

    // Clear the comment field
    setComment("")
  }

  if (!task) {
    return (
      <DashboardLayout title="Update Task Progress" userRole="developer">
        <div className="flex items-center justify-center h-40">
          <p>Loading task details...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Update Task Progress" userRole="developer">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{task.name}</h1>
        <p className="text-muted-foreground">
          {task.serviceName} | {task.projectName}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
            <CardDescription>Information about this task</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Description</Label>
              <p>{task.description}</p>
            </div>

            <div className="space-y-2">
              <Label>Current Progress</Label>
              <div className="flex items-center gap-2">
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: `${task.progress}%` }}></div>
                </div>
                <span className="font-medium">{task.progress}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Update Progress</CardTitle>
            <CardDescription>Report your daily progress on this task</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="progress">Progress (%)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="progress"
                    min={0}
                    max={100}
                    step={5}
                    value={[progress]}
                    onValueChange={([value]) => setProgress(value)}
                    className="flex-1"
                  />
                  <span className="w-12 text-right font-medium">{progress}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe what you've accomplished today..."
                  rows={3}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Save Progress
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Progress History</CardTitle>
            <CardDescription>Previous updates on this task</CardDescription>
          </CardHeader>
          <CardContent>
            {task.history.length === 0 ? (
              <p className="text-muted-foreground">No progress updates yet.</p>
            ) : (
              <div className="space-y-4">
                {[...task.history].reverse().map((entry, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{entry.date}</p>
                      <Badge variant="outline">{entry.progress}%</Badge>
                    </div>
                    <p className="text-sm">{entry.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Link to="/developer/tasks/view">
          <Button variant="outline">Back to Tasks</Button>
        </Link>
      </div>
    </DashboardLayout>
  )
}
