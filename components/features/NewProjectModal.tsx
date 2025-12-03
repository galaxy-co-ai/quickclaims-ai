"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { AddressAutocomplete, Button, Input, Select, toast } from "@/components/ui";

const PROJECT_TYPES = [
  { value: "Roof Replacement", label: "Roof Replacement" },
  { value: "Roof Repair", label: "Roof Repair" },
  { value: "Siding", label: "Siding" },
  { value: "Water Damage", label: "Water Damage" },
  { value: "Fire Damage", label: "Fire Damage" },
  { value: "Remodel", label: "Remodel" },
  { value: "Addition", label: "Addition" },
  { value: "Other", label: "Other" },
];

const STEPS = [
  {
    id: 1,
    title: "Property Address",
    description: "Where is this project located?",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Client Name",
    description: "Who is the property owner?",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Project Type",
    description: "What kind of work is this?",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
];

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    address: "",
    clientName: "",
    projectType: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAnimating, setIsAnimating] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setFormData({ address: "", clientName: "", projectType: "" });
        setErrors({});
      }, 300);
    }
  }, [isOpen]);

  // Animation when changing steps
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 200);
    return () => clearTimeout(timer);
  }, [step]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1 && !formData.address.trim()) {
      newErrors.address = "Property address is required";
    }
    if (step === 2 && !formData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }
    if (step === 3 && !formData.projectType) {
      newErrors.projectType = "Please select a project type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 3) {
      handleNext();
      return;
    }

    if (!validateStep()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const project = await response.json();
        toast.success("Project created successfully!");
        onClose();
        router.push(`/projects/${project.id}`);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to create project");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const currentStepData = STEPS[step - 1];
  const progress = (step / 3) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 text-center border-b border-border">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">
            New Project
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            3 quick questions to get started
          </p>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((s) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium transition-all duration-300 ${
                    step >= s.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s.id ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s.id
                  )}
                </div>
                {s.id < 3 && (
                  <div className={`w-16 sm:w-24 h-1 mx-2 rounded-full transition-colors ${
                    step > s.id ? "bg-primary" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <div className={`p-6 transition-opacity duration-150 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                {currentStepData.icon}
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Step {step} of 3
                </p>
                <h3 className="font-semibold text-foreground">
                  {currentStepData.description}
                </h3>
              </div>
            </div>

            {step === 1 && (
              <AddressAutocomplete
                value={formData.address}
                onChange={(value) => updateField("address", value)}
                placeholder="Start typing an address..."
                error={!!errors.address}
                errorMessage={errors.address}
                autoFocus
              />
            )}

            {step === 2 && (
              <Input
                id="clientName"
                type="text"
                value={formData.clientName}
                onChange={(e) => updateField("clientName", e.target.value)}
                placeholder="John Smith"
                error={!!errors.clientName}
                errorMessage={errors.clientName}
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
                autoFocus
              />
            )}

            {step === 3 && (
              <Select
                id="projectType"
                value={formData.projectType}
                onChange={(e) => updateField("projectType", e.target.value)}
                placeholder="Select project type..."
                options={PROJECT_TYPES}
                error={!!errors.projectType}
                errorMessage={errors.projectType}
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 p-6 pt-0">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex-1"
              >
                Back
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              loading={loading}
              className="flex-1"
            >
              {loading ? "Creating..." : step === 3 ? "Create Project" : "Continue"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

