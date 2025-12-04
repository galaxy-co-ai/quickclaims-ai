import { AppShell } from "@/components/layout";

export default function ProjectsLoading() {
  return (
    <AppShell mobileTitle="Projects">
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-32 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-10 w-32 bg-muted animate-pulse rounded-lg" />
        </div>

        {/* Stats skeleton */}
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-28 bg-muted animate-pulse rounded-full"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>

        {/* Project cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-4 space-y-3"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
              </div>
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
              <div className="flex gap-2">
                <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                <div className="h-6 w-16 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
