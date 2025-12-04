"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Button, Input, toast } from "@/components/ui";

interface Project {
  id: string;
  clientName: string;
  address: string;
  projectType: string;
  status: string;
}

interface EditProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (project: Project) => void;
}

const PROJECT_TYPES = [
  "Roof Replacement",
  "Roof Repair",
  "Storm Damage",
  "Hail Damage",
  "Wind Damage",
  "Insurance Claim",
  "General Restoration",
];

const PROJECT_STATUSES = [
  { value: "created", label: "Created" },
  { value: "analyzing", label: "Analyzing" },
  { value: "ready", label: "Ready" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export function EditProjectModal({ project, isOpen, onClose, onSaved }: EditProjectModalProps) {
  const [clientName, setClientName] = useState("");
  const [address, setAddress] = useState("");
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
  const [status, setStatus] = useState("created");
  const [isSaving, setIsSaving] = useState(false);

  // Update form when project changes
  useEffect(() => {
    if (project) {
      setClientName(project.clientName);
      setAddress(project.address);
      setProjectType(project.projectType);
      setStatus(project.status);
    }
  }, [project]);

  const handleSave = async () => {
    if (!project || !clientName.trim() || !address.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName.trim(),
          address: address.trim(),
          projectType,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      const data = await response.json();
      toast.success("Project updated successfully");
      onSaved(data.project);
      onClose();
    } catch {
      toast.error("Failed to update project. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-project-title"
        className="relative w-full max-w-md mx-4 bg-card rounded-2xl shadow-xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 id="edit-project-title" className="text-lg font-semibold">Edit Project</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Client Name <span className="text-destructive">*</span>
            </label>
            <Input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="John Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Property Address <span className="text-destructive">*</span>
            </label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St, City, State 12345"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Project Type
            </label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {PROJECT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {PROJECT_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
