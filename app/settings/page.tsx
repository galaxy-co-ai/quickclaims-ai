"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Card, Button, Input, toast } from "@/components/ui";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "billing">("profile");

  return (
    <AppShell mobileTitle="Settings">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account and preferences
          </p>
        </header>

        {/* Tabs */}
        <div className="flex gap-1 p-1 mb-6 rounded-full bg-muted/50 w-fit mx-auto">
          {[
            { id: "profile", label: "Profile" },
            { id: "preferences", label: "Preferences" },
            { id: "billing", label: "Billing" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`
                px-4 py-2 text-sm font-medium rounded-full transition-all
                ${activeTab === tab.id 
                  ? "bg-card text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "preferences" && <PreferencesTab />}
        {activeTab === "billing" && <BillingTab />}
      </div>
    </AppShell>
  );
}

function ProfileTab() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success("Profile updated successfully");
  };

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card className="p-6">
        <h3 className="text-sm font-medium text-foreground mb-4">Profile Photo</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <Button variant="outline" size="sm">
              Change Photo
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG or GIF. Max 2MB.
            </p>
          </div>
        </div>
      </Card>

      {/* Personal Info */}
      <Card className="p-6">
        <h3 className="text-sm font-medium text-foreground mb-4">Personal Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                First Name
              </label>
              <Input placeholder="John" defaultValue="" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Last Name
              </label>
              <Input placeholder="Smith" defaultValue="" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Email Address
            </label>
            <Input type="email" placeholder="john@example.com" defaultValue="" />
            <p className="text-xs text-muted-foreground mt-1">
              This will be managed by Clerk authentication
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Company Name
            </label>
            <Input placeholder="ABC Roofing Co." defaultValue="" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Phone Number
            </label>
            <Input type="tel" placeholder="(555) 123-4567" defaultValue="" />
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} loading={isSaving}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function PreferencesTab() {
  return (
    <div className="space-y-6">
      {/* Notifications */}
      <Card className="p-6">
        <h3 className="text-sm font-medium text-foreground mb-4">Notifications</h3>
        <div className="space-y-4">
          <ToggleSetting
            label="Email Notifications"
            description="Receive updates about your projects via email"
            defaultChecked={true}
          />
          <ToggleSetting
            label="Claim Status Updates"
            description="Get notified when claim status changes"
            defaultChecked={true}
          />
          <ToggleSetting
            label="Document Generation Complete"
            description="Notify when AI finishes generating documents"
            defaultChecked={false}
          />
        </div>
      </Card>

      {/* Display */}
      <Card className="p-6">
        <h3 className="text-sm font-medium text-foreground mb-4">Display</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Theme
            </label>
            <div className="flex gap-2">
              {["Light", "Dark", "System"].map((theme) => (
                <button
                  key={theme}
                  className={`
                    px-4 py-2 text-sm font-medium rounded-lg border transition-all
                    ${theme === "Light"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                    }
                  `}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* AI Settings */}
      <Card className="p-6">
        <h3 className="text-sm font-medium text-foreground mb-4">AI Assistant</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Default Detail Level
            </label>
            <div className="flex gap-2">
              {["Concise", "Standard", "Detailed"].map((level) => (
                <button
                  key={level}
                  className={`
                    px-4 py-2 text-sm font-medium rounded-lg border transition-all
                    ${level === "Standard"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                    }
                  `}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <ToggleSetting
            label="Auto-analyze Photos"
            description="Automatically run AI analysis when photos are uploaded"
            defaultChecked={true}
          />
        </div>
      </Card>
    </div>
  );
}

function BillingTab() {
  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card className="p-6 border-primary/20 bg-primary/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-foreground">Current Plan</h3>
            <p className="text-2xl font-bold text-primary mt-1">Free Plan</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground mb-4">
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            5 Projects
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            AI Document Generation
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Basic Analytics
          </li>
        </ul>
        <Button className="w-full">
          Upgrade to Pro
        </Button>
      </Card>

      {/* Usage */}
      <Card className="p-6">
        <h3 className="text-sm font-medium text-foreground mb-4">Usage This Month</h3>
        <div className="space-y-4">
          <UsageBar label="Projects" used={2} total={5} />
          <UsageBar label="AI Generations" used={12} total={50} />
          <UsageBar label="Storage" used={45} total={100} unit="MB" />
        </div>
      </Card>

      {/* Payment Method */}
      <Card className="p-6">
        <h3 className="text-sm font-medium text-foreground mb-4">Payment Method</h3>
        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-6 rounded bg-muted flex items-center justify-center">
              <span className="text-xs font-bold text-muted-foreground">VISA</span>
            </div>
            <div>
              <p className="text-sm font-medium">•••• •••• •••• 4242</p>
              <p className="text-xs text-muted-foreground">Expires 12/25</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            Update
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Helper Components
function ToggleSetting({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`
          relative w-11 h-6 rounded-full transition-colors
          ${checked ? "bg-primary" : "bg-muted"}
        `}
        role="switch"
        aria-checked={checked}
        aria-label={label}
      >
        <span
          className={`
            absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform
            ${checked ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </button>
    </div>
  );
}

function UsageBar({
  label,
  used,
  total,
  unit = "",
}: {
  label: string;
  used: number;
  total: number;
  unit?: string;
}) {
  const percentage = (used / total) * 100;

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {used}{unit} / {total}{unit}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            percentage > 80 ? "bg-amber-500" : "bg-primary"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
