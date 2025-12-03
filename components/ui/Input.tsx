"use client";

import React, { forwardRef, InputHTMLAttributes, ReactNode, useState, useRef, useEffect } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Error state */
  error?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Helper text below input */
  helperText?: string;
  /** Icon to display on the left */
  leftIcon?: ReactNode;
  /** Icon/element to display on the right */
  rightIcon?: ReactNode;
  /** Full width input */
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      error = false,
      errorMessage,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const hasError = error || !!errorMessage;
    const helperId = id ? `${id}-helper` : undefined;
    const errorId = id ? `${id}-error` : undefined;

    return (
      <div className={fullWidth ? "w-full" : ""}>
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            className={`
              w-full h-11 px-4 text-sm
              bg-card border rounded-xl
              transition-all duration-150
              placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted
              ${leftIcon ? "pl-10" : ""}
              ${rightIcon ? "pr-10" : ""}
              ${
                hasError
                  ? "border-error focus:ring-error/30 focus:border-error"
                  : "border-border hover:border-muted-foreground focus:ring-primary/30 focus:border-primary"
              }
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
        
        {errorMessage && (
          <p id={errorId} className="mt-1.5 text-sm text-error" role="alert">
            {errorMessage}
          </p>
        )}
        
        {helperText && !errorMessage && (
          <p id={helperId} className="mt-1.5 text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// Textarea variant
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      error = false,
      errorMessage,
      helperText,
      fullWidth = true,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const hasError = error || !!errorMessage;
    const helperId = id ? `${id}-helper` : undefined;
    const errorId = id ? `${id}-error` : undefined;

    return (
      <div className={fullWidth ? "w-full" : ""}>
        <textarea
          ref={ref}
          id={id}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? errorId : helperText ? helperId : undefined
          }
          className={`
            w-full min-h-[120px] px-4 py-3 text-sm
            bg-card border rounded-xl resize-y
            transition-all duration-150
            placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted
            ${
              hasError
                ? "border-error focus:ring-error/30 focus:border-error"
                : "border-border hover:border-muted-foreground focus:ring-primary/30 focus:border-primary"
            }
            ${className}
          `}
          {...props}
        />
        
        {errorMessage && (
          <p id={errorId} className="mt-1.5 text-sm text-error" role="alert">
            {errorMessage}
          </p>
        )}
        
        {helperText && !errorMessage && (
          <p id={helperId} className="mt-1.5 text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

// Custom Select component with iOS-style rounded dropdown
interface SelectProps {
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
  value?: string;
  onChange?: (e: { target: { value: string } }) => void;
  id?: string;
  className?: string;
  disabled?: boolean;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      error = false,
      errorMessage,
      helperText,
      fullWidth = true,
      options,
      placeholder,
      value,
      onChange,
      className = "",
      id,
      disabled = false,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const hasError = error || !!errorMessage;
    const helperId = id ? `${id}-helper` : undefined;
    const errorId = id ? `${id}-error` : undefined;
    
    const selectedOption = options.find(opt => opt.value === value);
    const displayValue = selectedOption?.label || placeholder || "Select...";

    const handleSelect = (optionValue: string) => {
      onChange?.({ target: { value: optionValue } });
      setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      
      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          if (isOpen && selectedIndex >= 0) {
            const option = options[selectedIndex];
            if (!option.disabled) {
              handleSelect(option.value);
            }
          } else {
            setIsOpen(!isOpen);
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setSelectedIndex(prev => 
              prev < options.length - 1 ? prev + 1 : prev
            );
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (isOpen) {
            setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    };

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div ref={containerRef} className={`relative ${fullWidth ? "w-full" : ""}`}>
        <button
          ref={ref}
          type="button"
          id={id}
          disabled={disabled}
          aria-invalid={hasError}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-describedby={
            hasError ? errorId : helperText ? helperId : undefined
          }
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className={`
            w-full h-11 px-4 pr-10 text-sm text-left
            bg-card border rounded-xl cursor-pointer
            transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted
            ${!selectedOption ? "text-muted-foreground" : ""}
            ${
              hasError
                ? "border-error focus:ring-error/30 focus:border-error"
                : "border-border hover:border-muted-foreground focus:ring-primary/30 focus:border-primary"
            }
            ${className}
          `}
        >
          {displayValue}
        </button>
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Custom Dropdown with iOS-style rounded corners */}
        {isOpen && (
          <div
            role="listbox"
            className="absolute z-50 w-full mt-2 bg-card border border-border rounded-2xl shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150"
          >
            <ul className="py-2 max-h-64 overflow-auto">
              {placeholder && (
                <li
                  role="option"
                  aria-selected={!value}
                  className="px-4 py-2.5 text-sm text-muted-foreground cursor-default"
                >
                  {placeholder}
                </li>
              )}
              {options.map((option, index) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                  aria-disabled={option.disabled}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  className={`
                    px-4 py-2.5 text-sm cursor-pointer transition-colors
                    ${option.disabled 
                      ? "text-muted-foreground/50 cursor-not-allowed" 
                      : "hover:bg-primary/10"
                    }
                    ${option.value === value 
                      ? "bg-primary/10 text-primary font-medium" 
                      : ""
                    }
                    ${index === selectedIndex && !option.disabled
                      ? "bg-primary/10"
                      : ""
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {option.value === value && (
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {errorMessage && (
          <p id={errorId} className="mt-1.5 text-sm text-error" role="alert">
            {errorMessage}
          </p>
        )}
        
        {helperText && !errorMessage && (
          <p id={helperId} className="mt-1.5 text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

// Search Input with clear button
interface SearchInputProps extends Omit<InputProps, "leftIcon" | "rightIcon"> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onClear, className = "", ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const showClear = value && String(value).length > 0;

    return (
      <Input
        ref={ref}
        type="search"
        value={value}
        leftIcon={
          <svg
            className={`w-4 h-4 transition-colors ${
              isFocused ? "text-primary" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
        rightIcon={
          showClear ? (
            <button
              type="button"
              onClick={onClear}
              className="p-1 rounded-md hover:bg-muted transition-colors"
              aria-label="Clear search"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          ) : undefined
        }
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        className={className}
        {...props}
      />
    );
  }
);

SearchInput.displayName = "SearchInput";
