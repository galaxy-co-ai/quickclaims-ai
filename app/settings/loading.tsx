import { AppShell } from "@/components/layout";

export default function SettingsLoading() {
  return (
    <AppShell mobileTitle="Settings">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header skeleton */}
        <div className="text-center mb-6">
          <div className="h-8 w-24 bg-muted animate-pulse rounded mx-auto mb-2" />
          <div className="h-4 w-48 bg-muted animate-pulse rounded mx-auto" />
        </div>

        {/* Tabs skeleton */}
        <div className="flex gap-1 p-1 rounded-full bg-muted/50 w-fit mx-auto">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 bg-muted animate-pulse rounded-full"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>

        {/* Settings cards skeleton */}
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-6 space-y-4"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="h-5 w-32 bg-muted animate-pulse rounded" />
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="h-4 w-36 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="h-6 w-11 bg-muted animate-pulse rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
