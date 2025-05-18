import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'

// Pages
import LoginPage from './pages/LoginPage'
import DirectorDashboard from './pages/DirectorDashboard'
import ProjectManagerDashboard from './pages/ProjectManagerDashboard'
import DeveloperDashboard from './pages/DeveloperDashboard'

// Context
import { AuthProvider } from './context/AuthContext'

// Create a client
const queryClient = new QueryClient()

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <AuthProvider>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/director/*" element={<DirectorDashboard />} />
                        <Route path="/project-manager/*" element={<ProjectManagerDashboard />} />
                        <Route path="/developer/*" element={<DeveloperDashboard />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                    <Toaster />
                </AuthProvider>
            </Router>
        </QueryClientProvider>
    )
}
