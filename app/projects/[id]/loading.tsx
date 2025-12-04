import { AppShell } from "@/components/layout";

export default function ProjectDetailLoading() {
  return (
    <AppShell mobileTitle="Project">
      <div className="space-y-6">
        {/* Back button and header skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-muted animate-pulse rounded-lg" />
          <div className="flex-1">
            <div className="h-7 w-48 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-muted animate-pulse rounded-lg" />
            <div className="h-10 w-10 bg-muted animate-pulse rounded-lg" />
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="flex gap-1 p-1 rounded-lg bg-muted/50">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-10 flex-1 bg-muted animate-pulse rounded-md"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="aspect-video bg-muted animate-pulse rounded-xl"
              style={{ animationDelay: `${i * 75}ms` }}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
