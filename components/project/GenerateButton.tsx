"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Settings2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui";

type DetailLevel = "concise" | "standard" | "detailed";

interface GenerateButtonProps {
  projectId: string;
  onGenerated?: () => void;
}

export function GenerateButton({ projectId, onGenerated }: GenerateButtonProps) {
  const router = useRouter();
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
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate documents");
      }
      
      // Success!
      if (data.cached) {
        toast.success("Documents loaded from cache");
      } else {
        toast.success("Documents generated successfully!");
      }
      
      // Call callback if provided, otherwise refresh
      if (onGenerated) {
        onGenerated();
      } else {
        router.refresh();
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Failed to generate";
      setError(errorMessage);
      toast.error(errorMessage);
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
          className="inline-flex items-center justify-center gap-1.5 h-8 px-4 text-xs font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              Generate
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className={`h-8 w-8 flex items-center justify-center rounded-full transition-colors ${
            showOptions 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted/60 hover:bg-muted text-muted-foreground"
          }`}
          aria-label="Generation options"
        >
          <Settings2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Options panel - iOS style bottom sheet on mobile, dropdown on desktop */}
      {showOptions && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20 sm:bg-transparent" onClick={() => setShowOptions(false)} />
          <div className="fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-auto sm:left-0 sm:right-auto sm:top-10 z-50 sm:w-64 bg-card border border-border sm:rounded-2xl rounded-t-2xl shadow-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Options</h4>
              <button 
                onClick={() => setShowOptions(false)}
                className="sm:hidden p-1 rounded-full hover:bg-muted text-muted-foreground"
                aria-label="Close options"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Temperature slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-foreground">Creativity</span>
                  <span className="text-xs text-muted-foreground">{temperature.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="1.0"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full h-1.5 rounded-full accent-primary appearance-none bg-muted cursor-pointer"
                  aria-label="Creativity temperature"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>

              {/* Detail level - iOS segmented control */}
              <div>
                <span className="text-xs text-foreground block mb-2">Detail Level</span>
                <div className="flex p-0.5 rounded-full bg-muted/60">
                  {(["concise", "standard", "detailed"] as DetailLevel[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setDetailLevel(level)}
                      className={`flex-1 py-1.5 text-[10px] font-medium rounded-full transition-all capitalize ${
                        detailLevel === level
                          ? "bg-card shadow-sm text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setShowOptions(false);
                  handleGenerate();
                }}
                disabled={loading}
                className="w-full h-10 sm:h-8 text-sm sm:text-xs font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>
            
            {/* Bottom padding for mobile nav bar (56px) + safe area */}
            <div className="h-[calc(56px+env(safe-area-inset-bottom)+16px)] sm:hidden" />
          </div>
        </>
      )}

      {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
    </div>
  );
}
