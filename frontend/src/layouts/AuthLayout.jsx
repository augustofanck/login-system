export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-indigo-600/20 ring-1 ring-indigo-500/30 flex items-center justify-center">
            <span className="text-indigo-200 font-bold">LS</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && <p className="mt-1 text-slate-300 text-sm">{subtitle}</p>}
        </div>

        {children}

        <p className="mt-6 text-center text-xs text-slate-400">
          Login System • React + Spring Boot
        </p>
      </div>
    </div>
  );
}