import React, { useState } from 'react';
import * as stockApi from '../services/stocks';
import { Product, Store } from '../types';

interface StockTransferProps {
  products: Product[];
  stores: Store[];
  onSuccess: (msg: string) => void;
  onError: (err: string) => void;
  onRefresh: () => void;
}

export const StockTransfer: React.FC<StockTransferProps> = ({
  products,
  stores,
  onSuccess,
  onError,
  onRefresh,
}) => {
  const [xferProd, setXferProd] = useState('');
  const [xferSource, setXferSource] = useState('');
  const [xferTarget, setXferTarget] = useState('');
  const [xferQty, setXferQty] = useState('');

  const getErr = (err: any): string => {
    if (err.response && err.response.data && err.response.data.message) {
      return err.response.data.message;
    }
    return err.message || 'An unexpected error occurred';
  };

  const transferStock = async (e: React.FormEvent) => {
    e.preventDefault();
    onError('');
    onSuccess('');
    if (!xferProd || !xferSource || !xferTarget || !xferQty) {
      onError('Please fill in all transfer fields');
      return;
    }
    if (xferSource === xferTarget) {
      onError('Source and target stores must be different');
      return;
    }
    const qtyNum = parseFloat(xferQty);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      onError('Transfer quantity must be a positive number');
      return;
    }
    try {
      await stockApi.transferStock(xferProd, xferSource, xferTarget, qtyNum);
      onSuccess('Stock transfer completed successfully!');
      setXferQty('');
      onRefresh();
    } catch (err) {
      onError(getErr(err));
    }
  };

  return (
    <div className="card-custom col-lg-6 mx-auto">
      <h4 className="card-title-custom">Atomic Stock Transfer</h4>
      <p className="text-muted small">
        Transfer units of a product safely from one store to another. Insufficient stock will roll back the transaction.
      </p>
      <form onSubmit={transferStock}>
        <div className="mb-3">
          <label className="form-label form-label-custom">Select Product</label>
          <select
            className="form-select form-select-custom"
            value={xferProd}
            onChange={(e) => setXferProd(e.target.value)}
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
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label form-label-custom">Source Store</label>
            <select
              className="form-select form-select-custom"
              value={xferSource}
              onChange={(e) => setXferSource(e.target.value)}
              required
            >
              <option value="">-- Choose Source --</option>
              {stores.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label form-label-custom">Target Store</label>
            <select
              className="form-select form-select-custom"
              value={xferTarget}
              onChange={(e) => setXferTarget(e.target.value)}
              required
            >
              <option value="">-- Choose Target --</option>
              {stores.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label form-label-custom">Transfer Quantity</label>
          <input
            type="number"
            min="1"
            className="form-control form-control-custom"
            value={xferQty}
            onChange={(e) => setXferQty(e.target.value)}
            placeholder="e.g. 5"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary-custom w-100 mt-2">
          Execute Transfer
        </button>
      </form>
    </div>
  );
};
export default StockTransfer;
