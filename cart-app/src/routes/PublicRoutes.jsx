import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoutes = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  // Show loading while checking auth state
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoutes;
