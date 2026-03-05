import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Send, Paperclip, Code, Eye, FolderTree, Terminal, Share2, Github, Upload,
  Link2, Globe, UserPlus, ChevronRight, Pencil, Plus, ExternalLink, ChevronDown,
  Home, Settings, Sun, Moon, HelpCircle, Zap, Lock, Search, AlertCircle,
  ChevronLeft, Copy, Check, ArrowLeft, Users, Rocket, LayoutDashboard, Trash2,
  RotateCcw, Server, Cloud, PanelLeftClose, PanelLeft,
} from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import slateLogo from "@/assets/slate-logo.svg";
import GenerationProgress from "@/components/slate/GenerationProgress";
import StreamingCode from "@/components/slate/StreamingCode";
import PreviewLoading from "@/components/slate/PreviewLoading";
import GeneratedPreview from "@/components/slate/GeneratedPreview";
import SettingsOverlay from "@/components/SettingsOverlay";

// ─── Types & Constants ───

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

type TopTab = "preview" | "code" | "appos" | "cloud";

const TENANTS = [
  { id: "ten_01HQ3X…8k", name: "Acme Corp", plan: "Pro", users: 24, created: "Jan 12, 2026" },
  { id: "ten_01HR7Y…3m", name: "Globex Inc", plan: "Starter", users: 8, created: "Feb 03, 2026" },
  { id: "ten_01HS2Z…9p", name: "Initech", plan: "Enterprise", users: 112, created: "Feb 18, 2026" },
  { id: "ten_01HT4A…1r", name: "Umbrella Ltd", plan: "Pro", users: 31, created: "Mar 01, 2026" },
];

const DEPLOYMENTS = [
  { version: "v1.4.2", status: "Live", branch: "main", commit: "a83f1d2", time: "Mar 03, 2026 · 2:14 PM" },
  { version: "v1.4.1", status: "Superseded", branch: "main", commit: "e7c09b4", time: "Feb 28, 2026 · 10:30 AM" },
  { version: "v1.4.0", status: "Superseded", branch: "main", commit: "3bf72e1", time: "Feb 20, 2026 · 4:45 PM" },
  { version: "v1.3.0", status: "Rolled back", branch: "release/1.3", commit: "d12ea98", time: "Feb 10, 2026 · 9:00 AM" },
];

const ENV_VARS = [
  { key: "DATABASE_URL", value: "••••••••••••" },
  { key: "API_SECRET", value: "••••••••••••" },
  { key: "STRIPE_KEY", value: "••••••••••••" },
];

const APPOS_NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "tenants", label: "Tenants", icon: Users },
  { id: "deployments", label: "Deployments", icon: Rocket },
  { id: "settings", label: "Configuration", icon: Settings },
];

// ─── Main Component ───

const ProjectPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const source = searchParams.get("source") || "build"; // "build" | "platform"
  const initialPrompt = searchParams.get("prompt") || DEFAULT_PROMPT;
  const projectName = searchParams.get("name") || "Franchise Sales App";

  // Determine available tabs
  const availableTabs: TopTab[] = source === "build"
    ? ["preview", "code", "appos", "cloud"]
    : ["appos", "cloud"];

  const [activeTab, setActiveTab] = useState<TopTab>(availableTabs[0]);

  // Chat state (only used in build mode)
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationDone, setGenerationDone] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Shared state
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<string | undefined>(undefined);
  const [publishOpen, setPublishOpen] = useState(false);
  const [githubPopoverOpen, setGithubPopoverOpen] = useState(false);
  const [appMenuOpen, setAppMenuOpen] = useState(false);

  // AppOS state
  const [appOsSection, setAppOsSection] = useState("overview");
  const [selectedTenant, setSelectedTenant] = useState<typeof TENANTS[number] | null>(null);
  const [copied, setCopied] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasSeededBuildRef = useRef(false);
  const forceCompleteTimerRef = useRef<number | null>(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(35); // percentage
  const [chatPanelCollapsed, setChatPanelCollapsed] = useState(false);

  const appUrl = `${projectName.toLowerCase().replace(/\s+/g, "-")}.onslate.com`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleGenerationComplete = useCallback(() => {
    setIsGenerating((prev) => {
      if (!prev) return prev;
      setGenerationDone(true);
      setActiveTab("preview");
      return false;
    });
  }, []);

  // Build mode: seed initial prompt
  useEffect(() => {
    if (source !== "build" || hasSeededBuildRef.current) return;

    hasSeededBuildRef.current = true;
    const userMsg: Message = { id: "1", role: "user", content: initialPrompt, timestamp: new Date() };
    const firstAssistant: Message = { id: "2", role: "assistant", content: `Great choice! I'll build a **Franchise Sales Management** app for you. Let me analyze the requirements and start generating the code...`, timestamp: new Date() };

    setMessages([userMsg, firstAssistant]);
    setGenerationDone(false);
    setIsGenerating(true);
    setActiveTab("code");

    const timers = ASSISTANT_STEPS.map((step, i) =>
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: `step-${i}`, role: "assistant" as const, content: step.content, timestamp: new Date() }]);
      }, step.delay)
    );

    return () => timers.forEach(clearTimeout);
  }, [source, initialPrompt]);

  // Progress ticker
  useEffect(() => {
    if (!isGenerating) return;
    setGenerationProgress(0);
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 95) { clearInterval(interval); return prev; }
        return prev + Math.random() * 12;
      });
    }, 800);

    forceCompleteTimerRef.current = window.setTimeout(() => {
      handleGenerationComplete();
    }, 14000);

    return () => {
      clearInterval(interval);
      if (forceCompleteTimerRef.current) {
        clearTimeout(forceCompleteTimerRef.current);
        forceCompleteTimerRef.current = null;
      }
    };
  }, [isGenerating, handleGenerationComplete]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", content: input.trim(), timestamp: new Date() }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Got it! I'm working on that change now. You'll see the preview update shortly.", timestamp: new Date() }]);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // ─── Tab label config ───
  const tabConfig: Record<TopTab, { label: string; icon: React.ReactNode }> = {
    preview: { label: "Preview", icon: <Eye className="h-3.5 w-3.5" /> },
    code: { label: "Code", icon: <Code className="h-3.5 w-3.5" /> },
    appos: { label: "AppOS", icon: <Server className="h-3.5 w-3.5" /> },
    cloud: { label: "Cloud", icon: <Cloud className="h-3.5 w-3.5" /> },
  };

  // ─── App Name Dropdown (shared) ───
  const AppNameDropdown = () => (
    <DropdownMenu open={appMenuOpen} onOpenChange={setAppMenuOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 text-base font-bold text-foreground hover:text-foreground/80 transition-colors" style={{ fontFamily: "'Lato', sans-serif" }}>
          {projectName}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[280px] p-0 bg-card border-border">
        <button onClick={() => navigate("/")} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
          <Home className="h-4 w-4 text-muted-foreground" /> Go back to Home
        </button>
        <DropdownMenuSeparator className="bg-border" />
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Plan</span>
            <span className="text-xs font-semibold bg-primary/15 text-primary px-2 py-0.5 rounded-full">Builder – $15/mo</span>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-border" />
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
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-foreground">App Usage</span>
              <span className="text-[11px] text-muted-foreground">$1.20 / $5.00 monthly</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: "24%" }} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 pt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
            <span className="text-[11px] text-destructive">Currently using free daily usage</span>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-border" />
        <div className="py-1">
          <button onClick={() => { setAppMenuOpen(false); setSettingsOpen(true); }} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
            <Settings className="h-4 w-4 text-muted-foreground" /> Settings
          </button>
          <button onClick={() => { setIsDarkMode(!isDarkMode); document.documentElement.classList.toggle("dark"); }} className="flex items-center justify-between w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
            <span className="flex items-center gap-3">
              {isDarkMode ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
              Appearance
            </span>
            <span className="text-[11px] text-muted-foreground">{isDarkMode ? "Dark" : "Light"}</span>
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
            <HelpCircle className="h-4 w-4 text-muted-foreground" /> Help
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // ─── Top Header (shared) ───
  // ─── Tab Pills Component (reusable) ───
  const TabPills = () => (
    <div className="flex items-center gap-0.5 bg-muted/50 rounded-lg p-0.5">
      {availableTabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tabConfig[tab].icon}
          {tabConfig[tab].label}
        </button>
      ))}
    </div>
  );

  const TopHeader = () => (
    <div className="relative flex items-center justify-between px-4 py-2.5 border-b border-border bg-card shrink-0">
      <div className="flex items-center gap-3">
        <img src={slateLogo} alt="Slate" className="h-5 w-auto" />
        {AppNameDropdown()}
        {/* When collapsed, show expand button inline next to app name */}
        {source === "build" && (activeTab === "preview" || activeTab === "code") && chatPanelCollapsed && (
          <button
            onClick={() => setChatPanelCollapsed(false)}
            className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ml-1"
            title="Show chat panel"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* When expanded, position collapse button + tabs at the right panel edge */}
      {source === "build" && (activeTab === "preview" || activeTab === "code") && !chatPanelCollapsed && (
        <div
          className="absolute top-0 bottom-0 flex items-center gap-1"
          style={{ left: `calc(${leftPanelWidth}% - 28px)` }}
        >
          <button
            onClick={() => setChatPanelCollapsed(true)}
            className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Hide chat panel"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
          <div className="w-px h-4 bg-border mx-0.5" />
          {TabPills()}
        </div>
      )}
      {/* When collapsed or non-build tabs, center the tab pills */}
      {source === "build" && (activeTab === "preview" || activeTab === "code") && chatPanelCollapsed && (
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex items-center">
          {TabPills()}
        </div>
      )}
      {!(source === "build" && (activeTab === "preview" || activeTab === "code")) && (
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex items-center">
          {TabPills()}
        </div>
      )}

      {/* Right actions */}
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
            <SharePanel onPublishClick={() => setPublishOpen(true)} />
          </PopoverContent>
        </Popover>

        {/* GitHub */}
        <Popover open={githubPopoverOpen} onOpenChange={setGithubPopoverOpen}>
          <PopoverTrigger asChild>
            <button className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors">
              <Github className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[320px] bg-card border-border p-0 rounded-xl">
            <div className="p-5">
              <h3 className="text-base font-semibold text-foreground mb-1">GitHub</h3>
              <p className="text-sm text-muted-foreground">Sync your app 2-way with GitHub to collaborate at source.</p>
            </div>
            <div className="border-t border-border px-5 py-3 flex items-center justify-between">
              <button className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <HelpCircle className="h-4 w-4" />
              </button>
              <button
                onClick={() => { setGithubPopoverOpen(false); setSettingsInitialTab("developer"); setSettingsOpen(true); }}
                className="h-9 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 flex items-center gap-2 transition-colors"
              >
                <Github className="h-4 w-4" /> Connect GitHub
              </button>
            </div>
          </PopoverContent>
        </Popover>

        <PublishButton externalOpen={publishOpen} onExternalOpenChange={setPublishOpen} />
      </div>
    </div>
  );

  // ─── Chat Panel (build mode only) ───
  const ChatPanel = () => (
    <div className="flex flex-col h-full border-r border-border">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
              }`}>
                {msg.content.split("\n").map((line, i) => (
                  <p key={i} className={i > 0 ? "mt-2" : ""}>
                    {line.split("**").map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
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
                Press <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">Enter</kbd> to send
              </span>
              <button onClick={handleSend} disabled={!input.trim()} className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40">
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── Preview Content ───
  const PreviewContent = () => (
    <div className="flex-1 overflow-hidden">
      {generationDone ? (
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
              <p className="text-sm text-muted-foreground max-w-md">Your app preview will appear here as Slate generates and updates the code.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ─── Code Content ───
  const CodeContent = () => (
    <div className="h-full flex">
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
      <div className="flex-1 bg-[hsl(var(--card))] overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-border">
          <span className="text-xs text-muted-foreground font-mono">src / pages / Index.tsx</span>
        </div>
        <StreamingCode isGenerating={isGenerating} />
      </div>
    </div>
  );

  // ─── AppOS Content ───
  const AppOSContent = () => (
    <div className="flex flex-1 overflow-hidden h-full">
      {/* Sidebar nav */}
      <aside className="w-48 border-r border-border bg-card flex flex-col shrink-0">
        <nav className="flex-1 p-2 space-y-0.5">
          {APPOS_NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => { setAppOsSection(item.id); setSelectedTenant(null); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                appOsSection === item.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-medium">Project ID</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">prj_01HQ…7x</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-8">
          {appOsSection === "overview" && <OverviewTab projectName={projectName} appUrl={appUrl} copied={copied} onCopy={handleCopy} />}
          {appOsSection === "tenants" && (
            selectedTenant
              ? <TenantDetail tenant={selectedTenant} onBack={() => setSelectedTenant(null)} />
              : <TenantsTab tenants={TENANTS} onSelect={setSelectedTenant} />
          )}
          {appOsSection === "deployments" && <DeploymentsTab />}
          {appOsSection === "settings" && <SettingsTab projectName={projectName} appUrl={appUrl} />}
        </div>
      </main>
    </div>
  );

  // ─── Cloud Content ───
  const CloudContent = () => (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>Cloud</h2>
          <p className="text-sm text-muted-foreground mt-1">Backend infrastructure and cloud services for your application.</p>
        </div>

        <div className="grid gap-4">
          <InfoCard label="Backend Status">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm text-foreground">Active · AppOS Cloud</span>
            </div>
          </InfoCard>

          <InfoCard label="Region">
            <span className="text-sm text-foreground">US East (Virginia)</span>
          </InfoCard>

          <InfoCard label="Database">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs font-medium">PostgreSQL 15</Badge>
              <span className="text-sm text-muted-foreground">· 2.4 GB used</span>
            </div>
          </InfoCard>

          <InfoCard label="Storage">
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground">1.8 GB / 5 GB</span>
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden max-w-[120px]">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: "36%" }} />
              </div>
            </div>
          </InfoCard>

          <InfoCard label="Edge Functions">
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground">3 deployed</span>
              <span className="text-xs text-muted-foreground">· 12.4k invocations today</span>
            </div>
          </InfoCard>

          <InfoCard label="Authentication">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs font-medium">Email + OAuth</Badge>
              <span className="text-sm text-muted-foreground">· 156 active users</span>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );

  // ─── Tab Content Renderer ───
  const renderTabContent = () => {
    switch (activeTab) {
      case "preview": return PreviewContent();
      case "code": return CodeContent();
      case "appos": return AppOSContent();
      case "cloud": return CloudContent();
    }
  };

  // ─── Determine if chat panel should show ───
  const showChatPanel = source === "build" && (activeTab === "preview" || activeTab === "code");

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {TopHeader()}

      <div className="flex-1 overflow-hidden">
        {showChatPanel && !chatPanelCollapsed ? (
          <ResizablePanelGroup direction="horizontal" onLayout={(sizes) => setLeftPanelWidth(sizes[0])}>
            <ResizablePanel defaultSize={35} minSize={25} maxSize={55}>
              {ChatPanel()}
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={65} minSize={40}>
              <div className="flex flex-col h-full">
                {renderTabContent()}
                {(activeTab === "preview" || activeTab === "code") && (
                  <div className="shrink-0 border-t border-border bg-card">
                    <button className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full">
                      <Terminal className="h-3.5 w-3.5" />
                      <span className="font-medium">Console</span>
                    </button>
                  </div>
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="flex flex-col h-full">
            {renderTabContent()}
          </div>
        )}
      </div>

      <SettingsOverlay open={settingsOpen} onClose={() => { setSettingsOpen(false); setSettingsInitialTab(undefined); }} initialTab={settingsInitialTab} />
    </div>
  );
};

// ─── Helper Components ───

const FileTreeItem = ({ name, isFolder, defaultOpen, children }: { name: string; isFolder?: boolean; defaultOpen?: boolean; children?: React.ReactNode }) => {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div>
      <button onClick={() => isFolder && setOpen(!open)} className="flex items-center gap-1.5 w-full px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
        {isFolder ? <FolderTree className="h-3.5 w-3.5 text-primary/70" /> : <Code className="h-3.5 w-3.5" />}
        <span className={isFolder ? "font-medium" : ""}>{name}</span>
      </button>
      {isFolder && open && children && <div className="pl-4">{children}</div>}
    </div>
  );
};

const InfoCard = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="rounded-lg border border-border bg-card p-4">
    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium mb-1.5">{label}</p>
    {children}
  </div>
);

// ─── AppOS Sub-tabs ───

const OverviewTab = ({ projectName, appUrl, copied, onCopy }: { projectName: string; appUrl: string; copied: boolean; onCopy: (t: string) => void }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>{projectName}</h2>
      <p className="text-sm text-muted-foreground mt-1">Project overview and quick details.</p>
    </div>
    <div className="grid gap-4">
      <InfoCard label="App URL">
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-foreground">{appUrl}</span>
          <button onClick={() => onCopy(appUrl)} className="text-muted-foreground hover:text-foreground transition-colors">
            {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <a href={`https://${appUrl}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </InfoCard>
      <InfoCard label="Deployment Status">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-sm text-foreground">Live · v1.4.2</span>
        </div>
      </InfoCard>
      <InfoCard label="Backend Type">
        <Badge variant="secondary" className="text-xs font-medium">AppOS · Cloud</Badge>
      </InfoCard>
      <InfoCard label="Created">
        <span className="text-sm text-foreground">Jan 12, 2026</span>
      </InfoCard>
    </div>
  </div>
);

const TenantsTab = ({ tenants, onSelect }: { tenants: typeof TENANTS; onSelect: (t: typeof TENANTS[number]) => void }) => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>Tenants</h2>
        <p className="text-sm text-muted-foreground mt-1">Organizations using this application.</p>
      </div>
      <button className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5">
        <Plus className="h-3.5 w-3.5" /> Add Tenant
      </button>
    </div>
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Name</th>
            <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Tenant ID</th>
            <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Plan</th>
            <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Users</th>
            <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Created</th>
            <th className="w-8" />
          </tr>
        </thead>
        <tbody>
          {tenants.map((t) => (
            <tr key={t.id} onClick={() => onSelect(t)} className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors group">
              <td className="px-4 py-3 font-medium text-primary hover:underline">{t.name}</td>
              <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">{t.id}</td>
              <td className="px-4 py-3"><Badge variant="secondary" className="text-[11px]">{t.plan}</Badge></td>
              <td className="px-4 py-3 text-muted-foreground">{t.users}</td>
              <td className="px-4 py-3 text-muted-foreground">{t.created}</td>
              <td className="px-4 py-3"><ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-foreground transition-colors" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const TenantDetail = ({ tenant, onBack }: { tenant: typeof TENANTS[number]; onBack: () => void }) => (
  <div className="space-y-5">
    <button onClick={onBack} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
      <ArrowLeft className="h-3.5 w-3.5" /> Back to tenants
    </button>
    <div>
      <h2 className="text-xl font-semibold tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>{tenant.name}</h2>
      <p className="text-[11px] text-muted-foreground font-mono mt-1">{tenant.id}</p>
    </div>
    <div className="grid gap-4">
      <InfoCard label="Plan"><Badge variant="secondary" className="text-[11px]">{tenant.plan}</Badge></InfoCard>
      <InfoCard label="Active Users"><span className="text-sm text-foreground">{tenant.users} users</span></InfoCard>
      <InfoCard label="Created"><span className="text-sm text-foreground">{tenant.created}</span></InfoCard>
    </div>
    <div>
      <h3 className="text-sm font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Modules</h3>
      <div className="grid grid-cols-2 gap-2">
        {["Contacts", "Invoicing", "Pipeline", "Reports"].map((mod) => (
          <div key={mod} className="rounded-lg border border-border bg-card p-3 flex items-center justify-between">
            <span className="text-sm font-medium">{mod}</span>
            <Badge variant="outline" className="text-[10px]">Active</Badge>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DeploymentsTab = () => (
  <div className="space-y-5">
    <div>
      <h2 className="text-xl font-semibold tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>Deployments</h2>
      <p className="text-sm text-muted-foreground mt-1">Deployment history and rollback.</p>
    </div>
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Version</th>
            <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Status</th>
            <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Branch / Commit</th>
            <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Deployed</th>
            <th className="w-20" />
          </tr>
        </thead>
        <tbody>
          {DEPLOYMENTS.map((d, i) => (
            <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
              <td className="px-4 py-3 font-mono font-medium">{d.version}</td>
              <td className="px-4 py-3">
                <Badge
                  variant={d.status === "Live" ? "default" : "secondary"}
                  className={`text-[11px] ${d.status === "Live" ? "bg-green-500/15 text-green-700 border-green-500/30 hover:bg-green-500/20" : ""} ${d.status === "Rolled back" ? "bg-orange-500/15 text-orange-700 border-orange-500/30 hover:bg-orange-500/20" : ""}`}
                >
                  {d.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                <span>{d.branch}</span>
                <span className="mx-1.5 text-muted-foreground/40">·</span>
                <span className="font-mono text-[11px]">{d.commit}</span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{d.time}</td>
              <td className="px-4 py-3">
                {d.status !== "Live" && d.status !== "Rolled back" && (
                  <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                    <RotateCcw className="h-3 w-3" /> Rollback
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SettingsTab = ({ projectName, appUrl }: { projectName: string; appUrl: string }) => {
  const [customDomain, setCustomDomain] = useState("");
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>Configuration</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage project settings.</p>
      </div>
      <section className="space-y-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Project Details</h3>
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div>
            <label className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Project Name</label>
            <p className="text-sm mt-0.5 font-medium">{projectName}</p>
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">App URL</label>
            <p className="text-sm mt-0.5 font-mono">{appUrl}</p>
          </div>
        </div>
      </section>
      <section className="space-y-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Custom Domain</h3>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-2">Connect your own domain to this project.</p>
          <div className="flex items-center gap-2">
            <input value={customDomain} onChange={(e) => setCustomDomain(e.target.value)} placeholder="app.yourdomain.com" className="flex-1 h-8 px-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            <button className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Connect</button>
          </div>
        </div>
      </section>
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Environment Variables</h3>
          <button className="text-[11px] text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-1"><Plus className="h-3 w-3" /> Add Variable</button>
        </div>
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {ENV_VARS.map((v, i) => (
            <div key={i} className={`flex items-center justify-between px-4 py-3 ${i < ENV_VARS.length - 1 ? "border-b border-border" : ""}`}>
              <span className="text-sm font-mono font-medium">{v.key}</span>
              <span className="text-sm text-muted-foreground font-mono">{v.value}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-destructive">Danger Zone</h3>
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Delete Project</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">This action is permanent and cannot be undone.</p>
          </div>
          <button className="h-8 px-3 rounded-md border border-destructive text-destructive text-sm font-medium hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center gap-1.5">
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      </section>
    </div>
  );
};

// ─── Share Panel ───
const SharePanel = ({ onPublishClick }: { onPublishClick?: () => void }) => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Editor");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [invitedPeople, setInvitedPeople] = useState<{ email: string; role: string }[]>([]);
  const roles = ["App Owner", "Editor", "Viewer"];

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      setInvitedPeople((prev) => [...prev, { email: inviteEmail.trim(), role: inviteRole }]);
      setInviteEmail("");
      setInviteRole("Editor");
    }
  };

  return (
    <div className="py-4">
      <h3 className="text-base font-semibold text-foreground px-4 mb-3">Share app</h3>
      <div className="px-4 mb-4">
        <div className="rounded-lg border border-input bg-background overflow-hidden">
          <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="Add people" className="w-full h-9 px-3 text-sm text-foreground bg-transparent placeholder:text-muted-foreground focus:outline-none" />
          {inviteEmail.trim() && (
            <div className="flex items-center justify-end gap-2 px-3 pb-2">
              <div className="relative">
                <button onClick={() => setShowRoleDropdown(!showRoleDropdown)} className="h-7 px-2.5 rounded-md border border-border text-xs font-medium text-foreground hover:bg-muted flex items-center gap-1 transition-colors">
                  {inviteRole} <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>
                {showRoleDropdown && (
                  <div className="absolute right-0 top-8 z-50 w-28 rounded-md border border-border bg-card shadow-lg py-1">
                    {roles.map((role) => (
                      <button key={role} onClick={() => { setInviteRole(role); setShowRoleDropdown(false); }} className={`w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors ${role === inviteRole ? "text-primary font-medium" : "text-foreground"}`}>
                        {role}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={handleInvite} className="h-7 px-3 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">Invite</button>
            </div>
          )}
        </div>
      </div>
      <div className="px-4 mb-2">
        <p className="text-sm font-semibold text-foreground mb-3">Who has access</p>
        <div className="flex items-center justify-between py-2 px-1">
          <div className="flex items-center gap-3">
            <span className="h-8 w-8 rounded-full bg-primary text-[11px] font-bold text-primary-foreground flex items-center justify-center">S</span>
            <span className="text-sm text-foreground">user@company.com (you)</span>
          </div>
          <span className="text-xs text-muted-foreground">Owner</span>
        </div>
        {invitedPeople.map((person, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 px-1">
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-full bg-muted text-[11px] font-bold text-muted-foreground flex items-center justify-center uppercase">{person.email.charAt(0)}</span>
              <div className="flex flex-col">
                <span className="text-sm text-foreground">{person.email}</span>
                <span className="text-xs text-muted-foreground">Invited</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{person.role}</span>
          </div>
        ))}
      </div>
      <div className="px-4 pt-2 space-y-2">
        <div className="border-t border-border pt-3">
          <button onClick={onPublishClick} className="w-full h-9 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted/50 flex items-center justify-center gap-2 transition-colors">
            <Upload className="h-3.5 w-3.5" /> Publish app
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Publish Button ───
const PublishButton = ({ externalOpen, onExternalOpenChange }: { externalOpen?: boolean; onExternalOpenChange?: (v: boolean) => void }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = (v: boolean) => { setInternalOpen(v); onExternalOpenChange?.(v); };
  const [isPublished, setIsPublished] = useState(false);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<"main" | "editSettings" | "websiteInfo" | "websiteAccess" | "editUrl">("main");
  const [appTitle, setAppTitle] = useState("Slate app");
  const [appDescription, setAppDescription] = useState("");
  const [accessMode, setAccessMode] = useState<"org" | "public">("org");
  const [urlSlug, setUrlSlug] = useState("franchise-app");
  const [editingSlug, setEditingSlug] = useState("franchise-app");

  const fullUrl = `${urlSlug}.onslate.com`;

  const handlePublish = () => setIsPublished(true);
  const handleUnpublish = () => { setIsPublished(false); setView("main"); };
  const handleCopyUrl = () => { navigator.clipboard.writeText(fullUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleOpenChange = (val: boolean) => { setOpen(val); if (!val) setView("main"); };

  return (
    <>
      <button onClick={() => setOpen(true)} className="h-8 px-5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm shadow-primary/25">
        Publish
      </button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[420px] bg-card border-border rounded-2xl p-0 overflow-hidden">
          {view === "editUrl" ? (
            <div className="p-6 space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-semibold text-foreground">Edit URL</h3>
                  <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 font-normal"><HelpCircle className="h-3.5 w-3.5" /> Docs</button>
                </div>
                <p className="text-sm text-muted-foreground">Customize your app's web address</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-foreground block mb-2">Subdomain</span>
                <div className="flex items-center gap-0">
                  <input type="text" value={editingSlug} onChange={(e) => setEditingSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} className="flex-1 h-10 rounded-l-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="my-app" />
                  <span className="h-10 px-3 rounded-r-lg border border-l-0 border-border bg-muted flex items-center text-sm text-muted-foreground">.onslate.com</span>
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block mb-1">Preview</span>
                <div className="rounded-lg border border-border bg-muted/20 px-4 py-3">
                  <span className="text-sm font-medium text-foreground">{editingSlug || "my-app"}.onslate.com</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <button onClick={() => { setEditingSlug(urlSlug); setView("editSettings"); }} className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"><ChevronLeft className="h-4 w-4" /> Back</button>
                <button onClick={() => { setUrlSlug(editingSlug); setView("editSettings"); }} className="h-10 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">Save</button>
              </div>
            </div>
          ) : view === "websiteAccess" ? (
            <div className="p-6 space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-semibold text-foreground">Website access</h3>
                  <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 font-normal"><HelpCircle className="h-3.5 w-3.5" /> Docs</button>
                </div>
                <p className="text-sm text-muted-foreground">Control who can view your published app</p>
              </div>
              <div className="space-y-3">
                <button onClick={() => setAccessMode("org")} className={`w-full rounded-xl border p-4 flex items-center gap-4 text-left transition-colors ${accessMode === "org" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"}`}>
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${accessMode === "org" ? "bg-primary/15" : "bg-muted"}`}><Lock className={`h-5 w-5 ${accessMode === "org" ? "text-primary" : "text-muted-foreground"}`} /></div>
                  <div className="flex-1"><span className="text-sm font-semibold text-foreground block">Org members only</span><span className="text-xs text-muted-foreground">Only members of your organization can access</span></div>
                  {accessMode === "org" && <svg className="h-5 w-5 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
                </button>
                <button onClick={() => setAccessMode("public")} className={`w-full rounded-xl border p-4 flex items-center gap-4 text-left transition-colors ${accessMode === "public" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"}`}>
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${accessMode === "public" ? "bg-primary/15" : "bg-muted"}`}><Globe className={`h-5 w-5 ${accessMode === "public" ? "text-primary" : "text-muted-foreground"}`} /></div>
                  <div className="flex-1"><span className="text-sm font-semibold text-foreground block">Public access</span><span className="text-xs text-muted-foreground">Anyone with the link can access your app</span></div>
                  {accessMode === "public" && <svg className="h-5 w-5 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
                </button>
              </div>
              <div className="flex items-center justify-between pt-2">
                <button onClick={() => setView("editSettings")} className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"><ChevronLeft className="h-4 w-4" /> Back</button>
                <button onClick={() => setView("editSettings")} className="h-10 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">Done</button>
              </div>
            </div>
          ) : view === "websiteInfo" ? (
            <div className="p-6 space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-semibold text-foreground">Website info</h3>
                  <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 font-normal"><HelpCircle className="h-3.5 w-3.5" /> Docs</button>
                </div>
                <p className="text-sm text-muted-foreground">Help people discover your app</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">Icon & title</span>
                  <span className="text-xs text-muted-foreground">{appTitle.length}/60</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl border border-border bg-muted/30 flex items-center justify-center shrink-0 cursor-pointer hover:bg-muted transition-colors">
                    <img src={slateLogo} alt="Slate" className="h-6 w-6" />
                  </div>
                  <input type="text" value={appTitle} onChange={(e) => setAppTitle(e.target.value.slice(0, 60))} className="flex-1 h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Slate app" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">Description</span>
                  <span className="text-xs text-muted-foreground">{appDescription.length}/160</span>
                </div>
                <textarea value={appDescription} onChange={(e) => setAppDescription(e.target.value.slice(0, 160))} placeholder="Slate Generated Project" rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground resize-y focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <span className="text-sm font-semibold text-foreground block mb-2">Preview</span>
                <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <img src={slateLogo} alt="Slate" className="h-4 w-4" />
                    <span className="text-sm font-medium text-primary">{appTitle || "Slate App"}</span>
                  </div>
                  <p className="text-xs text-primary/70">{fullUrl}</p>
                  <p className="text-xs text-muted-foreground">{appDescription || "Slate Generated Project"}</p>
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button onClick={() => setView("editSettings")} className="h-10 px-8 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">Done</button>
              </div>
            </div>
          ) : view === "editSettings" ? (
            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-semibold text-foreground">Edit settings</h3>
                  <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 font-normal"><HelpCircle className="h-3.5 w-3.5" /> Docs</button>
                </div>
                <p className="text-sm text-muted-foreground">Update your publish settings</p>
              </div>
              <button onClick={() => { setEditingSlug(urlSlug); setView("editUrl"); }} className="w-full rounded-xl border border-border p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors text-left">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0"><Link2 className="h-5 w-5 text-emerald-500" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5"><span className="text-sm font-semibold text-foreground">URL</span><svg className="h-4 w-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg></div>
                  <span className="text-xs text-muted-foreground">{fullUrl}</span>
                </div>
                <Pencil className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
              <button onClick={() => setView("websiteAccess")} className="w-full rounded-xl border border-border p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors text-left">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0"><Lock className="h-5 w-5 text-emerald-500" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5"><span className="text-sm font-semibold text-foreground">Website access</span><svg className="h-4 w-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg></div>
                  <span className="text-xs text-muted-foreground">{accessMode === "org" ? "Org members only" : "Public access"}</span>
                </div>
                <Pencil className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
              <button onClick={() => setView("websiteInfo")} className="w-full rounded-xl border border-border p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors text-left">
                <div className="h-10 w-10 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0"><Search className="h-5 w-5 text-amber-500" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5"><span className="text-sm font-semibold text-foreground">Website info</span><AlertCircle className="h-4 w-4 text-amber-500" /></div>
                  <span className="text-xs text-muted-foreground">Missing info</span>
                </div>
                <Pencil className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
              <div className="flex items-center justify-between pt-2">
                <button onClick={() => setView("main")} className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"><ChevronLeft className="h-4 w-4" /> Back</button>
                <button onClick={() => setView("main")} className="h-10 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">Save changes</button>
              </div>
            </div>
          ) : isPublished ? (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-base font-semibold text-foreground">Published to org</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9m-9 9a9 9 0 0 1 9-9" /></svg>
                  4 Visitors
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Live URL</span>
                  <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"><Link2 className="h-3.5 w-3.5" /> Add custom domain</button>
                </div>
                <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{fullUrl}</span>
                  <button onClick={handleCopyUrl} className="h-7 w-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                    {copied ? <svg className="h-4 w-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg> : <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>}
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setView("editSettings")} className="flex-1 h-10 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">Edit settings</button>
                <button onClick={handleUnpublish} className="flex-1 h-10 rounded-lg border border-destructive/50 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">Unpublish</button>
              </div>
              <button onClick={() => setOpen(false)} className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/25">Update</button>
            </div>
          ) : (
            <>
              <div className="p-6 pb-0">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between text-lg">
                    <span>Website address</span>
                    <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 font-normal"><Globe className="h-3.5 w-3.5" /> Docs</button>
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground">Choose your app's URL or use the generated one</DialogDescription>
                </DialogHeader>
              </div>
              <div className="p-6 pt-4 space-y-3">
                <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-3.5 flex items-center gap-3 transition-colors">
                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0"><Link2 className="h-4 w-4 text-foreground" /></div>
                  <span className="text-sm font-medium text-foreground flex-1 truncate">{fullUrl}</span>
                  <button className="h-7 w-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                </div>
                <button className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors w-full py-2 px-1 rounded-lg hover:bg-muted/50">
                  <div className="h-9 w-9 rounded-full border-2 border-dashed border-muted-foreground/40 flex items-center justify-center"><Plus className="h-4 w-4" /></div>
                  Add custom domain
                </button>
                <div className="flex justify-end pt-2">
                  <button onClick={handlePublish} className="h-10 px-8 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/25">Continue</button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectPage;
