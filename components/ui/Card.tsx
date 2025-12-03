import { HTMLAttributes, forwardRef, ReactNode } from "react";

type CardVariant = "default" | "elevated" | "interactive" | "outlined";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  noPadding?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  default: "bg-card border border-border shadow-[var(--shadow-sm)]",
  elevated: "bg-card border-0 shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)]",
  interactive: "bg-card border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-primary/30 cursor-pointer transition-all duration-200",
  outlined: "bg-transparent border border-border",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", noPadding = false, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-xl transition-shadow duration-200
          ${variantClasses[variant]}
          ${noPadding ? "" : "p-4"}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

// Card Header
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  action?: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ action, className = "", children, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={`flex items-start justify-between gap-3 mb-3 ${className}`} 
        {...props}
      >
        <div className="flex-1 min-w-0">{children}</div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

// Card Title
export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement> & { as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" }
>(({ as: Component = "h3", className = "", children, ...props }, ref) => {
  return (
    <Component
      ref={ref}
      className={`text-base font-semibold text-foreground ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
});

CardTitle.displayName = "CardTitle";

// Card Description
export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className = "", children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={`text-xs text-muted-foreground mt-0.5 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = "CardDescription";

// Card Content
export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = "CardContent";

// Card Footer
export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`mt-4 pt-3 border-t border-border flex items-center gap-2 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";

// Metric Card - specialized card for displaying KPIs
interface MetricCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  change?: {
    value: string | number;
    type: "positive" | "negative" | "neutral";
  };
  icon?: ReactNode;
}

export const MetricCard = forwardRef<HTMLDivElement, MetricCardProps>(
  ({ label, value, change, icon, className = "", ...props }, ref) => {
    return (
      <Card ref={ref} className={className} {...props}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-0.5">
              {label}
            </p>
            <p className="text-xl font-semibold text-foreground">
              {value}
            </p>
            {change && (
              <p
                className={`text-xs mt-0.5 font-medium ${
                  change.type === "positive"
                    ? "text-success"
                    : change.type === "negative"
                    ? "text-error"
                    : "text-muted-foreground"
                }`}
              >
                {change.type === "positive" && "+"}
                {change.value}
              </p>
            )}
          </div>
          {icon && (
            <div className="p-1.5 rounded-md bg-primary-light text-primary">
              {icon}
            </div>
          )}
        </div>
      </Card>
    );
  }
);

MetricCard.displayName = "MetricCard";
