import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {useToast} from '../ui/use-toast'
import {Button} from '../ui/button'
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '../ui/card'
import {Checkbox} from '../ui/checkbox'
import {Input} from '../ui/input'
import {Label} from '../ui/label'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '../ui/table'
import type {Project, User} from '../../types'

// Mock projects data
const mockProjects: Project[] = [
 {
  id: 'proj1',
  name: 'Refonte Site Web',
  description: 'Refonte complète du site web corporate',
  client: 'Entreprise ABC',
  startDate: '2023-06-01',
  deliveryDate: '2023-09-30',
  developmentDays: 80,
  projectManagerId: 'pm1',
  technologies: ['React', 'Node.js', 'PostgreSQL'],
  methodology: 'Agile',
  status: 'planning'
 }
]

// Mock developers data
const mockDevelopers: User[] = [
 {
  id: 'dev1',
  name: 'Alice Martin',
  email: 'alice@example.com',
  role: 'developer',
  skills: ['React', 'Angular', 'Node.js']
 },
 {
  id: 'dev2',
  name: 'Bob Dupont',
  email: 'bob@example.com',
  role: 'developer',
  skills: ['React', 'Vue.js', 'MongoDB']
 },
 {
  id: 'dev3',
  name: 'Claire Dubois',
  email: 'claire@example.com',
  role: 'developer',
  skills: ['Node.js', 'Express', 'PostgreSQL']
 },
 {
  id: 'dev4',
  name: 'David Moreau',
  email: 'david@example.com',
  role: 'developer',
  skills: ['React', 'React Native', 'Firebase']
 },
 {
  id: 'dev5',
  name: 'Emma Petit',
  email: 'emma@example.com',
  role: 'developer',
  skills: ['Angular', 'Spring Boot', 'MySQL']
 }
]

export default function TeamFormation() {
 const {id} = useParams<{id: string}>()
 const {toast} = useToast()

 const [project, setProject] = useState<Project | null>(null)
 const [developers, setDevelopers] = useState<User[]>([])
 const [selectedDevelopers, setSelectedDevelopers] = useState<string[]>([])
 const [meetingDate, setMeetingDate] = useState('')

 useEffect(() => {
  // In a real app, fetch project by ID from API
  if (id) {
   const foundProject = mockProjects.find(p => p.id === id)
   if (foundProject) {
    setProject(foundProject)
    if (foundProject.meetingDate) {
     setMeetingDate(foundProject.meetingDate)
    }
    if (foundProject.team) {
     setSelectedDevelopers(foundProject.team)
    }

    // Filter developers who have skills matching the project technologies
    if (foundProject.technologies && foundProject.technologies.length > 0) {
     const filteredDevelopers = mockDevelopers.filter(dev => dev.skills?.some(skill => foundProject.technologies?.includes(skill)))
     setDevelopers(filteredDevelopers)
    } else {
     setDevelopers(mockDevelopers)
    }
   }
  }
 }, [id])

 const handleDeveloperToggle = (developerId: string) => {
  setSelectedDevelopers(prev => (prev.includes(developerId) ? prev.filter(id => id !== developerId) : [...prev, developerId]))
 }

 const handleSave = () => {
  if (!meetingDate) {
   toast({
    title: 'Date de réunion requise',
    description: "Veuillez définir une date de réunion pour l'équipe.",
    variant: 'destructive'
   })
   return
  }

  if (selectedDevelopers.length === 0) {
   toast({
    title: 'Équipe requise',
    description: "Veuillez sélectionner au moins un développeur pour l'équipe.",
    variant: 'destructive'
   })
   return
  }

  // In a real app, this would be an API call to update the project
  toast({
   title: 'Équipe formée',
   description: `L'équipe a été formée et la réunion planifiée pour le ${new Date(meetingDate).toLocaleDateString()}.`
  })
 }

 const getMatchingSkills = (developer: User) => {
  if (!project?.technologies || !developer.skills) return []
  return developer.skills.filter(skill => project.technologies?.includes(skill))
 }

 if (!project) {
  return <div>Chargement...</div>
 }

 return (
  <Card>
   <CardHeader>
    <CardTitle>Formation de l'équipe pour {project.name}</CardTitle>
   </CardHeader>
   <CardContent className="space-y-6">
    <div>
     <h3 className="text-lg font-medium mb-2">Technologies requises</h3>
     <div className="flex flex-wrap gap-2">
      {project.technologies?.map(tech => (
       <div key={tech} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
        {tech}
       </div>
      ))}
     </div>
    </div>

    <div className="space-y-2">
     <Label htmlFor="meetingDate">Date de réunion de présentation</Label>
     <Input id="meetingDate" type="date" value={meetingDate} onChange={e => setMeetingDate(e.target.value)} required />
    </div>

    <div>
     <h3 className="text-lg font-medium mb-2">Développeurs disponibles</h3>
     {developers.length === 0 ? (
      <p className="text-muted-foreground">Aucun développeur avec les compétences requises n'a été trouvé.</p>
     ) : (
      <Table>
       <TableHeader>
        <TableRow>
         <TableHead className="w-12">Sélection</TableHead>
         <TableHead>Nom</TableHead>
         <TableHead>Email</TableHead>
         <TableHead>Compétences correspondantes</TableHead>
        </TableRow>
       </TableHeader>
       <TableBody>
        {developers.map(developer => {
         const matchingSkills = getMatchingSkills(developer)
         return (
          <TableRow key={developer.id}>
           <TableCell>
            <Checkbox checked={selectedDevelopers.includes(developer.id)} onCheckedChange={() => handleDeveloperToggle(developer.id)} />
           </TableCell>
           <TableCell>{developer.name}</TableCell>
           <TableCell>{developer.email}</TableCell>
           <TableCell>
            <div className="flex flex-wrap gap-1">
             {matchingSkills.map(skill => (
              <span key={skill} className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
               {skill}
              </span>
             ))}
            </div>
           </TableCell>
          </TableRow>
         )
        })}
       </TableBody>
      </Table>
     )}
    </div>
   </CardContent>
   <CardFooter>
    <Button onClick={handleSave} disabled={selectedDevelopers.length === 0 || !meetingDate}>
     Enregistrer et envoyer les notifications
    </Button>
   </CardFooter>
  </Card>
 )
}
