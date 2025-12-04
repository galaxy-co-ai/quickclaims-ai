import { AppShell } from "@/components/layout";

export default function ClaimLoading() {
  return (
    <AppShell mobileTitle="Claim">
      <div className="space-y-6">
        {/* Back button and header skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-muted animate-pulse rounded-lg" />
          <div className="flex-1">
            <div className="h-7 w-48 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-8 w-24 bg-muted animate-pulse rounded-full" />
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-4"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="h-4 w-20 bg-muted animate-pulse rounded mb-2" />
              <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>

        {/* Tabs skeleton */}
        <div className="flex gap-2 border-b border-border pb-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 bg-muted animate-pulse rounded-lg"
              style={{ animationDelay: `${i * 75}ms` }}
            />
          ))}
        </div>

        {/* Content skeleton */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-muted animate-pulse rounded-lg"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
