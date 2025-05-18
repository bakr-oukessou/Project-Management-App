import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {useToast} from '../ui/use-toast'
import {Button} from '../ui/button'
import {Card, CardContent, CardHeader, CardTitle} from '../ui/card'
import {Input} from '../ui/input'
import {Label} from '../ui/label'
import {Textarea} from '../ui/textarea'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../ui/select'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '../ui/table'
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from '../ui/dialog'
import {Plus, Edit, Trash2} from 'lucide-react'
import type {Project, Service, User} from '../../types'

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
 }
]

// Mock services data
const mockServices: Service[] = [
 {
  id: 'serv1',
  projectId: 'proj1',
  name: 'Authentification',
  description: "Système d'authentification avec JWT",
  durationDays: 5,
  assignedDeveloperId: 'dev1'
 },
 {
  id: 'serv2',
  projectId: 'proj1',
  name: 'API Backend',
  description: 'Développement des endpoints REST',
  durationDays: 10,
  assignedDeveloperId: 'dev3'
 }
]

export default function ServiceAssignment() {
 const {id} = useParams<{id: string}>()
 const {toast} = useToast()

 const [project, setProject] = useState<Project | null>(null)
 const [services, setServices] = useState<Service[]>([])
 const [teamMembers, setTeamMembers] = useState<User[]>([])

 const [isDialogOpen, setIsDialogOpen] = useState(false)
 const [editingService, setEditingService] = useState<Service | null>(null)
 const [serviceForm, setServiceForm] = useState<Omit<Service, 'id' | 'projectId'>>({
  name: '',
  description: '',
  durationDays: 1,
  assignedDeveloperId: ''
 })

 useEffect(() => {
  // In a real app, fetch project, team members and services by ID from API
  if (id) {
   const foundProject = mockProjects.find(p => p.id === id)
   if (foundProject) {
    setProject(foundProject)

    // Get team members
    if (foundProject.team && foundProject.team.length > 0) {
     const teamDevelopers = mockDevelopers.filter(dev => foundProject.team?.includes(dev.id))
     setTeamMembers(teamDevelopers)
    }

    // Get services for this project
    const projectServices = mockServices.filter(s => s.projectId === id)
    setServices(projectServices)
   }
  }
 }, [id])

 const openAddDialog = () => {
  setEditingService(null)
  setServiceForm({
   name: '',
   description: '',
   durationDays: 1,
   assignedDeveloperId: ''
  })
  setIsDialogOpen(true)
 }

 const openEditDialog = (service: Service) => {
  setEditingService(service)
  setServiceForm({
   name: service.name,
   description: service.description,
   durationDays: service.durationDays,
   assignedDeveloperId: service.assignedDeveloperId
  })
  setIsDialogOpen(true)
 }

 const handleFormChange = (field: string, value: string | number) => {
  setServiceForm(prev => ({
   ...prev,
   [field]: value
  }))
 }

 const handleSaveService = () => {
  if (!serviceForm.name || !serviceForm.description || !serviceForm.assignedDeveloperId) {
   toast({
    title: 'Formulaire incomplet',
    description: 'Veuillez remplir tous les champs obligatoires.',
    variant: 'destructive'
   })
   return
  }

  // In a real app, this would be an API call to create/update the service
  if (editingService) {
   // Update existing service
   setServices(prev => prev.map(s => (s.id === editingService.id ? {...s, ...serviceForm} : s)))

   toast({
    title: 'Service mis à jour',
    description: `Le service "${serviceForm.name}" a été mis à jour.`
   })
  } else {
   // Create new service
   const newService: Service = {
    id: `serv${Date.now()}`,
    projectId: id || '',
    ...serviceForm
   }

   setServices(prev => [...prev, newService])

   toast({
    title: 'Service créé',
    description: `Le service "${serviceForm.name}" a été créé et assigné.`
   })
  }

  setIsDialogOpen(false)
 }

 const handleDeleteService = (serviceId: string) => {
  // In a real app, this would be an API call to delete the service
  setServices(prev => prev.filter(s => s.id !== serviceId))

  toast({
   title: 'Service supprimé',
   description: 'Le service a été supprimé avec succès.'
  })
 }

 const getDeveloperName = (id: string) => {
  const developer = teamMembers.find(d => d.id === id)
  return developer ? developer.name : 'Non assigné'
 }

 if (!project) {
  return <div>Chargement...</div>
 }

 return (
  <>
   <Card>
    <CardHeader className="flex flex-row items-center justify-between">
     <CardTitle>Services pour {project.name}</CardTitle>
     <Button onClick={openAddDialog}>
      <Plus className="h-4 w-4 mr-2" />
      Ajouter un service
     </Button>
    </CardHeader>
    <CardContent>
     {services.length === 0 ? (
      <div className="text-center py-6">
       <p className="text-muted-foreground">Aucun service n'a encore été créé pour ce projet.</p>
       <Button className="mt-4" onClick={openAddDialog}>
        Créer le premier service
       </Button>
      </div>
     ) : (
      <Table>
       <TableHeader>
        <TableRow>
         <TableHead>Nom du service</TableHead>
         <TableHead>Description</TableHead>
         <TableHead>Durée (jours)</TableHead>
         <TableHead>Développeur assigné</TableHead>
         <TableHead className="text-right">Actions</TableHead>
        </TableRow>
       </TableHeader>
       <TableBody>
        {services.map(service => (
         <TableRow key={service.id}>
          <TableCell className="font-medium">{service.name}</TableCell>
          <TableCell>{service.description}</TableCell>
          <TableCell>{service.durationDays}</TableCell>
          <TableCell>{getDeveloperName(service.assignedDeveloperId)}</TableCell>
          <TableCell className="text-right">
           <Button variant="ghost" size="sm" onClick={() => openEditDialog(service)} className="mr-2">
            <Edit className="h-4 w-4" />
           </Button>
           <Button variant="ghost" size="sm" onClick={() => handleDeleteService(service.id)}>
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

   <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    <DialogContent>
     <DialogHeader>
      <DialogTitle>{editingService ? 'Modifier le service' : 'Ajouter un nouveau service'}</DialogTitle>
      <DialogDescription>Définissez les détails du service et assignez-le à un membre de l'équipe.</DialogDescription>
     </DialogHeader>

     <div className="space-y-4 py-2">
      <div className="space-y-2">
       <Label htmlFor="name">Nom du service*</Label>
       <Input id="name" value={serviceForm.name} onChange={e => handleFormChange('name', e.target.value)} placeholder="ex: Authentification" required />
      </div>

      <div className="space-y-2">
       <Label htmlFor="description">Description*</Label>
       <Textarea id="description" value={serviceForm.description} onChange={e => handleFormChange('description', e.target.value)} placeholder="Décrivez le service à développer" required rows={3} />
      </div>

      <div className="space-y-2">
       <Label htmlFor="durationDays">Durée (jours)*</Label>
       <Input id="durationDays" type="number" min="1" value={serviceForm.durationDays} onChange={e => handleFormChange('durationDays', Number.parseInt(e.target.value) || 1)} required />
      </div>

      <div className="space-y-2">
       <Label htmlFor="assignedDeveloperId">Développeur assigné*</Label>
       <Select value={serviceForm.assignedDeveloperId} onValueChange={(value: string | number) => handleFormChange('assignedDeveloperId', value)} required>
        <SelectTrigger>
         <SelectValue placeholder="Sélectionner un développeur" />
        </SelectTrigger>
        <SelectContent>
         {teamMembers.map(dev => (
          <SelectItem key={dev.id} value={dev.id}>
           {dev.name}
          </SelectItem>
         ))}
        </SelectContent>
       </Select>
      </div>
     </div>

     <DialogFooter>
      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
       Annuler
      </Button>
      <Button onClick={handleSaveService}>{editingService ? 'Mettre à jour' : 'Créer'}</Button>
     </DialogFooter>
    </DialogContent>
   </Dialog>
  </>
 )
}
