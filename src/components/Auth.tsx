import React, { useState } from 'react';
import * as authApi from '../services/auth';
import { User } from '../types';

interface AuthProps {
  onAuthSuccess: (token: string, user: User) => void;
  error: string;
  setError: (err: string) => void;
  success: string;
  setSuccess: (msg: string) => void;
}

export const Auth: React.FC<AuthProps> = ({
  onAuthSuccess,
  error,
  setError,
  success,
  setSuccess,
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'shopper'>('shopper');

  const getErr = (err: any): string => {
    if (err.response && err.response.data && err.response.data.message) {
      return err.response.data.message;
    }
    return err.message || 'An unexpected error occurred';
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      let data;
      if (isLogin) {
        data = await authApi.login(username, password);
        setSuccess('Logged in successfully!');
      } else {
        data = await authApi.register(username, password, role);
        setSuccess('Account registered successfully!');
      }
      onAuthSuccess(data.token, data.user);
      setUsername('');
      setPassword('');
    } catch (err) {
      setError(getErr(err));
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="text-center mb-4 fw-bold text-indigo">Stock Management</h2>
        <div className="d-flex mb-4 justify-content-center">
          <button
            className={`btn mx-2 ${isLogin ? 'btn-dark' : 'btn-outline-dark'}`}
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
          >
            Login
          </button>
          <button
            className={`btn mx-2 ${!isLogin ? 'btn-dark' : 'btn-outline-dark'}`}
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
          >
            Register
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleAuth}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          {!isLogin && (
            <div className="mb-4">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'shopper')}
              >
                <option value="shopper">Shopper</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          <button type="submit" className="btn btn-dark w-100 py-2 mt-2">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Auth;
