import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Send, Paperclip, Code, Eye, FolderTree, Terminal, Share2, Github, Upload, Link2, Globe, UserPlus, ChevronRight, Pencil, Plus, ExternalLink, ChevronDown, Home, CreditCard, Settings, Sun, Moon, HelpCircle, Zap, Server } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import slateLogo from "@/assets/slate-logo.svg";
import GenerationProgress from "@/components/slate/GenerationProgress";
import StreamingCode from "@/components/slate/StreamingCode";
import PreviewLoading from "@/components/slate/PreviewLoading";
import GeneratedPreview from "@/components/slate/GeneratedPreview";
import SettingsOverlay from "@/components/SettingsOverlay";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const DEFAULT_PROMPT = "Create a Franchise Sales Management app to manage all the franchises across the globe with a rich UI and UX";

const ASSISTANT_STEPS: { delay: number; content: string }[] = [
  { delay: 2000, content: "I'll start by setting up the **project structure** with a modern React + TypeScript stack, Tailwind CSS for styling, and a clean component architecture." },
  { delay: 5000, content: "Now I'm building the **core components**:\n\n• `FranchiseTable` – sortable data grid with search & filters\n• `SalesOverview` – KPI cards for total revenue, active franchises, growth rate\n• `GlobalMap` – interactive map showing franchise locations\n• `FranchiseDetail` – detail drawer with sales history chart" },
  { delay: 8000, content: "Adding the **dashboard layout** with a sidebar navigation, top metrics bar, and responsive grid. Wiring up mock data for 24 franchise locations across 12 countries." },
  { delay: 10500, content: "✅ **Your Franchise Sales Management app is ready!**\n\nHere's what I built:\n• Dashboard with real-time KPI cards\n• Searchable franchise directory with status badges\n• Sales analytics with interactive charts\n• Responsive layout that works on all devices\n\nYou can check the **Preview** tab to see it live." },
];

const SlateWorkspace = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || DEFAULT_PROMPT;

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [previewTab, setPreviewTab] = useState<"preview" | "code">("code");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationDone, setGenerationDone] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const appName = "Franchise Sales App";

  const handleGenerationComplete = useCallback(() => {
    setIsGenerating(false);
    setGenerationDone(true);
    setPreviewTab("preview");
  }, []);

  // Seed initial prompt and schedule assistant messages
  useEffect(() => {
    const userMsg: Message = {
      id: "1",
      role: "user",
      content: initialPrompt,
      timestamp: new Date(),
    };
    const firstAssistant: Message = {
      id: "2",
      role: "assistant",
      content: `Great choice! I'll build a **Franchise Sales Management** app for you. Let me analyze the requirements and start generating the code...`,
      timestamp: new Date(),
    };
    setMessages([userMsg, firstAssistant]);
    setIsGenerating(true);
    setPreviewTab("code");

    // Schedule follow-up assistant messages
    const timers = ASSISTANT_STEPS.map((step, i) =>
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `step-${i}`,
            role: "assistant" as const,
            content: step.content,
            timestamp: new Date(),
          },
        ]);
      }, step.delay)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  // Progress ticker during generation
  useEffect(() => {
    if (!isGenerating) return;
    setGenerationProgress(0);
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 95) { clearInterval(interval); return prev; }
        return prev + Math.random() * 12;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [isGenerating]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // Simulate assistant reply
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Got it! I'm working on that change now. You'll see the preview update shortly.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, reply]);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <ResizablePanelGroup direction="horizontal">
        {/* Left: Conversation Panel */}
        <ResizablePanel defaultSize={35} minSize={25} maxSize={55}>
          <div className="flex flex-col h-full border-r border-border">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card shrink-0">
              <img src={slateLogo} alt="Slate" className="h-5 w-auto" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 text-base font-bold text-foreground hover:text-foreground/80 transition-colors" style={{ fontFamily: "'Lato', sans-serif" }}>
                    {appName}
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[280px] p-0 bg-card border-border">
                  {/* Go back to Home */}
                  <button
                    onClick={() => navigate("/slate")}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <Home className="h-4 w-4 text-muted-foreground" />
                    Go back to Home
                  </button>

                  <DropdownMenuSeparator className="bg-border" />

                  {/* Billing Plan */}
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Plan</span>
                      <span className="text-xs font-semibold bg-primary/15 text-primary px-2 py-0.5 rounded-full">Builder – $15/mo</span>
                    </div>
                  </div>

                  <DropdownMenuSeparator className="bg-border" />

                  {/* AI Usage - monthly with free daily tier */}
                  <div className="px-4 py-3 space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-foreground">AI Usage</span>
                        <span className="text-[11px] text-muted-foreground">$3.20 / $10.00 monthly</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: "32%" }} />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                        <Zap className="h-3 w-3 text-amber-500" />
                        Free tier: $0.65 / $1.00 used today · $3.80 / $5.00 this month
                      </p>
                    </div>

                    {/* App Usage */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-foreground">App Usage</span>
                        <span className="text-[11px] text-muted-foreground">$1.20 / $5.00 monthly</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: "24%" }} />
                      </div>
                    </div>

                    {/* Usage indicator */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
                      <span className="text-[11px] text-destructive">Currently using free daily usage</span>
                    </div>
                  </div>

                  <DropdownMenuSeparator className="bg-border" />

                  {/* Settings, Appearance, Help */}
                  <div className="py-1">
                    <button
                      onClick={() => setSettingsOpen(true)}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        setIsDarkMode(!isDarkMode);
                        document.documentElement.classList.toggle("dark");
                      }}
                      className="flex items-center justify-between w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        {isDarkMode ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
                        Appearance
                      </span>
                      <span className="text-[11px] text-muted-foreground">{isDarkMode ? "Dark" : "Light"}</span>
                    </button>
                    <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      Help
                    </button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {msg.content.split("\n").map((line, i) => (
                        <p key={i} className={i > 0 ? "mt-2" : ""}>
                          {line.split("**").map((part, j) =>
                            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-xl px-4 py-2.5 bg-muted text-foreground">
                      <GenerationProgress onComplete={handleGenerationComplete} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input area */}
            <div className="shrink-0 border-t border-border bg-card p-3">
              <div className="rounded-xl border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your application idea..."
                  rows={1}
                  className="w-full resize-none bg-transparent px-4 pt-3 pb-1 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
                <div className="flex items-center justify-between px-3 pb-2">
                  <button className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">
                      Press <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">Shift+Enter</kbd> for new line
                    </span>
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right: Preview Panel */}
        <ResizablePanel defaultSize={65} minSize={40}>
          <div className="flex flex-col h-full">
            {/* Preview header with tabs */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPreviewTab("code")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    previewTab === "code"
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Code className="h-3.5 w-3.5" />
                  Code
                </button>
                <button
                  onClick={() => setPreviewTab("preview")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    previewTab === "preview"
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Preview
                </button>
              </div>

              {/* Share, GitHub, Publish buttons */}
              <div className="flex items-center gap-2">
                {/* Share */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 h-8 px-3 rounded-full bg-muted text-sm font-medium text-foreground hover:bg-muted/80 transition-colors">
                      <span className="h-5 w-5 rounded-full bg-green-700 text-[10px] font-bold text-white flex items-center justify-center">S</span>
                      Share
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-[380px] bg-card border-border p-0">
                    <SharePanel />
                  </PopoverContent>
                </Popover>

                {/* GitHub */}
                <button className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors">
                  <Github className="h-4 w-4" />
                </button>

                {/* Publish */}
                <PublishButton />
              </div>
            </div>

            {/* Preview / Code content */}
            <div className="flex-1 overflow-hidden">
              {previewTab === "preview" ? (
                generationDone ? (
                  <GeneratedPreview />
                ) : isGenerating ? (
                  <PreviewLoading progress={Math.min(Math.round(generationProgress), 95)} />
                ) : (
                  <div className="h-full bg-background flex items-center justify-center">
                    <div className="text-center space-y-4 px-8">
                      <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Eye className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">Live Preview</h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                          Your app preview will appear here as Slate generates and updates the code.
                        </p>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="h-full flex">
                  {/* File tree */}
                  <div className="w-56 border-r border-border bg-card overflow-y-auto shrink-0">
                    <div className="px-3 py-2 border-b border-border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project Files</p>
                    </div>
                    <div className="px-2 py-2 space-y-0.5">
                      <FileTreeItem name="public" isFolder />
                      <FileTreeItem name="src" isFolder defaultOpen>
                        <FileTreeItem name="components" isFolder>
                          <FileTreeItem name="ui" isFolder />
                        </FileTreeItem>
                        <FileTreeItem name="pages" isFolder>
                          <FileTreeItem name="Index.tsx" />
                        </FileTreeItem>
                        <FileTreeItem name="App.tsx" />
                        <FileTreeItem name="index.css" />
                        <FileTreeItem name="main.tsx" />
                      </FileTreeItem>
                      <FileTreeItem name="package.json" />
                      <FileTreeItem name="tailwind.config.ts" />
                    </div>
                  </div>

                  {/* Code editor - streaming */}
                  <div className="flex-1 bg-[hsl(var(--card))] overflow-hidden flex flex-col">
                    <div className="px-4 py-3 border-b border-border">
                      <span className="text-xs text-muted-foreground font-mono">src / pages / Index.tsx</span>
                    </div>
                    <StreamingCode isGenerating={isGenerating} />
                  </div>
                </div>
              )}
            </div>

            {/* Console bar */}
            <div className="shrink-0 border-t border-border bg-card">
              <button className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full">
                <Terminal className="h-3.5 w-3.5" />
                <span className="font-medium">Console</span>
              </button>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <SettingsOverlay open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

/* ---------- Helper Components ---------- */

const FileTreeItem = ({
  name,
  isFolder,
  defaultOpen,
  children,
}: {
  name: string;
  isFolder?: boolean;
  defaultOpen?: boolean;
  children?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div>
      <button
        onClick={() => isFolder && setOpen(!open)}
        className="flex items-center gap-1.5 w-full px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
      >
        {isFolder ? (
          <FolderTree className="h-3.5 w-3.5 text-primary/70" />
        ) : (
          <Code className="h-3.5 w-3.5" />
        )}
        <span className={isFolder ? "font-medium" : ""}>{name}</span>
      </button>
      {isFolder && open && children && (
        <div className="pl-4">{children}</div>
      )}
    </div>
  );
};

const CodeLine = ({ num, text }: { num: number; text: string }) => (
  <div className="flex">
    <span className="w-8 text-right mr-4 text-muted-foreground/40 select-none">{num}</span>
    <span className="text-foreground/80">{text}</span>
  </div>
);

/* ---------- Share Panel ---------- */
const SharePanel = () => (
  <div className="py-4">
    <h3 className="text-base font-semibold text-foreground px-4 mb-3">Share project</h3>
    <div className="px-4 mb-4">
      <div className="h-9 rounded-md border border-input bg-background px-3 flex items-center">
        <span className="text-sm text-muted-foreground">Add people</span>
      </div>
    </div>
    <div className="px-4 mb-2">
      <p className="text-sm font-semibold text-foreground mb-3">Project access</p>
      <button className="flex items-center justify-between w-full py-2 text-sm text-foreground hover:bg-muted/50 rounded-md px-1 transition-colors">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <Globe className="h-4 w-4 text-muted-foreground" />
          </div>
          <span>People you invited</span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </button>
      <div className="flex items-center justify-between py-2 px-1">
        <div className="flex items-center gap-3">
          <span className="h-8 w-8 rounded-full bg-destructive/80 text-[11px] font-bold text-white flex items-center justify-center">M</span>
          <span className="text-sm text-foreground">My Workspace</span>
        </div>
        <span className="text-xs text-muted-foreground">Can edit ∨</span>
      </div>
      <div className="flex items-center justify-between py-2 px-1">
        <div className="flex items-center gap-3">
          <span className="h-8 w-8 rounded-full bg-primary text-[11px] font-bold text-primary-foreground flex items-center justify-center">S</span>
          <span className="text-sm text-foreground">user@company.com (you)</span>
        </div>
        <span className="text-xs text-muted-foreground">Owner</span>
      </div>
      <div className="flex items-center justify-between py-2 px-1">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full border border-dashed border-muted-foreground flex items-center justify-center">
            <UserPlus className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <span className="text-sm text-muted-foreground">Invite link</span>
        </div>
        <span className="text-xs text-muted-foreground">Disabled ∨</span>
      </div>
    </div>
    <div className="px-4 pt-2 space-y-2">
      <button className="w-full h-9 rounded-md bg-muted text-sm font-medium text-foreground hover:bg-muted/80 transition-colors">
        Create invite link
      </button>
      <div className="border-t border-border pt-2 space-y-2">
        <button className="w-full h-9 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted/50 flex items-center justify-center gap-2 transition-colors">
          <Upload className="h-3.5 w-3.5" /> Publish project
        </button>
        <button className="w-full h-9 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted/50 flex items-center justify-center gap-2 transition-colors">
          <ExternalLink className="h-3.5 w-3.5" /> Share preview
        </button>
      </div>
    </div>
  </div>
);

/* ---------- Publish Button ---------- */
const PublishButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="h-8 px-5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm shadow-primary/25"
      >
        Publish
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[420px] bg-card border-border rounded-2xl p-0 overflow-hidden">
          <div className="p-6 pb-0">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between text-lg">
                <span>Website address</span>
                <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 font-normal">
                  <Globe className="h-3.5 w-3.5" />
                  Docs
                </button>
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Choose your app's URL or use the generated one
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-6 pt-4 space-y-3">
            <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-3.5 flex items-center gap-3 transition-colors">
              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Link2 className="h-4 w-4 text-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground flex-1 truncate">franchise-app.onslate.com</span>
              <button className="h-7 w-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
            <button className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors w-full py-2 px-1 rounded-lg hover:bg-muted/50">
              <div className="h-9 w-9 rounded-full border-2 border-dashed border-muted-foreground/40 flex items-center justify-center">
                <Plus className="h-4 w-4" />
              </div>
              Add custom domain
            </button>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setOpen(false)}
                className="h-10 px-8 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/25"
              >
                Continue
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SlateWorkspace;
