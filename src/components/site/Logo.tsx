import { Link } from "@tanstack/react-router";
import logoUrl from "@/assets/bagsafe-logo.png";

export function Logo({
  variant = "light",
  className = "",
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  return (
    <Link
      to="/"
      aria-label="BagSafe — Home"
      className={`group inline-flex items-center ${className}`}
    >
      <img
        src={logoUrl}
        alt="BagSafe"
        className={`h-8 w-auto md:h-9 transition-transform group-hover:scale-105 ${
          variant === "light" ? "brightness-0 invert" : ""
        }`}
      />
    </Link>
  );
}
