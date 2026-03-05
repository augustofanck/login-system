import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ProtectedRoute() {
  const { token, loading } = useAuth();

  if (loading) return <div className="p-4">Carregando...</div>;

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}