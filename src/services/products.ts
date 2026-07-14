import api from './api';
import { Product } from '../types';

export const getProducts = async (): Promise<Product[]> => {
  const res = await api.get('/products');
  return res.data.data;
};

export const createProduct = async (name: string, sku: string): Promise<Product> => {
  const res = await api.post('/products', { name, sku });
  return res.data.data;
};
