import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  if (!isLoggedIn) {
    // If not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If logged in, render the component that was passed in
  return children;
};

export default ProtectedRoute;