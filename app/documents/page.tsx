"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  FileText, 
  Search, 
  FolderOpen,
  Wand2,
  Upload,
  Download,
  MoreVertical,
  Grid3X3,
  List,
  Building2,
  FileSpreadsheet,
  FileImage,
  File,
  Sparkles,
  ChevronDown,
  X,
  CloudUpload,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { AppShell } from "@/components/layout";
import { Card, Input, toast } from "@/components/ui";

// Document categories with icons
const DOCUMENT_CATEGORIES = [
  { id: "all", label: "All", icon: FolderOpen, color: "bg-slate-100 text-slate-600" },
  { id: "scope", label: "Scopes", icon: FileText, color: "bg-blue-100 text-blue-600" },
  { id: "estimate", label: "Estimates", icon: FileSpreadsheet, color: "bg-emerald-100 text-emerald-600" },
  { id: "photo", label: "Photos", icon: FileImage, color: "bg-purple-100 text-purple-600" },
  { id: "contract", label: "Contracts", icon: File, color: "bg-amber-100 text-amber-600" },
  { id: "invoice", label: "Invoices", icon: FileSpreadsheet, color: "bg-rose-100 text-rose-600" },
  { id: "report", label: "Reports", icon: FileText, color: "bg-cyan-100 text-cyan-600" },
  { id: "other", label: "Other", icon: File, color: "bg-gray-100 text-gray-600" },
];

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  category: string;
  projectId: string;
  projectName: string;
  size: number;
  createdAt: string;
  aiTags: string[];
  aiConfidence: number;
  url: string | null;
  isGenerated: boolean;
  docType: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getFileIcon(category: string) {
  const cat = DOCUMENT_CATEGORIES.find(c => c.id === category);
  if (cat) {
    const Icon = cat.icon;
    return <Icon className="w-5 h-5" />;
  }
  return <File className="w-5 h-5" />;
}

function getCategoryColor(category: string): string {
  const cat = DOCUMENT_CATEGORIES.find(c => c.id === category);
  return cat?.color || "bg-gray-100 text-gray-600";
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date");
  const [isLoading, setIsLoading] = useState(true);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{ name: string; progress: number; status: "uploading" | "done" | "error" }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch documents from API
  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch("/api/documents");
        if (response.ok) {
          const data = await response.json();
          setDocuments(data.documents || []);
        } else {
          toast.error("Failed to load documents");
        }
      } catch {
        toast.error("Failed to load documents");
      } finally {
        setIsLoading(false);
      }
    }
    fetchDocuments();
  }, []);

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.aiTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "size":
        return b.size - a.size;
      case "date":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Category counts
  const getCategoryCount = (categoryId: string): number => {
    if (categoryId === "all") return documents.length;
    return documents.filter(d => d.category === categoryId).length;
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    // For now, show a message that uploads should be done through projects
    toast.info("To upload files, please go to a specific project and use the upload feature there.");
    setUploadOpen(false);
  };

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
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDocumentClick = (doc: DocumentItem) => {
    if (doc.url) {
      window.open(doc.url, '_blank');
    } else if (doc.isGenerated) {
      // Navigate to project to view generated document
      window.location.href = `/projects/${doc.projectId}`;
    }
  };

  return (
    <AppShell mobileTitle="Documents">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-col gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-semibold text-foreground">Documents</h1>
              <p className="text-sm text-muted-foreground mt-1">
                All documents across your projects
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <button 
                onClick={() => setUploadOpen(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-8 px-4 text-xs font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload
              </button>
            </div>
          </div>
        </header>

        {/* Search & Filters */}
        <div className="space-y-3 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search documents, projects, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-full"
            />
          </div>
          
          {/* Filter Pills Row */}
          <div className={`flex items-center gap-2 pb-1 ${categoryOpen || sortOpen ? "" : "overflow-x-auto"}`}>
            {/* Category Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => { setCategoryOpen(!categoryOpen); setSortOpen(false); }}
                className="h-7 pl-3 pr-7 text-xs font-medium rounded-full bg-muted/60 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 hover:bg-muted transition-colors flex items-center gap-1"
                aria-label="Filter by category"
                aria-expanded={categoryOpen}
              >
                {DOCUMENT_CATEGORIES.find(c => c.id === selectedCategory)?.label} ({getCategoryCount(selectedCategory)})
                <ChevronDown className={`absolute right-2 w-3 h-3 text-muted-foreground transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
              </button>
              {categoryOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setCategoryOpen(false)} />
                  <div className="absolute top-full left-0 mt-1 z-20 min-w-[160px] py-1 rounded-2xl bg-card border border-border shadow-lg overflow-hidden">
                    {DOCUMENT_CATEGORIES.map(category => (
                      <button
                        key={category.id}
                        onClick={() => { setSelectedCategory(category.id); setCategoryOpen(false); }}
                        className={`w-full px-3 py-2 text-xs text-left hover:bg-muted transition-colors flex items-center justify-between ${
                          selectedCategory === category.id ? "text-primary font-medium" : "text-foreground"
                        }`}
                      >
                        <span>{category.label}</span>
                        <span className="text-muted-foreground">{getCategoryCount(category.id)}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => { setSortOpen(!sortOpen); setCategoryOpen(false); }}
                className="h-7 pl-3 pr-7 text-xs font-medium rounded-full bg-muted/60 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 hover:bg-muted transition-colors flex items-center gap-1"
                aria-label="Sort documents by"
                aria-expanded={sortOpen}
              >
                {sortBy === "date" ? "Recent" : sortBy === "name" ? "Name" : "Size"}
                <ChevronDown className={`absolute right-2 w-3 h-3 text-muted-foreground transition-transform ${sortOpen ? "rotate-180" : ""}`} />
              </button>
              {sortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                  <div className="absolute top-full left-0 mt-1 z-20 min-w-[100px] py-1 rounded-2xl bg-card border border-border shadow-lg overflow-hidden">
                    {[
                      { id: "date", label: "Recent" },
                      { id: "name", label: "Name" },
                      { id: "size", label: "Size" },
                    ].map(option => (
                      <button
                        key={option.id}
                        onClick={() => { setSortBy(option.id as "date" | "name" | "size"); setSortOpen(false); }}
                        className={`w-full px-3 py-2 text-xs text-left hover:bg-muted transition-colors ${
                          sortBy === option.id ? "text-primary font-medium" : "text-foreground"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex items-center h-7 p-0.5 rounded-full bg-muted/60 shrink-0">
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
            </div>
          </div>
        </div>

        {/* Documents Display */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-muted/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : sortedDocuments.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No Documents Found</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== "all" 
                ? "Try adjusting your search or filter to find what you're looking for."
                : "Upload documents to your projects or generate AI documents to see them here."}
            </p>
            <Link 
              href="/projects"
              className="inline-flex items-center justify-center gap-1.5 h-8 px-5 text-xs font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Go to Projects
            </Link>
          </Card>
        ) : viewMode === "list" ? (
          <div className="space-y-2">
            {sortedDocuments.map(doc => (
              <Card 
                key={doc.id} 
                className="p-4 hover:shadow-md transition-all cursor-pointer group"
                noPadding={false}
                onClick={() => handleDocumentClick(doc)}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getCategoryColor(doc.category)}`}>
                    {getFileIcon(doc.category)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
                          {doc.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          <Link 
                            href={`/projects/${doc.projectId}`}
                            className="hover:text-primary transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {doc.projectName}
                          </Link>
                          <span className="mx-1.5">•</span>
                          <span>{formatDate(doc.createdAt)}</span>
                          <span className="mx-1.5">•</span>
                          <span>{formatFileSize(doc.size)}</span>
                        </p>
                      </div>

                      {/* Badges */}
                      <div className="flex items-center gap-2">
                        {doc.isGenerated && (
                          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                            <Sparkles className="w-3 h-3" />
                            AI
                          </div>
                        )}
                        {doc.url && (
                          <a 
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                            aria-label="Open file"
                          >
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* AI Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {doc.aiTags.slice(0, 4).map(tag => (
                        <span 
                          key={tag} 
                          className="px-2 py-0.5 text-[10px] rounded-full bg-muted text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                      {doc.aiTags.length > 4 && (
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-muted text-muted-foreground">
                          +{doc.aiTags.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {sortedDocuments.map(doc => (
              <Card 
                key={doc.id} 
                className="p-4 hover:shadow-md transition-all cursor-pointer group text-center"
                noPadding={false}
                onClick={() => handleDocumentClick(doc)}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 ${getCategoryColor(doc.category)}`}>
                  {getFileIcon(doc.category)}
                </div>

                {/* Name */}
                <h3 className="font-medium text-xs text-foreground truncate group-hover:text-primary transition-colors mb-1">
                  {doc.name}
                </h3>

                {/* Project */}
                <p className="text-[10px] text-muted-foreground truncate mb-2">
                  {doc.projectName}
                </p>

                {/* Meta */}
                <div className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                  {doc.isGenerated && <Sparkles className="w-3 h-3 text-primary" />}
                  {formatDate(doc.createdAt)}
                </div>

                {/* AI Tags (show first 2) */}
                <div className="flex flex-wrap justify-center gap-1 mt-2">
                  {doc.aiTags.slice(0, 2).map(tag => (
                    <span 
                      key={tag} 
                      className="px-1.5 py-0.5 text-[9px] rounded-full bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Stats Footer */}
        {!isLoading && sortedDocuments.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>{sortedDocuments.length} documents</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                <span>{formatFileSize(sortedDocuments.reduce((acc, d) => acc + d.size, 0))} total</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>{new Set(sortedDocuments.map(d => d.projectId)).size} projects</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{sortedDocuments.filter(d => d.isGenerated).length} AI generated</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setUploadOpen(false)}
          />
          
          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-base font-semibold text-foreground">Upload Documents</h2>
              <button
                onClick={() => setUploadOpen(false)}
                className="p-1.5 rounded-full hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-5">
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <CloudUpload className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="text-sm text-foreground mb-2">
                  Upload files through your projects
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Go to a specific project to upload scope documents, photos, and other files.
                </p>
                <Link
                  href="/projects"
                  onClick={() => setUploadOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 h-9 px-5 text-sm font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Go to Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
