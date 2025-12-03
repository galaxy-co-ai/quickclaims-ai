"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";

// Toast Types
type ToastVariant = "default" | "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  title?: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  // Convenience methods
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// Generate unique IDs
let toastCounter = 0;
const generateId = () => `toast-${++toastCounter}-${Date.now()}`;

// Toast Provider
interface ToastProviderProps {
  children: ReactNode;
  /** Maximum number of toasts to show at once */
  maxToasts?: number;
  /** Default duration in ms (0 for no auto-dismiss) */
  defaultDuration?: number;
}

export function ToastProvider({
  children,
  maxToasts = 5,
  defaultDuration = 5000,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = generateId();
      const duration = toast.duration ?? defaultDuration;

      setToasts((prev) => {
        const newToasts = [...prev, { ...toast, id }];
        // Remove oldest if exceeding max
        if (newToasts.length > maxToasts) {
          return newToasts.slice(-maxToasts);
        }
        return newToasts;
      });

      // Auto-dismiss
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [defaultDuration, maxToasts, removeToast]
  );

  // Convenience methods
  const success = useCallback(
    (message: string, title?: string) => {
      addToast({ message, title, variant: "success" });
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, title?: string) => {
      addToast({ message, title, variant: "error", duration: 7000 }); // Longer for errors
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string, title?: string) => {
      addToast({ message, title, variant: "warning" });
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, title?: string) => {
      addToast({ message, title, variant: "info" });
    },
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, success, error, warning, info }}
    >
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

// Hook to use toasts
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// Toast Container (renders all toasts)
interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-md w-full pointer-events-none"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {toasts.map((toast, index) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => removeToast(toast.id)}
          style={{ animationDelay: `${index * 50}ms` }}
        />
      ))}
    </div>
  );
}

// Individual Toast Item
const variantStyles: Record<ToastVariant, { bg: string; icon: ReactNode; iconBg: string }> = {
  default: {
    bg: "bg-card border-border",
    iconBg: "bg-muted text-muted-foreground",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  success: {
    bg: "bg-card border-success/30",
    iconBg: "bg-success-light text-success",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  error: {
    bg: "bg-card border-error/30",
    iconBg: "bg-error-light text-error",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  warning: {
    bg: "bg-card border-warning/30",
    iconBg: "bg-warning-light text-warning-foreground",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  info: {
    bg: "bg-card border-info/30",
    iconBg: "bg-info-light text-info",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: () => void;
  style?: React.CSSProperties;
}

function ToastItem({ toast, onDismiss, style }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  const { bg, icon, iconBg } = variantStyles[toast.variant];

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(onDismiss, 200); // Wait for exit animation
  };

  return (
    <div
      className={`
        pointer-events-auto
        flex items-start gap-3 p-4 rounded-xl border shadow-lg
        transition-all duration-200 ease-out
        ${bg}
        ${isVisible && !isExiting ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}
      `}
      style={style}
      role="alert"
      aria-live={toast.variant === "error" ? "assertive" : "polite"}
    >
      <div className={`flex-shrink-0 p-1.5 rounded-lg ${iconBg}`}>
        {icon}
      </div>
      
      <div className="flex-1 min-w-0 pt-0.5">
        {toast.title && (
          <p className="text-sm font-semibold text-foreground mb-0.5">
            {toast.title}
          </p>
        )}
        <p className="text-sm text-muted-foreground">{toast.message}</p>
      </div>
      
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Dismiss notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// Simple toast function for use outside React components
// (requires ToastProvider to be mounted)
export const toast = {
  success: (message: string, title?: string) => {
    dispatchToastEvent({ message, title, variant: "success" });
  },
  error: (message: string, title?: string) => {
    dispatchToastEvent({ message, title, variant: "error" });
  },
  warning: (message: string, title?: string) => {
    dispatchToastEvent({ message, title, variant: "warning" });
  },
  info: (message: string, title?: string) => {
    dispatchToastEvent({ message, title, variant: "info" });
  },
};

function dispatchToastEvent(toast: Omit<Toast, "id">) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("quickclaims-toast", { detail: toast }));
  }
}

// Hook to listen for toast events (used by ToastProvider internally)
export function useToastEvents() {
  const context = useContext(ToastContext);
  
  useEffect(() => {
    if (!context) return;
    
    const handler = (e: CustomEvent<Omit<Toast, "id">>) => {
      context.addToast(e.detail);
    };
    
    window.addEventListener("quickclaims-toast" as keyof WindowEventMap, handler as EventListener);
    return () => {
      window.removeEventListener("quickclaims-toast" as keyof WindowEventMap, handler as EventListener);
    };
  }, [context]);
}

