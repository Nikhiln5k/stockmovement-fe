import React from 'react';
import { Stock } from '../types';

interface StocksProps {
  stocks: Stock[];
  onRefresh: () => void;
  loading: boolean;
  role: 'admin' | 'shopper';
}

export const Stocks: React.FC<StocksProps> = ({
  stocks,
  onRefresh,
  loading,
  role,
}) => {
  return (
    <div className="card-custom">
      <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
        <h4 className="m-0 fw-bold text-indigo">
          {role === 'admin' ? 'Current Stock Levels' : 'Stock Levels'}
        </h4>
        <button
          className={`btn ${role === 'admin' ? 'btn-dark' : 'btn-success'} btn-sm`}
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Stock'}
        </button>
      </div>
      {stocks.length === 0 ? (
        <div className="no-data-msg">
          {role === 'admin'
            ? 'No stock records found. Assign stock through "Adjust Stock".'
            : 'No stock records found.'}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-custom table-striped table-hover">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Store Name</th>
                <th className="text-center">Quantity</th>
                {role === 'admin' && <th>Last Updated</th>}
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock._id}>
                  <td>{stock.product?.name || 'N/A'}</td>
                  <td>
                    <span className="badge bg-secondary">{stock.product?.sku || 'N/A'}</span>
                  </td>
                  <td>{stock.store?.name || 'N/A'}</td>
                  <td className="text-center fw-bold">{stock.quantity}</td>
                  {role === 'admin' && (
                    <td>
                      {stock.updatedAt
                        ? new Date(stock.updatedAt).toLocaleString()
                        : 'N/A'}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default Stocks;
