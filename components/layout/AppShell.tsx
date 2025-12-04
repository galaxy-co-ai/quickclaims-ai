"use client";

import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { MobileNav, MobileHeader } from "./MobileNav";
import { ToastProvider, useToastEvents } from "@/components/ui/Toast";
import { CommandPalette, useCommandPalette } from "@/components/ui/CommandPalette";

interface AppShellProps {
  children: ReactNode;
  /** Show mobile back button */
  showMobileBack?: boolean;
  /** Mobile back button handler */
  onMobileBack?: () => void;
  /** Back link href (use instead of onMobileBack for server components) */
  mobileBackHref?: string;
  /** Back link label */
  mobileBackLabel?: string;
  /** Custom mobile header title */
  mobileTitle?: string;
  /** Actions to show in mobile header */
  mobileActions?: ReactNode;
  /** Hide navigation (for landing page, etc.) */
  hideNav?: boolean;
  /** Full height mode - disables scroll on main container (for chat interfaces) */
  fullHeight?: boolean;
}

function AppShellContent({
  children,
  showMobileBack,
  onMobileBack,
  mobileBackHref,
  mobileBackLabel,
  mobileTitle,
  mobileActions,
  hideNav = false,
  fullHeight = false,
}: AppShellProps) {
  // Listen for toast events from outside React
  useToastEvents();
  
  // Command palette state (Cmd+K / Ctrl+K)
  const commandPalette = useCommandPalette();

  if (hideNav) {
    return <>{children}</>;
  }

  return (
    <div className={`min-h-screen bg-background ${fullHeight ? "overflow-hidden h-screen" : ""}`}>
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Header */}
      <MobileHeader
        title={mobileTitle}
        showBack={showMobileBack}
        backHref={mobileBackHref}
        backLabel={mobileBackLabel}
        onBack={onMobileBack}
        actions={mobileActions}
      />

      {/* Main Content Area */}
      <main
        className={`
          lg:ml-[200px]
          ${fullHeight ? "h-screen overflow-hidden" : "pb-[calc(56px+env(safe-area-inset-bottom))] lg:pb-0"}
        `}
      >
        {fullHeight ? (
          children
        ) : (
          <div className="max-w-6xl mx-auto px-4 py-4">
            {children}
          </div>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNav />
      
      {/* Command Palette (Cmd+K / Ctrl+K) */}
      <CommandPalette
        isOpen={commandPalette.isOpen}
        onClose={commandPalette.close}
      />
    </div>
  );
}

export function AppShell(props: AppShellProps) {
  return (
    <ToastProvider>
      <AppShellContent {...props} />
    </ToastProvider>
  );
}

// Simple content wrapper without navigation (for landing, auth pages)
export function SimpleShell({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-background">{children}</div>
    </ToastProvider>
  );
}

