"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, User, FolderPlus, FileText, Calculator, HelpCircle, Loader2 } from "lucide-react";
import { AppShell } from "@/components/layout";
import { Button } from "@/components/ui";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const QUICK_ACTIONS = [
  {
    icon: FolderPlus,
    label: "Create a project",
    prompt: "Help me create a new project",
  },
  {
    icon: FileText,
    label: "Generate a document",
    prompt: "I need to generate a document for my project",
  },
  {
    icon: Calculator,
    label: "Compare estimates",
    prompt: "Help me compare my estimate with the carrier scope",
  },
  {
    icon: HelpCircle,
    label: "Insurance questions",
    prompt: "I have a question about insurance claims",
  },
];

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "Hi! I'm your QuickClaims AI assistant. I can help you manage projects, generate documents, analyze carrier scopes, and answer questions about insurance claims. What would you like to do today?",
  timestamp: new Date(),
};

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const responses = [
        "I'd be happy to help you with that! Could you tell me more about what you're looking for?",
        "Great question! Let me explain how that works in QuickClaims...",
        "I can definitely assist with that. To get started, I'll need a few details from you.",
        "That's a common scenario in insurance claims. Here's what I recommend...",
      ];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000);
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
        <div className="flex-shrink-0 px-4 pt-4 pb-2 hidden lg:block">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight">AI Assistant</h1>
              <p className="text-[11px] text-muted-foreground">Your claims management copilot</p>
            </div>
          </div>
        </div>

        {/* Messages Area - this is the only scrollable part */}
        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
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
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  message.role === "assistant"
                    ? "bg-card border border-border text-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <p
                  className={`text-[10px] mt-1.5 ${
                    message.role === "assistant" ? "text-muted-foreground" : "text-primary-foreground/70"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
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
        <div className="flex-shrink-0 px-4 pb-2 pt-2 bg-background border-t border-border/50">
          {/* Quick Actions (only show when few messages) */}
          {messages.length <= 2 && (
            <div className="mb-2">
              <p className="text-[10px] text-muted-foreground mb-1.5">Quick actions</p>
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
                placeholder="Ask me anything..."
                className="flex-1 resize-none bg-transparent border-0 focus:ring-0 focus:outline-none text-sm placeholder:text-muted-foreground min-h-[32px] max-h-[80px] py-1"
                rows={1}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!input.trim() || isLoading}
                className="rounded-full h-7 w-7 p-0 flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-1">
              Enter to send · Shift+Enter for new line
            </p>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
