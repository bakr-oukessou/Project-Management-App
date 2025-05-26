import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import DashboardLayout from "../../components/dashboard-layout"
import { projectsApi, usersApi } from "../../api/authService"
//import { toast } from "../../hooks/use-toast"

export default function NewProject() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        name: "",
        description: "",
        clientName: "",
        startDate: "",
        deadlineDate: "",
        managerId: ""
    })
    const [managers, setManagers] = useState<any[]>([])

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const res = await usersApi.getManagers()
                setManagers(res.data)
            } catch (err) {
                console.error("Failed to fetch managers", err)
            }
        }
        fetchManagers()
    }, [])

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            await projectsApi.create({
                name: form.name,
                description: form.description,
                clientName: form.clientName,
                startDate: form.startDate,
                deadlineDate: form.deadlineDate,
                managerId: Number(form.managerId),
            })
            //toast({ title: "Project created successfully!" })
            navigate("/director/projects/index")
        } catch (err) {
            console.error("Failed to create project", err)
            //toast({ title: "Error", description: "Could not create project", variant: "destructive" })
        }
    }

    return (
        <DashboardLayout title="Create New Project" userRole="director">
            <Card>
                <CardHeader>
                    <CardTitle>New Project</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input name="name" placeholder="Project Name" value={form.name} onChange={handleChange} required />
                        <textarea
                            name="description"
                            placeholder="Project Description"
                            className="w-full border rounded px-3 py-2"
                            value={form.description}
                            onChange={handleChange}
                            required
                        />
                        <Input name="clientName" placeholder="Client Name" value={form.clientName} onChange={handleChange} />
                        <Input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
                        <Input type="date" name="deadlineDate" value={form.deadlineDate} onChange={handleChange} required />
                        <select
                            name="managerId"
                            className="w-full border rounded px-3 py-2"
                            value={form.managerId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Manager</option>
                            {managers.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.firstName} {m.lastName} ({m.email})
                                </option>
                            ))}
                        </select>
                        <Button type="submit" className="w-full">Create Project</Button>
                    </form>
                </CardContent>
            </Card>
        </DashboardLayout>
    )
}
