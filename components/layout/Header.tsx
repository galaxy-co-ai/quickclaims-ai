"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderProps {
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  className?: string;
}

export function Header({
  title,
  description,
  breadcrumbs,
  actions,
  className = "",
}: HeaderProps) {
  return (
    <header className={`sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border ${className}`}>
      <div className="flex items-center justify-between h-12 px-4">
        <div className="flex-1 min-w-0">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-0.5">
              <ol className="flex items-center gap-1.5 text-xs">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center gap-1.5">
                    {index > 0 && (
                      <svg
                        className="w-3 h-3 text-muted-foreground/50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-foreground font-medium truncate">
                        {crumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Title */}
          {title && (
            <h1 className="text-base font-semibold text-foreground truncate">
              {title}
            </h1>
          )}

          {/* Description */}
          {description && (
            <p className="text-xs text-muted-foreground truncate">{description}</p>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-2 ml-3 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}

// Page Header component for consistent page layouts
interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  backHref,
  backLabel = "Back",
  actions,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`mb-4 ${className}`}>
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          {backLabel}
        </Link>
      )}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {title}
          </h1>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

// Simple breadcrumb generator based on pathname
export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
  ];

  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    // Convert segment to readable label
    let label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    // Special cases
    if (segment === "claims") label = "Claims";
    if (segment === "projects") label = "Projects";
    if (segment === "dashboard") label = "Dashboard";
    if (segment === "analytics") label = "Analytics";
    if (segment === "checklist") label = "Photo Checklist";

    // Skip UUID-like segments in the label (show parent context)
    const isId = segment.length > 20 || /^[a-z0-9]{8,}$/i.test(segment);

    breadcrumbs.push({
      label: isId ? "Details" : label,
      href: isLast ? undefined : currentPath,
    });
  });

  return breadcrumbs;
}

