import { HTMLAttributes, forwardRef } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Width of the skeleton. Can be a number (px) or string (e.g., '100%') */
  width?: number | string;
  /** Height of the skeleton. Can be a number (px) or string */
  height?: number | string;
  /** Makes the skeleton circular */
  circle?: boolean;
  /** Number of skeleton lines to render */
  count?: number;
  /** Gap between skeleton lines when count > 1 */
  gap?: number;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      width,
      height,
      circle = false,
      count = 1,
      gap = 8,
      className = "",
      style,
      ...props
    },
    ref
  ) => {
    const baseStyle = {
      width: typeof width === "number" ? `${width}px` : width,
      height: typeof height === "number" ? `${height}px` : height,
      ...style,
    };

    if (count > 1) {
      return (
        <div 
          ref={ref}
          className="flex flex-col" 
          style={{ gap: `${gap}px` }}
          role="status"
          aria-label="Loading..."
        >
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className={`skeleton ${circle ? "rounded-full" : ""} ${className}`}
              style={baseStyle}
              aria-hidden="true"
            />
          ))}
          <span className="sr-only">Loading...</span>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`skeleton ${circle ? "rounded-full" : ""} ${className}`}
        style={baseStyle}
        role="status"
        aria-label="Loading..."
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

Skeleton.displayName = "Skeleton";

// Preset skeleton components for common UI patterns
export const SkeletonText = forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, "height"> & { lines?: number }
>(({ lines = 3, className = "", ...props }, ref) => (
  <Skeleton
    ref={ref}
    count={lines}
    height={16}
    width="100%"
    gap={12}
    className={className}
    {...props}
  />
));

SkeletonText.displayName = "SkeletonText";

export const SkeletonAvatar = forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, "circle" | "width" | "height"> & { size?: number }
>(({ size = 40, className = "", ...props }, ref) => (
  <Skeleton
    ref={ref}
    circle
    width={size}
    height={size}
    className={className}
    {...props}
  />
));

SkeletonAvatar.displayName = "SkeletonAvatar";

export const SkeletonCard = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`p-6 rounded-2xl border border-border bg-card ${className}`}
      role="status"
      aria-label="Loading card..."
      {...props}
    >
      <div className="flex items-start gap-4 mb-4">
        <SkeletonAvatar size={48} />
        <div className="flex-1">
          <Skeleton height={20} width="60%" className="mb-2" />
          <Skeleton height={14} width="40%" />
        </div>
      </div>
      <SkeletonText lines={3} />
      <span className="sr-only">Loading card content...</span>
    </div>
  )
);

SkeletonCard.displayName = "SkeletonCard";

export const SkeletonTable = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { rows?: number; columns?: number }
>(({ rows = 5, columns = 4, className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-xl border border-border overflow-hidden ${className}`}
    role="status"
    aria-label="Loading table..."
    {...props}
  >
    {/* Header */}
    <div className="bg-muted p-4 flex gap-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={`header-${i}`} height={14} className="flex-1" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div
        key={`row-${rowIndex}`}
        className="p-4 flex gap-4 border-t border-border"
      >
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton
            key={`cell-${rowIndex}-${colIndex}`}
            height={16}
            className="flex-1"
          />
        ))}
      </div>
    ))}
    <span className="sr-only">Loading table content...</span>
  </div>
));

SkeletonTable.displayName = "SkeletonTable";

// Metric card skeleton
export const SkeletonMetric = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`p-5 rounded-2xl border border-border bg-card ${className}`}
      role="status"
      aria-label="Loading metric..."
      {...props}
    >
      <Skeleton height={12} width={80} className="mb-2" />
      <Skeleton height={36} width={100} className="mb-2" />
      <Skeleton height={14} width={60} />
      <span className="sr-only">Loading metric...</span>
    </div>
  )
);

SkeletonMetric.displayName = "SkeletonMetric";

