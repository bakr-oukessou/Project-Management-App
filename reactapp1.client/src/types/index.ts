export type UserRole = 'director' | 'project-manager' | 'developer'

export interface User {
    id: string
    name: string
    email: string
    role: UserRole
    skills?: string[]
}

export interface Project {
    id: string
    name: string
    description: string
    client: string
    startDate: string
    deliveryDate: string
    developmentDays: number
    projectManagerId: string
    technologies?: string[]
    methodology?: string
    team?: string[]
    meetingDate?: string
    status: 'new' | 'planning' | 'in-progress' | 'completed'
}

export interface Service {
    id: string
    projectId: string
    name: string
    description: string
    durationDays: number
    assignedDeveloperId: string
}

export interface Task {
    id: string
    serviceId: string
    description: string
    progress: number // 0-100
    date: string
}

export interface Notification {
    id: string
    userId: string
    message: string
    read: boolean
    date: string
    type: 'project-assignment' | 'team-formation' | 'meeting' | 'service-assignment'
    relatedId?: string // ID of related project, service, etc.
}
