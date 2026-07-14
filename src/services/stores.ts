import api from './api';
import { Store } from '../types';

export const getStores = async (): Promise<Store[]> => {
  const res = await api.get('/stores');
  return res.data.data;
};

export const createStore = async (name: string): Promise<Store> => {
  const res = await api.post('/stores', { name });
  return res.data.data;
};
