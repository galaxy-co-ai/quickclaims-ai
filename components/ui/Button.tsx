import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "success";
type ButtonSize = "sm" | "md" | "lg" | "xl" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover shadow-[var(--shadow-primary)] hover:shadow-[var(--shadow-primary-lg)] hover:-translate-y-0.5 active:translate-y-0",
  secondary: 
    "bg-secondary text-secondary-foreground hover:bg-muted",
  outline:
    "border border-border bg-transparent hover:bg-muted hover:border-primary/30 text-foreground",
  ghost: 
    "bg-transparent hover:bg-muted text-foreground",
  destructive: 
    "bg-error text-white hover:bg-error/90 shadow-sm",
  success:
    "bg-success text-white hover:bg-success/90 shadow-sm",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-7 px-2.5 text-xs gap-1 rounded-md",
  md: "h-8 px-3 text-sm gap-1.5 rounded-lg",
  lg: "h-9 px-4 text-sm gap-2 rounded-lg",
  xl: "h-10 px-5 text-base gap-2 rounded-xl",
  icon: "h-8 w-8 rounded-lg",
};

const Spinner = ({ className = "" }: { className?: string }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = "",
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    
    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        className={`
          inline-flex items-center justify-center font-medium
          transition-all duration-150 ease-out
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <Spinner className="h-4 w-4" />
        ) : leftIcon ? (
          <span className="flex-shrink-0" aria-hidden="true">{leftIcon}</span>
        ) : null}
        
        {size !== "icon" && (
          <span className={loading ? "ml-2" : ""}>{children}</span>
        )}
        {size === "icon" && !loading && children}
        
        {rightIcon && !loading && (
          <span className="flex-shrink-0" aria-hidden="true">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

// Icon-only button variant for convenience
export const IconButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "size" | "leftIcon" | "rightIcon"> & {
    "aria-label": string;
  }
>(({ children, className = "", ...props }, ref) => (
  <Button
    ref={ref}
    size="icon"
    className={className}
    {...props}
  >
    {children}
  </Button>
));

IconButton.displayName = "IconButton";
