import api from './api';
import { User } from '../types';

interface AuthResponse {
  token: string;
  user: User;
}

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const res = await api.post('/auth/login', { username, password });
  return res.data.data;
};

export const register = async (username: string, password: string, role: string): Promise<AuthResponse> => {
  const res = await api.post('/auth/register', { username, password, role });
  return res.data.data;
};
