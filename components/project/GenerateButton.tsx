"use client";

import { useState } from "react";

type DetailLevel = "concise" | "standard" | "detailed";

export function GenerateButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [detailLevel, setDetailLevel] = useState<DetailLevel>("standard");

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          options: { temperature, detailLevel },
        }),
      });
      if (!res.ok) throw new Error("Failed to generate documents");
      window.location.reload();
    } catch (e: any) {
      setError(e.message || "Failed to generate");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="h-12 px-6 bg-primary text-primary-foreground rounded-xl font-medium disabled:opacity-50 shadow-soft hover:shadow-soft-hover"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className="h-12 w-12 flex items-center justify-center rounded-xl border border-border text-foreground/70 hover:bg-muted/50"
          title="Generation options"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </button>
      </div>

      {/* Options panel */}
      {showOptions && (
        <div className="absolute right-0 top-14 z-20 w-72 bg-card border border-border rounded-xl shadow-lg p-4 space-y-4">
          <h4 className="font-semibold text-sm">Generation Options</h4>

          {/* Temperature slider */}
          <div>
            <label className="text-xs text-foreground/70 block mb-1">
              Creativity (temperature): {temperature.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.3"
              max="1.0"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-foreground/50 mt-1">
              <span>Precise</span>
              <span>Creative</span>
            </div>
          </div>

          {/* Detail level dropdown */}
          <div>
            <label className="text-xs text-foreground/70 block mb-1">
              Detail Level
            </label>
            <select
              value={detailLevel}
              onChange={(e) => setDetailLevel(e.target.value as DetailLevel)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm"
            >
              <option value="concise">Concise — fewer items, essentials only</option>
              <option value="standard">Standard — balanced detail</option>
              <option value="detailed">Detailed — granular breakdown</option>
            </select>
          </div>

          <button
            onClick={() => {
              setShowOptions(false);
              handleGenerate();
            }}
            disabled={loading}
            className="w-full h-10 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate with Options"}
          </button>
        </div>
      )}

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}
