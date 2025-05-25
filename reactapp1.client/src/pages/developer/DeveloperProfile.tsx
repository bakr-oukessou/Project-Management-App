"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Badge } from "../../components/ui/badge"
import { X } from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import DashboardLayout from "../../components/dashboard-layout"
import { authApi, usersApi } from "../../api/authService"

const availableSkills = [
  ".NET",
  "Java",
  "PHP",
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "Angular",
  "Vue.js",
  "Node.js",
  "SQL Server",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Azure",
  "Docker",
  "Kubernetes",
]

export default function DeveloperProfile() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [profile, setProfile] = useState({
    id: 0,
    name: "",
    email: "",
    username: "",
    role: "",
    firstName: "",
    lastName: "",
    skills: [] as string[],
    experience: "",
    profilePicture: "" as string | null,
    managedProjects: [] as any[],
    projects: [] as any[],
    assignedTasks: [] as any[],
  })
  const [newSkill, setNewSkill] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // 1. Get basic user info
        const meResponse = await authApi.me()
        const me = meResponse.data

        // 2. Get full user profile
        const userResponse = await usersApi.getById(me.id)
        const user = userResponse.data

        setProfile({
          id: user.id,
          name:
            user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.username || user.email,
          email: user.email,
          username: user.username,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
            skills: user.skills || ["React", ".NET", "JS"],
          experience: user.experience || "5 years",
          profilePicture: user.profilePicture || "",
          managedProjects: user.managedProjects || [],
          projects: user.projects || [],
          assignedTasks: user.assignedTasks || [],
        })
      } catch (err: any) {
        toast({
          title: "Error",
          description: "Failed to load your profile.",
          variant: "destructive",
        })
      }
    }
    fetchProfile()
  }, [toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // For demo: just use the file name as a string. In a real app, upload and get a URL.
      setProfile((prev) => ({ ...prev, profilePicture: file.name }))
    }
  }

  const addSkill = () => {
    if (newSkill && !profile.skills.includes(newSkill)) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Prepare update payload
      const updateData = {
        id: profile.id,
        username: profile.username,
        email: profile.email,
        role: profile.role,
        firstName: profile.firstName,
        lastName: profile.lastName,
        profilePicture: profile.profilePicture,
        skills: profile.skills,
        experience: profile.experience,
        // Optionally: managedProjects, projects, assignedTasks if you want to allow editing
      }
      await usersApi.update(profile.id, updateData)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
      navigate("/developer/dashboard")
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout title="Edit Profile" userRole="developer">
      <Card>
        <CardHeader>
          <CardTitle>Developer Profile</CardTitle>
          <CardDescription>Update your profile information and skills</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" value={profile.username} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={profile.name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={profile.email} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" name="role" value={profile.role} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profilePicture">Profile Picture</Label>
              <Input id="profilePicture" name="profilePicture" type="file" onChange={handleProfilePictureChange} />
              {profile.profilePicture && (
                <div className="mt-2">
                  <span>Current: {profile.profilePicture}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                name="experience"
                value={profile.experience}
                onChange={handleChange}
                placeholder="e.g., 5 years"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {profile.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="rounded-full hover:bg-muted-foreground/10"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {skill}</span>
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="newSkill"
                  list="skillOptions"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a new skill"
                  className="flex-1"
                />
                <datalist id="skillOptions">
                  {availableSkills
                    .filter((skill) => !profile.skills.includes(skill))
                    .map((skill) => (
                      <option key={skill} value={skill} />
                    ))}
                </datalist>
                <Button type="button" onClick={addSkill} disabled={!newSkill || profile.skills.includes(newSkill)}>
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/developer/dashboard")} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardLayout>
  )
}
