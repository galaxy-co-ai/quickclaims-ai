"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useId,
  KeyboardEvent,
} from "react";

// Types
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
}

// Main Tabs Container
interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className = "",
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const baseId = useId();

  const activeTab = value ?? internalValue;
  const setActiveTab = useCallback(
    (newValue: string) => {
      if (!value) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [value, onValueChange]
  );

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, baseId }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

// Tab List (container for tab buttons)
interface TabListProps {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}

export function TabList({
  children,
  className = "",
  "aria-label": ariaLabel = "Tabs",
}: TabListProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const tabs = e.currentTarget.querySelectorAll<HTMLButtonElement>(
      '[role="tab"]:not([disabled])'
    );
    const currentIndex = Array.from(tabs).findIndex(
      (tab) => tab === document.activeElement
    );

    let nextIndex: number;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) nextIndex = tabs.length - 1;
        tabs[nextIndex]?.focus();
        break;
      case "ArrowRight":
        e.preventDefault();
        nextIndex = currentIndex + 1;
        if (nextIndex >= tabs.length) nextIndex = 0;
        tabs[nextIndex]?.focus();
        break;
      case "Home":
        e.preventDefault();
        tabs[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        tabs[tabs.length - 1]?.focus();
        break;
    }
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`flex gap-1 border-b border-border ${className}`}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}

// Individual Tab Button
interface TabTriggerProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  badge?: ReactNode;
}

export function TabTrigger({
  value,
  children,
  disabled = false,
  className = "",
  icon,
  badge,
}: TabTriggerProps) {
  const { activeTab, setActiveTab, baseId } = useTabsContext();
  const isActive = activeTab === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  return (
    <button
      id={tabId}
      role="tab"
      type="button"
      aria-selected={isActive}
      aria-controls={panelId}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={`
        relative flex items-center gap-1.5 px-3 py-2 text-xs font-medium
        border-b-2 -mb-px transition-all duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          isActive
            ? "border-primary text-primary"
            : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
        }
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0 w-3.5 h-3.5" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
      {badge && <span className="flex-shrink-0">{badge}</span>}
    </button>
  );
}

// Tab Content Panel
interface TabContentProps {
  value: string;
  children: ReactNode;
  className?: string;
  /** Keep content mounted when not active (useful for preserving state) */
  forceMount?: boolean;
}

export function TabContent({
  value,
  children,
  className = "",
  forceMount = false,
}: TabContentProps) {
  const { activeTab, baseId } = useTabsContext();
  const isActive = activeTab === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  if (!isActive && !forceMount) {
    return null;
  }

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={tabId}
      tabIndex={0}
      hidden={!isActive}
      className={`
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        ${isActive ? "animate-fade-in" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Pill-style tabs variant
interface PillTabsProps extends Omit<TabsProps, "children"> {
  tabs: Array<{
    value: string;
    label: string;
    icon?: ReactNode;
    badge?: ReactNode;
    disabled?: boolean;
  }>;
}

export function PillTabs({
  tabs,
  defaultValue,
  value,
  onValueChange,
  className = "",
}: PillTabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeTab = value ?? internalValue;

  const handleChange = (newValue: string) => {
    if (!value) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <div
      role="tablist"
      className={`inline-flex p-1 bg-muted rounded-xl ${className}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          type="button"
          aria-selected={activeTab === tab.value}
          disabled={tab.disabled}
          onClick={() => handleChange(tab.value)}
          className={`
            flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
            transition-all duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              activeTab === tab.value
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }
          `}
        >
          {tab.icon && <span className="w-4 h-4" aria-hidden="true">{tab.icon}</span>}
          {tab.label}
          {tab.badge}
        </button>
      ))}
    </div>
  );
}

