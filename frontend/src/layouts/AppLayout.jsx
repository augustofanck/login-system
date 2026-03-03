import { NavLink } from "react-router-dom";
import Button from "../components/ui/Button";
import { cn } from "../lib/cn";
import { useAuth } from "../auth/AuthContext";

function TopLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "rounded-xl px-3 py-2 text-sm font-medium transition",
          isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
        )
      }
    >
      {children}
    </NavLink>
  );
}

export default function AppLayout({ children }) {
  const { me, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              LS
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Login System</p>
              <p className="text-xs text-slate-500">JWT • Spring Security</p>
            </div>
          </div>

          <nav className="hidden sm:flex items-center gap-2">
            <TopLink to="/home">Home</TopLink>
            <TopLink to="/me/change-password">Trocar senha</TopLink>
            {me?.role === "ADMIN" && <TopLink to="/admin/users">Admin</TopLink>}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-slate-900">{me?.name}</p>
              <p className="text-xs text-slate-500">{me?.role}</p>
            </div>
            <Button variant="secondary" onClick={logout}>Sair</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}