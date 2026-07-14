import React, { useState } from 'react';
import * as stockApi from '../services/stocks';
import { Product, Store } from '../types';

interface StockAdjustmentProps {
  products: Product[];
  stores: Store[];
  onSuccess: (msg: string) => void;
  onError: (err: string) => void;
  onRefresh: () => void;
}

export const StockAdjustment: React.FC<StockAdjustmentProps> = ({
  products,
  stores,
  onSuccess,
  onError,
  onRefresh,
}) => {
  const [adjProd, setAdjProd] = useState('');
  const [adjStore, setAdjStore] = useState('');
  const [adjQty, setAdjQty] = useState('');

  const getErr = (err: any): string => {
    if (err.response && err.response.data && err.response.data.message) {
      return err.response.data.message;
    }
    return err.message || 'An unexpected error occurred';
  };

  const adjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    onError('');
    onSuccess('');
    if (!adjProd || !adjStore || !adjQty) {
      onError('Please select product, store, and quantity');
      return;
    }
    const quantityChange = parseFloat(adjQty);
    if (isNaN(quantityChange)) {
      onError('Quantity change must be a valid number');
      return;
    }
    try {
      await stockApi.adjustStock(adjProd, adjStore, quantityChange);
      onSuccess('Stock adjusted successfully!');
      setAdjQty('');
      onRefresh();
    } catch (err) {
      onError(getErr(err));
    }
  };

  return (
    <div className="card-custom col-lg-6 mx-auto">
      <h4 className="card-title-custom">Adjust Stock Levels</h4>
      <p className="text-muted small">
        Select a product and store. Enter positive value to add stock, or negative value to subtract stock.
      </p>
      <form onSubmit={adjustStock}>
        <div className="mb-3">
          <label className="form-label form-label-custom">Select Product</label>
          <select
            className="form-select form-select-custom"
            value={adjProd}
            onChange={(e) => setAdjProd(e.target.value)}
            required
          >
            <option value="">-- Choose Product --</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.sku})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label form-label-custom">Select Store</label>
          <select
            className="form-select form-select-custom"
            value={adjStore}
            onChange={(e) => setAdjStore(e.target.value)}
            required
          >
            <option value="">-- Choose Store --</option>
            {stores.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label form-label-custom">Quantity Change</label>
          <input
            type="number"
            className="form-control form-control-custom"
            value={adjQty}
            onChange={(e) => setAdjQty(e.target.value)}
            placeholder="e.g. 10 or -5"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary-custom w-100 mt-2">
          Apply Adjustment
        </button>
      </form>
    </div>
  );
};
export default StockAdjustment;
