import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Calendar, Clock } from "lucide-react"

type Project = {
    id: string | number
    name: string
    description?: string
    client?: string
    status?: { name: string } | string
    startDate?: string
    endDate?: string
    developmentDays?: number
    manager?: { firstName: string, lastName: string } | string
}

type ProjectListProps = {
    projects: Project[]
    userRole: string
}

export default function ProjectList({ projects, userRole }: ProjectListProps) {
    if (!projects || projects.length === 0) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center p-6">
                    <p className="text-muted-foreground">No projects found</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: Project) => (
                <Card key={project.id}>
                    <CardHeader>
                        <CardTitle>{project.name}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {project.client && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Client:</span>
                                    <span className="text-sm font-medium">{project.client}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Status:</span>
                                <Badge>
                                    {typeof project.status === 'string' ? project.status : project.status?.name}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Start Date:</span>
                                <span className="text-sm font-medium flex items-center">
                                    <Calendar className="mr-1 h-3 w-3" />
                                    {project.startDate || "N/A"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">End Date:</span>
                                <span className="text-sm font-medium flex items-center">
                                    <Calendar className="mr-1 h-3 w-3" />
                                    {project.endDate || "N/A"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Development Days:</span>
                                <span className="text-sm font-medium flex items-center">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {project.developmentDays ?? "N/A"}
                                </span>
                            </div>
                            {project.manager && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Project Manager:</span>
                                    <span className="text-sm font-medium">
                                        {typeof project.manager === 'string'
                                            ? project.manager
                                            : `${project.manager.firstName} ${project.manager.lastName}`}
                                    </span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Link to={`/${userRole}/projects/${project.id}`} className="w-full">
                            <Button variant="outline" className="w-full">
                                View Details
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
