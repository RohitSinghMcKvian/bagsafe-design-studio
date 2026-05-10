import { Loader2, Plane } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingScreenProps {
  variant?: "spinner" | "skeleton" | "both";
 showText?: boolean;
}

export function LoadingScreen({
  variant = "both",
  showText = true,
}: LoadingScreenProps) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-6 p-8">
      {variant === "spinner" || variant === "both" ? (
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 backdrop-blur-sm">
            <Plane className="h-8 w-8 animate-bounce text-primary" strokeWidth={1.5} />
          </div>
        </div>
      ) : null}

      {showText && (
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Loading...
        </p>
      )}

      {(variant === "skeleton" || variant === "both") && (
        <div className="w-full max-w-md space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}
    </div>
  );
}

export function LoadingSpinner({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <Loader2
      className={`animate-spin text-primary ${sizeClasses[size]} ${className}`}
    />
  );
}
