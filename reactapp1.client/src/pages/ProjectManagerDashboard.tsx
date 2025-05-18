import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useToast } from '../components/ui/use-toast';
import { mockProjects, mockNotifications, type Project, type Notification } from '../data/mockData';

const ProjectManagerDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load mock data
    setProjects(mockProjects);
    setNotifications(mockNotifications);
  }, []);

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
                  <div className="flex flex-col gap-4">
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="text-lg font-semibold">{project.name}</h3>
                          <p className="text-sm text-secondary">{project.description}</p>
                          <div className="mt-2">
                            {getStatusBadge(project.status)}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-secondary">Date limite</p>
                          <p className="font-medium">{new Date(project.deadline).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <Card>
                <div className="card-header">
                  <h2 className="card-title">Notifications</h2>
                </div>
                <div className="card-content">
                  <div className="flex flex-col gap-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-3 rounded-lg bg-background"
                      >
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-secondary mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
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
