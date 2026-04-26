import { Link } from "@tanstack/react-router";
import { Plane } from "lucide-react";

export function Logo({
  variant = "light",
  className = "",
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const colorClass = variant === "dark" ? "text-foreground" : "text-ink-foreground";
  return (
    <Link
      to="/"
      aria-label="BagSafe — Home"
      className={`group inline-flex items-center gap-2 ${colorClass} ${className}`}
    >
      <span
        className="grid h-9 w-9 place-items-center rounded-full bg-gradient-amber shadow-elegant transition-transform group-hover:rotate-6"
        aria-hidden
      >
        <Plane className="h-4 w-4 text-ink" strokeWidth={2.5} />
      </span>
      <span className="font-display text-2xl font-semibold tracking-tight">
        Bag<span className="text-amber">Safe</span>
      </span>
    </Link>
  );
}
