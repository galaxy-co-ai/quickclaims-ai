"use client";

import { useState } from "react";

export function UploadBox({ projectId }: { projectId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string>("document");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("projectId", projectId);
      fd.append("fileType", fileType);

      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      // Reload page data
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="md:col-span-2">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full h-12 px-3 bg-input-background border border-border rounded-xl"
            required
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="fileType" className="text-sm text-foreground/80">
            Type
          </label>
          <select
            id="fileType"
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="h-12 px-3 bg-input-background border border-border rounded-xl"
          >
            <option value="scope">Scope</option>
            <option value="photo">Photo</option>
            <option value="document">Document</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={uploading || !file}
          className="h-12 px-6 bg-primary text-primary-foreground rounded-xl font-medium disabled:opacity-50 shadow-soft hover:shadow-soft-hover"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>
    </form>
  );
}
