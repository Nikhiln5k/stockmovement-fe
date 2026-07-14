import React, { useState } from 'react';
import * as productApi from '../services/products';
import { Product } from '../types';

interface ProductListProps {
  products: Product[];
}

export const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div className="card-custom">
      <h5 className="card-title-custom">Products Catalog ({products.length})</h5>
      {products.length === 0 ? (
        <div className="no-data-msg">No products found.</div>
      ) : (
        <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td><code>{p.sku}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

interface CreateProductFormProps {
  onSuccess: (msg: string) => void;
  onError: (err: string) => void;
  onRefresh: () => void;
}

export const CreateProductForm: React.FC<CreateProductFormProps> = ({
  onSuccess,
  onError,
  onRefresh,
}) => {
  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');

  const getErr = (err: any): string => {
    if (err.response && err.response.data && err.response.data.message) {
      return err.response.data.message;
    }
    return err.message || 'An unexpected error occurred';
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    onError('');
    onSuccess('');
    if (!prodName || !prodSku) {
      onError('Please provide product name and SKU');
      return;
    }
    try {
      await productApi.createProduct(prodName, prodSku);
      onSuccess(`Product "${prodName}" created successfully!`);
      setProdName('');
      setProdSku('');
      onRefresh();
    } catch (err) {
      onError(getErr(err));
    }
  };

  return (
    <div className="card-custom col-lg-6 mx-auto">
      <h4 className="card-title-custom">Create New Product</h4>
      <form onSubmit={addProduct}>
        <div className="mb-3">
          <label className="form-label form-label-custom">Product Name</label>
          <input
            type="text"
            className="form-control form-control-custom"
            value={prodName}
            onChange={(e) => setProdName(e.target.value)}
            placeholder="e.g. iPhone 15 Pro"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label form-label-custom">Unique SKU</label>
          <input
            type="text"
            className="form-control form-control-custom"
            value={prodSku}
            onChange={(e) => setProdSku(e.target.value)}
            placeholder="e.g. IPHONE15PRO"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary-custom w-100 mt-2">
          Create Product
        </button>
      </form>
    </div>
  );
};
