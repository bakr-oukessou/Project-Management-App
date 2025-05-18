import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {Card, CardContent, CardHeader, CardTitle} from '../ui/card'
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

export default function ProjectDetails() {
 const {id} = useParams<{id: string}>()
 const [project, setProject] = useState<Project | null>(null)

 useEffect(() => {
  // In a real app, fetch project by ID from API
  if (id) {
   const foundProject = mockProjects.find(p => p.id === id)
   if (foundProject) {
    setProject(foundProject)
   }
  }
 }, [id])

 if (!project) {
  return <div>Chargement...</div>
 }

 return (
  <Card>
   <CardHeader>
    <CardTitle>{project.name}</CardTitle>
   </CardHeader>
   <CardContent>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
     <div>
      <h3 className="text-lg font-medium mb-2">Informations générales</h3>
      <div className="space-y-2">
       <div>
        <span className="font-medium">Client:</span> {project.client}
       </div>
       <div>
        <span className="font-medium">Description:</span>
        <p className="mt-1">{project.description}</p>
       </div>
       <div>
        <span className="font-medium">Statut:</span> {project.status === 'new' ? 'Nouveau' : project.status === 'planning' ? 'En planification' : project.status === 'in-progress' ? 'En cours' : 'Terminé'}
       </div>
      </div>
     </div>

     <div>
      <h3 className="text-lg font-medium mb-2">Calendrier</h3>
      <div className="space-y-2">
       <div>
        <span className="font-medium">Date de démarrage:</span> {new Date(project.startDate).toLocaleDateString()}
       </div>
       <div>
        <span className="font-medium">Date de livraison:</span> {new Date(project.deliveryDate).toLocaleDateString()}
       </div>
       <div>
        <span className="font-medium">Jours de développement:</span> {project.developmentDays}
       </div>
       {project.meetingDate && (
        <div>
         <span className="font-medium">Date de réunion:</span> {new Date(project.meetingDate).toLocaleDateString()}
        </div>
       )}
      </div>
     </div>

     {(project.technologies && project.technologies.length > 0) || project.methodology ? (
      <div className="md:col-span-2">
       <h3 className="text-lg font-medium mb-2">Spécifications techniques</h3>
       <div className="space-y-2">
        {project.technologies && project.technologies.length > 0 && (
         <div>
          <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
         </div>
        )}
        {project.methodology && (
         <div>
          <span className="font-medium">Méthodologie:</span> {project.methodology}
         </div>
        )}
       </div>
      </div>
     ) : null}

     {project.team && project.team.length > 0 && (
      <div className="md:col-span-2">
       <h3 className="text-lg font-medium mb-2">Équipe</h3>
       <div>
        <span className="font-medium">Membres:</span> {project.team.join(', ')}
       </div>
      </div>
     )}
    </div>
   </CardContent>
  </Card>
 )
}
