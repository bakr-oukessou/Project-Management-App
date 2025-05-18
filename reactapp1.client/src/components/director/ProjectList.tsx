import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Button} from '../ui/button'
import {Card, CardContent, CardHeader, CardTitle} from '../ui/card'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '../ui/table'
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from '../ui/dialog'
import {useToast} from '../ui/use-toast'
import {Edit, Trash2} from 'lucide-react'
import type {Project} from '../../types'

// Mock data for projects
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
  status: 'in-progress'
 },
 {
  id: 'proj2',
  name: 'Application Mobile',
  description: "Développement d'une application mobile de gestion",
  client: 'Société XYZ',
  startDate: '2023-07-15',
  deliveryDate: '2023-12-15',
  developmentDays: 110,
  projectManagerId: 'pm2',
  status: 'planning'
 },
 {
  id: 'proj3',
  name: 'Système de Facturation',
  description: "Mise en place d'un nouveau système de facturation",
  client: 'Entreprise 123',
  startDate: '2023-08-01',
  deliveryDate: '2023-10-31',
  developmentDays: 60,
  projectManagerId: 'pm3',
  status: 'new'
 }
]

// Mock data for project managers
const projectManagers = [
 {id: 'pm1', name: 'Jean Dupont'},
 {id: 'pm2', name: 'Marie Martin'},
 {id: 'pm3', name: 'Pierre Durand'}
]

export default function ProjectList() {
 const navigate = useNavigate()
 const {toast} = useToast()
 const [projects, setProjects] = useState<Project[]>(mockProjects)
 const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)

 const getProjectManagerName = (id: string) => {
  const manager = projectManagers.find(pm => pm.id === id)
  return manager ? manager.name : 'Non assigné'
 }

 const getStatusLabel = (status: Project['status']) => {
  switch (status) {
   case 'new':
    return 'Nouveau'
   case 'planning':
    return 'En planification'
   case 'in-progress':
    return 'En cours'
   case 'completed':
    return 'Terminé'
   default:
    return status
  }
 }

 const handleEdit = (id: string) => {
  navigate(`/director/edit-project/${id}`)
 }

 const confirmDelete = (project: Project) => {
  setProjectToDelete(project)
 }

 const handleDelete = () => {
  if (projectToDelete) {
   // In a real app, this would be an API call
   setProjects(prev => prev.filter(p => p.id !== projectToDelete.id))

   toast({
    title: 'Projet supprimé',
    description: `Le projet ${projectToDelete.name} a été supprimé avec succès.`
   })

   setProjectToDelete(null)
  }
 }

 return (
  <>
   <Card>
    <CardHeader>
     <CardTitle>Liste des projets</CardTitle>
    </CardHeader>
    <CardContent>
     {projects.length === 0 ? (
      <div className="text-center py-6">
       <p className="text-muted-foreground">Aucun projet trouvé</p>
       <Button className="mt-4" onClick={() => navigate('/director/new-project')}>
        Créer un projet
       </Button>
      </div>
     ) : (
      <Table>
       <TableHeader>
        <TableRow>
         <TableHead>Nom</TableHead>
         <TableHead>Client</TableHead>
         <TableHead>Date de démarrage</TableHead>
         <TableHead>Date de livraison</TableHead>
         <TableHead>Chef de projet</TableHead>
         <TableHead>Statut</TableHead>
         <TableHead className="text-right">Actions</TableHead>
        </TableRow>
       </TableHeader>
       <TableBody>
        {projects.map(project => (
         <TableRow key={project.id}>
          <TableCell className="font-medium">{project.name}</TableCell>
          <TableCell>{project.client}</TableCell>
          <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
          <TableCell>{new Date(project.deliveryDate).toLocaleDateString()}</TableCell>
          <TableCell>{getProjectManagerName(project.projectManagerId)}</TableCell>
          <TableCell>{getStatusLabel(project.status)}</TableCell>
          <TableCell className="text-right">
           <Button variant="ghost" size="sm" onClick={() => handleEdit(project.id)} className="mr-2">
            <Edit className="h-4 w-4" />
           </Button>
           <Button variant="ghost" size="sm" onClick={() => confirmDelete(project)}>
            <Trash2 className="h-4 w-4 text-red-500" />
           </Button>
          </TableCell>
         </TableRow>
        ))}
       </TableBody>
      </Table>
     )}
    </CardContent>
   </Card>

   <Dialog open={!!projectToDelete} onOpenChange={(open: unknown) => !open && setProjectToDelete(null)}>
    <DialogContent>
     <DialogHeader>
      <DialogTitle>Confirmer la suppression</DialogTitle>
      <DialogDescription>Êtes-vous sûr de vouloir supprimer le projet "{projectToDelete?.name}" ? Cette action est irréversible.</DialogDescription>
     </DialogHeader>
     <DialogFooter>
      <Button variant="outline" onClick={() => setProjectToDelete(null)}>
       Annuler
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
       Supprimer
      </Button>
     </DialogFooter>
    </DialogContent>
   </Dialog>
  </>
 )
}
