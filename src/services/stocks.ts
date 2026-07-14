import api from './api';
import { Stock } from '../types';

export const getStocks = async (): Promise<Stock[]> => {
  const res = await api.get('/stocks');
  return res.data.data;
};

export const adjustStock = async (
  productId: string,
  storeId: string,
  quantityChange: number
): Promise<Stock> => {
  const res = await api.post('/stocks/adjust', { productId, storeId, quantityChange });
  return res.data.data;
};

export interface TransferResponse {
  source: Stock;
  target: Stock;
}

export const transferStock = async (
  productId: string,
  sourceStoreId: string,
  targetStoreId: string,
  quantity: number
): Promise<TransferResponse> => {
  const res = await api.post('/stocks/transfer', {
    productId,
    sourceStoreId,
    targetStoreId,
    quantity,
  });
  return res.data.data;
};
