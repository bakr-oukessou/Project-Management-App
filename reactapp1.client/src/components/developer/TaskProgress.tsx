import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {useToast} from '../ui/use-toast'
import {Button} from '../ui/button'
import {Input} from '../ui/input'
import {Label} from '../ui/label'
import {Textarea} from '../ui/textarea'
import {Slider} from '../ui/slider'
import {Card, CardContent, CardHeader, CardTitle} from '../ui/card'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '../ui/table'
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from '../ui/dialog'
import {Progress} from '../ui/progress'
import {Plus, Edit, Trash2} from 'lucide-react'
import type {Service, Task, Project} from '../../types'

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

// Mock tasks data
const mockTasks: Task[] = [
 {
  id: 'task1',
  serviceId: 'serv1',
  description: 'Création des modèles utilisateur',
  progress: 100,
  date: '2023-06-10'
 },
 {
  id: 'task2',
  serviceId: 'serv1',
  description: 'Implémentation du login/register',
  progress: 75,
  date: '2023-06-11'
 }
]

export default function TaskProgress() {
 const {id} = useParams<{id: string}>()
 const {toast} = useToast()

 const [service, setService] = useState<Service | null>(null)
 const [project, setProject] = useState<Project | null>(null)
 const [tasks, setTasks] = useState<Task[]>([])

 const [isDialogOpen, setIsDialogOpen] = useState(false)
 const [editingTask, setEditingTask] = useState<Task | null>(null)
 const [taskForm, setTaskForm] = useState<Omit<Task, 'id' | 'serviceId'>>({
  description: '',
  progress: 0,
  date: new Date().toISOString().split('T')[0]
 })

 useEffect(() => {
  // In a real app, fetch service, project and tasks by ID from API
  if (id) {
   const foundService = mockServices.find(s => s.id === id)
   if (foundService) {
    setService(foundService)

    // Get the related project
    const foundProject = mockProjects.find(p => p.id === foundService.projectId)
    if (foundProject) {
     setProject(foundProject)
    }

    // Get tasks for this service
    const serviceTasks = mockTasks.filter(t => t.serviceId === id)
    setTasks(serviceTasks)
   }
  }
 }, [id])

 const calculateOverallProgress = () => {
  if (tasks.length === 0) return 0
  const totalProgress = tasks.reduce((sum, task) => sum + task.progress, 0)
  return Math.round(totalProgress / tasks.length)
 }

 const openAddDialog = () => {
  setEditingTask(null)
  setTaskForm({
   description: '',
   progress: 0,
   date: new Date().toISOString().split('T')[0]
  })
  setIsDialogOpen(true)
 }

 const openEditDialog = (task: Task) => {
  setEditingTask(task)
  setTaskForm({
   description: task.description,
   progress: task.progress,
   date: task.date
  })
  setIsDialogOpen(true)
 }

 const handleFormChange = (field: string, value: string | number) => {
  setTaskForm(prev => ({
   ...prev,
   [field]: value
  }))
 }

 const handleSaveTask = () => {
  if (!taskForm.description) {
   toast({
    title: 'Description requise',
    description: 'Veuillez saisir une description pour la tâche.',
    variant: 'destructive'
   })
   return
  }

  // In a real app, this would be an API call to create/update the task
  if (editingTask) {
   // Update existing task
   setTasks(prev => prev.map(t => (t.id === editingTask.id ? {...t, ...taskForm} : t)))

   toast({
    title: 'Tâche mise à jour',
    description: 'La progression de la tâche a été mise à jour.'
   })
  } else {
   // Create new task
   const newTask: Task = {
    id: `task${Date.now()}`,
    serviceId: id || '',
    ...taskForm
   }

   setTasks(prev => [...prev, newTask])

   toast({
    title: 'Tâche ajoutée',
    description: 'La nouvelle tâche a été ajoutée avec succès.'
   })
  }

  setIsDialogOpen(false)
 }

 const handleDeleteTask = (taskId: string) => {
  // In a real app, this would be an API call to delete the task
  setTasks(prev => prev.filter(t => t.id !== taskId))

  toast({
   title: 'Tâche supprimée',
   description: 'La tâche a été supprimée avec succès.'
  })
 }

 if (!service || !project) {
  return <div>Chargement...</div>
 }

 const overallProgress = calculateOverallProgress()

 return (
  <>
   <Card className="mb-6">
    <CardHeader>
     <CardTitle>Progression du service: {service.name}</CardTitle>
    </CardHeader>
    <CardContent>
     <div className="space-y-4">
      <div>
       <div className="flex justify-between mb-2">
        <span>Progression globale</span>
        <span>{overallProgress}%</span>
       </div>
       <Progress value={overallProgress} className="h-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <div>
        <h3 className="text-sm font-medium mb-1">Description du service</h3>
        <p className="text-sm text-muted-foreground">{service.description}</p>
       </div>
       <div>
        <h3 className="text-sm font-medium mb-1">Projet</h3>
        <p className="text-sm text-muted-foreground">{project.name}</p>
        <p className="text-xs text-muted-foreground">Livraison: {new Date(project.deliveryDate).toLocaleDateString()}</p>
       </div>
      </div>
     </div>
    </CardContent>
   </Card>

   <Card>
    <CardHeader className="flex flex-row items-center justify-between">
     <CardTitle>Tâches et progression</CardTitle>
     <Button onClick={openAddDialog}>
      <Plus className="h-4 w-4 mr-2" />
      Ajouter une tâche
     </Button>
    </CardHeader>
    <CardContent>
     {tasks.length === 0 ? (
      <div className="text-center py-6">
       <p className="text-muted-foreground">Aucune tâche n'a encore été ajoutée pour ce service.</p>
       <Button className="mt-4" onClick={openAddDialog}>
        Ajouter votre première tâche
       </Button>
      </div>
     ) : (
      <Table>
       <TableHeader>
        <TableRow>
         <TableHead>Date</TableHead>
         <TableHead>Description</TableHead>
         <TableHead>Progression</TableHead>
         <TableHead className="text-right">Actions</TableHead>
        </TableRow>
       </TableHeader>
       <TableBody>
        {tasks.map(task => (
         <TableRow key={task.id}>
          <TableCell>{new Date(task.date).toLocaleDateString()}</TableCell>
          <TableCell>{task.description}</TableCell>
          <TableCell>
           <div className="flex items-center gap-2">
            <Progress value={task.progress} className="h-2 flex-1" />
            <span className="text-sm">{task.progress}%</span>
           </div>
          </TableCell>
          <TableCell className="text-right">
           <Button variant="ghost" size="sm" onClick={() => openEditDialog(task)} className="mr-2">
            <Edit className="h-4 w-4" />
           </Button>
           <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task.id)}>
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
      <DialogTitle>{editingTask ? 'Modifier la tâche' : 'Ajouter une nouvelle tâche'}</DialogTitle>
      <DialogDescription>{editingTask ? 'Mettez à jour la description et la progression de la tâche.' : 'Ajoutez une nouvelle tâche et indiquez sa progression.'}</DialogDescription>
     </DialogHeader>

     <div className="space-y-4 py-2">
      <div className="space-y-2">
       <Label htmlFor="date">Date</Label>
       <Input id="date" type="date" value={taskForm.date} onChange={e => handleFormChange('date', e.target.value)} required />
      </div>

      <div className="space-y-2">
       <Label htmlFor="description">Description de la tâche*</Label>
       <Textarea id="description" value={taskForm.description} onChange={e => handleFormChange('description', e.target.value)} placeholder="Décrivez la tâche réalisée" required rows={3} />
      </div>

      <div className="space-y-2">
       <div className="flex justify-between">
        <Label htmlFor="progress">Progression</Label>
        <span>{taskForm.progress}%</span>
       </div>
       <Slider id="progress" min={0} max={100} step={5} value={[taskForm.progress]} onValueChange={(values: (string | number)[]) => handleFormChange('progress', values[0])} />
      </div>
     </div>

     <DialogFooter>
      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
       Annuler
      </Button>
      <Button onClick={handleSaveTask}>{editingTask ? 'Mettre à jour' : 'Ajouter'}</Button>
     </DialogFooter>
    </DialogContent>
   </Dialog>
  </>
 )
}
