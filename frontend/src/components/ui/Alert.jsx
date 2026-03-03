import { cn } from "../../lib/cn";

const styles = {
  error: "border-rose-200 bg-rose-50 text-rose-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  info: "border-sky-200 bg-sky-50 text-sky-800",
};

export default function Alert({ variant = "info", className, children }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 text-sm",
        styles[variant],
        className
      )}
    >
      {children}
    </div>
  );
}