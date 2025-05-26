import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DirectorDashboard from "./pages/director/DirectorDashboard"
import NewProject from "./pages/director/NewProject"
import ProjectsIndex from "./pages/director/ProjectsIndex"
import ProjectDetails from "./pages/director/ProjectDetails"
import DeleteProject from "./pages/director/DeleteProject"
import EditProject from "./pages/director/EditProject"
import CreateProject from "./pages/director/CreateProject"
import ManagerDashboard from "./pages/manager/ManagerDashboard"
import ManagerProjectDetails from "./pages/manager/ManagerProjectDetails"
import AddTechnologies from "./pages/manager/AddTechnologies"
import FormTeam from "./pages/manager/FormTeam"
import AssignTasks from "./pages/manager/AssignTasks"
import DeveloperDashboard from "./pages/developer/DeveloperDashboard"
import DeveloperProjectDetails from "./pages/developer/DeveloperProjectDetails"
import DeveloperProfile from "./pages/developer/DeveloperProfile"
import UpdateProgress from "./pages/developer/UpdateProgress"
import ViewTasks from "./pages/developer/ViewTasks"
import ViewProjects from "./pages/developer/ViewProjects"
import EditProfile from "./pages/developer/EditProfile"
import { Toaster } from "./components/ui/toaster"
import { ThemeProvider } from "./components/theme-provider"
import ManagerProjectsPage from "./pages/manager/ManagerProjectsPage"
import { AuthProvider } from "./context/AuthContext" // Import AuthProvider

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider> {/* Add AuthProvider here */}
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Director routes */}
            <Route path="/director/dashboard" element={<DirectorDashboard />} />
            <Route path="/director/projects/new" element={<NewProject />} />
            <Route path="/director/projects/index" element={<ProjectsIndex />} />
            <Route path="/director/projects/details/:id" element={<ProjectDetails />} />
            <Route path="/director/projects/delete/:id" element={<DeleteProject />} />
            <Route path="/director/projects/edit/:id" element={<EditProject />} />
            <Route path="/director/projects/create" element={<CreateProject />} />

            {/* Manager routes */}
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/manager/projects/:id" element={<ManagerProjectDetails />} />
            <Route path="/manager/projects" element={<ManagerProjectsPage />} />
            <Route path="/manager/projects/add-technologies/:id" element={<AddTechnologies />} />
            <Route path="/manager/projects/form-team/:id" element={<FormTeam />} />
            <Route path="/manager/projects/assign-tasks/:id" element={<AssignTasks />} />

            {/* Developer routes */}
            <Route path="/developer/dashboard" element={<DeveloperDashboard />} />
            <Route path="/developer/projects/:id" element={<DeveloperProjectDetails />} />
            <Route path="/developer/profile" element={<DeveloperProfile />} />
            <Route path="/developer/tasks/update-progress/:id" element={<UpdateProgress />} />
            <Route path="/developer/tasks/view" element={<ViewTasks />} />
            <Route path="/developer/projects/view" element={<ViewProjects />} />
            <Route path="/developer/profile/edit" element={<EditProfile />} />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/error" replace />} />
          </Routes>
        </AuthProvider> {/* Close AuthProvider */}
        <Toaster />
      </Router>
    </ThemeProvider>
  )
}

export default App
