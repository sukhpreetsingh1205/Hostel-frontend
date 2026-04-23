import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const roleToHome = (role) => {
  if (role === 'admin') return '/admin';
  if (role === 'warden') return '/warden';
  return '/student';
};

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="navbar bg-white border-b border-gray-200 px-4">
        <div className="flex-1">
          <button
            type="button"
            className="btn btn-ghost text-lg"
            onClick={() => navigate(roleToHome(user?.role))}
          >
            Hostel MS
          </button>
        </div>
        <div className="flex-none gap-2">
          <div className="text-right leading-tight hidden sm:block">
            <div className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</div>
            <div className="text-xs text-gray-500 capitalize">{user?.role || ''}</div>
          </div>
          <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
