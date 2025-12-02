"use client";

import { useEffect, useState } from "react";

interface ActivityEntry {
  timestamp: string;
  event: string;
  details?: Record<string, any>;
}

const eventLabels: Record<string, { label: string; icon: string; color: string }> = {
  cache_hit: { label: "Cache Hit", icon: "⚡", color: "text-green-600" },
  generation_start: { label: "Generation Started", icon: "🔄", color: "text-blue-600" },
  generation_complete: { label: "Generation Complete", icon: "✅", color: "text-green-600" },
};

export function ActivityLog({ projectId }: { projectId: string }) {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/activity`)
      .then((res) => res.json())
      .then((data) => {
        setEntries(data.activity ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [projectId]);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading activity...</p>;
  }

  if (!entries.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No activity yet. Generate documents to see activity here.
      </p>
    );
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {entries.map((entry, i) => {
        const meta = eventLabels[entry.event] ?? {
          label: entry.event,
          icon: "📌",
          color: "text-foreground/70",
        };
        const time = new Date(entry.timestamp);
        const timeStr = time.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });

        return (
          <div
            key={i}
            className="flex items-start gap-3 text-sm border-b border-border pb-2 last:border-0"
          >
            <span className="text-lg">{meta.icon}</span>
            <div className="flex-1 min-w-0">
              <span className={`font-medium ${meta.color}`}>{meta.label}</span>
              {entry.details?.options && (
                <span className="ml-2 text-xs text-foreground/50">
                  temp={entry.details.options.temperature ?? 0.7}, detail=
                  {entry.details.options.detailLevel ?? "standard"}
                </span>
              )}
              <p className="text-xs text-foreground/50">{timeStr}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
