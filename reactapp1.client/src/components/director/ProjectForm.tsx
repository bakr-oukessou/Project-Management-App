/* eslint-disable @typescript-eslint/no-unused-vars */
import {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {useToast} from '../ui/use-toast'
import {Button} from '../ui/button'
import {Input} from '../ui/input'
import {Textarea} from '../ui/textarea'
import {Label} from '../ui/label'
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '../ui/card'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../ui/select'
import type {Project} from '../../types'

// Mock data for project managers
const projectManagers = [
 {id: 'pm1', name: 'Jean Dupont'},
 {id: 'pm2', name: 'Marie Martin'},
 {id: 'pm3', name: 'Pierre Durand'}
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
  status: 'in-progress'
 }
]

export default function ProjectForm() {
 const {id} = useParams<{id: string}>()
 const navigate = useNavigate()
 const {toast} = useToast()
 const isEditing = !!id

 const [formData, setFormData] = useState<Omit<Project, 'id' | 'status'>>({
  name: '',
  description: '',
  client: '',
  startDate: '',
  deliveryDate: '',
  developmentDays: 0,
  projectManagerId: ''
 })

 const [nameError, setNameError] = useState('')

 useEffect(() => {
  if (isEditing) {
   // In a real app, fetch project by ID from API
   const project = mockProjects.find(p => p.id === id)
   if (project) {
    const {id, status, ...projectData} = project
    setFormData(projectData)
   }
  }
 }, [id, isEditing])

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const {name, value} = e.target
  setFormData(prev => ({
   ...prev,
   [name]: name === 'developmentDays' ? Number.parseInt(value) || 0 : value
  }))

  if (name === 'name') {
   setNameError('')
  }
 }

 const handleSelectChange = (value: string) => {
  setFormData(prev => ({
   ...prev,
   projectManagerId: value
  }))
 }

 const validateForm = () => {
  // Check if project name already exists (for new projects)
  if (!isEditing && mockProjects.some(p => p.name === formData.name)) {
   setNameError('Ce nom de projet existe déjà')
   return false
  }
  return true
 }

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()

  if (!validateForm()) {
   return
  }

  // In a real app, this would be an API call
  if (isEditing) {
   toast({
    title: 'Projet modifié',
    description: `Le projet ${formData.name} a été mis à jour avec succès.`
   })
  } else {
   toast({
    title: 'Projet créé',
    description: `Le projet ${formData.name} a été créé avec succès.`
   })
  }

  navigate('/director/projects')
 }

 return (
  <Card className="max-w-2xl mx-auto">
   <CardHeader>
    <CardTitle>{isEditing ? 'Modifier le projet' : 'Créer un nouveau projet'}</CardTitle>
   </CardHeader>
   <form onSubmit={handleSubmit}>
    <CardContent className="space-y-4">
     <div className="space-y-2">
      <Label htmlFor="name">Nom du projet*</Label>
      <Input id="name" name="name" value={formData.name} onChange={handleChange} required className={nameError ? 'border-red-500' : ''} />
      {nameError && <p className="text-sm text-red-500">{nameError}</p>}
     </div>

     <div className="space-y-2">
      <Label htmlFor="description">Description*</Label>
      <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={3} />
     </div>

     <div className="space-y-2">
      <Label htmlFor="client">Client*</Label>
      <Input id="client" name="client" value={formData.client} onChange={handleChange} required />
     </div>

     <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
       <Label htmlFor="startDate">Date de démarrage*</Label>
       <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
       <Label htmlFor="deliveryDate">Date de livraison*</Label>
       <Input id="deliveryDate" name="deliveryDate" type="date" value={formData.deliveryDate} onChange={handleChange} required />
      </div>
     </div>

     <div className="space-y-2">
      <Label htmlFor="developmentDays">Jours de développement*</Label>
      <Input id="developmentDays" name="developmentDays" type="number" min="1" value={formData.developmentDays} onChange={handleChange} required />
     </div>

     <div className="space-y-2">
      <Label htmlFor="projectManager">Chef de projet*</Label>
      <Select value={formData.projectManagerId} onValueChange={handleSelectChange} required>
       <SelectTrigger>
        <SelectValue placeholder="Sélectionner un chef de projet" />
       </SelectTrigger>
       <SelectContent>
        {projectManagers.map(pm => (
         <SelectItem key={pm.id} value={pm.id}>
          {pm.name}
         </SelectItem>
        ))}
       </SelectContent>
      </Select>
     </div>
    </CardContent>

    <CardFooter className="flex justify-between">
     <Button type="button" variant="outline" onClick={() => navigate('/director/projects')}>
      Annuler
     </Button>
     <Button type="submit">{isEditing ? 'Mettre à jour' : 'Créer le projet'}</Button>
    </CardFooter>
   </form>
  </Card>
 )
}
