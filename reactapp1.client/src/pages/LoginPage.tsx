"use client"

import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useToast } from "../hooks/use-toast"

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const role = searchParams.get("role") || "developer"
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real application, you would validate credentials against a database
    // For demo purposes, we'll just simulate a successful login

    let redirectPath = "/"

    switch (role) {
      case "director":
        redirectPath = "/director/dashboard"
        break
      case "manager":
        redirectPath = "/manager/dashboard"
        break
      case "developer":
        redirectPath = "/developer/dashboard"
        break
    }

    toast({
      title: "Login successful",
      description: `Welcome back, ${formData.email}!`,
    })

    navigate(redirectPath)
  }

  const getRoleTitle = () => {
    switch (role) {
      case "director":
        return "IT Director"
      case "manager":
        return "Project Manager"
      case "developer":
        return "Developer"
      default:
        return "User"
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login as {getRoleTitle()}</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              Login
            </Button>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary underline">
                Register
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
