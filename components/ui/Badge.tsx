"use client";

import { HTMLAttributes, forwardRef, ReactNode } from "react";

type BadgeVariant = 
  | "default" 
  | "primary" 
  | "secondary"
  | "success" 
  | "warning" 
  | "error" 
  | "info"
  | "outline";

type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary-light text-primary",
  secondary: "bg-secondary text-secondary-foreground",
  success: "bg-success-light text-success-foreground",
  warning: "bg-warning-light text-warning-foreground",
  error: "bg-error-light text-error-foreground",
  info: "bg-info-light text-info-foreground",
  outline: "bg-transparent border border-border text-foreground",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs gap-1",
  md: "px-2.5 py-1 text-xs gap-1.5",
  lg: "px-3 py-1.5 text-sm gap-2",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-muted-foreground",
  primary: "bg-primary",
  secondary: "bg-secondary-foreground",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  info: "bg-info",
  outline: "bg-foreground",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "default",
      size = "md",
      dot = false,
      icon,
      removable = false,
      onRemove,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center font-medium rounded-full whitespace-nowrap
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
        {...props}
      >
        {dot && (
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[variant]}`}
            aria-hidden="true"
          />
        )}
        
        {icon && !dot && (
          <span className="flex-shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        
        {children}
        
        {removable && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-1 -mr-1 p-0.5 rounded-full hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Remove"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = "Badge";

// Status Badge - specialized badge for claim workflow statuses
const STATUS_CONFIG: Record<string, { label: string; variant: BadgeVariant }> = {
  intake: { label: "Intake", variant: "default" },
  scope_review: { label: "Scope Review", variant: "info" },
  delta_analysis: { label: "Delta Analysis", variant: "primary" },
  supplement_pending: { label: "Supplement Pending", variant: "warning" },
  awaiting_sol: { label: "Awaiting SOL", variant: "warning" },
  rebuttal: { label: "Rebuttal", variant: "error" },
  build_scheduled: { label: "Build Scheduled", variant: "info" },
  post_build: { label: "Post Build", variant: "primary" },
  invoicing: { label: "Invoicing", variant: "success" },
  depreciation_pending: { label: "Dep. Pending", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
};

interface StatusBadgeProps extends Omit<BadgeProps, "variant" | "children"> {
  status: string;
}

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, ...props }, ref) => {
    const config = STATUS_CONFIG[status] || { label: status, variant: "default" as BadgeVariant };
    
    return (
      <Badge ref={ref} variant={config.variant} dot {...props}>
        {config.label}
      </Badge>
    );
  }
);

StatusBadge.displayName = "StatusBadge";

