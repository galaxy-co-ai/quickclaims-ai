"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  FolderPlus, 
  FileText, 
  Calculator, 
  HelpCircle, 
  Loader2,
  Wrench,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { AppShell } from "@/components/layout";
import { Button, toast } from "@/components/ui";

interface ToolUsed {
  name: string;
  description: string;
  success: boolean;
  message: string;
  data?: unknown;
}

interface ActionPayload {
  type: 'navigate' | 'refresh' | 'download' | 'toast';
  payload: { url?: string; message?: string };
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  toolsUsed?: ToolUsed[];
  actions?: ActionPayload[];
}

const QUICK_ACTIONS = [
  {
    icon: FolderPlus,
    label: "Create a project",
    prompt: "Create a new project for me",
  },
  {
    icon: FileText,
    label: "Generate documents",
    prompt: "Generate AI documents for my latest project",
  },
  {
    icon: Calculator,
    label: "Show my projects",
    prompt: "Show me all my projects",
  },
  {
    icon: HelpCircle,
    label: "Xactimate help",
    prompt: "What's the Xactimate code for drip edge?",
  },
];

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "Hey! 👋 I'm your QuickClaims AI assistant. I can actually **do things** for you - not just answer questions.\n\nTry asking me to:\n- **Create a project** for a new client\n- **Generate documents** like estimates and materials lists\n- **Look up** Xactimate codes or IRC requirements\n- **Analyze photos** with AI vision\n- **Navigate** you anywhere in the app\n\nWhat would you like me to help with?",
  timestamp: new Date(),
};

export default function DashboardPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  // Handle actions from AI response
  const handleActions = useCallback((actions: ActionPayload[]) => {
    for (const action of actions) {
      switch (action.type) {
        case 'navigate':
          if (action.payload.url) {
            // Delay navigation slightly so user sees the response
            setTimeout(() => {
              router.push(action.payload.url!);
            }, 1500);
          }
          break;
        case 'download':
          if (action.payload.url) {
            window.open(action.payload.url, '_blank');
          }
          break;
        case 'toast':
          if (action.payload.message) {
            toast.success(action.payload.message);
          }
          break;
        case 'refresh':
          window.location.reload();
          break;
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      // Call the AI API with function calling
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages
            .filter(m => m.id !== "welcome")
            .map(m => ({ role: m.role, content: m.content })),
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      
      // Create assistant message with tools info
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content || "I apologize, but I couldn't generate a response. Please try again.",
        timestamp: new Date(),
        toolsUsed: data.toolsUsed || [],
        actions: data.actions || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Execute any actions
      if (data.actions && data.actions.length > 0) {
        handleActions(data.actions);
      }

    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      toast.error("Failed to get AI response. Please try again.");
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please check your connection and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <AppShell mobileTitle="AI Assistant" fullHeight>
      <div className="fixed inset-0 top-[var(--header-height)] bottom-[var(--mobile-nav-height)] lg:bottom-0 lg:left-[var(--sidebar-width)] flex flex-col">
        {/* Header - hidden on mobile since it's in the mobile nav */}
        <div className="shrink-0 px-4 pt-4 pb-2 hidden lg:block">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight">AI Assistant</h1>
              <p className="text-[11px] text-muted-foreground">Your powerful claims copilot</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div
                className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                  message.role === "assistant"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {message.role === "assistant" ? (
                  <Bot className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>

              {/* Message Bubble */}
              <div className="flex flex-col gap-2 max-w-[85%]">
                <div
                  className={`rounded-2xl px-4 py-2.5 ${
                    message.role === "assistant"
                      ? "bg-card border border-border text-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-strong:text-inherit max-w-none">
                    <MessageContent content={message.content} />
                  </div>
                  <p
                    className={`text-[10px] mt-1.5 ${
                      message.role === "assistant" ? "text-muted-foreground" : "text-primary-foreground/70"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>

                {/* Tools Used Display */}
                {message.toolsUsed && message.toolsUsed.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {message.toolsUsed.map((tool, index) => (
                      <div
                        key={index}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                          tool.success
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {tool.success ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {tool.description}
                      </div>
                    ))}
                  </div>
                )}

                {/* Navigation indicator */}
                {message.actions && message.actions.some(a => a.type === 'navigate') && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[11px] font-medium animate-pulse">
                    <ArrowRight className="w-3 h-3" />
                    Navigating...
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-card border border-border rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Fixed Area - Quick Actions + Input */}
        <div className="shrink-0 px-4 pb-2 pt-2 bg-background border-t border-border/50">
          {/* Quick Actions (only show when few messages) */}
          {messages.length <= 2 && (
            <div className="mb-2">
              <p className="text-[10px] text-muted-foreground mb-1.5">Try these</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.prompt)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all text-left group"
                  >
                    <action.icon className="w-3.5 h-3.5 text-primary group-hover:text-primary" />
                    <span className="text-xs font-medium text-foreground">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card shadow-sm">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything or tell me what to do..."
                className="flex-1 resize-none bg-transparent border-0 focus:ring-0 focus:outline-none text-sm placeholder:text-muted-foreground min-h-[32px] max-h-[80px] py-1"
                rows={1}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!input.trim() || isLoading}
                className="rounded-full h-7 w-7 p-0 shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-1">
              I can create projects, generate docs, analyze photos, and more!
            </p>
          </form>
        </div>
      </div>
    </AppShell>
  );
}

// Enhanced markdown renderer component
function MessageContent({ content }: { content: string }) {
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];
    let listKey = 0;

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${listKey++}`} className="list-disc list-inside space-y-0.5 my-1">
            {listItems.map((item, i) => (
              <li key={i}>{parseInline(item)}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    const parseInline = (text: string): React.ReactNode => {
      // Handle bold, code, and emojis
      const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} className="px-1 py-0.5 rounded bg-muted text-primary text-xs">
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      });
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Check for bullet points
      if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        listItems.push(trimmed.slice(2));
      } else {
        flushList();
        
        if (trimmed === '') {
          if (index > 0 && index < lines.length - 1) {
            elements.push(<br key={`br-${index}`} />);
          }
        } else {
          elements.push(
            <p key={`p-${index}`} className="my-1">
              {parseInline(trimmed)}
            </p>
          );
        }
      }
    });

    flushList();
    return elements;
  };

  return <>{parseMarkdown(content)}</>;
}
