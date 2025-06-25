import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return allowedRoles.includes(user?.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  ); // Or a 403 page
};

export default ProtectedRoute;
