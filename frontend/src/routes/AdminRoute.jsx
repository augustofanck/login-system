import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AdminRoute() {
  const { me, loading } = useAuth();

  if (loading) return <div className="p-4">Carregando...</div>;

  return me?.role === "ADMIN" ? <Outlet /> : <Navigate to="/home" replace />;
}