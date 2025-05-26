import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Slider } from "../../components/ui/slider"
import { Badge } from "../../components/ui/badge"
import { useToast } from "../../hooks/use-toast"
import DashboardLayout from "../../components/dashboard-layout"
import { tasksApi, getCurrentUser } from "../../api/authService"

interface Task {
    id: string
    title: string
    description: string
    project: { name: string }
    progressUpdates: { updatedAt: string; percentageComplete: number; description: string }[]
}

export default function UpdateProgress() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { toast } = useToast()
    const [task, setTask] = useState<Task | null>(null)
    const [progress, setProgress] = useState(0)
    const [comment, setComment] = useState("")
    const [userId, setUserId] = useState<number | null>(null)

    useEffect(() => {
        const fetchUserAndTask = async () => {
            try {
                const user = await getCurrentUser()
                setUserId(user.id)

                const res = await tasksApi.getById(Number(id))
                const taskData = res.data
                const latestProgress = taskData.progressUpdates?.[0]?.percentageComplete ?? 0
                setTask(taskData)
                setProgress(latestProgress)
            } catch (err) {
                console.error("Failed to fetch user/task", err)
                toast({ title: "Error", description: "Could not load task or user.", variant: "destructive" })
            }
        }
        fetchUserAndTask()
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!comment.trim()) {
            toast({ title: "Comment required", description: "Please describe your progress.", variant: "destructive" })
            return
        }

        if (!userId) {
            toast({ title: "Unauthorized", description: "User ID missing.", variant: "destructive" })
            return
        }

        try {
            await tasksApi.updateProgressRawSql(Number(id), {
                percentageComplete: progress,
                description: comment,
                userId: userId,
            })
            toast({ title: "Progress updated", description: `Progress set to ${progress}%.` })
            setComment("")
            const res = await tasksApi.getById(Number(id))
            setTask(res.data)
        } catch (err) {
            console.error("Failed to update progress", err)
            toast({ title: "Error", description: "Could not update progress.", variant: "destructive" })
        }
    }

    if (!task) {
        return (
            <DashboardLayout title="Update Task Progress" userRole="developer">
                <div className="flex items-center justify-center h-40">
                    <p>Loading task...</p>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout title="Update Task Progress" userRole="developer">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">{task.title}</h1>
                <p className="text-muted-foreground">
                    {task.project?.name ?? "Unknown Project"}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Task Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Label>Description</Label>
                        <p>{task.description}</p>

                        <Label>Current Progress</Label>
                        <div className="flex items-center gap-2">
                            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                <div className="bg-primary h-full" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="font-medium">{progress}%</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Update Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Label htmlFor="progress">Progress (%)</Label>
                            <div className="flex items-center gap-4">
                                <Slider
                                    id="progress"
                                    min={0}
                                    max={100}
                                    step={5}
                                    value={[progress]}
                                    onValueChange={([val]) => setProgress(val)}
                                    className="flex-1"
                                />
                                <span className="w-12 text-right font-medium">{progress}%</span>
                            </div>

                            <Label htmlFor="comment">Comment</Label>
                            <Textarea
                                id="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Describe your progress..."
                                required
                            />

                            <Button type="submit" className="w-full">
                                Save Progress
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Progress History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {task.progressUpdates.length === 0 ? (
                            <p className="text-muted-foreground">No updates yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {[...task.progressUpdates].reverse().map((entry, index) => (
                                    <div key={index} className="rounded-lg border p-4">
                                        <div className="flex justify-between mb-1">
                                            <p className="font-medium">{entry.updatedAt.split("T")[0]}</p>
                                            <Badge variant="outline">{entry.percentageComplete}%</Badge>
                                        </div>
                                        <p className="text-sm">{entry.description}</p>
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
