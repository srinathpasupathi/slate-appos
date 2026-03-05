import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Send, Paperclip, Code, Eye, FolderTree, Terminal, Share2, Github, Upload,
  Link2, Globe, UserPlus, ChevronRight, Pencil, Plus, ExternalLink, ChevronDown,
  Home, Settings, Sun, Moon, HelpCircle, Zap, Lock, Search, AlertCircle,
  ChevronLeft, Copy, Check, ArrowLeft, Users, Rocket, LayoutDashboard, Trash2,
  RotateCcw, Server, Cloud, PanelLeftClose, PanelLeft, Boxes, DatabaseZap, Wrench,
  MoreHorizontal, X, Shield,
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
import RelationalDBView from "@/components/cloud/RelationalDBView";
import ObjectStorageView from "@/components/cloud/ObjectStorageView";
import NoSQLDBView from "@/components/cloud/NoSQLDBView";
import AuthenticationView from "@/components/cloud/AuthenticationView";
import ServicePromoView from "@/components/ServicePromoView";
import GitHubConnectDialog from "@/components/GitHubConnectDialog";

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

interface AppUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  userRole: string;
  roleId: string;
  department: string;
  jobTitle: string;
  orgId: string;
  orgName: string;
  status: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  signupDate: string;
}

const APP_USERS: AppUser[] = [
  { userId: "usr_01HQ3X8k", firstName: "Alice", lastName: "Johnson", email: "alice@acme.com", phone: "+1-555-0101", username: "alicej", userRole: "Admin", roleId: "role_001", department: "Engineering", jobTitle: "CTO", orgId: "org_001", orgName: "Acme Corp", status: "Active", emailVerified: true, phoneVerified: true, signupDate: "Jan 12, 2026" },
  { userId: "usr_01HR7Y3m", firstName: "Bob", lastName: "Smith", email: "bob@globex.com", phone: "+1-555-0102", username: "bsmith", userRole: "Editor", roleId: "role_002", department: "Marketing", jobTitle: "Marketing Lead", orgId: "org_002", orgName: "Globex Inc", status: "Active", emailVerified: true, phoneVerified: false, signupDate: "Feb 03, 2026" },
  { userId: "usr_01HS2Z9p", firstName: "Carol", lastName: "Williams", email: "carol@initech.com", phone: "+1-555-0103", username: "cwilliams", userRole: "Viewer", roleId: "role_003", department: "Sales", jobTitle: "Sales Manager", orgId: "org_003", orgName: "Initech", status: "Inactive", emailVerified: false, phoneVerified: false, signupDate: "Feb 18, 2026" },
  { userId: "usr_01HT4A1r", firstName: "David", lastName: "Brown", email: "david@umbrella.com", phone: "+1-555-0104", username: "dbrown", userRole: "Admin", roleId: "role_001", department: "Operations", jobTitle: "COO", orgId: "org_004", orgName: "Umbrella Ltd", status: "Active", emailVerified: true, phoneVerified: true, signupDate: "Mar 01, 2026" },
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
  { id: "users", label: "Users", icon: Users },
  { id: "resources", label: "Resources", icon: Boxes },
  { id: "query-console", label: "Query Console", icon: DatabaseZap },
  { id: "configuration", label: "Configuration", icon: Wrench },
  { id: "deployments", label: "Deployments", icon: Rocket },
];

const CLOUD_NAV = [
  { id: "authentication", label: "Authentication", icon: Lock },
  { id: "relational-db", label: "Relational DB", icon: Server },
  { id: "object-storage", label: "Object Storage", icon: FolderTree },
  { id: "nosql-db", label: "NoSQL DB", icon: LayoutDashboard },
  { id: "functions", label: "Functions", icon: Zap },
  { id: "schedulers", label: "Schedulers", icon: RotateCcw },
  { id: "mail", label: "Mail", icon: Send },
  { id: "logs", label: "Logs", icon: Terminal },
];

// ─── Main Component ───

const ProjectPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const source = searchParams.get("source") || "build"; // "build" | "platform"
  const initialPrompt = searchParams.get("prompt") || DEFAULT_PROMPT;
  const projectName = searchParams.get("name") || "Franchise Sales App";

  // GitHub connect state (platform mode)
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubDialogOpen, setGithubDialogOpen] = useState(false);

  // Determine available tabs
  const availableTabs: TopTab[] = source === "build"
    ? ["preview", "code", "appos", "cloud"]
    : githubConnected
      ? ["preview", "code", "appos", "cloud"]
      : ["appos", "cloud", "preview"];

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
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [copied, setCopied] = useState(false);
  const [appOsEnabled, setAppOsEnabled] = useState(source === "platform");
  const [appOsEnabling, setAppOsEnabling] = useState(false);

  // Cloud state
  const [cloudSection, setCloudSection] = useState("authentication");
  const [cloudEnabled, setCloudEnabled] = useState(false);
  const [cloudEnabling, setCloudEnabling] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasSeededBuildRef = useRef(false);
  const forceCompleteTimerRef = useRef<number | null>(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(25); // percentage
  const [chatPanelCollapsed, setChatPanelCollapsed] = useState(false);

  const appUrl = `${projectName.toLowerCase().replace(/\s+/g, "-")}.us.omcloud.ai`;

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

  const handleEnableService = (service: "appos" | "cloud") => {
    const label = service === "appos" ? "AppOS" : "Cloud";
    const setEnabling = service === "appos" ? setAppOsEnabling : setCloudEnabling;
    const setEnabled = service === "appos" ? setAppOsEnabled : setCloudEnabled;

    setEnabling(true);

    // If chat panel is not visible, enable directly after a brief delay
    const chatVisible = source === "build" || (source === "platform" && githubConnected);
    if (!chatVisible) {
      setTimeout(() => {
        setEnabling(false);
        setEnabled(true);
      }, 1500);
      return;
    }

    // Build mode: simulate chat conversation
    const userMsg: Message = {
      id: `enable-${service}-user-${Date.now()}`,
      role: "user",
      content: `Enable ${label} for this project`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    if (chatPanelCollapsed) setChatPanelCollapsed(false);

    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: `enable-${service}-ack-${Date.now()}`,
        role: "assistant",
        content: `Sure! I'm enabling **${label}** for your project now. Setting up the required infrastructure...`,
        timestamp: new Date(),
      }]);
    }, 800);

    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: `enable-${service}-done-${Date.now()}`,
        role: "assistant",
        content: `✅ **${label} has been enabled** for your project!\n\n${
          service === "appos"
            ? "You now have access to:\n• **Users & Profiles** – Manage application users\n• **Workflows & Automation** – Build business logic\n• **Roles & Permissions** – Fine-grained access control\n• **Query Console** – Run data queries\n• **Deployments** – Manage releases"
            : "You now have access to:\n• **Authentication** – User sign-in & management\n• **Relational DB** – PostgreSQL database\n• **Object Storage** – File & media storage\n• **NoSQL DB** – Document database\n• **Functions** – Serverless backend logic\n• **Schedulers, Mail & Logs**"
        }\n\nYou can explore the **${label}** tab now.`,
        timestamp: new Date(),
      }]);
      setEnabling(false);
      setEnabled(true);
    }, 3500);
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
        {showChatPanel && chatPanelCollapsed && (
          <button
            onClick={() => setChatPanelCollapsed(false)}
            className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ml-1"
            title="Show chat panel"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Tabs always centered */}
      {showChatPanel && (
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex items-center">
          {TabPills()}
        </div>
      )}
      {/* Collapse button animates at panel edge */}
      {showChatPanel && !chatPanelCollapsed && (
        <div
          className="absolute top-0 bottom-0 flex items-center"
          style={{
            left: `calc(${leftPanelWidth}% - 28px)`,
            transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <button
            onClick={() => setChatPanelCollapsed(true)}
            className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Hide chat panel"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>
      )}
      {!showChatPanel && (
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
              Invite
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[380px] bg-card border-border p-0">
            <SharePanel onPublishClick={() => setPublishOpen(true)} />
          </PopoverContent>
        </Popover>

        {/* GitHub */}
        {source === "platform" && !githubConnected ? null : (
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
        )}

        <PublishButton externalOpen={publishOpen} onExternalOpenChange={setPublishOpen} initialPublished={source === "platform"} />
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
      {source === "platform" ? (
        <GeneratedPreview appName={projectName} />
      ) : generationDone ? (
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
  const AppOSContent = () => {
    if (!appOsEnabled) {
      return <ServicePromoView type="appos" enabling={appOsEnabling} onEnable={() => handleEnableService("appos")} />;
    }
    return (
    <div className="flex flex-1 overflow-hidden h-full">
      {/* Sidebar nav */}
      <aside className="w-48 border-r border-border bg-card flex flex-col shrink-0">
        <div className="px-4 pt-4 pb-3 border-b border-border">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AppOS</h3>
        </div>
        <nav className="flex-1 p-2 pt-1 space-y-0.5">
          {APPOS_NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => { setAppOsSection(item.id); setSelectedUser(null); }}
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
        <div className="px-6 py-6">
          {appOsSection === "overview" && <OverviewTab projectName={projectName} appUrl={appUrl} copied={copied} onCopy={handleCopy} />}
          {appOsSection === "users" && (
            <UsersTab users={APP_USERS} />
          )}
          {appOsSection === "resources" && <ResourcesTab />}
          {appOsSection === "query-console" && <QueryConsoleTab />}
          {appOsSection === "configuration" && <ConfigurationTab />}
          {appOsSection === "deployments" && <DeploymentsTab />}
        </div>
      </main>
    </div>
    );
  };

  // ─── Cloud Content ───
  const CloudContent = () => {
    if (!cloudEnabled) {
      return <ServicePromoView type="cloud" enabling={cloudEnabling} onEnable={() => handleEnableService("cloud")} />;
    }
    const renderCloudSection = () => {
      if (cloudSection === "authentication") {
        return <AuthenticationView />;
      }
      if (cloudSection === "relational-db") {
        return <RelationalDBView />;
      }
      if (cloudSection === "object-storage") {
        return <ObjectStorageView />;
      }
      if (cloudSection === "nosql-db") {
        return <NoSQLDBView />;
      }
      const sectionItem = CLOUD_NAV.find(n => n.id === cloudSection);
      const title = sectionItem?.label || "Cloud";
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>{title}</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage {title.toLowerCase()} for your application.</p>
          </div>
          {cloudSection === "object-storage" && (
            <ObjectStorageView />
          )}
          {cloudSection === "nosql-db" && (
            <NoSQLDBView />
          )}
          {cloudSection === "functions" && (
            <div className="grid gap-4">
              <InfoCard label="Deployed Functions">
                <span className="text-sm text-foreground">3 deployed</span>
              </InfoCard>
              <InfoCard label="Invocations">
                <span className="text-sm text-foreground">12.4k invocations today</span>
              </InfoCard>
            </div>
          )}
          {cloudSection === "schedulers" && (
            <div className="grid gap-4">
              <InfoCard label="Active Jobs">
                <span className="text-sm text-foreground">2 scheduled jobs</span>
              </InfoCard>
            </div>
          )}
          {cloudSection === "mail" && (
            <div className="grid gap-4">
              <InfoCard label="Emails Sent">
                <span className="text-sm text-foreground">342 emails (30d)</span>
              </InfoCard>
              <InfoCard label="Provider">
                <Badge variant="secondary" className="text-xs font-medium">SMTP</Badge>
              </InfoCard>
            </div>
          )}
          {cloudSection === "logs" && (
            <div className="grid gap-4">
              <InfoCard label="Log Entries">
                <span className="text-sm text-foreground">48.2k entries (24h)</span>
              </InfoCard>
              <InfoCard label="Errors">
                <span className="text-sm text-foreground text-destructive">12 errors (24h)</span>
              </InfoCard>
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="flex flex-1 overflow-hidden h-full">
        <aside className="w-48 border-r border-border bg-card flex flex-col shrink-0">
          <div className="px-4 pt-4 pb-3 border-b border-border">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cloud</h3>
          </div>
          <nav className="flex-1 p-2 pt-1 space-y-0.5">
            {CLOUD_NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => setCloudSection(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                  cloudSection === item.id
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
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-[11px] text-muted-foreground">Cloud Active</span>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto">
          {(cloudSection === "authentication" || cloudSection === "relational-db" || cloudSection === "object-storage" || cloudSection === "nosql-db") ? (
            renderCloudSection()
          ) : (
            <div className="px-6 py-6">
              {renderCloudSection()}
            </div>
          )}
        </main>
      </div>
    );
  };

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
  const showChatPanel = source === "build" || (source === "platform" && githubConnected);

  const handleGithubConnected = (repoName: string) => {
    setGithubDialogOpen(false);
    setGithubConnected(true);
    setGenerationDone(true);
    setActiveTab("preview");

    // Seed chat with welcome messages after repo pull
    const now = new Date();
    setMessages([
      {
        id: `gh-welcome-1-${Date.now()}`,
        role: "assistant",
        content: `✅ **Repository "${repoName}" has been successfully pulled!**\n\nYour codebase is now loaded and ready for development.`,
        timestamp: now,
      },
    ]);

    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: `gh-welcome-2-${Date.now()}`,
        role: "assistant",
        content: `You can now start prompting to iterate on your app — describe any changes, new features, or fixes and I'll implement them for you.\n\n🔄 **All changes will be auto-synced to GitHub** in the background, so your repository stays up to date without any manual steps.\n\nWhat would you like to work on first?`,
        timestamp: new Date(),
      }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {TopHeader()}

      <div className="flex-1 overflow-hidden flex">
        {showChatPanel && (
          <div
            className="h-full overflow-hidden border-r border-border flex-shrink-0"
            style={{
              width: chatPanelCollapsed ? '0px' : `${leftPanelWidth}%`,
              minWidth: chatPanelCollapsed ? '0px' : '25%',
              maxWidth: '55%',
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="h-full w-full overflow-hidden" style={{ minWidth: '300px' }}>
              {ChatPanel()}
            </div>
          </div>
        )}
        <div className="flex-1 flex flex-col h-full min-w-0" style={{ transition: 'flex 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
          {renderTabContent()}
          {showChatPanel && (activeTab === "preview" || activeTab === "code") && (
            <div className="shrink-0 border-t border-border bg-card">
              <button className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full">
                <Terminal className="h-3.5 w-3.5" />
                <span className="font-medium">Console</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <SettingsOverlay open={settingsOpen} onClose={() => { setSettingsOpen(false); setSettingsInitialTab(undefined); }} initialTab={settingsInitialTab} />
      <GitHubConnectDialog open={githubDialogOpen} onOpenChange={setGithubDialogOpen} onConnected={handleGithubConnected} />
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

// ─── Placeholder Section ───
const PlaceholderSection = ({ title, description }: { title: string; description: string }) => (
  <div className="space-y-4">
    <div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
    <div className="rounded-lg border border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
      Coming soon
    </div>
  </div>
);

// ─── AppOS Sub-tabs ───

const API_CALLS_7D = [
  { day: "Mon", calls: 1240 },
  { day: "Tue", calls: 1580 },
  { day: "Wed", calls: 2100 },
  { day: "Thu", calls: 1890 },
  { day: "Fri", calls: 2340 },
  { day: "Sat", calls: 980 },
  { day: "Sun", calls: 760 },
];

const OverviewTab = ({ projectName, appUrl, copied, onCopy }: { projectName: string; appUrl: string; copied: boolean; onCopy: (t: string) => void }) => {
  const maxCalls = Math.max(...API_CALLS_7D.map(d => d.calls));
  const totalCalls = API_CALLS_7D.reduce((s, d) => s + d.calls, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Overview</h2>
        <p className="text-sm text-muted-foreground mt-1">Project overview and quick details.</p>
      </div>

      {/* App Name card */}
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">App Name</p>
        <span className="text-base font-normal text-foreground">{projectName}</span>
      </div>

      {/* App URL – Primary */}
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Application URL</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 rounded-lg bg-muted/40 px-4 py-2.5">
            <Globe className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm font-mono text-foreground truncate">{appUrl}</span>
          </div>
          <button
            onClick={() => onCopy(appUrl)}
            className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
          </button>
          <a
            href={`https://${appUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Visit
          </a>
        </div>
      </div>

      {/* Secondary info row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Deployment Status</p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-sm font-medium text-foreground">Live</span>
            <span className="text-xs text-muted-foreground">· v1.4.2</span>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Created</p>
          <p className="text-sm font-medium text-foreground">Jan 12, 2026</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Total API Calls (7d)</p>
          <p className="text-2xl font-bold text-foreground">{totalCalls.toLocaleString()}</p>
        </div>
      </div>

      {/* API Calls Chart – Line + Area */}
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">API Calls · Last 7 Days</p>
        <div className="h-44">
          <svg viewBox="0 0 600 180" className="w-full h-full" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <line key={i} x1="0" y1={i * 35 + 10} x2="600" y2={i * 35 + 10} stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="4 4" />
            ))}
            {/* Area fill */}
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <path
              d={(() => {
                const pts = API_CALLS_7D.map((d, i) => ({
                  x: i * (600 / 6),
                  y: 150 - (d.calls / maxCalls) * 130,
                }));
                const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
                return `${line} L${pts[pts.length - 1].x},160 L${pts[0].x},160 Z`;
              })()}
              fill="url(#areaGradient)"
            />
            {/* Line */}
            <path
              d={API_CALLS_7D.map((d, i) => {
                const x = i * (600 / 6);
                const y = 150 - (d.calls / maxCalls) * 130;
                return `${i === 0 ? "M" : "L"}${x},${y}`;
              }).join(" ")}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />
            {/* Dots */}
            {API_CALLS_7D.map((d, i) => {
              const x = i * (600 / 6);
              const y = 150 - (d.calls / maxCalls) * 130;
              return <circle key={i} cx={x} cy={y} r="3.5" fill="hsl(var(--primary))" opacity="0.5" />;
            })}
            {/* Day labels */}
            {API_CALLS_7D.map((d, i) => (
              <text key={i} x={i * (600 / 6)} y="175" textAnchor="middle" className="fill-muted-foreground text-[11px]">{d.day}</text>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

const UsersTab = ({ users }: { users: AppUser[] }) => {
  const [detailUser, setDetailUser] = useState<AppUser | null>(null);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>Users</h2>
          <p className="text-sm text-muted-foreground mt-1">All registered users in this application.</p>
        </div>
        <button className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add User
        </button>
      </div>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Last Name</th>
              <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Email</th>
              <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">User ID</th>
              <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">User Role</th>
              <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Signup Date</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.userId} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 font-medium">{u.lastName}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">{u.userId}</td>
                <td className="px-4 py-3"><Badge variant="secondary" className="text-[11px]">{u.userRole}</Badge></td>
                <td className="px-4 py-3 text-muted-foreground">{u.signupDate}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setDetailUser(u)}
                    className="p-1 rounded hover:bg-muted transition-colors"
                    title="View more details"
                  >
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Detail Dialog */}
      <Dialog open={!!detailUser} onOpenChange={(open) => !open && setDetailUser(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Full profile information for this user.</DialogDescription>
          </DialogHeader>
          {detailUser && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm mt-2">
              {([
                ["User ID", detailUser.userId],
                ["First Name", detailUser.firstName],
                ["Last Name", detailUser.lastName],
                ["Email", detailUser.email],
                ["Phone Number", detailUser.phone],
                ["Username", detailUser.username],
                ["User Role", detailUser.userRole],
                ["Role ID", detailUser.roleId],
                ["Department", detailUser.department],
                ["Job Title", detailUser.jobTitle],
                ["Org ID", detailUser.orgId],
                ["Org Name", detailUser.orgName],
                ["Status", detailUser.status],
                ["Email Verified", detailUser.emailVerified ? "Yes" : "No"],
                ["Phone Verified", detailUser.phoneVerified ? "Yes" : "No"],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label}>
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium block mb-0.5">{label}</span>
                  <span className="text-foreground font-medium">{value}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const RESOURCE_MODULES = [
  { name: "Orders", entities: 3, description: "Handling the orders", createdOn: "01 Jan 2026, 10:30 am", createdBy: "admin@franchise.com" },
  { name: "Products", entities: 5, description: "Product list", createdOn: "01 Jan 2026, 10:30 am", createdBy: "admin@franchise.com" },
  { name: "Customers", entities: 2, description: "All Users of app", createdOn: "01 Jan 2026, 10:30 am", createdBy: "admin@franchise.com" },
  { name: "Franchises", entities: 8, description: "Franchise locations", createdOn: "15 Jan 2026, 2:00 pm", createdBy: "admin@franchise.com" },
  { name: "Invoices", entities: 4, description: "Billing and invoices", createdOn: "20 Jan 2026, 9:15 am", createdBy: "admin@franchise.com" },
];

type ResourceSubNav = "module" | "workflow" | "roles";

const RESOURCE_SUB_NAV: { id: ResourceSubNav; label: string }[] = [
  { id: "module", label: "Modules & Fields" },
  { id: "workflow", label: "Workflow" },
  { id: "roles", label: "Roles & Permissions" },
];

interface WorkflowEntry {
  name: string;
  type: string;
  moduleName: string;
  createdOn: string;
  trigger: string;
  target: string;
  configuration: string;
}

const SAMPLE_WORKFLOWS: WorkflowEntry[] = [
  { name: "New Lead Assignment", type: "On Record Action", moduleName: "Leads", createdOn: "10 Jan 2026, 10:00 am", trigger: "On Record Create", target: "Assign Owner Field", configuration: "Round-robin assignment among sales reps based on region" },
  { name: "Invoice Overdue Alert", type: "Scheduled", moduleName: "Invoices", createdOn: "15 Jan 2026, 3:30 pm", trigger: "Daily at 9:00 AM", target: "Send Email Notification", configuration: "Email sent to billing team when invoice is overdue by 7+ days" },
  { name: "Deal Stage Update", type: "On Record Action", moduleName: "Deals", createdOn: "20 Jan 2026, 11:45 am", trigger: "On Field Update (Stage)", target: "Update Probability Field", configuration: "Auto-update win probability based on deal stage mapping" },
  { name: "Customer Onboarding", type: "On Record Action", moduleName: "Contacts", createdOn: "25 Jan 2026, 9:00 am", trigger: "On Record Create (Customer Type)", target: "Create Tasks", configuration: "Generate 5 onboarding tasks assigned to CSM with due dates" },
  { name: "Inventory Restock", type: "Scheduled", moduleName: "Products", createdOn: "01 Feb 2026, 8:00 am", trigger: "Weekly on Monday", target: "Create Purchase Order", configuration: "Auto-create PO when stock falls below minimum threshold" },
];

interface RoleEntry {
  name: string;
  description: string;
  users: number;
  permissions: { module: string; create: boolean; read: boolean; update: boolean; delete: boolean }[];
}

const SAMPLE_ROLES: RoleEntry[] = [
  { name: "Super Admin", description: "Full system access with all permissions", users: 2, permissions: [
    { module: "Leads", create: true, read: true, update: true, delete: true },
    { module: "Deals", create: true, read: true, update: true, delete: true },
    { module: "Contacts", create: true, read: true, update: true, delete: true },
    { module: "Invoices", create: true, read: true, update: true, delete: true },
  ]},
  { name: "Sales Manager", description: "Manage sales pipeline and team performance", users: 5, permissions: [
    { module: "Leads", create: true, read: true, update: true, delete: false },
    { module: "Deals", create: true, read: true, update: true, delete: false },
    { module: "Contacts", create: true, read: true, update: true, delete: false },
    { module: "Invoices", create: false, read: true, update: false, delete: false },
  ]},
  { name: "Sales Rep", description: "Create and manage own leads and deals", users: 12, permissions: [
    { module: "Leads", create: true, read: true, update: true, delete: false },
    { module: "Deals", create: true, read: true, update: true, delete: false },
    { module: "Contacts", create: true, read: true, update: false, delete: false },
    { module: "Invoices", create: false, read: true, update: false, delete: false },
  ]},
  { name: "Finance", description: "Manage invoices and billing operations", users: 3, permissions: [
    { module: "Leads", create: false, read: true, update: false, delete: false },
    { module: "Deals", create: false, read: true, update: false, delete: false },
    { module: "Contacts", create: false, read: true, update: false, delete: false },
    { module: "Invoices", create: true, read: true, update: true, delete: true },
  ]},
  { name: "Viewer", description: "Read-only access across all modules", users: 8, permissions: [
    { module: "Leads", create: false, read: true, update: false, delete: false },
    { module: "Deals", create: false, read: true, update: false, delete: false },
    { module: "Contacts", create: false, read: true, update: false, delete: false },
    { module: "Invoices", create: false, read: true, update: false, delete: false },
  ]},
];

const SAMPLE_DATA: Record<string, { columns: string[]; rows: string[][] }> = {
  "SELECT * FROM orders": {
    columns: ["Order ID", "Customer", "Amount", "Status", "Date"],
    rows: [
      ["ORD-001", "Acme Corp", "$12,500", "Completed", "2026-01-15"],
      ["ORD-002", "Globex Inc", "$8,200", "Pending", "2026-02-03"],
      ["ORD-003", "Initech", "$15,750", "Completed", "2026-02-10"],
      ["ORD-004", "Umbrella Ltd", "$4,300", "Cancelled", "2026-02-18"],
    ],
  },
  "SELECT * FROM products": {
    columns: ["Product ID", "Name", "Price", "Category", "Stock"],
    rows: [
      ["PRD-001", "Widget Pro", "$299", "Hardware", "142"],
      ["PRD-002", "DataSync", "$49/mo", "Software", "∞"],
      ["PRD-003", "SmartHub", "$599", "Hardware", "38"],
    ],
  },
  "SELECT * FROM customers": {
    columns: ["Customer ID", "Name", "Email", "Plan", "Since"],
    rows: [
      ["CST-001", "Acme Corp", "admin@acme.com", "Enterprise", "2025-06-01"],
      ["CST-002", "Globex Inc", "info@globex.com", "Pro", "2025-09-15"],
      ["CST-003", "Initech", "hello@initech.com", "Starter", "2026-01-10"],
    ],
  },
};

const QueryConsoleTab = () => {
  const [query, setQuery] = useState("SELECT * FROM orders");
  const [result, setResult] = useState<{ columns: string[]; rows: string[][] } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const handleRun = () => {
    setIsRunning(true);
    setError(null);
    setResult(null);
    const trimmed = query.trim().replace(/;$/, "").trim();
    setTimeout(() => {
      const match = Object.entries(SAMPLE_DATA).find(([key]) => key.toLowerCase() === trimmed.toLowerCase());
      if (match) {
        setResult(match[1]);
        setExecutionTime(Math.floor(Math.random() * 80) + 12);
      } else {
        setError("No results found. Try: SELECT * FROM orders, SELECT * FROM products, or SELECT * FROM customers");
      }
      setIsRunning(false);
    }, 600);
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div>
        <h2 className="text-xl font-semibold tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>Query Console</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Run queries against your application data.</p>
      </div>

      {/* Editor area */}
      <div className="rounded-lg border border-border bg-card overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
          <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Editor</span>
          <button
            onClick={handleRun}
            disabled={isRunning || !query.trim()}
            className="h-7 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            {isRunning ? (
              <RotateCcw className="h-3 w-3 animate-spin" />
            ) : (
              <Zap className="h-3 w-3" />
            )}
            {isRunning ? "Running…" : "Execute"}
          </button>
        </div>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleRun(); }}
          spellCheck={false}
          className="w-full min-h-[120px] p-4 bg-background text-sm font-mono resize-y focus:outline-none placeholder:text-muted-foreground"
          placeholder="Enter your query here… (⌘+Enter to execute)"
        />
      </div>

      {/* Results area */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-lg border border-border bg-card overflow-hidden flex-1 flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
            <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
              Results — {result.rows.length} row{result.rows.length !== 1 ? "s" : ""}
            </span>
            {executionTime && (
              <span className="text-[11px] text-muted-foreground">{executionTime}ms</span>
            )}
          </div>
          <div className="overflow-auto flex-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {result.columns.map((col) => (
                    <th key={col} className="text-left px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-2.5 whitespace-nowrap font-mono text-[12px]">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const ResourcesTab = () => {
  const [subNav, setSubNav] = useState<ResourceSubNav>("module");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredModules = RESOURCE_MODULES.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex gap-0 h-full">
      {/* Sub-sidebar */}
      <div className="w-48 shrink-0 border-r border-border pr-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Data Entity</h3>
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Here"
            className="w-full h-8 pl-8 pr-3 rounded-md border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <nav className="space-y-0.5">
          {RESOURCE_SUB_NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setSubNav(item.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                subNav === item.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 pl-6 space-y-4">
        {subNav === "module" && (
          <>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Modules & Fields</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Business Data Entity</p>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search Here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-8 pr-3 rounded-md border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-2.5 text-[11px] text-primary uppercase tracking-wider font-medium">Module Name</th>
                    <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Entities</th>
                    <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Description</th>
                    <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Created On</th>
                    <th className="text-left px-4 py-2.5 text-[11px] text-primary uppercase tracking-wider font-medium">Created By</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredModules.map((m) => (
                    <tr key={m.name} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-medium">{m.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{m.entities}</td>
                      <td className="px-4 py-3 text-muted-foreground">{m.description}</td>
                      <td className="px-4 py-3 text-muted-foreground">{m.createdOn}</td>
                      <td className="px-4 py-3 text-muted-foreground flex items-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center uppercase">{m.createdBy[0]}</span>
                        {m.createdBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {subNav === "workflow" && <WorkflowSection />}
        {subNav === "roles" && <RolesSection />}
      </div>
    </div>
  );
};

const WorkflowSection = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowEntry | null>(null);

  return (
    <>
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Workflow</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Define and manage automated workflows for your application.</p>
      </div>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-2.5 text-[11px] text-primary uppercase tracking-wider font-medium">Workflow Name</th>
              <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Type</th>
              <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Module Name</th>
              <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Created On</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_WORKFLOWS.map((w) => (
              <tr
                key={w.name}
                onClick={() => setSelectedWorkflow(w)}
                className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3 font-medium text-primary">{w.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{w.type}</td>
                <td className="px-4 py-3 text-muted-foreground">{w.moduleName}</td>
                <td className="px-4 py-3 text-muted-foreground">{w.createdOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selectedWorkflow} onOpenChange={() => setSelectedWorkflow(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedWorkflow?.name}</DialogTitle>
            <DialogDescription>Workflow details and configuration</DialogDescription>
          </DialogHeader>
          {selectedWorkflow && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Type</p>
                  <p className="text-sm font-medium">{selectedWorkflow.type}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Module</p>
                  <p className="text-sm font-medium">{selectedWorkflow.moduleName}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Created On</p>
                  <p className="text-sm font-medium">{selectedWorkflow.createdOn}</p>
                </div>
              </div>
              <div className="border-t border-border pt-4 space-y-3">
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Trigger</p>
                  <p className="text-sm bg-muted/50 rounded-md px-3 py-2">{selectedWorkflow.trigger}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Target</p>
                  <p className="text-sm bg-muted/50 rounded-md px-3 py-2">{selectedWorkflow.target}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Configuration</p>
                  <p className="text-sm bg-muted/50 rounded-md px-3 py-2">{selectedWorkflow.configuration}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const RolesSection = () => {
  const [selectedRole, setSelectedRole] = useState<RoleEntry | null>(null);

  if (selectedRole) {
    return (
      <>
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setSelectedRole(null)} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">{selectedRole.name}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{selectedRole.description}</p>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-2.5 text-[11px] text-primary uppercase tracking-wider font-medium">Module</th>
                <th className="text-center px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Create</th>
                <th className="text-center px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Read</th>
                <th className="text-center px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Update</th>
                <th className="text-center px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Delete</th>
              </tr>
            </thead>
            <tbody>
              {selectedRole.permissions.map((p) => (
                <tr key={p.module} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{p.module}</td>
                  <td className="px-4 py-3 text-center">{p.create ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-destructive/50 mx-auto" />}</td>
                  <td className="px-4 py-3 text-center">{p.read ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-destructive/50 mx-auto" />}</td>
                  <td className="px-4 py-3 text-center">{p.update ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-destructive/50 mx-auto" />}</td>
                  <td className="px-4 py-3 text-center">{p.delete ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-destructive/50 mx-auto" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  return (
    <>
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Roles & Permissions</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Manage user roles and their access permissions.</p>
      </div>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-2.5 text-[11px] text-primary uppercase tracking-wider font-medium">Role Name</th>
              <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Description</th>
              <th className="text-left px-4 py-2.5 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Users</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_ROLES.map((r) => (
              <tr
                key={r.name}
                onClick={() => setSelectedRole(r)}
                className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3 font-medium text-primary flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary/70" />
                  {r.name}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{r.description}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.users}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

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

interface LocalhostEntry {
  url: string;
  emails: string[];
}

const ConfigurationTab = () => {
  const [openSection, setOpenSection] = useState<string | null>("localhost");

  // Localhost entries (saved)
  const [localhostEntries, setLocalhostEntries] = useState<LocalhostEntry[]>([]);

  // Form state for adding new localhost
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUrl, setNewUrl] = useState("https://localhost:3000");
  const [newEmailInput, setNewEmailInput] = useState("");
  const [newEmails, setNewEmails] = useState<string[]>([]);

  // Editing state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editEmailInput, setEditEmailInput] = useState("");

  // Trusted domains state
  const [trustedDomainInput, setTrustedDomainInput] = useState("");
  const [trustedDomains, setTrustedDomains] = useState<string[]>([]);
  const [trustedDomainError, setTrustedDomainError] = useState<string | null>(null);

  const toggleSection = (id: string) => setOpenSection(openSection === id ? null : id);

  // New localhost form handlers
  const handleAddNewEmail = () => {
    const trimmed = newEmailInput.trim();
    if (trimmed && trimmed.includes("@") && !newEmails.includes(trimmed)) {
      setNewEmails((prev) => [...prev, trimmed]);
      setNewEmailInput("");
    }
  };

  const handleSaveNewEntry = () => {
    if (newUrl.trim() && newEmails.length > 0) {
      setLocalhostEntries((prev) => [...prev, { url: newUrl.trim(), emails: newEmails }]);
      setNewUrl("https://localhost:3000");
      setNewEmails([]);
      setNewEmailInput("");
      setShowAddForm(false);
    }
  };

  const handleDeleteEntry = (index: number) => {
    setLocalhostEntries((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const handleAddEditEmail = (index: number) => {
    const trimmed = editEmailInput.trim();
    if (trimmed && trimmed.includes("@")) {
      setLocalhostEntries((prev) => prev.map((entry, i) =>
        i === index && !entry.emails.includes(trimmed)
          ? { ...entry, emails: [...entry.emails, trimmed] }
          : entry
      ));
      setEditEmailInput("");
    }
  };

  const handleRemoveEntryEmail = (entryIndex: number, email: string) => {
    setLocalhostEntries((prev) => prev.map((entry, i) =>
      i === entryIndex ? { ...entry, emails: entry.emails.filter((e) => e !== email) } : entry
    ));
  };

  // Trusted domain handlers
  const handleAddTrustedDomain = () => {
    const trimmed = trustedDomainInput.trim().toLowerCase();
    setTrustedDomainError(null);
    if (!trimmed) return;
    if (trimmed.includes("localhost") || trimmed.includes("127.0.0.1")) {
      setTrustedDomainError("Localhost domains are not allowed here. Use the Trusted Domain (Local Host) section instead.");
      return;
    }
    if (trustedDomains.includes(trimmed)) {
      setTrustedDomainError("This domain is already added.");
      return;
    }
    setTrustedDomains((prev) => [...prev, trimmed]);
    setTrustedDomainInput("");
  };

  const handleRemoveTrustedDomain = (domain: string) => {
    setTrustedDomains((prev) => prev.filter((d) => d !== domain));
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>Configuration</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Manage app-level settings and security.</p>
      </div>

      {/* Trusted Domain (Localhost) */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <button
          onClick={() => toggleSection("localhost")}
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full bg-primary" />
            <div>
              <h3 className="text-sm font-semibold">Trusted Domain (Local Host)</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Connect your local system for development. Only whitelisted emails can log in from each localhost domain.</p>
            </div>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openSection === "localhost" ? "rotate-180" : ""}`} />
        </button>
        {openSection === "localhost" && (
          <div className="px-5 pb-5 border-t border-border pt-4 space-y-4">

            {/* Saved localhost entries */}
            {localhostEntries.map((entry, idx) => (
              <div key={idx} className="rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-[11px] text-primary font-medium uppercase tracking-wider">Domain URL</label>
                    <p className="text-sm font-mono mt-0.5">{entry.url}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setEditingIndex(editingIndex === idx ? null : idx); setEditEmailInput(""); }}
                      className="text-xs text-primary font-medium hover:text-primary/80 transition-colors px-2 py-1 rounded hover:bg-muted/50"
                    >
                      {editingIndex === idx ? "Done" : "Edit"}
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(idx)}
                      className="p-1.5 hover:bg-muted rounded transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Whitelisted Emails</label>
                  <div className="mt-1.5 space-y-1.5">
                    {entry.emails.map((email) => (
                      <div key={email} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                        <span className="text-sm">{email}</span>
                        {editingIndex === idx && (
                          <button onClick={() => handleRemoveEntryEmail(idx, email)} className="p-1 hover:bg-muted rounded transition-colors">
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                          </button>
                        )}
                      </div>
                    ))}
                    {editingIndex === idx && (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          value={editEmailInput}
                          onChange={(e) => setEditEmailInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") handleAddEditEmail(idx); }}
                          placeholder="Add email address"
                          className="flex-1 h-9 px-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                        <button onClick={() => setEditEmailInput("")} className="h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                          <X className="h-3.5 w-3.5 text-destructive" />
                        </button>
                        <button onClick={() => handleAddEditEmail(idx)} className="h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                          <Check className="h-3.5 w-3.5 text-green-600" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Add new localhost form */}
            {showAddForm ? (
              <div className="rounded-lg border border-dashed border-primary/40 p-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] text-primary font-medium uppercase tracking-wider">Domain URL</label>
                  <p className="text-xs text-muted-foreground">Enter your localhost domain for development access.</p>
                  <input
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder="https://localhost:3000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Whitelisted Email Addresses</label>
                  <p className="text-xs text-muted-foreground">Only these email addresses can sign up or log in from this localhost domain.</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <input
                        value={newEmailInput}
                        onChange={(e) => setNewEmailInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleAddNewEmail(); }}
                        placeholder="Enter email"
                        className="flex-1 h-9 px-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                      <button onClick={() => setNewEmailInput("")} className="h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                        <X className="h-3.5 w-3.5 text-destructive" />
                      </button>
                      <button onClick={handleAddNewEmail} className="h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      </button>
                    </div>
                    {newEmails.map((email) => (
                      <div key={email} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                        <span className="text-sm">{email}</span>
                        <button onClick={() => setNewEmails((prev) => prev.filter((e) => e !== email))} className="p-1 hover:bg-muted rounded transition-colors">
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => { setShowAddForm(false); setNewUrl("https://localhost:3000"); setNewEmails([]); setNewEmailInput(""); }}
                    className="h-8 px-4 rounded-md border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNewEntry}
                    disabled={!newUrl.trim() || newEmails.length === 0}
                    className="h-8 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full h-10 rounded-lg border border-dashed border-border text-sm text-muted-foreground font-medium hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> Add Localhost Domain
              </button>
            )}
          </div>
        )}
      </div>

      {/* Trusted Domains */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <button
          onClick={() => toggleSection("trusted-domains")}
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors"
        >
          <div>
            <h3 className="text-sm font-semibold">Trusted Domains</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Add domains that are allowed to make authenticated requests to your backend.</p>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openSection === "trusted-domains" ? "rotate-180" : ""}`} />
        </button>
        {openSection === "trusted-domains" && (
          <div className="px-5 pb-5 border-t border-border pt-4 space-y-3">
            <div className="flex items-center gap-2">
              <input
                value={trustedDomainInput}
                onChange={(e) => { setTrustedDomainInput(e.target.value); setTrustedDomainError(null); }}
                onKeyDown={(e) => { if (e.key === "Enter") handleAddTrustedDomain(); }}
                placeholder="app.yourdomain.com"
                className="flex-1 h-9 px-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button
                onClick={handleAddTrustedDomain}
                className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Add Domain
              </button>
            </div>
            {trustedDomainError && (
              <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {trustedDomainError}</p>
            )}
            {trustedDomains.length > 0 && (
              <div className="rounded-lg border border-border overflow-hidden">
                {trustedDomains.map((domain, i) => (
                  <div key={domain} className={`flex items-center justify-between px-4 py-3 ${i < trustedDomains.length - 1 ? "border-b border-border" : ""}`}>
                    <span className="text-sm font-mono">{domain}</span>
                    <button onClick={() => handleRemoveTrustedDomain(domain)} className="p-1 hover:bg-muted rounded transition-colors">
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {trustedDomains.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">No trusted domains added yet.</p>
            )}
          </div>
        )}
      </div>
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
const PublishButton = ({ externalOpen, onExternalOpenChange, initialPublished = false }: { externalOpen?: boolean; onExternalOpenChange?: (v: boolean) => void; initialPublished?: boolean }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = (v: boolean) => { setInternalOpen(v); onExternalOpenChange?.(v); };
  const [isPublished, setIsPublished] = useState(initialPublished);
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
