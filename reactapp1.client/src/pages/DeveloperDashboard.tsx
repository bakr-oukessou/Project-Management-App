import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useToast } from '../components/ui/use-toast';
import { mockTasks, mockNotifications, type Task, type Notification } from '../data/mockData';

const DeveloperDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load mock data
    setTasks(mockTasks);
    setNotifications(mockNotifications);
  }, []);

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
                  <div className="flex flex-col gap-4">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="text-lg font-semibold">{task.title}</h3>
                          <p className="text-sm text-secondary">Projet: {task.projectName}</p>
                          <div className="mt-2 flex gap-2">
                            {getStatusBadge(task.status)}
                            {getPriorityBadge(task.priority)}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-secondary">Date limite</p>
                          <p className="font-medium">{new Date(task.dueDate).toLocaleDateString()}</p>
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

export default DeveloperDashboard;
