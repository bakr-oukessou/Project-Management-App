// authService.ts
// Service for authentication API calls

import axios, { AxiosResponse } from 'axios';

// const API_URL = '/api/auth/';
const API_URL = 'https://localhost:7151/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  userName: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}
export interface ProjectDto {
    id: number;
    name: string;
    description: string;
    startDate: string;
    deadlineDate: string;
    endDate: string | null;
    status: {
        id: number;
        name: string;
    };
    manager: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    } | null;
    director: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
    developers: Array<{
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    }>;
    technologies: Array<{
        id: number;
        name: string;
    }>;
    tasks: Array<{
        id: number;
        title: string;
        status: string;
        progress: number;
    }>;
    completionPercentage: number;
    clientName: string | null;
}

export interface CreateProjectDto {
    name: string;
    description: string;
    startDate: string;
    deadlineDate: string;
    clientName?: string;
}

export interface UpdateProjectDto {
    name?: string;
    description?: string;
    startDate?: string;
    deadlineDate?: string;
    clientName?: string | null;
    statusId?: number;
    managerId?: number | null;
}
export interface Project {
    id: number;
    name: string;
    description: string;
    startDate: string;
    deadlineDate: string;
    endDate: string | null;
    status: {
        id: number;
        name: string;
    };
    manager: User;
    director: User;
    developers: User[];
    technologies: Technology[];
    tasks: Task[];
    completionPercentage: number;
    clientName: string | null;
}
export interface Task {
    id: number;
    title: string;
    description: string;
    status: {
        id: number;
        name: string;
    };
    progress: number;
    assignedTo: User;
    dueDate: string;
}
interface TaskCreatePayload {
    Title: string;
    Description: string;
    PriorityId: number;
    StatusId: number;
    AssignedToId?: number | null;
    DueDate: string;
    ProjectId: number;
    EstimatedHours?: number | null;
    ActualHours?: number | null;
}

interface TaskStatus {
    id: number;
    name: string;
}

interface TaskPriority {
    id: number;
    name: string;
}

export interface ProjectStatusUpdate {
    statusId: number;
}


export const getCurrentUser = async (): Promise<User> => {
    const response = await api.get("/auth/me"); // ← pas axios.get
    return response.data;
};
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, credentials);
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response || {};
    
    if (status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (userData: any) => 
    api.post('/auth/register', userData),

    me: () =>
        api.get('/auth/me'),
};

// Projects API
export const projectsApi = {
  getAll: () => 
    api.get('/projects'),
  
  getById: (id: number) => 
    api.get(`/projects/${id}`),
  
  create: (project: any) => 
    api.post('/projects', project),
  
  update: (id: number, project: any) => 
    api.put(`/projects/${id}`, project),
  
  delete: (id: number) => 
    api.delete(`/projects/${id}`),
  
  assignManager: (projectId: number, managerId: number) => 
    api.post(`/projects/${projectId}/assign-manager/${ managerId }`),
  
  addTechnology: (projectId: number, technologyId: number) => 
    api.post(`/projects/${projectId}/add-technology/${ technologyId }`),
  
  addDeveloper: (projectId: number, developerId: number) => 
      api.post(`/projects/${projectId}/add-developer/${developerId}`),

  removeDeveloper: (projectId: number, developerId: number) =>
    api.post(`/projects/${projectId}/remove-developer/${developerId}`),

  removeTechnology: (projectId: number, TechnologyId: number) =>
     api.post(`/projects/${projectId}/remove-technology/${TechnologyId}`),

  getDirectorProjects: (directorId:number) => 
    api.get(`/projects/director/${directorId}`),
  
  getManagerProjects: () => 
        api.get(`/projects/manager`),

   getManagerProjectsById: (managerId: number) => api.get(`/projects/manager/${managerId}`),

  getDeveloperProjects: () => 
    api.get('/projects/developer'),
  
  getDeveloperProjectsById: (developerId: number) => 
    api.get(`/projects/developer/${developerId}`),
  
  updateProjectStatus: (projectId: number, statusData: any) => 
    api.post(`/projects/${projectId}/update-status`, statusData),
};

// Tasks API
export const tasksApi = {
  getAll: () => 
    api.get('/tasks'),
  
  getById: (id: number) => 
    api.get(`/tasks/${id}`),

  getMyTasks: () => 
    api.get('/tasks/my'),

  create: (taskData: TaskCreatePayload): Promise<AxiosResponse<TaskItem>> => {
    return api.post('/tasks', taskData);
   },
  
  update: (id: number, task: string) => 
    api.put(`/tasks/${id}`, task),
  
  delete: (id: number) => 
    api.delete(`/tasks/${id}`),
  
  getTasksByProject: (projectId: number) => 
    api.get(`/tasks/by-project/${projectId}`),
  
  getTasksByDeveloper: (developerId:number) => 
    api.get(`/tasks/by-developer/${developerId}`),

    updateProgressRawSql: (
        taskId: number,
        data: {
            description: string;
            percentageComplete: number;
            userId: number;
        }
    ) => api.post(`/tasks/${taskId}/progress-sql`, data),

    assignTask: (taskId: number, developerId: number): Promise<Task> =>
        api.put(`/tasks/assign/${taskId}/developer/${developerId}`),

    updateStatus: (taskId: number, statusId: number): Promise<Task> =>
        api.put(`/tasks/update-status/${taskId}/to/${statusId}`),

    addComment: (taskId: number, comment: { content: string }): Promise<any> =>
        api.post(`/tasks/${taskId}/comments`, comment),

    getComments: (taskId: number): Promise<any[]> => api.get(`/tasks/${taskId}/comments`),

    getProgress: (taskId: number): Promise<any[]> => api.get(`/tasks/${taskId}/progress`),

    getStatuses: (): Promise<any[]> => api.get('/tasks/statuses'),

    getPriorities: (): Promise<any[]> => api.get('/tasks/priorities'),
};

// Users API
export const usersApi = {
  getAll: () => 
    api.get('/users'),
  
  getById: (id: number) => 
    api.get(`/users/${id}`),
  
  update: (id: number, userData: any) => 
    api.put(`/users/${id}`, userData),
  
  getManagers: () => 
    api.get('/users/role/manager'),
 

  getDevelopers: (projectId: number) =>
    api.get(`/users/project/${projectId}/developers`),

  getAvailableDevelopers: (projectId: number) =>
    api.get(`/users/project/${projectId}/available-developers`),

  updateProfile: (userData: any) => 
    api.put('/users/profile', userData),
  
  addSkill: (technologyId: number) => 
    api.post('/users/skills', { technologyId }),
  
  removeSkill: (technologyId: number) => 
        api.delete(`/users/skills/${technologyId}`),

  getAllTechnologies: () => api.get('/technologies'),
};

// Technologies API
export const technologiesApi = {
  getAll: () => 
    api.get('/technologies'),
  
  getById: (id: number) => 
    api.get(`/technologies/${id}`),
  
  create: (technology: any) => // Changed from string to any for flexibility
    api.post('/technologies', technology),
  
  update: (id: number, technology: any) => // Changed from string to any for flexibility
    api.put(`/technologies/${id}`, technology),
  
  delete: (id: number) => 
    api.delete(`/technologies/${id}`),

  getTechnologiesByProject: (projectId: number) =>
    api.get(`/technologies/project/${projectId}`),
};

export const notificationsApi = {
    getUserNotifications: (userId: number): Promise<any[]> =>
        api.get(`/notifications/user/${userId}`),

    markAsRead: (notificationId: number): Promise<void> =>
        api.put(`/notifications/${notificationId}/read`),
};

export default api;