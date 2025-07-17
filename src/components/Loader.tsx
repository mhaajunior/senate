"use client";

import { cn } from "@/lib/utils";
import React from "react";

export interface LoaderProps {
  variant?: "normal" | "full";
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function NormalLoader({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "size-4",
    md: "size-5",
    lg: "size-6",
  };

  return (
    <div
      className={cn(
        "border-primary animate-spin rounded-full border-2 border-t-transparent",
        sizeClasses[size],
        className
      )}
    >
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function FullLoader({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "size-4",
    md: "size-5",
    lg: "size-6",
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={cn(
          "border-primary animate-spin rounded-full border-2 border-t-transparent",
          sizeClasses[size],
          className
        )}
      >
        <span className="sr-only">Loading</span>
      </div>
    </div>
  );
}

function Loader({ variant = "normal", size = "md", className }: LoaderProps) {
  switch (variant) {
    case "normal":
      return <NormalLoader size={size} className={className} />;
    case "full":
      return <FullLoader size={size} className={className} />;
    default:
      return <NormalLoader size={size} className={className} />;
  }
}

export { Loader };
