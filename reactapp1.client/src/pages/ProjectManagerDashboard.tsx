import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useToast } from '../components/ui/use-toast';
import { projectsApi } from '../api/authService';
import { mockProjects, mockNotifications,} from '../data/mockData';

interface Project {
  id: number;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  deadline: string;
  startDate?: string;
  managerId?: number;
  technologies?: string[];
  developers?: any[];
}

interface Notification {
  id: number;
  message: string;
  timestamp: string;
  isRead: boolean;
}

const ProjectManagerDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch manager's projects
        const projectsResponse = await projectsApi.getManagerProjects();
        setProjects(projectsResponse.data || []);
        
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

  const getStatusBadge = (status: Project['status']) => {
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

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <h1 className="header-title">Tableau de bord - Chef de Projet</h1>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <div className="card-header">
                  <h2 className="card-title">Mes Projets</h2>
                </div>
                <div className="card-content">
                  {projects.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Aucun projet assigné</p>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {projects.map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="text-lg font-semibold">{project.name}</h3>
                            <p className="text-sm text-secondary">{project.description}</p>
                            {project.technologies && project.technologies.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {project.technologies.map((tech, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <div className="mt-2">
                              {getStatusBadge(project.status)}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-secondary">Date limite</p>
                            <p className="font-medium">{new Date(project.deadline).toLocaleDateString()}</p>
                            {project.developers && (
                              <p className="text-xs text-secondary mt-1">
                                {project.developers.length} développeur(s)
                              </p>
                            )}
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

export default ProjectManagerDashboard;
