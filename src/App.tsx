import React, { useState, useEffect, useCallback } from 'react';
import * as productApi from './services/products';
import * as storeApi from './services/stores';
import * as stockApi from './services/stocks';
import { User, Product, Store, Stock } from './types';
import Header from './components/Header';
import Auth from './components/Auth';
import Stocks from './components/Stocks';
import { ProductList, CreateProductForm } from './components/Products';
import { StoreList, CreateStoreForm } from './components/Stores';
import StockAdjustment from './components/StockAdjustment';
import StockTransfer from './components/StockTransfer';

function App() {
  // Auth state
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string>(() => localStorage.getItem('token') || '');

  // Business state
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Active tab state for Admin
  const [tab, setTab] = useState<string>('overview');

  // alerts
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // error message helper
  const getErr = (err: any): string => {
    if (err.response && err.response.data && err.response.data.message) {
      return err.response.data.message;
    }
    return err.message || 'An unexpected error occurred';
  };

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [stocksData, productsData, storesData] = await Promise.all([
        stockApi.getStocks(),
        productApi.getProducts(),
        storeApi.getStores(),
      ]);
      setStocks(stocksData);
      setProducts(productsData);
      setStores(storesData);
    } catch (err) {
      setError(getErr(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // load all data
  useEffect(() => {
    if (token) {
      loadAll();
    }
  }, [token, loadAll]);

  const handleAuthSuccess = (savedToken: string, savedUser: User) => {
    localStorage.setItem('token', savedToken);
    localStorage.setItem('user', JSON.stringify(savedUser));
    setToken(savedToken);
    setUser(savedUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setProducts([]);
    setStores([]);
    setStocks([]);
    setError('');
    setSuccess('');
  };

  // Auth
  if (!user) {
    return (
      <Auth
        onAuthSuccess={handleAuthSuccess}
        error={error}
        setError={setError}
        success={success}
        setSuccess={setSuccess}
      />
    );
  }

  // Dashboard layout
  return (
    <div className="dashboard-wrapper">
      {/* Top Banner Header */}
      <Header user={user} onLogout={logout} />

      {/* Global Alerts */}
      {error && (
        <div className="alert alert-danger alert-dismiss-custom d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <button className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}
      {success && (
        <div className="alert alert-success alert-dismiss-custom d-flex justify-content-between align-items-center">
          <span>{success}</span>
          <button className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      {user.role === 'admin' ? (
        <div>
          <ul className="nav nav-pills nav-pills-custom mb-4 gap-2">
            <li className="nav-item">
              <button
                className={`nav-link ${tab === 'overview' ? 'active' : ''}`}
                onClick={() => setTab('overview')}
              >
                Overview & Stocks
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${tab === 'product' ? 'active' : ''}`}
                onClick={() => setTab('product')}
              >
                Add Product
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${tab === 'store' ? 'active' : ''}`}
                onClick={() => setTab('store')}
              >
                Add Store
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${tab === 'adjust' ? 'active' : ''}`}
                onClick={() => setTab('adjust')}
              >
                Adjust Stock
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${tab === 'transfer' ? 'active' : ''}`}
                onClick={() => setTab('transfer')}
              >
                Transfer Stock
              </button>
            </li>
          </ul>

          {tab === 'overview' && (
            <div>
              <Stocks stocks={stocks} onRefresh={loadAll} loading={loading} role="admin" />

              <div className="row">
                <div className="col-md-6">
                  <ProductList products={products} />
                </div>
                <div className="col-md-6">
                  <StoreList stores={stores} />
                </div>
              </div>
            </div>
          )}

          {tab === 'product' && (
            <CreateProductForm
              onSuccess={setSuccess}
              onError={setError}
              onRefresh={loadAll}
            />
          )}

          {tab === 'store' && (
            <CreateStoreForm
              onSuccess={setSuccess}
              onError={setError}
              onRefresh={loadAll}
            />
          )}

          {tab === 'adjust' && (
            <StockAdjustment
              products={products}
              stores={stores}
              onSuccess={setSuccess}
              onError={setError}
              onRefresh={loadAll}
            />
          )}

          {tab === 'transfer' && (
            <StockTransfer
              products={products}
              stores={stores}
              onSuccess={setSuccess}
              onError={setError}
              onRefresh={loadAll}
            />
          )}
        </div>
      ) : (
        <div>
          <Stocks stocks={stocks} onRefresh={loadAll} loading={loading} role="shopper" />

          <div className="row">
            <div className="col-md-6">
              <ProductList products={products} />
            </div>
            <div className="col-md-6">
              <StoreList stores={stores} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
