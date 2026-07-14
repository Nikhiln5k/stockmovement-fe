import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <div className="header-card">
      <div>
        <h2 className="m-0 fw-bold">Multi Store Stock System</h2>
        <span className="text-muted small">Real Time Inventory Portal</span>
      </div>
      <div className="d-flex align-items-center gap-3">
        <div className="text-end">
          <span className={`role-badge ${user.role}`}>
            {user.role}
          </span>
        </div>
        <button className="btn btn-outline-danger btn-sm" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};
export default Header;
