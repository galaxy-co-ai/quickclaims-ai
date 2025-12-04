import { AppShell } from "@/components/layout";

export default function DocumentsLoading() {
  return (
    <AppShell mobileTitle="Documents">
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-36 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-56 bg-muted animate-pulse rounded" />
          </div>
        </div>

        {/* Filter tabs skeleton */}
        <div className="flex gap-2 border-b border-border pb-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-24 bg-muted animate-pulse rounded-lg"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>

        {/* Document list skeleton */}
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
              style={{ animationDelay: `${i * 75}ms` }}
            >
              <div className="w-10 h-10 bg-muted animate-pulse rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-48 bg-muted animate-pulse rounded" />
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-8 w-20 bg-muted animate-pulse rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
