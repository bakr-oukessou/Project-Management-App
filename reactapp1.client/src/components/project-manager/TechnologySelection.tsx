import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {useToast} from '../ui/use-toast'
import {Button} from '../ui/button'
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '../ui/card'
import {Label} from '../ui/label'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../ui/select'
import {Badge} from '../ui/badge'
import {X} from 'lucide-react'
import type {Project} from '../../types'

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
  status: 'new'
 },
 {
  id: 'proj2',
  name: 'Application Mobile',
  description: "Développement d'une application mobile de gestion",
  client: 'Société XYZ',
  startDate: '2023-07-15',
  deliveryDate: '2023-12-15',
  developmentDays: 110,
  projectManagerId: 'pm1',
  technologies: ['React Native', 'Node.js'],
  methodology: 'Agile',
  status: 'planning'
 }
]

// Mock technologies
const availableTechnologies = ['React', 'Angular', 'Vue.js', 'React Native', 'Flutter', 'Node.js', 'Express', 'Django', 'Laravel', 'Spring Boot', 'MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub Actions']

// Mock methodologies
const availableMethodologies = ['Agile', 'Scrum', 'Kanban', 'XP', 'Waterfall', 'DevOps', 'RAD']

export default function TechnologySelection() {
 const {id} = useParams<{id: string}>()
 const {toast} = useToast()

 const [project, setProject] = useState<Project | null>(null)
 const [technologies, setTechnologies] = useState<string[]>([])
 const [newTechnology, setNewTechnology] = useState('')
 const [methodology, setMethodology] = useState('')

 useEffect(() => {
  // In a real app, fetch project by ID from API
  if (id) {
   const foundProject = mockProjects.find(p => p.id === id)
   if (foundProject) {
    setProject(foundProject)
    setTechnologies(foundProject.technologies || [])
    setMethodology(foundProject.methodology || '')
   }
  }
 }, [id])

 const handleAddTechnology = () => {
  if (newTechnology && !technologies.includes(newTechnology)) {
   setTechnologies([...technologies, newTechnology])
   setNewTechnology('')
  }
 }

 const handleRemoveTechnology = (tech: string) => {
  setTechnologies(technologies.filter(t => t !== tech))
 }

 const handleSave = () => {
  // In a real app, this would be an API call to update the project
  toast({
   title: 'Technologies enregistrées',
   description: 'Les technologies et la méthodologie ont été mises à jour.'
  })
 }

 if (!project) {
  return <div>Chargement...</div>
 }

 return (
  <Card>
   <CardHeader>
    <CardTitle>Sélection des technologies pour {project.name}</CardTitle>
   </CardHeader>
   <CardContent className="space-y-6">
    <div className="space-y-2">
     <Label>Technologies sélectionnées</Label>
     <div className="flex flex-wrap gap-2 min-h-10 p-2 border rounded-md">
      {technologies.length === 0 ? (
       <span className="text-muted-foreground">Aucune technologie sélectionnée</span>
      ) : (
       technologies.map(tech => (
        <Badge key={tech} variant="secondary" className="flex items-center gap-1">
         {tech}
         <button onClick={() => handleRemoveTechnology(tech)} className="ml-1 rounded-full hover:bg-muted p-1">
          <X className="h-3 w-3" />
         </button>
        </Badge>
       ))
      )}
     </div>
    </div>

    <div className="flex gap-2">
     <div className="flex-1">
      <Label htmlFor="technology">Ajouter une technologie</Label>
      <Select value={newTechnology} onValueChange={setNewTechnology}>
       <SelectTrigger>
        <SelectValue placeholder="Sélectionner une technologie" />
       </SelectTrigger>
       <SelectContent>
        {availableTechnologies
         .filter(tech => !technologies.includes(tech))
         .map(tech => (
          <SelectItem key={tech} value={tech}>
           {tech}
          </SelectItem>
         ))}
       </SelectContent>
      </Select>
     </div>
     <Button className="mt-auto" onClick={handleAddTechnology} disabled={!newTechnology}>
      Ajouter
     </Button>
    </div>

    <div className="space-y-2">
     <Label htmlFor="methodology">Méthodologie</Label>
     <Select value={methodology} onValueChange={setMethodology}>
      <SelectTrigger>
       <SelectValue placeholder="Sélectionner une méthodologie" />
      </SelectTrigger>
      <SelectContent>
       {availableMethodologies.map(method => (
        <SelectItem key={method} value={method}>
         {method}
        </SelectItem>
       ))}
      </SelectContent>
     </Select>
    </div>
   </CardContent>
   <CardFooter>
    <Button onClick={handleSave} disabled={technologies.length === 0 || !methodology}>
     Enregistrer et continuer
    </Button>
   </CardFooter>
  </Card>
 )
}
