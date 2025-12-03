"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FolderOpen, Plus, MapPin, FileText, Upload, Clock } from "lucide-react";
import { AppShell } from "@/components/layout";
import { Card, Badge, Button } from "@/components/ui";
import { NewProjectModal } from "@/components/features/NewProjectModal";

interface Project {
  id: string;
  clientName: string;
  address: string;
  projectType: string;
  status: string;
  createdAt: string;
  _count: {
    uploads: number;
    documents: number;
  };
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatAddress(address: string): string {
  return address
    .replace(/Oklahoma/gi, "OK")
    .replace(/Texas/gi, "TX")
    .replace(/California/gi, "CA")
    .replace(/Florida/gi, "FL");
}

function getStatusBadge(status: string) {
  const statusMap: Record<string, { variant: "default" | "success" | "warning" | "info"; label: string }> = {
    created: { variant: "default", label: "Created" },
    analyzing: { variant: "info", label: "Analyzing" },
    ready: { variant: "success", label: "Ready" },
    "in-progress": { variant: "warning", label: "In Progress" },
    completed: { variant: "success", label: "Completed" },
  };
  const config = statusMap[status] || { variant: "default" as const, label: status };
  return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects");
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const totalUploads = projects.reduce((sum, p) => sum + p._count.uploads, 0);
  const totalDocs = projects.reduce((sum, p) => sum + p._count.documents, 0);

  return (
    <AppShell mobileTitle="Projects">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-wide">Projects</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your roofing and restoration projects
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto h-9 px-4 inline-flex flex-row items-center justify-center gap-1.5 font-medium text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover shadow-[var(--shadow-primary)] hover:shadow-[var(--shadow-primary-lg)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 ease-out"
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            <span>New Project</span>
          </button>
        </div>

        {/* Quick Stats */}
        {projects.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              <FolderOpen className="w-3.5 h-3.5" />
              <span className="text-sm font-semibold">{projects.length}</span>
              <span className="text-xs text-blue-600">Projects</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
              <Upload className="w-3.5 h-3.5" />
              <span className="text-sm font-semibold">{totalUploads}</span>
              <span className="text-xs text-purple-600">Files</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-100">
              <FileText className="w-3.5 h-3.5" />
              <span className="text-sm font-semibold">{totalDocs}</span>
              <span className="text-xs text-green-600">Documents</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-2/3 mb-3" />
                <div className="h-3 bg-muted rounded w-full mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && projects.length === 0 && (
          <Card className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">No projects yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
              Create your first project with our AI concierge to get started.
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              Create Project
            </Button>
          </Card>
        )}

        {/* Projects Grid */}
        {!loading && projects.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="h-full hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {project.clientName}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{formatAddress(project.address)}</span>
                      </div>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="px-2 py-0.5 rounded-full bg-muted">{project.projectType}</span>
                    <span className="flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      {project._count.uploads}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {project._count.documents}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70 mt-3 pt-3 border-t border-border/50">
                    <Clock className="w-3 h-3" />
                    {formatDate(project.createdAt)}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* New Project Modal */}
      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </AppShell>
  );
}
