import React, { useState } from 'react';
import * as storeApi from '../services/stores';
import { Store } from '../types';

interface StoreListProps {
  stores: Store[];
}

export const StoreList: React.FC<StoreListProps> = ({ stores }) => {
  return (
    <div className="card-custom">
      <h5 className="card-title-custom">Stores Directory ({stores.length})</h5>
      {stores.length === 0 ? (
        <div className="no-data-msg">No stores found.</div>
      ) : (
        <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Store Name</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

interface CreateStoreFormProps {
  onSuccess: (msg: string) => void;
  onError: (err: string) => void;
  onRefresh: () => void;
}

export const CreateStoreForm: React.FC<CreateStoreFormProps> = ({
  onSuccess,
  onError,
  onRefresh,
}) => {
  const [storeName, setStoreName] = useState('');

  const getErr = (err: any): string => {
    if (err.response && err.response.data && err.response.data.message) {
      return err.response.data.message;
    }
    return err.message || 'An unexpected error occurred';
  };

  const addStore = async (e: React.FormEvent) => {
    e.preventDefault();
    onError('');
    onSuccess('');
    if (!storeName) {
      onError('Please provide store name');
      return;
    }
    try {
      await storeApi.createStore(storeName);
      onSuccess(`Store "${storeName}" created successfully!`);
      setStoreName('');
      onRefresh();
    } catch (err) {
      onError(getErr(err));
    }
  };

  return (
    <div className="card-custom col-lg-6 mx-auto">
      <h4 className="card-title-custom">Create New Store</h4>
      <form onSubmit={addStore}>
        <div className="mb-3">
          <label className="form-label form-label-custom">Store Name</label>
          <input
            type="text"
            className="form-control form-control-custom"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="e.g. New York Outlet"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary-custom w-100 mt-2">
          Create Store
        </button>
      </form>
    </div>
  );
};
