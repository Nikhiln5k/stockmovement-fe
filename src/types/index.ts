export interface User {
  id: string;
  username: string;
  role: 'admin' | 'shopper';
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Store {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Stock {
  _id: string;
  product: Product;
  store: Store;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}
