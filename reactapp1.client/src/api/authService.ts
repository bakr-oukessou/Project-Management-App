// authService.ts
// Service for authentication API calls

import axios from 'axios';

const API_URL = '/api/auth/';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const login = async (credentials: LoginData): Promise<{ user: User; token: string }> => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

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