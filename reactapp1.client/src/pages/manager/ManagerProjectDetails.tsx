"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Textarea } from "../../components/ui/textarea"
import { Calendar, Clock, GitBranch, Plus, CalendarIcon, Trash2, Edit, Check, X } from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import DashboardLayout from "../../components/dashboard-layout"
import { projectsApi, tasksApi, usersApi, technologiesApi } from "../../api/authService"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { AxiosResponse } from "axios"

interface ProjectStatus {
    id: number
    name: string
}

interface User {
    id: number
    firstName: string
    lastName: string
    email: string
    role: string
}

interface Technology {
    id: number
    name: string
}

interface Task {
    id: number
    title: string
    description: string
    status: ProjectStatus
    progress: number
    assignedTo: User
    dueDate: string
}

interface Project {
    id: number
    name: string
    description: string
    startDate: string
    deadlineDate: string
    endDate: string | null
    status: ProjectStatus
    manager: User
    director: User
    developers: User[]
    technologies: Technology[]
    tasks: Task[]
    completionPercentage: number
    clientName: string | null
}
interface TaskCreatePayload {
    title: string;
    description: string;
    priority: {
        id: number;
    };
    status: {
        id: number;
    };
    assignedTo?: {
        id: number;
    } | null;
    dueDate: string;
    project: {
        id: number;
    };
    estimatedHours?: number;
    actualHours?: number;
}
interface NewTaskForm {
    title: string;
    description: string;
    priorityId: number;
    statusId: number;
    assignedToId: number | null;
    dueDate: string;
    estimatedHours?: number;
    actualHours?: number;
}

export default function ManagerProjectDetails() {
    const { id } = useParams<{ id: string }>()
    const { toast } = useToast()
    const navigate = useNavigate()
    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        clientName: '',
        deadlineDate: ''
    })
    const [availableDevelopers, setAvailableDevelopers] = useState<User[]>([])
    const [availableTechnologies, setAvailableTechnologies] = useState<Technology[]>([])
    const [newTask, setNewTask] = useState<NewTaskForm>({
        title: '',
        description: '',
        priorityId: 2, // Default to Medium
        statusId: 1,   // Default to To Do
        assignedToId: null,
        dueDate: new Date().toISOString().split('T')[0],
        estimatedHours: 0,
        actualHours: 0
    });
    const [selectedTechnologyId, setSelectedTechnologyId] = useState<number | null>(null)
    const [removingDeveloperId, setRemovingDeveloperId] = useState<number | null>(null);
    const [addingDeveloperId, setAddingDeveloperId] = useState<number | null>(null);
    useEffect(() => {
        console.log('Current project state:', {
            developers: project?.developers,
            availableDevs: availableDevelopers
        });
    }, [project, availableDevelopers]);

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                setLoading(true);

                // 1. Fetch basic project data
                const projectResponse: AxiosResponse<Project> = await projectsApi.getById(Number(id));
                console.log('Project API Response:', projectResponse.data);

                // 2. Fetch assigned developers using the correct endpoint
                const devsResponse: AxiosResponse<User[]> = await usersApi.getDevelopers(Number(id));
                const developers = devsResponse.data || [];
                const techsResponse: AxiosResponse<Technology[]> =
                    await technologiesApi.getTechnologiesByProject(Number(id));
                const technologies = techsResponse.data || [];
                // 3. Set state with guaranteed arrays
                setProject({
                    ...projectResponse.data,
                    developers: developers,
                    technologies: technologies || [],
                    tasks: projectResponse.data.tasks || []
                });

                // 4. Fetch available developers using the correct endpoint
                const availableDevsResponse: AxiosResponse<User[]> = await usersApi.getAvailableDevelopers(Number(id));
                setAvailableDevelopers(availableDevsResponse.data || []);
                const allTechsResponse: AxiosResponse<Technology[]> = await technologiesApi.getAll();
                setAvailableTechnologies(allTechsResponse.data || []);

            } catch (error) {
                console.error("Failed to fetch project data", error);
                toast({
                    title: "Error",
                    description: "Could not load project details.",
                    variant: "destructive"
                });
                navigate("/manager/projects");
            } finally {
                setLoading(false);
            }
        };

        fetchProjectData();
    }, [id]);

    const handleEditProject = async () => {
        try {
            const response: AxiosResponse<Project> = await projectsApi.update(Number(id), {
                ...editForm,
                deadlineDate: new Date(editForm.deadlineDate).toISOString()
            })
            setProject({
                ...response.data,
                developers: response.data.developers || [],
                technologies: response.data.technologies || [],
                tasks: response.data.tasks || []
            })
            setEditing(false)
            toast({
                title: "Success",
                description: "Project updated successfully",
            })
        } catch (error) {
            console.error("Failed to update project", error)
            toast({
                title: "Error",
                description: "Could not update project",
                variant: "destructive"
            })
        }
    }

    const handleAddDeveloper = async (developerId: number) => {
        try {
            setAddingDeveloperId(developerId);
            await projectsApi.addDeveloper(Number(id), developerId);
            await refreshDevelopers(); // Refresh developers after adding
            toast({
                title: "Success",
                description: "Developer added to project",
            });
        } catch (error) {
            console.error("Failed to add developer", error);
            toast({
                title: "Error",
                description: "Could not add developer",
                variant: "destructive"
            });
        } finally {
            setAddingDeveloperId(null);
        }
    };

    const refreshDevelopers = async () => {
        try {
            // Refresh assigned developers
            const devsResponse: AxiosResponse<User[]> = await usersApi.getDevelopers(Number(id));
            setProject(prev => prev ? {
                ...prev,
                developers: devsResponse.data || []
            } : null);

            // Refresh available developers
            const availableDevsResponse: AxiosResponse<User[]> = await usersApi.getAvailableDevelopers(Number(id));
            setAvailableDevelopers(availableDevsResponse.data || []);
        } catch (error) {
            console.error("Failed to refresh developers", error);
            toast({
                title: "Error",
                description: "Failed to refresh developer lists",
                variant: "destructive"
            });
        }
    };

    const handleRemoveDeveloper = async (developerId: number) => {
        try {
            setRemovingDeveloperId(developerId);
            await projectsApi.removeDeveloper(Number(id), developerId);
            await refreshDevelopers(); // Refresh developers after removing
            toast({
                title: "Success",
                description: "Developer removed from project",
            });
        } catch (error) {
            console.error("Failed to remove developer", error);
            toast({
                title: "Error",
                description: "Could not remove developer",
                variant: "destructive"
            });
        } finally {
            setRemovingDeveloperId(null);
        }
    };

    const refreshTechnologies = async () => {
        try {
            // Refresh project technologies
            const techsResponse: AxiosResponse<Technology[]> =
                await technologiesApi.getTechnologiesByProject(Number(id));

            setProject(prev => prev ? {
                ...prev,
                technologies: techsResponse.data || []
            } : null);

            // Refresh available technologies
            const allTechsResponse: AxiosResponse<Technology[]> = await technologiesApi.getAll();
            setAvailableTechnologies(allTechsResponse.data || []);

        } catch (error) {
            console.error("Failed to refresh technologies", error);
            toast({
                title: "Error",
                description: "Failed to refresh technology lists",
                variant: "destructive"
            });
        }
    };

    const handleAddTechnology = async () => {
        if (!selectedTechnologyId) return

        try {
            const response: AxiosResponse<Project> = await projectsApi.addTechnology(Number(id), selectedTechnologyId)
            setProject({
                ...response.data,
                developers: response.data.developers || [],
                technologies: response.data.technologies || [],
                tasks: response.data.tasks || []
            })
            await refreshTechnologies(); // Refresh technologies after adding
            setSelectedTechnologyId(null)
            toast({
                title: "Success",
                description: "Technology added to project",
            })
        } catch (error) {
            console.error("Failed to add technology", error)
            toast({
                title: "Error",
                description: "Could not add technology",
                variant: "destructive"
            })
        }
    }

    
    const handleRemoveTechnology = async (technologyId: number) => {
        try {
            const response: AxiosResponse<Project> = await projectsApi.removeTechnology(Number(id), technologyId)
            setProject({
                ...response.data,
                developers: response.data.developers || [],
                technologies: response.data.technologies || [],
                tasks: response.data.tasks || []
            })
            await refreshTechnologies(); // Refresh technologies after removing
            toast({
                title: "Success",
                description: "Technology removed from project",
            })
        } catch (error) {
            console.error("Failed to remove technology", error)
            toast({
                title: "Error",
                description: "Could not remove technology",
                variant: "destructive"
            })
        }
    }

    const handleCreateTask = async () => {
        if (!newTask.title || !newTask.description || !newTask.assignedToId) {
            toast({
                title: "Error",
                description: "Please fill all required fields",
                variant: "destructive"
            });
            return;
        }

        try {
            // Create the exact payload structure the API expects
            const taskPayload: TaskCreatePayload = {
                title: newTask.title,
                description: newTask.description,
                priority: {
                    id: newTask.priorityId
                },
                status: {
                    id: newTask.statusId
                },
                assignedTo: newTask.assignedToId ? {
                    id: newTask.assignedToId
                } : null,
                dueDate: newTask.dueDate,
                project: {
                    id: Number(id)
                },
                estimatedHours: newTask.estimatedHours || 0,
                actualHours: newTask.actualHours || 0
            };

            console.log("Sending task payload:", JSON.stringify(taskPayload, null, 2));

            const response = await tasksApi.create(taskPayload);
            console.log("Task created successfully:", response.data);

            // Refresh the project to get updated tasks
            const projectResponse = await projectsApi.getById(Number(id));
            setProject(projectResponse.data);

            // Reset form
            setNewTask({
                title: '',
                description: '',
                priorityId: 2, // Medium
                statusId: 1,  // To Do
                assignedToId: null,
                dueDate: new Date().toISOString().split('T')[0],
                estimatedHours: 0,
                actualHours: 0
            });

            toast({
                title: "Success",
                description: "Task created successfully",
            });
        } catch (error: any) {
            console.error("Task creation failed:", error.response?.data || error.message);

            let errorMessage = "Could not create task";
            if (error.response?.data?.errors) {
                errorMessage = Object.values(error.response.data.errors)
                    .flat()
                    .join('\n');
            }

            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            });
        }
    };

    const handleUpdateTaskStatus = async (taskId: number, statusId: number) => {
        try {
            await tasksApi.updateStatus(taskId, statusId)
            // Refresh project tasks
            const projectResponse = await projectsApi.getById(Number(id))
            setProject({
                ...projectResponse.data,
                developers: projectResponse.data.developers || [],
                technologies: projectResponse.data.technologies || [],
                tasks: projectResponse.data.tasks || []
            })
            toast({
                title: "Success",
                description: "Task status updated",
            })
        } catch (error) {
            console.error("Failed to update task status", error)
            toast({
                title: "Error",
                description: "Could not update task status",
                variant: "destructive"
            })
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    if (loading) {
        return (
            <DashboardLayout title="Project Details" userRole="manager">
                <div className="flex items-center justify-center h-40">
                    <p>Loading project details...</p>
                </div>
            </DashboardLayout>
        )
    }

    if (!project) {
        return (
            <DashboardLayout title="Project Details" userRole="manager">
                <div className="flex items-center justify-center h-40">
                    <p>Project not found</p>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout title={`Project: ${project.name}`} userRole="manager">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">{project.name}</h1>
                    <p className="text-muted-foreground">{project.description}</p>
                </div>
                <Button
                    variant={editing ? "default" : "outline"}
                    onClick={() => setEditing(!editing)}
                >
                    {editing ? (
                        <>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </>
                    ) : (
                        <>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Project
                        </>
                    )}
                </Button>
            </div>

            {editing ? (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Edit Project</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Project Name</Label>
                            <Input
                                id="name"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="clientName">Client Name</Label>
                            <Input
                                id="clientName"
                                value={editForm.clientName}
                                onChange={(e) => setEditForm({ ...editForm, clientName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deadlineDate">Deadline Date</Label>
                            <Input
                                id="deadlineDate"
                                type="date"
                                value={editForm.deadlineDate}
                                onChange={(e) => setEditForm({ ...editForm, deadlineDate: e.target.value })}
                            />
                        </div>
                        <Button onClick={handleEditProject}>
                            <Check className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>
                    </CardContent>
                </Card>
            ) : null}

            <Tabs defaultValue="overview">
                <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                    <TabsTrigger value="technologies">Technologies</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
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
                                    <p>{project.clientName || "Not specified"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                                    <Badge>{project.status.name}</Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                                    <p className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                        {formatDate(project.startDate)}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Deadline</p>
                                    <p className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                        {formatDate(project.deadlineDate)}
                                    </p>
                                </div>
                                {project.endDate && (
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">End Date</p>
                                        <p className="flex items-center">
                                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                            {formatDate(project.endDate)}
                                        </p>
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Completion</p>
                                    <p className="flex items-center">
                                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                        {project.completionPercentage}%
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Director</p>
                                    <p>
                                        {project.director.firstName} {project.director.lastName}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Manager</p>
                                    <p>
                                        {project.manager.firstName} {project.manager.lastName}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="team">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Current Team</CardTitle>
                                <CardDescription>Developers working on this project</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {project && Array.isArray(project.developers) && project.developers.length > 0 ? (
                                    <div className="space-y-4">
                                        {project.developers.map(developer => (
                                            <div key={`dev-${developer.id}`} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">
                                                        {developer?.firstName || 'Unknown'} {developer?.lastName || 'Developer'}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">{developer?.email || 'No email'}</p>
                                                </div>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleRemoveDeveloper(developer.id)}
                                                    disabled={removingDeveloperId === developer.id}
                                                >
                                                    {removingDeveloperId === developer.id ? "Removing..." : <Trash2 className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">No developers assigned yet</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Available Developers</CardTitle>
                                <CardDescription>Add developers to this project</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {availableDevelopers?.length ? (
                                    <div className="space-y-4">
                                        {availableDevelopers.map(developer => (
                                            <div key={`avail-dev-${developer.id}`} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">
                                                        {developer.firstName} {developer.lastName}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">{developer.email}</p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAddDeveloper(developer.id)}
                                                    disabled={addingDeveloperId === developer.id}
                                                >
                                                    {addingDeveloperId === developer.id ? (
                                                        "Adding..."
                                                    ) : (
                                                        <Plus className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">No available developers</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="technologies">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Current Technologies</CardTitle>
                                <CardDescription>Technologies used in this project</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {project.technologies.length === 0 ? (
                                    <p className="text-muted-foreground">No technologies added yet</p>
                                ) : (
                                    <div className="space-y-2">
                                        {project.technologies.map((tech) => (
                                            <div key={tech.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <Badge variant="secondary">{tech.name}</Badge>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleRemoveTechnology(tech.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Add Technology</CardTitle>
                                <CardDescription>Add a technology to this project</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Select Technology</Label>
                                    <Select
                                        value={selectedTechnologyId?.toString() || ''}
                                        onValueChange={(value) => setSelectedTechnologyId(Number(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a technology" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableTechnologies
                                                .filter(tech => !project.technologies.some(t => t.id === tech.id))
                                                .map((tech) => (
                                                    <SelectItem key={tech.id} value={tech.id.toString()}>
                                                        {tech.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button
                                    onClick={handleAddTechnology}
                                    disabled={!selectedTechnologyId}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Technology
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="tasks">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Create New Task</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="taskTitle">Title*</Label>
                                    <Input
                                        id="taskTitle"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        placeholder="Task title"
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="taskDescription">Description*</Label>
                                    <Textarea
                                        id="taskDescription"
                                        value={newTask.description}
                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                        placeholder="Task description"
                                        rows={3}
                                    />
                                </div>

                                {/* Priority */}
                                <div className="space-y-2">
                                    <Label htmlFor="taskPriority">Priority*</Label>
                                    <Select
                                        value={newTask.priorityId.toString()}
                                        onValueChange={(value) => setNewTask({ ...newTask, priorityId: Number(value) })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Low</SelectItem>
                                            <SelectItem value="2">Medium</SelectItem>
                                            <SelectItem value="3">High</SelectItem>
                                            <SelectItem value="4">Critical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <Label htmlFor="taskStatus">Status*</Label>
                                    <Select
                                        value={newTask.statusId.toString()}
                                        onValueChange={(value) => setNewTask({ ...newTask, statusId: Number(value) })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">To Do</SelectItem>
                                            <SelectItem value="2">In Progress</SelectItem>
                                            <SelectItem value="3">Review</SelectItem>
                                            <SelectItem value="4">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Assignee */}
                                <div className="space-y-2">
                                    <Label htmlFor="taskAssignee">Assign To*</Label>
                                    <Select
                                        value={newTask.assignedToId?.toString() || ''}
                                        onValueChange={(value) => setNewTask({ ...newTask, assignedToId: Number(value) })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a developer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {project?.developers?.map((dev) => (
                                                <SelectItem key={dev.id} value={dev.id.toString()}>
                                                    {dev.firstName} {dev.lastName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Due Date */}
                                <div className="space-y-2">
                                    <Label htmlFor="taskDueDate">Due Date*</Label>
                                    <Input
                                        id="taskDueDate"
                                        type="date"
                                        value={newTask.dueDate}
                                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                    />
                                </div>

                                {/* Estimated Hours */}
                                <div className="space-y-2">
                                    <Label htmlFor="taskEstimatedHours">Estimated Hours</Label>
                                    <Input
                                        id="taskEstimatedHours"
                                        type="number"
                                        min="0"
                                        value={newTask.estimatedHours}
                                        onChange={(e) => setNewTask({ ...newTask, estimatedHours: Number(e.target.value) })}
                                    />
                                </div>

                                {/* Actual Hours */}
                                <div className="space-y-2">
                                    <Label htmlFor="taskActualHours">Actual Hours</Label>
                                    <Input
                                        id="taskActualHours"
                                        type="number"
                                        min="0"
                                        value={newTask.actualHours}
                                        onChange={(e) => setNewTask({ ...newTask, actualHours: Number(e.target.value) })}
                                    />
                                </div>

                                <Button
                                    onClick={handleCreateTask}
                                    disabled={!newTask.title || !newTask.description || !newTask.assignedToId}
                                    className="w-full"
                                >
                                    Create Task
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Project Tasks</CardTitle>
                                <CardDescription>Tasks for this project</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {project.tasks.length === 0 ? (
                                    <p className="text-muted-foreground">No tasks created yet</p>
                                ) : (
                                    <div className="space-y-4">
                                        {project.tasks.map((task) => (
                                            <div key={task.id} className="p-4 border rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-medium">{task.title}</h3>
                                                    <Badge variant="outline">{task.progress}%</Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm">
                                                            <span className="font-medium">Assigned to:</span> {task.assignedTo.firstName} {task.assignedTo.lastName}
                                                        </p>
                                                        <p className="text-sm">
                                                            <span className="font-medium">Due:</span> {formatDate(task.dueDate)}
                                                        </p>
                                                    </div>
                                                    <Select
                                                        value={task.status.id.toString()}
                                                        onValueChange={(value) => handleUpdateTaskStatus(task.id, Number(value))}
                                                    >
                                                        <SelectTrigger className="w-[150px]">
                                                            <SelectValue placeholder="Status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="1">To Do</SelectItem>
                                                            <SelectItem value="2">In Progress</SelectItem>
                                                            <SelectItem value="3">Review</SelectItem>
                                                            <SelectItem value="4">Completed</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="mt-6">
                <Button variant="outline" onClick={() => navigate("/manager/projects")}>
                    Back to Projects
                </Button>
            </div>
        </DashboardLayout>
    )
}