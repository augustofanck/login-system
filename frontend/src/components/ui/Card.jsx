import { cn } from "../../lib/cn";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div className={cn("px-6 pt-6", className)} {...props} />
  );
}

export function CardContent({ className, ...props }) {
  return (
    <div className={cn("px-6 pb-6", className)} {...props} />
  );
}