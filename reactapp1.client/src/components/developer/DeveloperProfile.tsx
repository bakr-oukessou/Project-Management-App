/* eslint-disable @typescript-eslint/no-unused-vars */
import {useState, useEffect} from 'react'
import {useAuth} from '../../context/AuthContext'
import {useToast} from '../../components/ui/use-toast'
import {Button} from '../../components/ui/button'
import {Input} from '../../components/ui/input'
import {Label} from '../../components/ui/label'
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '../../components/ui/card'
import {Badge} from '../../components/ui/badge'
import {X, Plus} from 'lucide-react'
import type {User} from '../../types'

// Mock available skills
const availableSkills = ['React', 'Angular', 'Vue.js', 'React Native', 'Flutter', 'Node.js', 'Express', 'Django', 'Laravel', 'Spring Boot', 'MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub Actions']

export default function DeveloperProfile() {
 const {user} = useAuth()
 const {toast} = useToast()

 // In a real app, this would be fetched from an API
 const [profile, setProfile] = useState<User>({
  id: 'dev1',
  name: 'Alice Martin',
  email: 'alice@example.com',
  role: 'developer',
  skills: ['React', 'Angular', 'Node.js']
 })

 const [newSkill, setNewSkill] = useState('')
 const [customSkill, setCustomSkill] = useState('')
 const [isAddingCustom, setIsAddingCustom] = useState(false)

 useEffect(() => {
  // In a real app, fetch the developer profile from API
  // For now, we'll use the mock data
 }, [])

 const handleAddSkill = () => {
  if (newSkill && !profile.skills?.includes(newSkill)) {
   setProfile(prev => ({
    ...prev,
    skills: [...(prev.skills || []), newSkill]
   }))
   setNewSkill('')
  }
 }

 const handleAddCustomSkill = () => {
  if (customSkill && !profile.skills?.includes(customSkill)) {
   setProfile(prev => ({
    ...prev,
    skills: [...(prev.skills || []), customSkill]
   }))
   setCustomSkill('')
   setIsAddingCustom(false)
  }
 }

 const handleRemoveSkill = (skill: string) => {
  setProfile(prev => ({
   ...prev,
   skills: prev.skills?.filter(s => s !== skill) || []
  }))
 }

 const handleSave = () => {
  // In a real app, this would be an API call to update the profile
  toast({
   title: 'Profil mis à jour',
   description: 'Votre profil a été mis à jour avec succès.'
  })
 }

 const filteredSkills = availableSkills.filter(skill => !profile.skills?.includes(skill) && skill.toLowerCase().includes(newSkill.toLowerCase()))

 return (
  <Card className="max-w-2xl mx-auto">
   <CardHeader>
    <CardTitle>Mon profil développeur</CardTitle>
   </CardHeader>
   <CardContent className="space-y-6">
    <div className="space-y-2">
     <Label htmlFor="name">Nom</Label>
     <Input id="name" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} required />
    </div>

    <div className="space-y-2">
     <Label htmlFor="email">Email</Label>
     <Input id="email" type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} required />
    </div>

    <div className="space-y-2">
     <Label>Compétences</Label>
     <div className="flex flex-wrap gap-2 min-h-10 p-2 border rounded-md">
      {profile.skills?.length === 0 ? (
       <span className="text-muted-foreground">Aucune compétence ajoutée</span>
      ) : (
       profile.skills?.map(skill => (
        <Badge key={skill} variant="secondary" className="flex items-center gap-1">
         {skill}
         <button onClick={() => handleRemoveSkill(skill)} className="ml-1 rounded-full hover:bg-muted p-1">
          <X className="h-3 w-3" />
         </button>
        </Badge>
       ))
      )}
     </div>
    </div>

    {isAddingCustom ? (
     <div className="flex gap-2">
      <div className="flex-1">
       <Input placeholder="Saisir une compétence personnalisée" value={customSkill} onChange={e => setCustomSkill(e.target.value)} />
      </div>
      <Button onClick={handleAddCustomSkill} disabled={!customSkill}>
       Ajouter
      </Button>
      <Button variant="outline" onClick={() => setIsAddingCustom(false)}>
       Annuler
      </Button>
     </div>
    ) : (
     <div className="flex gap-2">
      <div className="flex-1 relative">
       <Input placeholder="Rechercher une compétence" value={newSkill} onChange={e => setNewSkill(e.target.value)} />
       {newSkill && filteredSkills.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
         {filteredSkills.map(skill => (
          <div
           key={skill}
           className="px-3 py-2 hover:bg-muted cursor-pointer"
           onClick={() => {
            setNewSkill(skill)
           }}
          >
           {skill}
          </div>
         ))}
        </div>
       )}
      </div>
      <Button onClick={handleAddSkill} disabled={!newSkill || !filteredSkills.includes(newSkill)}>
       Ajouter
      </Button>
      <Button variant="outline" onClick={() => setIsAddingCustom(true)}>
       <Plus className="h-4 w-4 mr-2" />
       Personnalisée
      </Button>
     </div>
    )}
   </CardContent>
   <CardFooter>
    <Button onClick={handleSave}>Enregistrer les modifications</Button>
   </CardFooter>
  </Card>
 )
}
