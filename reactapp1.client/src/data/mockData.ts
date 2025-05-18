export interface Project {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed';
  description: string;
  deadline: string;
  client?: string;
  technologies?: string[];
}

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  projectName: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  timestamp: string;
}

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Refonte Site Web',
    status: 'in_progress',
    description: 'Refonte complète du site web corporate',
    deadline: '2024-06-30',
    client: 'Entreprise ABC',
    technologies: ['React', 'Node.js', 'PostgreSQL']
  },
  {
    id: '2',
    name: 'Application Mobile',
    status: 'pending',
    description: 'Développement d\'une application mobile de gestion',
    deadline: '2024-08-15',
    client: 'Société XYZ',
    technologies: ['React Native', 'Firebase']
  },
  {
    id: '3',
    name: 'API REST',
    status: 'completed',
    description: 'Création d\'une API REST pour le système de paiement',
    deadline: '2024-03-15',
    client: 'FinTech Solutions',
    technologies: ['Node.js', 'Express', 'MongoDB']
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Implémenter l\'authentification',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2024-04-15',
    projectName: 'Refonte Site Web'
  },
  {
    id: '2',
    title: 'Créer les composants UI',
    status: 'pending',
    priority: 'medium',
    dueDate: '2024-04-20',
    projectName: 'Application Mobile'
  },
  {
    id: '3',
    title: 'Tests unitaires',
    status: 'completed',
    priority: 'low',
    dueDate: '2024-03-10',
    projectName: 'API REST'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    message: 'Nouveau projet assigné: Refonte Site Web',
    type: 'info',
    timestamp: '2024-03-20T10:00:00'
  },
  {
    id: '2',
    message: 'Date limite approchante pour "Implémenter l\'authentification"',
    type: 'warning',
    timestamp: '2024-03-21T15:30:00'
  },
  {
    id: '3',
    message: 'Tâche "Tests unitaires" marquée comme terminée',
    type: 'success',
    timestamp: '2024-03-22T09:15:00'
  }
]; 