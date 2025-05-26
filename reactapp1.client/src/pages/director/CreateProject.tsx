"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { useToast } from "../../hooks/use-toast"
import DashboardLayout from "../../components/dashboard-layout"
import { projectsApi, usersApi } from "../../api/authService"
import { useAuth } from "../../context/AuthContext"

interface ProjectFormData {
    name: string
    description: string
    clientName: string
    startDate: string
    deadlineDate: string
    directorId: number
    managerId: number | null
    statusId: number // Add statusId
}

interface ProjectFormErrors {
    name?: string
    description?: string
    clientName?: string
    startDate?: string
    deadlineDate?: string
    managerId?: string
}

export default function CreateProject() {
    const navigate = useNavigate()
    const { toast } = useToast()
    const { user } = useAuth()
    const [managers, setManagers] = useState<any[]>([])
    const [loadingManagers, setLoadingManagers] = useState(true)

    const [formData, setFormData] = useState<ProjectFormData>({
        name: "",
        description: "",
        clientName: "",
        startDate: "",
        deadlineDate: "",
        directorId: Number(user?.id) || 0,
        managerId: null,
        statusId: 1 // Or your default status ID, e.g., 1 for 'New' or 'Pending'
    })

    const [errors, setErrors] = useState<ProjectFormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const response = await usersApi.getManagers()
                setManagers(response.data)
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load managers",
                    variant: "destructive"
                })
            } finally {
                setLoadingManagers(false)
            }
        }

        fetchManagers()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))

        // Clear error when field is edited
        if (errors[name as keyof ProjectFormErrors]) {
            setErrors((prev) => ({ ...prev, [name as keyof ProjectFormErrors]: undefined }))
        }
    }

    const handleSelectChange = (name: keyof ProjectFormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value === "" ? null : Number(value)
        }))

        // Clear error when field is edited
        if (errors[name as keyof ProjectFormErrors]) {
            setErrors((prev) => ({ ...prev, [name as keyof ProjectFormErrors]: undefined }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: ProjectFormErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = "Project name is required"
        }

        if (!formData.clientName.trim()) {
            newErrors.clientName = "Client name is required"
        }

        if (!formData.startDate) {
            newErrors.startDate = "Start date is required"
        }

        if (!formData.deadlineDate) {
            newErrors.deadlineDate = "Deadline date is required"
        } else if (formData.startDate && new Date(formData.deadlineDate) <= new Date(formData.startDate)) {
            newErrors.deadlineDate = "Deadline date must be after start date"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        if (!validateForm()) {
            setIsSubmitting(false)
            return
        }

        try {
            // Only include the required fields
            const payload = {
                name: formData.name,
                description: formData.description,
                startDate: new Date(formData.startDate).toISOString(),
                deadlineDate: new Date(formData.deadlineDate).toISOString(),
                managerId: formData.managerId && formData.managerId !== 0 ? formData.managerId : null,
                directorId: formData.directorId,
                clientName: formData.clientName,
                statusId: formData.statusId // Add statusId to the payload
            }
            console.log('Payload:', payload);
            await projectsApi.create(payload)

            toast({
                title: "Success",
                description: "Project created successfully",
            })
            
            navigate("/director/projects/index")
        } catch (error: any) {
            console.error("Project creation failed:", error)
            let errorMessage = "Failed to create project"

            if (error.response?.data?.errors) {
                errorMessage = Object.entries(error.response.data.errors)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join('\n')
            }

            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <DashboardLayout title="Create New Project" userRole="director">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Project</CardTitle>
                    <CardDescription>Enter the details for the new project</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Project Name*</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter a unique project name"
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the project"
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="clientName">Client Name*</Label>
                            <Input
                                id="clientName"
                                name="clientName"
                                value={formData.clientName}
                                onChange={handleChange}
                                placeholder="Client name or organization"
                            />
                            {errors.clientName && <p className="text-sm text-destructive">{errors.clientName}</p>}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date*</Label>
                                <Input
                                    id="startDate"
                                    name="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                />
                                {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deadlineDate">Deadline Date*</Label>
                                <Input
                                    id="deadlineDate"
                                    name="deadlineDate"
                                    type="date"
                                    value={formData.deadlineDate}
                                    onChange={handleChange}
                                />
                                {errors.deadlineDate && <p className="text-sm text-destructive">{errors.deadlineDate}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="managerId">Project Manager</Label>
                            <Select
                                value={formData.managerId?.toString() || ""}
                                onValueChange={(value) => handleSelectChange("managerId", value)}
                                disabled={loadingManagers}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={loadingManagers ? "Loading managers..." : "Select a manager"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">No manager assigned</SelectItem>
                                    {managers.map((manager) => (
                                        <SelectItem key={manager.id} value={manager.id.toString()}>
                                            {manager.firstName} {manager.lastName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/director/projects/index")}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Project"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </DashboardLayout>
    )
}