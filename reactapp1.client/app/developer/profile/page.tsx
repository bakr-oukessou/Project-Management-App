"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Badge } from "@/src/components/ui/badge"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import DashboardLayout from "@/src/components/dashboard-layout"
import { authApi, usersApi, technologiesApi } from "@/src/api/authService"

interface UserProfile {
  id: number;
  name: string;
  email: string;
  userName: string;
  skills: string[];
  experience?: string;
}

interface Technology {
  id: number;
  name: string;
}

export default function DeveloperProfile() {
  const router = useRouter()
  const { toast } = useToast()

  const [profile, setProfile] = useState<UserProfile>({
    id: 0,
    name: "",
    email: "",
    userName: "",
    skills: [],
    experience: ""
  })
  const [availableSkills, setAvailableSkills] = useState<Technology[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch current user data and available technologies
        const [userResponse, technologiesResponse] = await Promise.all([
          authApi.me(),
          technologiesApi.getAll()
        ])
        
        const userData = userResponse.data
        
        setProfile({
          id: userData.id,
          name: userData.firstName && userData.lastName 
            ? `${userData.firstName} ${userData.lastName}` 
            : userData.userName || userData.email,
          email: userData.email,
          userName: userData.userName || userData.email,
          skills: userData.skills || [],
          experience: userData.experience || ""
        })
        
        setAvailableSkills(technologiesResponse.data || [])
        
      } catch (err: any) {
        console.error('Error fetching user data:', err)
        setError('Failed to load user profile')
        toast({
          title: "Error",
          description: "Failed to load your profile data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const addSkill = async () => {
    if (!newSkill) return
    
    // Find the technology by name
    const technology = availableSkills.find(tech => 
      tech.name.toLowerCase() === newSkill.toLowerCase()
    )
    
    if (!technology) {
      toast({
        title: "Error",
        description: "Please select a skill from the available options.",
        variant: "destructive",
      })
      return
    }
    
    if (profile.skills.includes(technology.name)) {
      toast({
        title: "Error",
        description: "This skill is already added to your profile.",
        variant: "destructive",
      })
      return
    }
    
    try {
      // Add skill via API
      await usersApi.addSkill(technology.id)
      
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, technology.name],
      }))
      setNewSkill("")
      
      toast({
        title: "Success",
        description: "Skill added successfully.",
      })
    } catch (err: any) {
      console.error('Error adding skill:', err)
      toast({
        title: "Error",
        description: "Failed to add skill. Please try again.",
        variant: "destructive",
      })
    }
  }

  const removeSkill = async (skillName: string) => {
    // Find the technology by name
    const technology = availableSkills.find(tech => 
      tech.name.toLowerCase() === skillName.toLowerCase()
    )
    
    if (!technology) {
      toast({
        title: "Error",
        description: "Unable to remove skill. Please try again.",
        variant: "destructive",
      })
      return
    }
    
    try {
      // Remove skill via API
      await usersApi.removeSkill(technology.id)
      
      setProfile((prev) => ({
        ...prev,
        skills: prev.skills.filter((s) => s !== skillName),
      }))
      
      toast({
        title: "Success",
        description: "Skill removed successfully.",
      })
    } catch (err: any) {
      console.error('Error removing skill:', err)
      toast({
        title: "Error",
        description: "Failed to remove skill. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      
      // Update user profile
      const updateData = {
        firstName: profile.name.split(' ')[0] || profile.name,
        lastName: profile.name.split(' ').slice(1).join(' ') || '',
        email: profile.email,
        userName: profile.userName,
        experience: profile.experience
      }
      
      await usersApi.updateProfile(updateData)
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      router.push("/developer/dashboard")
    } catch (err: any) {
      console.error('Error updating profile:', err)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Edit Profile" userRole="developer">
        <Card>
          <CardContent className="flex justify-center items-center h-64">
            <p>Loading profile...</p>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="Edit Profile" userRole="developer">
        <Card>
          <CardContent className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
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
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={profile.name} 
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={profile.email} 
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userName">Username</Label>
              <Input 
                id="userName" 
                name="userName" 
                value={profile.userName} 
                onChange={handleChange}
                required
              />
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
                    .filter((tech) => !profile.skills.includes(tech.name))
                    .map((tech) => (
                      <option key={tech.id} value={tech.name} />
                    ))}
                </datalist>
                <Button 
                  type="button" 
                  onClick={addSkill} 
                  disabled={!newSkill || profile.skills.some(skill => 
                    skill.toLowerCase() === newSkill.toLowerCase()
                  )}
                >
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push("/developer/dashboard")}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardLayout>
  )
}