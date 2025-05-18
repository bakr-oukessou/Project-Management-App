import {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {Card, CardContent, CardHeader, CardTitle} from '../ui/card'
import {Button} from '../ui/button'
import type {Service, Project} from '../../types'

// Mock services data
const mockServices: Service[] = [
 {
  id: 'serv1',
  projectId: 'proj1',
  name: 'Authentification',
  description: "Système d'authentification avec JWT",
  durationDays: 5,
  assignedDeveloperId: 'dev1'
 }
]

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
  team: ['dev1', 'dev3', 'dev4'],
  meetingDate: '2023-06-05',
  status: 'in-progress'
 }
]

export default function ServicesList() {
 const {id} = useParams<{id: string}>()
 const navigate = useNavigate()
 const [service, setService] = useState<Service | null>(null)
 const [project, setProject] = useState<Project | null>(null)

 useEffect(() => {
  // In a real app, fetch service by ID from API
  if (id) {
   const foundService = mockServices.find(s => s.id === id)
   if (foundService) {
    setService(foundService)

    // Get the related project
    const foundProject = mockProjects.find(p => p.id === foundService.projectId)
    if (foundProject) {
     setProject(foundProject)
    }
   }
  }
 }, [id])

 if (!service || !project) {
  return <div>Chargement...</div>
 }

 return (
  <Card>
   <CardHeader>
    <CardTitle>Détails du service</CardTitle>
   </CardHeader>
   <CardContent className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
     <div>
      <h3 className="text-lg font-medium mb-2">Informations du service</h3>
      <div className="space-y-2">
       <div>
        <span className="font-medium">Nom:</span> {service.name}
       </div>
       <div>
        <span className="font-medium">Description:</span>
        <p className="mt-1">{service.description}</p>
       </div>
       <div>
        <span className="font-medium">Durée estimée:</span> {service.durationDays} jours
       </div>
      </div>
     </div>

     <div>
      <h3 className="text-lg font-medium mb-2">Projet associé</h3>
      <div className="space-y-2">
       <div>
        <span className="font-medium">Nom du projet:</span> {project.name}
       </div>
       <div>
        <span className="font-medium">Client:</span> {project.client}
       </div>
       <div>
        <span className="font-medium">Date de livraison:</span> {new Date(project.deliveryDate).toLocaleDateString()}
       </div>
      </div>
     </div>
    </div>

    <div className="flex justify-center mt-6">
     <Button size="lg" onClick={() => navigate(`/developer/service/${service.id}/tasks`)}>
      Gérer les tâches et la progression
     </Button>
    </div>
   </CardContent>
  </Card>
 )
}
