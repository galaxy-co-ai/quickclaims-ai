"use client";

import { useState } from "react";
import { 
  FileText, 
  Upload, 
  Clock, 
  FolderOpen, 
  Sparkles,
  Download,
  Trash2,
  Edit3,
  ExternalLink,
  Camera,
  Search,
  Tag,
  Grid3X3,
  List,
  Filter,
  Wand2,
  ChevronDown,
  Eye,
  Share2,
  X,
} from "lucide-react";
import { Card, Badge, Tabs, TabList, TabTrigger, TabContent, toast, Input } from "@/components/ui";
import { UploadBox } from "@/components/project/UploadBox";
import { GenerateButton } from "@/components/project/GenerateButton";
import { RoadmapView, MaterialsView, EstimateView } from "@/components/project/DocumentViews";

interface Upload {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
  // AI analysis data
  tags: string[];
  category: string | null;
  description: string | null;
  aiAnalyzedAt: string | null;
}

interface Document {
  id: string;
  type: string;
  title: string;
  content: unknown;
  createdAt: string;
}

interface Activity {
  id: string;
  action: string;
  description: string | null;
  createdAt: string;
}

interface ProjectDetailClientProps {
  project: {
    id: string;
    clientName: string;
    address: string;
    projectType: string;
    status: string;
    createdAt: string;
  };
  uploads: Upload[];
  documents: Document[];
  activities: Activity[];
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function formatAddress(address: string): { line1: string; line2: string } {
  // Try to split address into street and city/state/zip
  // Common format: "123 Street Name, City, State ZIP"
  const parts = address.split(",").map(p => p.trim());
  
  if (parts.length >= 3) {
    // Format: "Street, City, State ZIP"
    const street = parts[0];
    const cityStateZip = parts.slice(1).join(", ")
      .replace(/Oklahoma/gi, "OK")
      .replace(/Texas/gi, "TX")
      .replace(/California/gi, "CA")
      .replace(/Florida/gi, "FL")
      .replace(/New York/gi, "NY")
      .replace(/Arizona/gi, "AZ")
      .replace(/Colorado/gi, "CO")
      .replace(/Georgia/gi, "GA")
      .replace(/Illinois/gi, "IL")
      .replace(/Michigan/gi, "MI")
      .replace(/North Carolina/gi, "NC")
      .replace(/Ohio/gi, "OH")
      .replace(/Pennsylvania/gi, "PA")
      .replace(/Tennessee/gi, "TN")
      .replace(/Virginia/gi, "VA")
      .replace(/Washington/gi, "WA");
    return { line1: street, line2: cityStateZip };
  } else if (parts.length === 2) {
    return { line1: parts[0], line2: parts[1] };
  }
  
  return { line1: address, line2: "" };
}

function getStatusBadge(status: string) {
  const statusMap: Record<string, { variant: "default" | "success" | "warning" | "info" | "error"; label: string }> = {
    created: { variant: "default", label: "Created" },
    analyzing: { variant: "info", label: "Analyzing" },
    ready: { variant: "success", label: "Ready" },
    "in-progress": { variant: "warning", label: "In Progress" },
    completed: { variant: "success", label: "Completed" },
  };
  const config = statusMap[status] || { variant: "default" as const, label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function ProjectDetailClient({
  project,
  uploads,
  documents,
  activities,
}: ProjectDetailClientProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [fileList, setFileList] = useState(uploads);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set());
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  const handleRename = async (uploadId: string, currentName: string) => {
    const newName = prompt("Enter new file name:", currentName);
    if (!newName || newName === currentName) return;

    try {
      const response = await fetch(`/api/uploads/${uploadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: newName }),
      });

      if (response.ok) {
        setFileList((prev) =>
          prev.map((f) => (f.id === uploadId ? { ...f, fileName: newName } : f))
        );
        toast.success("File renamed successfully");
      } else {
        toast.error("Failed to rename file");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (uploadId: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    setIsDeleting(uploadId);
    try {
      const response = await fetch(`/api/uploads/${uploadId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFileList((prev) => prev.filter((f) => f.id !== uploadId));
        toast.success("File deleted");
      } else {
        toast.error("Failed to delete file");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(null);
    }
  };

  const scopeCount = fileList.filter((f) => f.fileType === "scope").length;
  const photoCount = fileList.filter((f) => f.fileType === "photo").length;
  const docCount = documents.length;

  return (
    <div className="space-y-4">
      {/* Quick Stats - Pill Badges */}
      <div className="flex flex-wrap justify-center gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
          <Upload className="w-3.5 h-3.5" />
          <span className="text-sm font-semibold">{fileList.length}</span>
          <span className="text-xs text-blue-600">Files</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-sm font-semibold">{docCount}</span>
          <span className="text-xs text-purple-600">Docs</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
          <Camera className="w-3.5 h-3.5" />
          <span className="text-sm font-semibold">{photoCount}</span>
          <span className="text-xs text-amber-600">Photos</span>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabList className="mb-6">
          <TabTrigger 
            value="overview"
            icon={<FolderOpen className="w-4 h-4" />}
          >
            Overview
          </TabTrigger>
          <TabTrigger 
            value="files"
            icon={<Upload className="w-4 h-4" />}
            badge={fileList.length > 0 ? (
              <span className="px-1.5 py-0.5 text-xs bg-muted rounded-full">
                {fileList.length}
              </span>
            ) : undefined}
          >
            Files
          </TabTrigger>
          <TabTrigger 
            value="documents"
            icon={<Sparkles className="w-4 h-4" />}
            badge={docCount > 0 ? (
              <span className="px-1.5 py-0.5 text-xs bg-muted rounded-full">
                {docCount}
              </span>
            ) : undefined}
          >
            AI Docs
          </TabTrigger>
          <TabTrigger 
            value="photos"
            icon={<Camera className="w-4 h-4" />}
            badge={photoCount > 0 ? (
              <span className="px-1.5 py-0.5 text-xs bg-muted rounded-full">
                {photoCount}
              </span>
            ) : undefined}
          >
            Photos
          </TabTrigger>
        </TabList>

        {/* Overview Tab */}
        <TabContent value="overview">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Project Info */}
            <Card className="md:col-span-2" noPadding>
              {/* Details Section */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column - Client & Address */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-0.5">Client</p>
                      <p className="text-sm text-foreground">{project.clientName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-0.5">Address</p>
                      <p className="text-sm text-foreground">{formatAddress(project.address).line1}</p>
                      {formatAddress(project.address).line2 && (
                        <p className="text-sm text-foreground">{formatAddress(project.address).line2}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Right Column - Type, Created, Status */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">Type</span>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">{project.projectType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">Created</span>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-muted text-muted-foreground">{formatDate(project.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">Status</span>
                      {getStatusBadge(project.status)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions - Minimal Style */}
              <div className="border-t border-border/50 px-4 py-3 bg-muted/20">
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setActiveTab("files")}
                    className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload
                  </button>
                  <span className="w-px h-3 bg-border" />
                  <button
                    onClick={() => setActiveTab("documents")}
                    className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate
                  </button>
                  <span className="w-px h-3 bg-border" />
                  <button
                    onClick={() => setActiveTab("photos")}
                    className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Photos
                  </button>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card noPadding>
              <div className="px-4 py-3 border-b border-border/50">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Activity</h3>
              </div>
              {activities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-6 h-6 mx-auto mb-1.5 opacity-40" />
                  <p className="text-xs">No activity yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {activities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="px-4 py-2.5 hover:bg-muted/30 transition-colors">
                      <p className="text-xs font-medium text-foreground truncate">
                        {activity.action.replace(/_/g, " ")}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {formatDate(activity.createdAt)} · {formatTime(activity.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </TabContent>

        {/* Files Tab */}
        <TabContent value="files">
          <div className="space-y-4">
            {/* Upload Section - Compact */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{fileList.length} files</span>
                <span className="text-muted-foreground/50">•</span>
                <span className="text-xs text-muted-foreground">{scopeCount} scopes, {photoCount} photos</span>
              </div>
              <div className="w-full sm:w-auto">
                <UploadBox projectId={project.id} compact />
              </div>
            </div>

            {/* File List */}
            {fileList.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <FolderOpen className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-base mb-1">No files uploaded</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload scopes and photos to get started
                </p>
                <UploadBox projectId={project.id} />
              </Card>
            ) : (
              <div className="space-y-2">
                {fileList.map((file) => (
                  <Card
                    key={file.id}
                    className="p-3 hover:shadow-md transition-all cursor-pointer group"
                    noPadding={false}
                  >
                    <div className="flex items-center gap-3">
                      {/* File Icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        file.mimeType.startsWith("image/") 
                          ? "bg-purple-100 text-purple-600" 
                          : file.mimeType === "application/pdf" 
                            ? "bg-red-100 text-red-600" 
                            : "bg-blue-100 text-blue-600"
                      }`}>
                        {file.mimeType.startsWith("image/") ? (
                          <Camera className="w-5 h-5" />
                        ) : (
                          <FileText className="w-5 h-5" />
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
                          {file.fileName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {file.fileType} • {formatDate(file.createdAt)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-full hover:bg-muted transition-colors"
                          aria-label="View file"
                        >
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </a>
                        <button
                          onClick={() => handleRename(file.id, file.fileName)}
                          className="p-1.5 rounded-full hover:bg-muted transition-colors"
                          aria-label="Rename file"
                        >
                          <Edit3 className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDelete(file.id)}
                          disabled={isDeleting === file.id}
                          className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                          aria-label="Delete file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabContent>

        {/* Documents Tab */}
        <TabContent value="documents">
          <div className="space-y-4">
            {/* Header with Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-sm font-medium text-foreground">{documents.length} documents</span>
                <span className="text-xs text-muted-foreground ml-2">AI-generated from your files</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Export Dropdown - iOS Style */}
                {documents.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setExportOpen(!exportOpen)}
                      className="h-8 pl-3 pr-7 text-xs font-medium rounded-full bg-muted/60 hover:bg-muted transition-colors flex items-center gap-1.5 relative"
                      aria-label="Export options"
                      aria-expanded={exportOpen}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export
                      <svg className={`absolute right-2 w-3 h-3 text-muted-foreground transition-transform ${exportOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {exportOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setExportOpen(false)} />
                        <div className="absolute top-full left-0 mt-1 z-20 min-w-[160px] py-1 rounded-2xl bg-card border border-border shadow-lg overflow-hidden">
                          <a
                            href={`/api/exports/${project.id}/materials.csv`}
                            className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted transition-colors"
                            onClick={() => setExportOpen(false)}
                          >
                            <Download className="w-3 h-3 text-muted-foreground" />
                            Materials CSV
                          </a>
                          <a
                            href={`/api/exports/${project.id}/materials/pdf`}
                            className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted transition-colors"
                            onClick={() => setExportOpen(false)}
                          >
                            <Download className="w-3 h-3 text-muted-foreground" />
                            Materials PDF
                          </a>
                          <div className="h-px bg-border my-1" />
                          <a
                            href={`/api/exports/${project.id}/estimate.csv`}
                            className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted transition-colors"
                            onClick={() => setExportOpen(false)}
                          >
                            <Download className="w-3 h-3 text-muted-foreground" />
                            Estimate CSV
                          </a>
                          <a
                            href={`/api/exports/${project.id}/estimate/pdf`}
                            className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted transition-colors"
                            onClick={() => setExportOpen(false)}
                          >
                            <Download className="w-3 h-3 text-muted-foreground" />
                            Estimate PDF
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                )}
                <GenerateButton projectId={project.id} />
              </div>
            </div>

            {/* Document List */}
            {documents.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-base mb-1">No documents yet</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                  Upload files and generate AI-powered documents
                </p>
                <button 
                  onClick={() => setActiveTab("files")}
                  className="inline-flex items-center justify-center gap-1.5 h-8 px-4 text-xs font-medium rounded-full border border-border bg-card hover:bg-muted transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Files First
                </button>
              </Card>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => {
                  const isExpanded = expandedDocs.has(doc.id);
                  const toggleExpand = () => {
                    setExpandedDocs(prev => {
                      const next = new Set(prev);
                      if (next.has(doc.id)) {
                        next.delete(doc.id);
                      } else {
                        next.add(doc.id);
                      }
                      return next;
                    });
                  };
                  
                  const handlePreview = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    setPreviewDoc(doc);
                  };
                  
                  const handleShare = async (e: React.MouseEvent) => {
                    e.stopPropagation();
                    const url = `${window.location.origin}/projects/${project.id}/documents/${doc.id}`;
                    const shareData = {
                      title: `${doc.type.charAt(0).toUpperCase() + doc.type.slice(1)} - ${project.clientName}`,
                      text: `Check out this ${doc.type} document for ${project.clientName}`,
                      url: url,
                    };
                    
                    // Use native share if available (iOS, Android)
                    if (navigator.share && navigator.canShare?.(shareData)) {
                      try {
                        await navigator.share(shareData);
                      } catch (err) {
                        // User cancelled or share failed - that's ok
                        if ((err as Error).name !== 'AbortError') {
                          // Fallback to clipboard
                          await navigator.clipboard.writeText(url);
                          toast.success("Link copied to clipboard");
                        }
                      }
                    } else {
                      // Fallback for desktop browsers
                      await navigator.clipboard.writeText(url);
                      toast.success("Link copied to clipboard");
                    }
                  };
                  
                  return (
                    <Card
                      key={doc.id}
                      className="overflow-hidden"
                      noPadding
                    >
                      <div className="flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors">
                        <button
                          onClick={toggleExpand}
                          className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"
                          aria-label={isExpanded ? "Collapse" : "Expand"}
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={toggleExpand}
                          className="flex-1 min-w-0 text-left"
                          aria-expanded={isExpanded}
                        >
                          <h4 className="font-medium text-sm capitalize">{doc.type}</h4>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(doc.createdAt)}
                          </p>
                        </button>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={handlePreview}
                            className="p-1.5 rounded-full hover:bg-muted transition-colors"
                            aria-label="Preview document"
                          >
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={handleShare}
                            className="p-1.5 rounded-full hover:bg-muted transition-colors"
                            aria-label="Share document"
                          >
                            <Share2 className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={toggleExpand}
                            className="p-1.5 rounded-full hover:bg-muted transition-colors"
                            aria-label={isExpanded ? "Collapse" : "Expand"}
                          >
                            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </button>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="p-3 bg-muted/20 border-t border-border/50">
                          {doc.type === "roadmap" && <RoadmapView data={doc.content as Record<string, unknown>} />}
                          {doc.type === "materials" && <MaterialsView data={doc.content as Record<string, unknown>} />}
                          {doc.type === "estimate" && <EstimateView data={doc.content as Record<string, unknown>} />}
                          {doc.type === "brief" && (
                            <pre className="text-xs overflow-auto whitespace-pre-wrap max-h-48">
                              {JSON.stringify(doc.content, null, 2)}
                            </pre>
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </TabContent>

        {/* Photos Tab */}
        <TabContent value="photos">
          <PhotoGallery 
            projectId={project.id} 
            photos={fileList.filter(f => f.mimeType.startsWith("image/"))} 
            onPhotoDeleted={(id) => setFileList(prev => prev.filter(f => f.id !== id))}
          />
        </TabContent>
      </Tabs>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewDoc(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          
          {/* Modal */}
          <div 
            className="relative w-full max-w-2xl max-h-[80vh] bg-card rounded-2xl shadow-xl overflow-hidden flex flex-col animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-medium text-sm capitalize">{previewDoc.type}</h3>
                  <p className="text-xs text-muted-foreground">{formatDate(previewDoc.createdAt)}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Close preview"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {previewDoc.type === "roadmap" && <RoadmapView data={previewDoc.content as Record<string, unknown>} />}
              {previewDoc.type === "materials" && <MaterialsView data={previewDoc.content as Record<string, unknown>} />}
              {previewDoc.type === "estimate" && <EstimateView data={previewDoc.content as Record<string, unknown>} />}
              {previewDoc.type === "brief" && (
                <pre className="text-xs overflow-auto whitespace-pre-wrap">
                  {JSON.stringify(previewDoc.content, null, 2)}
                </pre>
              )}
            </div>
            
            {/* Footer with actions */}
            <div className="flex items-center justify-end gap-2 p-4 border-t border-border shrink-0 bg-muted/30">
              <button
                onClick={async () => {
                  const url = `${window.location.origin}/projects/${project.id}/documents/${previewDoc.id}`;
                  const shareData = {
                    title: `${previewDoc.type.charAt(0).toUpperCase() + previewDoc.type.slice(1)} - ${project.clientName}`,
                    text: `Check out this ${previewDoc.type} document for ${project.clientName}`,
                    url: url,
                  };
                  if (navigator.share && navigator.canShare?.(shareData)) {
                    try { await navigator.share(shareData); } catch { /* cancelled */ }
                  } else {
                    await navigator.clipboard.writeText(url);
                    toast.success("Link copied to clipboard");
                  }
                }}
                className="inline-flex items-center justify-center gap-1.5 h-8 px-4 text-xs font-medium rounded-full border border-border bg-card hover:bg-muted transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
              <button
                onClick={() => setPreviewDoc(null)}
                className="inline-flex items-center justify-center gap-1.5 h-8 px-4 text-xs font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Photo Gallery Component with AI Organization
interface PhotoGalleryProps {
  projectId: string;
  photos: Upload[];
  onPhotoDeleted: (id: string) => void;
}

// AI-generated photo categories/tags
const PHOTO_CATEGORIES = [
  { id: "all", label: "All Photos", icon: Grid3X3 },
  { id: "roof", label: "Roof", icon: Tag },
  { id: "damage", label: "Damage", icon: Tag },
  { id: "before", label: "Before", icon: Tag },
  { id: "after", label: "After", icon: Tag },
  { id: "exterior", label: "Exterior", icon: Tag },
  { id: "interior", label: "Interior", icon: Tag },
  { id: "materials", label: "Materials", icon: Tag },
  { id: "uncategorized", label: "Uncategorized", icon: Tag },
];

function PhotoGallery({ projectId, photos, onPhotoDeleted }: PhotoGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Upload | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);

  // Get photo tags - use AI tags if available, otherwise infer from filename
  const getPhotoTags = (photo: Upload): string[] => {
    // If AI tags are available, use them
    if (photo.tags && photo.tags.length > 0) {
      return photo.tags;
    }
    
    // If AI category is set, include it
    if (photo.category) {
      return [photo.category];
    }
    
    // Fallback: infer from filename
    const fileName = photo.fileName.toLowerCase();
    const tags: string[] = [];
    
    if (fileName.includes("roof") || fileName.includes("shingle")) tags.push("roof");
    if (fileName.includes("damage") || fileName.includes("hail") || fileName.includes("wind")) tags.push("damage");
    if (fileName.includes("before")) tags.push("before");
    if (fileName.includes("after")) tags.push("after");
    if (fileName.includes("exterior") || fileName.includes("outside")) tags.push("exterior");
    if (fileName.includes("interior") || fileName.includes("inside")) tags.push("interior");
    if (fileName.includes("material")) tags.push("materials");
    
    return tags.length > 0 ? tags : ["uncategorized"];
  };
  
  // Check if a photo has been AI analyzed
  const isAIAnalyzed = (photo: Upload): boolean => {
    return !!photo.aiAnalyzedAt;
  };

  // Filter photos based on search and category
  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const tags = getPhotoTags(photo);
    const matchesCategory = selectedCategory === "all" || tags.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Get category counts
  const getCategoryCount = (categoryId: string): number => {
    if (categoryId === "all") return photos.length;
    return photos.filter(p => getPhotoTags(p).includes(categoryId)).length;
  };

  const handleAIOrganize = async () => {
    if (photos.length === 0) {
      toast.error("No photos to organize");
      return;
    }

    setIsOrganizing(true);
    try {
      // Get all photo upload IDs
      const photoIds = photos.map(p => p.id);
      
      // Call the batch analysis API
      const response = await fetch("/api/photos/analyze", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uploadIds: photoIds,
          projectId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze photos");
      }

      const data = await response.json();
      
      if (data.analyzed > 0) {
        toast.success(`Analyzed ${data.analyzed} photos! Tags have been updated.`);
        // Refresh to show new tags - in production, we'd update state directly
        window.location.reload();
      } else {
        toast.error("Could not analyze any photos. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to organize photos. Please try again.");
    } finally {
      setIsOrganizing(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    
    try {
      const response = await fetch(`/api/uploads/${photoId}`, { method: "DELETE" });
      if (response.ok) {
        onPhotoDeleted(photoId);
        toast.success("Photo deleted");
        setSelectedPhoto(null);
      } else {
        toast.error("Failed to delete photo");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const selectedCategoryLabel = PHOTO_CATEGORIES.find(c => c.id === selectedCategory)?.label || "All Photos";

  return (
    <div className="space-y-4">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{photos.length} photos</span>
          {filteredPhotos.length !== photos.length && (
            <>
              <span className="text-muted-foreground/50">•</span>
              <span className="text-xs text-muted-foreground">{filteredPhotos.length} shown</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleAIOrganize}
            disabled={isOrganizing || photos.length === 0}
            className="inline-flex items-center justify-center gap-1.5 h-8 px-4 text-xs font-medium rounded-full border border-border bg-card hover:bg-muted transition-colors disabled:opacity-50"
          >
            <Wand2 className={`w-3.5 h-3.5 ${isOrganizing ? "animate-spin" : ""}`} />
            {isOrganizing ? "Organizing..." : "AI Organize"}
          </button>
        </div>
      </div>

      {/* Search & Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search photos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8 text-sm rounded-full"
          />
        </div>
        
        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {/* Category Dropdown - iOS Pill Style */}
          <div className="relative">
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="h-7 pl-3 pr-7 text-xs font-medium rounded-full bg-muted/60 hover:bg-muted transition-colors flex items-center gap-1 relative"
              aria-label="Filter by category"
            >
              {selectedCategoryLabel} ({getCategoryCount(selectedCategory)})
              <svg className={`absolute right-2 w-3 h-3 text-muted-foreground transition-transform ${categoryOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {categoryOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setCategoryOpen(false)} />
                <div className="absolute top-full left-0 mt-1 z-20 min-w-[140px] py-1 rounded-2xl bg-card border border-border shadow-lg overflow-hidden">
                  {PHOTO_CATEGORIES.map(category => {
                    const count = getCategoryCount(category.id);
                    if (count === 0 && category.id !== "all") return null;
                    return (
                      <button
                        key={category.id}
                        onClick={() => { setSelectedCategory(category.id); setCategoryOpen(false); }}
                        className={`w-full px-3 py-2 text-xs text-left hover:bg-muted transition-colors flex items-center justify-between ${
                          selectedCategory === category.id ? "text-primary font-medium" : "text-foreground"
                        }`}
                      >
                        <span>{category.label}</span>
                        <span className="text-muted-foreground">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* View Toggle - iOS Segmented Control */}
          <div className="flex items-center h-7 p-0.5 rounded-full bg-muted/60">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center justify-center w-7 h-6 rounded-full transition-all ${
                viewMode === "grid" 
                  ? "bg-card shadow-sm text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Grid view"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center justify-center w-7 h-6 rounded-full transition-all ${
                viewMode === "list" 
                  ? "bg-card shadow-sm text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="List view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Photo Grid/List */}
      {photos.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Camera className="w-7 h-7" />
          </div>
          <h3 className="font-medium text-base mb-1">No photos yet</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
            Upload photos and AI will organize them
          </p>
          <UploadBox projectId={projectId} compact />
        </Card>
      ) : filteredPhotos.length === 0 ? (
        <Card className="p-8 text-center">
          <Filter className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No photos match your filter</p>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {filteredPhotos.map(photo => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group hover:shadow-lg transition-all"
            >
              <img
                src={photo.fileUrl}
                alt={photo.fileName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-medium truncate">{photo.fileName}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {isAIAnalyzed(photo) && (
                    <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-primary/50 text-white flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      AI
                    </span>
                  )}
                  {getPhotoTags(photo).slice(0, 2).map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 text-[9px] rounded-full bg-white/20 text-white capitalize">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredPhotos.map(photo => (
            <Card
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="p-3 hover:shadow-md cursor-pointer transition-all group"
              noPadding={false}
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={photo.fileUrl}
                    alt={photo.fileName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{photo.fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(photo.createdAt)}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {isAIAnalyzed(photo) && (
                      <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-primary/10 text-primary flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" />
                        AI
                      </span>
                    )}
                    {getPhotoTags(photo).slice(0, 3).map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 text-[9px] rounded-full bg-muted text-muted-foreground capitalize">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeletePhoto(photo.id); }}
                  className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Delete photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <img
              src={selectedPhoto.fileUrl}
              alt={selectedPhoto.fileName}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <a
                href={selectedPhoto.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
              <button
                onClick={() => handleDeletePhoto(selectedPhoto.id)}
                className="p-2 rounded-full bg-white/10 hover:bg-red-500/50 text-white transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors ml-2"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 text-white">
              <p className="font-medium">{selectedPhoto.fileName}</p>
              <p className="text-sm text-white/70 mt-1">
                {formatFileSize(selectedPhoto.fileSize)} · {formatDate(selectedPhoto.createdAt)}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {getPhotoTags(selectedPhoto).map(tag => (
                  <span key={tag} className="px-2 py-1 text-xs rounded-full bg-white/20 text-white capitalize">
                    <Tag className="w-3 h-3 inline mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

