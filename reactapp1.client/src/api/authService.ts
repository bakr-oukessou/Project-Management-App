// authService.ts
// Service for authentication API calls

import axios from 'axios';

// const API_URL = '/api/auth/';
const API_URL = 'https://localhost:5001/api';

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

// export async function login(email: string, password: string) {
//   const response = await fetch("https://localhost:5001/api/auth/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });
//   if (!response.ok) {
//     throw new Error("Login failed");
//   }
//   return response.json(); // { token: "..." }
// }

export const getCurrentUser = async (): Promise<User> => {
  const response = await axios.get(`${API_URL}/auth/me`);
  return response.data;
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}login`, credentials);
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
    api.post(`/projects/${projectId}/assign-manager`, { managerId }),
  
  addTechnology: (projectId: number, technologyId: number) => 
    api.post(`/projects/${projectId}/add-technology`, { technologyId }),
  
  addDeveloper: (projectId: number, developerId: number) => 
    api.post(`/projects/${projectId}/add-developer`, { developerId }),
  
  getDirectorProjects: () => 
    api.get('/projects/director'),
  
  getManagerProjects: () => 
    api.get('/projects/manager'),
  
  getDeveloperProjects: () => 
    api.get('/projects/developer'),
};

// Tasks API
export const tasksApi = {
  getAll: () => 
    api.get('/tasks'),
  
  getById: (id: number) => 
    api.get(`/tasks/${id}`),
  
  create: (task: any) => 
    api.post('/tasks', task),
  
  update: (id: number, task: any) => 
    api.put(`/tasks/${id}`, task),
  
  delete: (id: number) => 
    api.delete(`/tasks/${id}`),
  
  updateProgress: (taskId: number, progress: number) => 
    api.put(`/tasks/${taskId}/progress`, { progress }),
  
  getTasksByProject: (projectId: number) => 
    api.get(`/tasks/project/${projectId}`),
  
  getTasksByDeveloper: () => 
    api.get('/tasks/developer'),
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
    api.get('/users/managers'),
  
  getDevelopers: () => 
    api.get('/users/developers'),
  
  updateProfile: (userData: any) => 
    api.put('/users/profile', userData),
  
  addSkill: (technologyId: number) => 
    api.post('/users/skills', { technologyId }),
  
  removeSkill: (technologyId: number) => 
    api.delete(`/users/skills/${technologyId}`),
};

// Technologies API
export const technologiesApi = {
  getAll: () => 
    api.get('/technologies'),
  
  getById: (id: number) => 
    api.get(`/technologies/${id}`),
  
  create: (technology: any) => 
    api.post('/technologies', technology),
  
  update: (id: number, technology: any) => 
    api.put(`/technologies/${id}`, technology),
  
  delete: (id: number) => 
    api.delete(`/technologies/${id}`),
};

export default api;