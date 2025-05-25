import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useToast } from '../components/ui/use-toast';
import { tasksApi, usersApi } from '../api/authService';

// Define interfaces for the API response data
interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  projectName?: string;
  progress?: number;
}

interface Notification {
  id: number;
  message: string;
  timestamp: string;
  isRead: boolean;
}

const DeveloperDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch developer's tasks
        const tasksResponse = await tasksApi.getTasksByDeveloper();
        setTasks(tasksResponse.data || []);
        
        // Note: Add notifications API call when available
        // const notificationsResponse = await notificationsApi.getUserNotifications();
        // setNotifications(notificationsResponse.data || []);
        
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError('Erreur lors du chargement des données');
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du tableau de bord",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const getStatusBadge = (status: Task['status']) => {
    const variants = {
      pending: 'secondary',
      in_progress: 'default',
      completed: 'default'
    } as const;

    const labels = {
      pending: 'En attente',
      in_progress: 'En cours',
      completed: 'Terminé'
    };

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Task['priority']) => {
    const variants = {
      low: 'secondary',
      medium: 'default',
      high: 'destructive'
    } as const;

    const labels = {
      low: 'Basse',
      medium: 'Moyenne',
      high: 'Haute'
    };

    return (
      <Badge variant={variants[priority]}>
        {labels[priority]}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="layout">
        <header className="header">
          <div className="container">
            <h1 className="header-title">Tableau de bord - Développeur</h1>
          </div>
        </header>
        <main className="main">
          <div className="container">
            <div className="flex justify-center items-center h-64">
              <p>Chargement...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="layout">
        <header className="header">
          <div className="container">
            <h1 className="header-title">Tableau de bord - Développeur</h1>
          </div>
        </header>
        <main className="main">
          <div className="container">
            <div className="flex justify-center items-center h-64">
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <h1 className="header-title">Tableau de bord - Développeur</h1>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <div className="card-header">
                  <h2 className="card-title">Mes Tâches</h2>
                </div>
                <div className="card-content">
                  {tasks.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Aucune tâche assignée</p>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {tasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="text-lg font-semibold">{task.title}</h3>
                            {task.description && (
                              <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                            )}
                            <p className="text-sm text-secondary">Projet: {task.projectName || 'Non spécifié'}</p>
                            <div className="mt-2 flex gap-2">
                              {getStatusBadge(task.status)}
                              {getPriorityBadge(task.priority)}
                            </div>
                            {task.progress !== undefined && (
                              <div className="mt-2">
                                <div className="text-xs text-gray-500 mb-1">Progression: {task.progress}%</div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${task.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-secondary">Date limite</p>
                            <p className="font-medium">{new Date(task.dueDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div>
              <Card>
                <div className="card-header">
                  <h2 className="card-title">Notifications</h2>
                </div>
                <div className="card-content">
                  {notifications.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Aucune notification</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg ${
                            notification.isRead ? 'bg-gray-50' : 'bg-blue-50 border-l-4 border-blue-500'
                          }`}
                        >
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-secondary mt-1">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeveloperDashboard;
