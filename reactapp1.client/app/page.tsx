import { Link } from "react-router-dom"
import { Button } from ".././src/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from ".././src/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Project Management System</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>IT Director</CardTitle>
              <CardDescription>Create and manage projects, assign project managers</CardDescription>
            </CardHeader>
            <CardContent>
              <p>As an IT Director, you can create new projects, modify existing ones, and assign project managers.</p>
            </CardContent>
            <CardFooter>
              <Link to="/login?role=director" className="w-full">
                <Button className="w-full">Login as Director</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Manager</CardTitle>
              <CardDescription>Manage project details, technologies, and development teams</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                As a Project Manager, you can add technologies, methodologies, and assign developers to your projects.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/login?role=manager" className="w-full">
                <Button className="w-full">Login as Manager</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Developer</CardTitle>
              <CardDescription>View assigned projects and update task progress</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                As a Developer, you can update your profile with skills, view assigned projects, and report daily
                progress.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/login?role=developer" className="w-full">
                <Button className="w-full">Login as Developer</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Project Management System</p>
        </div>
      </footer>
    </div>
  )
}
