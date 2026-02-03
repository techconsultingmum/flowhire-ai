import { LucideIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
  size = "md",
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: "py-8",
      icon: "w-10 h-10",
      iconInner: "w-5 h-5",
      title: "text-base",
      description: "text-sm",
    },
    md: {
      container: "py-16",
      icon: "w-16 h-16",
      iconInner: "w-8 h-8",
      title: "text-lg",
      description: "text-base",
    },
    lg: {
      container: "py-24",
      icon: "w-20 h-20",
      iconInner: "w-10 h-10",
      title: "text-xl",
      description: "text-lg",
    },
  };

  const s = sizeClasses[size];

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center px-4 text-center",
        s.container,
        className
      )}
      role="status"
      aria-label={title}
    >
      <div className={cn("rounded-2xl bg-muted flex items-center justify-center mb-6", s.icon)}>
        <Icon className={cn("text-muted-foreground", s.iconInner)} aria-hidden="true" />
      </div>
      <h3 className={cn("font-semibold mb-2", s.title)}>{title}</h3>
      <p className={cn("text-muted-foreground max-w-sm mb-6", s.description)}>{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
