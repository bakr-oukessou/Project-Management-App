/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

type UserRole = 'Director' | 'project-manager' | 'developer'

interface User {
    id: string
    name: string
    email: string
    role: UserRole
}

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const navigate = useNavigate()

    const login = async (email: string, password: string) => {
        // In a real app, this would be an API call to validate credentials
        // For demo purposes, we'll simulate different users based on email
        let mockUser: User

        if (email.includes('director')) {
            mockUser = {
                id: '1',
                name: 'Directeur Informatique',
                email,
                role: 'director'
            }
            navigate('/director')
        } else if (email.includes('manager')) {
            mockUser = {
                id: '2',
                name: 'Chef de Projet',
                email,
                role: 'project-manager'
            }
            navigate('/project-manager')
        } else {
            mockUser = {
                id: '3',
                name: 'Développeur',
                email,
                role: 'developer'
            }
            navigate('/developer')
        }

        setUser(mockUser)
    }

    const logout = () => {
        setUser(null)
        navigate('/login')
    }

    return (<AuthContext.Provider value= {{ user, login, logout, isAuthenticated: !!user }}> { children } </AuthContext.Provider>);
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
