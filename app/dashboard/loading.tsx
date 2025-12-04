export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar skeleton */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col bg-card border-r border-border">
        <div className="flex h-16 items-center px-6">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-10 bg-muted animate-pulse rounded-lg"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </nav>
      </aside>

      {/* Main content skeleton */}
      <main className="lg:pl-64">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-10 w-32 bg-muted animate-pulse rounded-lg" />
          </div>

          {/* Chat area skeleton */}
          <div className="max-w-3xl mx-auto space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`h-20 ${i % 2 === 0 ? "w-3/4" : "w-1/2"} bg-muted animate-pulse rounded-xl`}
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              </div>
            ))}
          </div>

          {/* Input skeleton */}
          <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-background border-t border-border">
            <div className="max-w-3xl mx-auto">
              <div className="h-12 bg-muted animate-pulse rounded-xl" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
