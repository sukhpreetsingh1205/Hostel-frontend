import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const roleToHome = (role) => {
  if (role === 'admin') return '/admin';
  if (role === 'warden') return '/warden';
  return '/student';
};

const AuthLayout = () => {
  const location = useLocation();
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);

  if (isAuthenticated && (user?.role || token)) {
    return <Navigate to={roleToHome(user?.role)} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default AuthLayout;
