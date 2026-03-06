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
import { OverviewTab, UsersTab, ResourcesTab, QueryConsoleTab, ConfigurationTab, DeploymentsTab, APP_USERS, DEPLOYMENTS, type AppUser } from "@/components/appos/AppOSTabs";

// ─── Types & Constants ───

interface ActionCard {
  type: "appos-promo" | "cloud-promo" | "appos-resources" | "cloud-resources" | "backend-choice";
  title: string;
  description: string;
  features: { icon: string; label: string }[];
  ctaLabel: string;
  dismissLabel: string;
  /** If true, show "Proceed & auto-approve" option */
  showAutoApprove?: boolean;
  /** Secondary CTA for backend-choice cards */
  secondaryCtaLabel?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  actionCard?: ActionCard;
  /** Compact collapsible step — shows as a small chip, expandable on click */
  stepSummary?: string;
}

const DEFAULT_PROMPT = "Create a Franchise Sales Management app to manage all the franchises across the globe with a rich UI and UX";

// Build steps are now compact — short summary shown, detail on expand
const ASSISTANT_STEPS: { delay: number; summary: string; content: string }[] = [
  { delay: 2000, summary: "Setting up project structure", content: "React + TypeScript stack with Tailwind CSS and clean component architecture." },
  { delay: 5000, summary: "Building core components", content: "FranchiseTable, SalesOverview KPIs, GlobalMap, and FranchiseDetail drawer." },
  { delay: 8000, summary: "Creating dashboard layout", content: "Sidebar navigation, top metrics bar, responsive grid with 24 franchise locations across 12 countries." },
];

type TopTab = "preview" | "code" | "appos" | "cloud";

// AppUser and APP_USERS imported from @/components/appos/AppOSTabs
// DEPLOYMENTS imported from @/components/appos/AppOSTabs

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
  const source = searchParams.get("source") || "build"; // "build" | "platform" | "cloud"
  const initialPrompt = searchParams.get("prompt") || DEFAULT_PROMPT;
  const projectName = searchParams.get("name") || "Franchise Sales App";
  const initialTab = searchParams.get("tab") as TopTab | null;

  // GitHub connect state (platform mode)
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubDialogOpen, setGithubDialogOpen] = useState(false);

  

  const [activeTab, setActiveTab] = useState<TopTab>(initialTab || (source === "build" ? "preview" : "appos"));

  // Chat state (only used in build mode)
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationDone, setGenerationDone] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [previewReloading, setPreviewReloading] = useState(false);

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
  const [appOsEnabled, setAppOsEnabled] = useState(source === "platform" || initialTab === "appos");
  const [appOsEnabling, setAppOsEnabling] = useState(false);

  // Cloud state
  const [cloudSection, setCloudSection] = useState("authentication");
  const [cloudEnabled, setCloudEnabled] = useState(initialTab === "cloud" || source === "cloud");
  const [cloudEnabling, setCloudEnabling] = useState(false);

  // Auto-approve state — when true, resource creation proceeds without asking
  const [autoApproveResources, setAutoApproveResources] = useState(false);
  const [backendPromptShown, setBackendPromptShown] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);

  // Determine available tabs — AppOS/Cloud shown only when enabled
  const availableTabs: TopTab[] = source === "build"
    ? ["preview", "code", ...(appOsEnabled ? ["appos" as TopTab] : []), ...(cloudEnabled ? ["cloud" as TopTab] : [])]
    : githubConnected
      ? ["preview", "code", ...(appOsEnabled ? ["appos" as TopTab] : []), ...(cloudEnabled ? ["cloud" as TopTab] : [])]
      : ["preview", ...(appOsEnabled ? ["appos" as TopTab] : []), ...(cloudEnabled ? ["cloud" as TopTab] : [])];

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

  const appOsPromoShownRef = useRef(false);
  const cloudPromoShownRef = useRef(false);

  const handleGenerationComplete = useCallback(() => {
    setIsGenerating((prev) => {
      if (!prev) return prev;
      setGenerationDone(true);
      setGenerationProgress(85);
      return false;
    });
  }, []);

  // After generation completes, smoothly increase progress while waiting for preview ready
  useEffect(() => {
    if (!generationDone || previewReady) return;
    const interval = setInterval(() => {
      setGenerationProgress((prev) => Math.min(prev + 2, 99));
    }, 300);
    return () => clearInterval(interval);
  }, [generationDone, previewReady]);

  // After generation completes, show success message then reveal preview
  useEffect(() => {
    if (!generationDone || previewReady) return;

    // Show success message
    const successTimer = setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: `frontend-ready-${Date.now()}`,
        role: "assistant",
        content: `Your **frontend app is ready** 🎉\n\nLoading your preview now...`,
        timestamp: new Date(),
      }]);
    }, 500);

    // Then reveal the preview
    const previewTimer = setTimeout(() => {
      setGenerationProgress(100);
      setPreviewReady(true);
    }, 3000);

    return () => {
      clearTimeout(successTimer);
      clearTimeout(previewTimer);
    };
  }, [generationDone, previewReady]);

  // Build mode: seed initial prompt
  useEffect(() => {
    if (source !== "build" || hasSeededBuildRef.current) return;

    hasSeededBuildRef.current = true;
    const userMsg: Message = { id: "1", role: "user", content: initialPrompt, timestamp: new Date() };
    const firstAssistant: Message = { id: "2", role: "assistant", content: `On it! Building your app now...`, timestamp: new Date() };

    setMessages([userMsg, firstAssistant]);
    setGenerationDone(false);
    setIsGenerating(true);
    setActiveTab("preview");

    const timers = ASSISTANT_STEPS.map((step, i) =>
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          id: `step-${i}`,
          role: "assistant" as const,
          content: step.content,
          timestamp: new Date(),
          stepSummary: step.summary || undefined,
        }]);
      }, step.delay)
    );

    return () => timers.forEach(clearTimeout);
  }, [source, initialPrompt]);

  // Progress is now driven by GenerationProgress onProgress callback
  const handleGenerationProgress = useCallback((percent: number) => {
    setGenerationProgress(percent);
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim()) return;
    const trimmed = input.trim();
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", content: trimmed, timestamp: new Date() }]);
    setInput("");

    const lower = trimmed.toLowerCase();

    // Handle "enable appos" / "enable cloud" via chat
    if (lower === "enable appos" || lower === "enable appOS" || lower.includes("enable appos")) {
      if (appOsEnabled) {
        setTimeout(() => {
          setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "**AppOS** is already enabled for this app.", timestamp: new Date() }]);
        }, 800);
      } else {
        handleEnableService("appos", true);
      }
      return;
    }
    if (lower === "enable cloud" || lower.includes("enable cloud")) {
      if (cloudEnabled) {
        setTimeout(() => {
          setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "**Cloud** is already enabled for this app.", timestamp: new Date() }]);
        }, 800);
      } else {
        handleEnableService("cloud", true);
      }
      return;
    }

    // Handle "disable appos" / "disable cloud" via chat
    if (lower.includes("disable appos")) {
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "⚠️ **AppOS** once enabled cannot be disabled.", timestamp: new Date() }]);
      }, 800);
      return;
    }
    if (lower.includes("disable cloud")) {
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "⚠️ **Cloud** once enabled cannot be disabled.", timestamp: new Date() }]);
      }, 800);
      return;
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Got it! I'm working on that change now. You'll see the preview update shortly.", timestamp: new Date() }]);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleActionCardClick = (type: ActionCard["type"], action: "enable" | "dismiss" | "auto-approve" | "secondary") => {
    // Remove the action card from the message
    setMessages((prev) => prev.map((msg) =>
      msg.actionCard?.type === type ? { ...msg, actionCard: undefined } : msg
    ));

    if (action === "dismiss") {
      const dismissTexts: Record<string, string> = {
        "backend-choice": "No problem! You can enable **AppOS** or **Cloud** anytime from their respective tabs.",
        "appos-promo": "No problem! You can always enable **AppOS** later from the AppOS tab whenever you're ready.",
        "cloud-promo": "Sure thing! **Cloud** is available anytime you need it from the Cloud tab.",
        "appos-resources": "Okay, skipping resource creation for now. You can set these up manually from the **Resources** tab in AppOS.",
        "cloud-resources": "No worries! You can create Cloud resources anytime from the **Cloud** tab.",
      };
      setMessages((prev) => [...prev, {
        id: `dismiss-${type}-${Date.now()}`,
        role: "assistant",
        content: dismissTexts[type] || "Got it!",
        timestamp: new Date(),
      }]);
      if (type === "appos-resources" && !cloudPromoShownRef.current) {
        promptCloudAfterAppOS();
      }
      return;
    }

    if (action === "auto-approve") {
      setAutoApproveResources(true);
    }

    // Route to the right handler
    if (type === "backend-choice") {
      if (action === "secondary") {
        // User chose Cloud (independent app)
        handleEnableService("cloud");
      } else {
        // User chose AppOS (Zoho SSO)
        handleEnableService("appos");
      }
    } else if (type === "appos-promo") {
      handleEnableService("appos");
    } else if (type === "cloud-promo") {
      handleEnableService("cloud");
    } else if (type === "appos-resources") {
      simulateResourceCreation("appos");
    } else if (type === "cloud-resources") {
      simulateResourceCreation("cloud");
    }
  };

  const promptCloudAfterAppOS = () => {
    cloudPromoShownRef.current = true;
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: `cloud-promo-${Date.now()}`,
        role: "assistant",
        content: `Your app has features like **logo uploads** and **file attachments** — these need file storage. **Cloud** gives you managed object storage buckets, plus authentication and serverless functions.`,
        timestamp: new Date(),
        actionCard: {
          type: "cloud-promo",
          title: "Enable Cloud",
          description: "Object storage for files, managed auth, and serverless functions",
          features: [
            { icon: "hard-drive", label: "Object Storage" },
            { icon: "lock", label: "Authentication" },
            { icon: "database", label: "Database" },
            { icon: "code", label: "Functions" },
          ],
          ctaLabel: "Enable Cloud",
          dismissLabel: "Not now",
        },
      }]);
    }, 2500);
  };

  const simulateResourceCreation = (service: "appos" | "cloud") => {
    const isAppOS = service === "appos";
    const steps = isAppOS
      ? [
          { delay: 600, summary: "Creating Franchise module & fields" },
          { delay: 1800, summary: "Creating Sales module & fields" },
          { delay: 3000, summary: "Setting up user roles — Admin, Manager, Viewer" },
          { delay: 4200, summary: "Configuring workflows — approval chains" },
          { delay: 5200, summary: "Provisioning Users & permissions" },
        ]
      : [
          { delay: 600, summary: "Creating storage bucket — franchise-assets" },
          { delay: 1800, summary: "Setting up authentication providers" },
          { delay: 3000, summary: "Provisioning relational database schema" },
          { delay: 4000, summary: "Deploying serverless functions" },
        ];

    steps.forEach((step) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          id: `resource-${service}-${step.delay}-${Date.now()}`,
          role: "assistant",
          content: step.summary,
          timestamp: new Date(),
          stepSummary: step.summary,
        }]);
      }, step.delay);
    });

    // Final done message
    const totalDelay = steps[steps.length - 1].delay + 1200;
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: `resource-${service}-done-${Date.now()}`,
        role: "assistant",
        content: isAppOS
          ? `✅ **AppOS resources are ready!** Modules, fields, roles, workflows, and users have been configured. Check the **AppOS** tab to explore.`
          : `✅ **Cloud resources are ready!** Storage, auth, database, and functions are all provisioned.`,
        timestamp: new Date(),
      }]);

      // After Cloud resources, show the "fully functional" celebration
      if (!isAppOS) {
        setTimeout(() => {
          setMessages((prev) => [...prev, {
            id: `fully-functional-${Date.now()}`,
            role: "assistant",
            content: `🚀 **Your app is now fully functional!** The frontend UI and the entire backend — data persistence, user authentication, file storage, and business logic — are all wired up and ready to go.\n\nReloading preview with backend connected...`,
            timestamp: new Date(),
          }]);

          // Trigger preview reload effect
          setActiveTab("preview");
          setPreviewReloading(true);
          setTimeout(() => setPreviewReloading(false), 2000);
        }, 1500);
      }

      // After AppOS resources, prompt Cloud
      if (isAppOS && !cloudPromoShownRef.current) {
        promptCloudAfterAppOS();
      }
    }, totalDelay);
  };

  const handleEnableService = (service: "appos" | "cloud", skipUserMessage = false) => {
    const label = service === "appos" ? "AppOS" : "Cloud";
    const setEnabling = service === "appos" ? setAppOsEnabling : setCloudEnabling;
    const setEnabled = service === "appos" ? setAppOsEnabled : setCloudEnabled;

    setEnabling(true);

    // If chat panel is not visible, enable directly after a brief delay
    const chatVisible = source === "build" || (source === "platform" && githubConnected);
    if (!chatVisible) {
      setTimeout(() => { setEnabling(false); setEnabled(true); }, 1500);
      return;
    }

    // Build mode: simulate chat conversation
    if (!skipUserMessage) {
      setMessages((prev) => [...prev, {
        id: `enable-${service}-user-${Date.now()}`,
        role: "user",
        content: `Enable ${label}`,
        timestamp: new Date(),
      }]);
    }
    if (chatPanelCollapsed) setChatPanelCollapsed(false);

    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: `enable-${service}-ack-${Date.now()}`,
        role: "assistant",
        content: `Setting up **${label}**...`,
        timestamp: new Date(),
        stepSummary: `Enabling ${label}`,
      }]);
    }, 800);

    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: `enable-${service}-done-${Date.now()}`,
        role: "assistant",
        content: `✅ **${label} is enabled!**`,
        timestamp: new Date(),
      }]);
      setEnabling(false);
      setEnabled(true);

      // Now prompt for resource creation
      if (autoApproveResources) {
        // Auto-approved: skip the prompt, go straight to creation
        setTimeout(() => {
          setMessages((prev) => [...prev, {
            id: `auto-resource-${service}-${Date.now()}`,
            role: "assistant",
            content: service === "appos"
              ? `Auto-creating **AppOS** backend resources for your app...`
              : `Auto-creating **Cloud** resources for your app...`,
            timestamp: new Date(),
          }]);
          simulateResourceCreation(service);
        }, 1000);
      } else {
        // Ask the user if they want to create resources
        setTimeout(() => {
          const resourceCard: ActionCard = service === "appos"
            ? {
                type: "appos-resources",
                title: "Create AppOS Resources",
                description: "Auto-generate backend modules, fields, workflows, users & roles based on your app",
                features: [
                  { icon: "boxes", label: "Modules & Fields" },
                  { icon: "workflow", label: "Workflows" },
                  { icon: "users", label: "Users" },
                  { icon: "shield", label: "Roles & Permissions" },
                ],
                ctaLabel: "Proceed",
                dismissLabel: "Skip",
                showAutoApprove: true,
              }
            : {
                type: "cloud-resources",
                title: "Create Cloud Resources",
                description: "Set up storage buckets for franchise logos & docs, auth providers, and database schema",
                features: [
                  { icon: "hard-drive", label: "Storage Buckets" },
                  { icon: "lock", label: "Auth Providers" },
                  { icon: "database", label: "DB Schema" },
                  { icon: "code", label: "Functions" },
                ],
                ctaLabel: "Proceed",
                dismissLabel: "Skip",
                showAutoApprove: true,
              };

          setMessages((prev) => [...prev, {
            id: `resource-prompt-${service}-${Date.now()}`,
            role: "assistant",
            content: service === "appos"
              ? `Would you like me to automatically create the backend resources for your app? I'll set up modules, fields, workflows, and role-based access.`
              : `Would you like me to create the Cloud resources? I'll set up storage buckets for your files, configure authentication, and provision the database.`,
            timestamp: new Date(),
            actionCard: resourceCard,
          }]);
        }, 1500);
      }
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
        <button onClick={() => navigate("/om")} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
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

  // ─── Action Card Icon Helper ───
  const getActionCardIcon = (icon: string) => {
    switch (icon) {
      case "users": return <Users className="h-4 w-4" />;
      case "shield": return <Shield className="h-4 w-4" />;
      case "workflow": return <Boxes className="h-4 w-4" />;
      case "boxes": return <LayoutDashboard className="h-4 w-4" />;
      case "database": return <Server className="h-4 w-4" />;
      case "lock": return <Lock className="h-4 w-4" />;
      case "hard-drive": return <FolderTree className="h-4 w-4" />;
      case "code": return <Code className="h-4 w-4" />;
      case "server": return <Server className="h-4 w-4" />;
      case "cloud": return <Cloud className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getCardHeaderIcon = (type: ActionCard["type"]) => {
    switch (type) {
      case "appos-promo":
      case "appos-resources":
        return <Server className="h-3 w-3 text-primary" />;
      case "cloud-promo":
      case "cloud-resources":
        return <Cloud className="h-3 w-3 text-primary" />;
      case "backend-choice":
        return <Zap className="h-3 w-3 text-primary" />;
      default:
        return <Zap className="h-3 w-3 text-primary" />;
    }
  };

  // ─── Chat Panel (build mode only) ───
  const ChatPanel = () => {
    const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

    const toggleStep = (id: string) => {
      setExpandedSteps((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    };

    return (
      <div className="flex flex-col h-full border-r border-border">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id}>
                {/* Collapsible step chip */}
                {msg.stepSummary ? (
                  <div className="flex justify-start">
                    <button
                      onClick={() => toggleStep(msg.id)}
                      className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/60 hover:bg-muted transition-colors text-xs text-muted-foreground cursor-pointer"
                    >
                      <Check className="h-3 w-3 text-primary" />
                      <span className="font-medium">{msg.stepSummary}</span>
                      <ChevronRight className={`h-3 w-3 transition-transform ${expandedSteps.has(msg.id) ? "rotate-90" : ""}`} />
                    </button>
                  </div>
                ) : (
                  /* Regular message bubble */
                  <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}>
                      {msg.content.split("\n").map((line, i) => (
                        <p key={i} className={i > 0 ? "mt-1.5" : ""}>
                          {line.split("**").map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expanded step detail */}
                {msg.stepSummary && expandedSteps.has(msg.id) && (
                  <div className="flex justify-start mt-1.5 ml-5">
                    <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2 border-l-2 border-primary/20">
                      {msg.content}
                    </div>
                  </div>
                )}

                {/* Action Card */}
                {msg.actionCard && (
                  <div className="flex justify-start mt-3">
                    <div className="max-w-[92%] w-full">
                      <div className="rounded-xl border border-primary/20 bg-primary/[0.04] overflow-hidden">
                        {/* Card header */}
                        <div className="px-4 pt-3.5 pb-2.5">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                              {getCardHeaderIcon(msg.actionCard.type)}
                            </div>
                            <span className="text-[13px] font-semibold text-foreground">{msg.actionCard.title}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground ml-8">{msg.actionCard.description}</p>
                        </div>

                        {/* Feature descriptions — non-interactive info rows */}
                        <div className="px-4 pb-3 space-y-1.5">
                          {msg.actionCard.features.map((feat) => (
                            <div key={feat.label} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                              <span className="mt-0.5 text-muted-foreground/50 shrink-0">{getActionCardIcon(feat.icon)}</span>
                              <span>{feat.label}</span>
                            </div>
                          ))}
                        </div>

                        {/* Action buttons */}
                        <div className="px-4 pb-3.5 flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleActionCardClick(msg.actionCard!.type, "enable")}
                            className="h-8 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-sm"
                          >
                            <Zap className="h-3 w-3" />
                            {msg.actionCard.ctaLabel}
                          </button>
                          {msg.actionCard.secondaryCtaLabel && (
                            <button
                              onClick={() => handleActionCardClick(msg.actionCard!.type, "secondary")}
                              className="h-8 px-4 rounded-lg bg-muted text-foreground text-xs font-medium hover:bg-muted/80 transition-colors flex items-center gap-1.5 border border-border"
                            >
                              <Cloud className="h-3 w-3" />
                              {msg.actionCard.secondaryCtaLabel}
                            </button>
                          )}
                          {msg.actionCard.showAutoApprove && (
                            <button
                              onClick={() => handleActionCardClick(msg.actionCard!.type, "auto-approve")}
                              className="h-8 px-3 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors flex items-center gap-1.5 border border-primary/20"
                            >
                              <Check className="h-3 w-3" />
                              Proceed & auto-approve future
                            </button>
                          )}
                          <button
                            onClick={() => handleActionCardClick(msg.actionCard!.type, "dismiss")}
                            className="h-8 px-3 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                          >
                            {msg.actionCard.dismissLabel}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-xl px-4 py-2.5 bg-muted text-foreground">
                  <GenerationProgress onComplete={handleGenerationComplete} onProgress={handleGenerationProgress} />
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
              placeholder="Ask me anything about your app..."
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
  };

  // ─── Preview Content ───
  const PreviewContent = () => (
    <div className="flex-1 overflow-hidden">
      {source === "platform" ? (
        <GeneratedPreview appName={projectName} />
      ) : previewReady && previewReloading ? (
        <div className="h-full bg-background flex flex-col items-center justify-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Reconnecting with backend...</p>
        </div>
      ) : previewReady ? (
        <GeneratedPreview />
      ) : (isGenerating || generationDone) ? (
        <PreviewLoading progress={Math.min(Math.round(generationProgress), 99)} phase={backendPromptShown ? "loading" : "generating"} />
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

      <SettingsOverlay open={settingsOpen} onClose={() => { setSettingsOpen(false); setSettingsInitialTab(undefined); }} initialTab={settingsInitialTab} appOsEnabled={appOsEnabled} onAppOsToggle={setAppOsEnabled} cloudEnabled={cloudEnabled} onCloudToggle={setCloudEnabled} appName={projectName} />
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

// AppOS Sub-tabs imported from @/components/appos/AppOSTabs

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
