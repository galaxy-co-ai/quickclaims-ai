"use client";

import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";

interface UploadBoxProps {
  projectId: string;
  compact?: boolean;
}

export function UploadBox({ projectId, compact = false }: UploadBoxProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string>("document");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(selectedFile: File) {
    setUploading(true);
    setError(null);

    try {
      // Auto-detect file type
      const detectedType = selectedFile.type.startsWith("image/") ? "photo" : 
        selectedFile.name.toLowerCase().includes("scope") ? "scope" : "document";

      const fd = new FormData();
      fd.append("file", selectedFile);
      fd.append("projectId", projectId);
      fd.append("fileType", detectedType);

      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      window.location.reload();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    await handleUpload(file);
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      handleUpload(droppedFile);
    }
  };

  // Compact mode - just a pill button
  if (compact) {
    return (
      <div className="inline-flex">
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
              setFile(selectedFile);
              handleUpload(selectedFile);
            }
          }}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center justify-center gap-1.5 h-8 px-4 text-xs font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" />
              Upload
            </>
          )}
        </button>
        {error && <p className="text-red-600 text-xs ml-2">{error}</p>}
      </div>
    );
  }

  // Full mode - drag and drop area
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all
          ${isDragging 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-primary/50 hover:bg-muted/30"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp"
        />
        
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-colors ${
          isDragging ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        }`}>
          <Upload className="w-5 h-5" />
        </div>
        
        <p className="text-sm font-medium text-foreground mb-0.5">
          {isDragging ? "Drop file here" : file ? file.name : "Drag & drop or click"}
        </p>
        <p className="text-xs text-muted-foreground">
          PDF, Word, Excel, Images
        </p>
      </div>

      {file && (
        <div className="flex items-center gap-2">
          <select
            id="fileType"
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="h-7 pl-2 pr-6 text-xs rounded-full bg-muted/60 border-0 appearance-none"
            aria-label="File type"
          >
            <option value="scope">Scope</option>
            <option value="photo">Photo</option>
            <option value="document">Document</option>
          </select>
          
          <button
            type="submit"
            disabled={uploading || !file}
            className="flex-1 h-8 px-4 text-xs font-medium rounded-full bg-primary text-primary-foreground disabled:opacity-50 transition-colors hover:bg-primary/90"
          >
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      )}
      
      {error && <p className="text-red-600 text-xs text-center">{error}</p>}
    </form>
  );
}
