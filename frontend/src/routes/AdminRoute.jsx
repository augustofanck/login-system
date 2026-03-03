import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AdminRoute({ children }) {
  const { token, me, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;
  if (!token) return <Navigate to="/login" replace />;
  if (me?.role !== "ADMIN") return <Navigate to="/home" replace />;

  return children;
}