import axios from 'axios';

const API_BASE_URL = '/api/projects';

export interface Project {
  id: number;
  name: string;
  description?: string;
  // Add other project properties as needed
}

export const getProjects = async (): Promise<Project[]> => {
  const response = await axios.get<Project[]>(API_BASE_URL);
  return response.data;
};

export const getProjectById = async (id: number): Promise<Project> => {
  const response = await axios.get<Project>(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const createProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
  const response = await axios.post<Project>(API_BASE_URL, project);
  return response.data;
};

export const updateProject = async (id: number, project: Partial<Project>): Promise<Project> => {
  const response = await axios.put<Project>(`${API_BASE_URL}/${id}`, project);
  return response.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};