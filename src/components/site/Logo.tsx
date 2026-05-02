import { Link } from "@tanstack/react-router";
import logoUrl from "@/assets/bagsafe-logo.png";

export function Logo({
  variant = "light",
  className = "",
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const frameClass =
    variant === "light"
      ? "bg-white/96 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.55)] ring-1 ring-white/50"
      : "bg-white shadow-[0_10px_24px_-16px_rgba(0,0,0,0.22)] ring-1 ring-black/5";

  return (
    <Link
      to="/"
      aria-label="BagSafe — Home"
      className={`group inline-flex items-center ${className}`}
    >
      <span
        className={`inline-flex items-center rounded-[0.875rem] px-3 py-2 transition-transform group-hover:scale-[1.02] ${frameClass}`}
      >
        <img src={logoUrl} alt="BagSafe" className="h-7 w-auto md:h-8" />
      </span>
    </Link>
  );
}
