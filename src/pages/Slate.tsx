import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, Search, Clock, Grid3X3, Users, Plus, ArrowRight, Settings, UserPlus, Globe, Check, LogOut, User, Code2, GitBranch, ChevronUp, ChevronDown, Copy, Rocket, Bell, AppWindow, Layers, X, Database, Paperclip, Plug, Server, FileText, Trash2, PanelLeftClose, PanelLeftOpen, ExternalLink, Pencil,
} from "lucide-react";
import slateLogo from "@/assets/slate-logo.svg";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import SettingsOverlay from "@/components/SettingsOverlay";

const defaultRecentProjects = [
  { name: "CRM Analytics Dashboard", source: "build" },
  { name: "Invoice Manager Pro", source: "build" },
  { name: "Employee Portal", source: "platform" },
  { name: "Feedback Tracker", source: "platform" },
];

const projectCards = [
  {
    title: "CRM Analytics Dashboard",
    description: "Track leads, deals and pipeline metrics in real-time",
    color: "from-primary/20 to-accent/20",
  },
  {
    title: "Invoice Manager Pro",
    description: "Generate and manage invoices for freelancers and SMBs",
    color: "from-accent/20 to-primary/20",
  },
  {
    title: "Employee Portal",
    description: "Onboarding checklists, leave management and HR tools",
    color: "from-primary/10 to-secondary",
  },
];

const devApps = [
  {
    name: "catalyst-app-forge",
    stack: "React + Vite",
    source: "GitHub",
    initial: "C",
    deployments: [
      { label: "initial", branch: "main", commitId: "4a835e1", deployedOn: "Dec 29, 2025 11:02 AM", url: "catalyst-appos.onslate.in" },
    ],
  },
  {
    name: "franchise-sales-mgmt",
    stack: "React + Vite",
    source: "GitHub",
    initial: "F",
    deployments: [
      { label: "v2.1-release", branch: "main", commitId: "b92fa03", deployedOn: "Feb 14, 2026 3:45 PM", url: "franchise-app.onslate.com" },
      { label: "staging-hotfix", branch: "develop", commitId: "e1c74d8", deployedOn: "Feb 10, 2026 9:20 AM", url: "franchise-staging.onslate.com" },
    ],
  },
  {
    name: "crm-analytics-dashboard",
    stack: "React + Vite",
    source: "GitHub",
    initial: "A",
    deployments: [
      { label: "production", branch: "main", commitId: "7df21a9", deployedOn: "Jan 18, 2026 1:30 PM", url: "crm-analytics.onslate.com" },
    ],
  },
];

type DevApp = typeof devApps[number];

const DevAppCard = ({ app, defaultOpen = false }: { app: DevApp; defaultOpen?: boolean }) => {
  const [expanded, setExpanded] = useState(defaultOpen);

  return (
    <div className={`rounded-xl border bg-card overflow-hidden transition-colors ${expanded ? 'border-primary/30' : 'border-border'}`}>
      {/* App header */}
      <div className="flex items-center gap-4 px-6 py-4">
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary font-bold text-sm shrink-0">
            {app.initial}
          </div>
          {/* Vertical connector line */}
          {expanded && app.deployments.length > 0 && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-primary/20" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{app.name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="uppercase tracking-wide font-medium">GIT</span>
            <span className="text-muted-foreground/40">•</span>
            <Code2 className="h-3 w-3" />
            {app.stack}
            <span className="text-muted-foreground/40">•</span>
            {app.source}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
            <Settings className="h-4 w-4" />
            App Settings
          </button>
          <button className="h-9 px-5 rounded-lg border border-input text-sm font-medium text-foreground hover:bg-muted transition-colors">
            Create Deployment
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Deployments - accordion content */}
      {expanded && (
        <div className="px-6 pb-5">
          {app.deployments.map((dep, i) => (
            <div key={i} className="relative flex items-center gap-0 ml-5">
              {/* Vertical + horizontal connector */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/20" style={{ height: i < app.deployments.length - 1 ? '100%' : '50%' }} />
              <div className="absolute left-0 top-1/2 w-5 h-0.5 bg-primary/20" />

              <div className="ml-7 flex items-center gap-0 flex-1 py-3">
                {/* Branch icon */}
                <div className="h-9 w-9 rounded-full border-2 border-primary/20 flex items-center justify-center shrink-0 bg-card">
                  <GitBranch className="h-4 w-4 text-primary/50" />
                </div>

                {/* Deployment info row */}
                <div className="flex items-center flex-1 ml-4 gap-8">
                  <div className="min-w-[130px]">
                    <p className="text-sm font-semibold text-foreground">{dep.label}</p>
                    <p className="text-xs text-muted-foreground">Branch : {dep.branch}</p>
                  </div>
                  <div className="min-w-[100px]">
                    <p className="text-[11px] text-muted-foreground">Commit ID</p>
                    <p className="text-sm font-mono font-semibold text-foreground">{dep.commitId}</p>
                  </div>
                  <div className="min-w-[170px]">
                    <p className="text-[11px] text-muted-foreground">Last Deployed On</p>
                    <p className="text-sm text-foreground">{dep.deployedOn}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground shrink-0">Invocation URL&nbsp;&nbsp;:</p>
                    <div className="flex-1 flex items-center gap-2 rounded-lg border border-input bg-muted/30 px-3 py-2">
                      <span className="text-sm text-foreground truncate flex-1">{dep.url}</span>
                      <button className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const quickStarters = [
  {
    id: "website",
    title: "Website",
    description: "Marketing or content site",
    icon: Globe,
    prompt: "Build a modern responsive website for [your business or product].\nIt should include sections like hero, features, pricing, and contact.\nUse a clean and modern visual style.",
    pill: "Website",
  },
  {
    id: "frontend",
    title: "Frontend App",
    description: "Interactive product UI",
    icon: AppWindow,
    prompt: "Create an interactive frontend app for [your use case or product idea].\nInclude the main screens needed and design it with a modern, intuitive UI.",
    pill: "Frontend App",
  },
  {
    id: "crm-customisation",
    title: "CRM Customisation",
    description: "Extend your Zoho CRM",
    icon: Database,
    prompt: "Customize Zoho CRM to support [your business workflow].\nUpdate the relevant modules and add any required fields or automations.",
    pill: "CRM Customization",
  },
  {
    id: "crm-fullstack",
    title: "CRM Backend + Frontend",
    description: "Full-stack CRM experience",
    icon: Layers,
    prompt: "Build a full-stack CRM solution for [your business use case].\nSet up the required backend capabilities and create a clean frontend interface for users.",
    pill: "Custom Frontend + CRM Backend",
  },
];

const ideOptions = [
  { key: 'cursor', name: 'Cursor', logo: '/ide-logos/cursor.png' },
  { key: 'antigravity', name: 'Antigravity', logo: '/ide-logos/antigravity.png' },
  { key: 'vscode', name: 'VS Code', logo: '/ide-logos/vscode.png' },
  { key: 'windsurf', name: 'Windsurf', logo: '/ide-logos/windsurf.png' },
  { key: 'claude-code', name: 'Claude Code', logo: '/ide-logos/claude-code.png' },
  { key: 'custom', name: 'Others', logo: null },
];

const FULLSCREEN_PHASES = new Set(['ready', 'building', 'deploy-ready', 'deploying', 'live']);

const PlatformIDESelector = ({ onPhaseChange, onCreateUntitled, onRenameProject }: { onPhaseChange?: (phase: string) => void; onCreateUntitled?: () => void; onRenameProject?: (newName: string) => void }) => {
  const navigate = useNavigate();
  const [selectedIDE, setSelectedIDE] = useState<string | null>(null);
  const [connectionPhase, setConnectionPhase] = useState<'idle' | 'copied' | 'waiting' | 'connected' | 'ready' | 'building' | 'deploy-ready' | 'deploying' | 'live'>('idle');
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [showNudge, setShowNudge] = useState(false);
  const [buildStep, setBuildStep] = useState(0);
  const [deployStep, setDeployStep] = useState(0);
  const [deployCopied, setDeployCopied] = useState(false);
  const [appName, setAppName] = useState('Real Estate CRM');
  const [editingAppName, setEditingAppName] = useState(false);
  const [tempAppName, setTempAppName] = useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Notify parent of phase changes
  React.useEffect(() => {
    onPhaseChange?.(connectionPhase);
  }, [connectionPhase, onPhaseChange]);

  const selected = ideOptions.find(ide => ide.key === selectedIDE);

  const startConnectionFlow = () => {
    setConnectionPhase('waiting');
    setTimeout(() => {
      setConnectionPhase('connected');
      setTimeout(() => {
        setConnectionPhase('ready');
        setTimeout(() => {
          containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }, 1200);
    }, 4000);
  };

  const handleInstallClick = () => {
    onCreateUntitled?.();
    startConnectionFlow();
  };

  const handleCopyAndConnect = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    onCreateUntitled?.();
    setConnectionPhase('copied');
    setTimeout(() => startConnectionFlow(), 1500);
  };

  const handleCardClick = (key: string) => {
    if (selectedIDE === key) {
      setSelectedIDE(null);
      setConnectionPhase('idle');
    } else {
      setSelectedIDE(key);
      setConnectionPhase('idle');
    }
  };

  const startBuildFlow = () => {
    setConnectionPhase('building');
    setBuildStep(0);
    setTimeout(() => setBuildStep(1), 1200);
    setTimeout(() => setBuildStep(2), 2800);
    setTimeout(() => {
      setBuildStep(3);
      // After provisioning completes, transition to deploy-ready
      setTimeout(() => setConnectionPhase('deploy-ready'), 1500);
    }, 5000);
  };

  const startDeployFlow = () => {
    setConnectionPhase('deploying');
    setDeployStep(0);
    setTimeout(() => setDeployStep(1), 1000);
    setTimeout(() => setDeployStep(2), 2200);
    setTimeout(() => {
      setDeployStep(3);
      setTimeout(() => {
        setConnectionPhase('live');
        onRenameProject?.(appName);
      }, 1500);
    }, 4000);
  };

  const handleCopyDeployPrompt = () => {
    navigator.clipboard.writeText('Deploy my app to Om');
    setDeployCopied(true);
    setTimeout(() => startDeployFlow(), 3000);
  };

  const handleCopyPrompt = (prompt: string, title: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(prompt);
    setAppName(title);
    setShowNudge(false);
    setTimeout(() => setShowNudge(true), 4000);
    setTimeout(() => startBuildFlow(), 8000);
  };

  const ideName = selected?.name || 'your IDE';

  const buildChecklist = [
    'App detected',
    'Backend selected',
    'Provisioning resources',
  ];

  // Building screen — staged progress
  if (connectionPhase === 'building') {
    return (
      <div ref={containerRef} className="flex flex-col items-center gap-10 w-full max-w-md animate-in fade-in duration-500">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Building your app…
          </h2>
          <p className="text-sm text-muted-foreground">
            Om is provisioning backend resources.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          {buildChecklist.map((item, i) => {
            const done = buildStep > i;
            const active = buildStep === i;
            return (
              <div
                key={item}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-500 ${
                  done
                    ? 'border-green-500/20 bg-green-500/5'
                    : active
                    ? 'border-foreground/15 bg-muted/40'
                    : 'border-border bg-card opacity-50'
                } ${i <= buildStep ? 'animate-in fade-in slide-in-from-bottom-1 duration-300' : ''}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {done ? (
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                ) : active ? (
                  <div className="h-4 w-4 shrink-0 rounded-full border-2 border-foreground/30 border-t-foreground animate-spin" />
                ) : (
                  <div className="h-4 w-4 shrink-0 rounded-full border-2 border-border" />
                )}
                <span className={`text-sm font-medium ${done ? 'text-foreground' : active ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Deploy ready screen
  if (connectionPhase === 'deploy-ready') {
    return (
      <div ref={containerRef} className="flex flex-col items-center gap-6 w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-center gap-2.5 animate-in fade-in duration-700">
          <div className="h-5 w-5 rounded-full bg-green-500/15 flex items-center justify-center">
            <Check className="h-3 w-3 text-green-500" />
          </div>
          <span className="text-xs font-medium text-green-600">Build complete</span>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Your app is ready to deploy
          </h2>
          <p className="text-sm text-muted-foreground">
            Deploy to get your live app URL.
          </p>
        </div>

        <div
          className="w-full flex items-center justify-between gap-4 px-5 py-4 rounded-xl border border-border bg-card animate-in fade-in slide-in-from-bottom-3 duration-500"
          style={{ animationDelay: '150ms', animationFillMode: 'both' }}
        >
          <code className="text-sm text-muted-foreground font-mono">Deploy my app to Om</code>
          <button
            onClick={handleCopyDeployPrompt}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              deployCopied
                ? 'text-green-600 bg-green-500/10 border border-green-500/25'
                : 'text-foreground bg-muted hover:bg-muted/80 border border-border'
            }`}
          >
            {deployCopied ? (
              <><Check className="h-3 w-3" /> Copied</>
            ) : (
              <><Copy className="h-3 w-3" /> Copy prompt</>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Deploying screen
  if (connectionPhase === 'deploying') {
    return (
      <div ref={containerRef} className="flex flex-col items-center gap-8 w-full max-w-md animate-in fade-in duration-500">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-muted" />
          <div className="absolute inset-0 rounded-full border-2 border-t-foreground animate-spin" style={{ animationDuration: '1.2s' }} />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Deploying your app…
          </h2>
          <p className="text-sm text-muted-foreground animate-in fade-in duration-700" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
            This will only take a moment.
          </p>
        </div>
      </div>
    );
  }

  // Live / success screen
  if (connectionPhase === 'live') {
    return (
      <div ref={containerRef} className="flex flex-col items-center gap-8 w-full max-w-md animate-in fade-in duration-500">
        <div className="text-center space-y-3">
          <div className="mx-auto h-14 w-14 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mb-4">
            <Check className="h-7 w-7 text-green-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Your app is live
          </h2>
        </div>

        <div className="w-full rounded-xl border border-border bg-card p-5 space-y-4">
          {/* App Name */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">App Name</p>
            {editingAppName ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={tempAppName}
                  onChange={(e) => setTempAppName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { setAppName(tempAppName); setEditingAppName(false); }
                    if (e.key === 'Escape') setEditingAppName(false);
                  }}
                  className="flex-1 text-sm text-foreground bg-background border border-input rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-ring"
                />
                <button
                  onClick={() => { setAppName(tempAppName); setEditingAppName(false); }}
                  className="px-3 py-2 text-xs font-medium rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingAppName(false)}
                  className="px-3 py-2 text-xs font-medium rounded-lg border border-border text-foreground hover:bg-muted/50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div
                onDoubleClick={() => { setTempAppName(appName); setEditingAppName(true); }}
                className="flex items-center gap-2 rounded-lg border border-input bg-muted/30 px-3 py-2 cursor-pointer group"
                title="Double-click to edit"
              >
                <span className="text-sm font-medium text-foreground flex-1">{appName}</span>
                <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </div>

          {/* App URL */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">App URL</p>
            <div className="flex items-center gap-2 rounded-lg border border-input bg-muted/30 px-3 py-2">
              <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-sm text-foreground flex-1">real-estate.us.omcloud.ai</span>
              <button
                onClick={() => navigator.clipboard.writeText('https://real-estate.us.omcloud.ai')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <a
              href="https://real-estate.us.omcloud.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              Open App
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button
              onClick={() => navigate(`/project?source=platform&name=${encodeURIComponent(appName)}`)}
              className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
            >
              View Project
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Ready screen — connected and showing prompts
  if (connectionPhase === 'ready') {
    return (
      <div ref={containerRef} className="flex flex-col items-center gap-8 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Connected header */}
        <div className="text-center space-y-3">
          <div className="mx-auto h-14 w-14 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mb-4">
            <Check className="h-7 w-7 text-green-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            You're connected. Let's build something.
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Build directly from your AI IDE. Om will provision the backend automatically.
          </p>
        </div>

        {/* Prompt example cards */}
        <div className="flex flex-col gap-2.5 w-full">
          {[
            { title: "Real Estate CRM", subtitle: "Complete property sales system", prompt: "Build a Real Estate CRM with property listings, lead tracking, and deal pipeline" },
            { title: "Franchise Sales App", subtitle: "Manage franchise pipeline and approvals", prompt: "Build a Franchise Sales App to manage franchise pipeline and approvals" },
            { title: "Cloud API Backend", subtitle: "Database, storage, and REST APIs", prompt: "Generate a Cloud API Backend with database, storage, and REST APIs" },
          ].map((card) => {
            const isCopied = copiedPrompt === card.prompt;
            return (
              <div
                key={card.title}
                role="button"
                tabIndex={0}
                onClick={() => handleCopyPrompt(card.prompt, card.title)}
                onKeyDown={(e) => e.key === 'Enter' && handleCopyPrompt(card.prompt, card.title)}
                className="group flex items-center justify-between gap-4 px-5 py-4 rounded-xl border border-border bg-card hover:border-foreground/20 hover:bg-muted/50 hover:shadow-md transition-colors duration-200 cursor-pointer text-left w-full select-none"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-semibold text-foreground">{card.title}</span>
                  <span className="text-xs text-muted-foreground">{card.subtitle}</span>
                </div>
                <span
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors duration-150 ${
                    isCopied
                      ? 'text-green-500 border-green-500/20 bg-green-500/5'
                      : 'text-foreground/60 border-transparent group-hover:border-border group-hover:bg-muted/60 group-hover:text-foreground'
                  }`}
                >
                  {isCopied ? (
                    <><Check className="h-3 w-3" /> Copied</>
                  ) : (
                    <><Copy className="h-3 w-3" /> Copy Prompt</>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* Helper text — always reserve space, transitions between hint and nudge */}
        <div className={`text-center transition-opacity duration-300 min-h-[40px] flex items-center justify-center ${copiedPrompt ? 'opacity-100' : 'opacity-0'}`}>
          {showNudge ? (
            <p className="text-sm text-muted-foreground animate-in fade-in duration-500">
              <span className="font-semibold text-foreground">Still waiting?</span>
              <br />
              Make sure you've pasted the prompt into your IDE.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Paste the prompt into your IDE to start.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-8 w-full max-w-3xl">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Connect Om Platform to your AI IDE
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Choose the development tool you want to use with Om
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
        {ideOptions.map(ide => (
          <button
            key={ide.key}
            onClick={() => handleCardClick(ide.key)}
            className={`group relative flex flex-col items-center gap-3 p-6 rounded-xl border transition-all duration-200 ${
              selectedIDE === ide.key
                ? 'border-foreground/20 bg-foreground/5 shadow-md ring-1 ring-foreground/10'
                : 'border-border bg-card hover:border-foreground/15 hover:bg-muted/40 hover:shadow-sm'
            }`}
          >
            <div className="h-12 w-12 rounded-lg bg-muted/60 flex items-center justify-center overflow-hidden">
              {ide.logo ? (
                <img src={ide.logo} alt={ide.name} className="h-8 w-8 object-contain" />
              ) : (
                <Server className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <span className="text-sm font-medium text-foreground">{ide.name}</span>
            {selectedIDE === ide.key && (
              <div className="absolute top-2.5 right-2.5 h-5 w-5 rounded-full bg-foreground/10 flex items-center justify-center">
                <Check className="h-3 w-3 text-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Action area — always reserve space to prevent layout shift */}
      <div className="min-h-[120px] flex flex-col items-center justify-center w-full">
        {selected && (connectionPhase === 'idle' || connectionPhase === 'copied') && (
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-200">
            {selected.key === 'custom' ? (
              <div className="flex flex-col items-center gap-4 p-6 rounded-xl border border-border bg-card max-w-lg w-full">
                <Server className="h-6 w-6 text-muted-foreground" />
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium text-foreground">Om MCP Server</p>
                  <p className="text-xs text-muted-foreground">
                    Copy the MCP server URL below and add it to your preferred tool manually.
                  </p>
                </div>
                <div className="w-full relative flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border font-mono text-xs text-muted-foreground">
                  <span className="truncate flex-1 select-all">https://mcp.us.om.ai/mcp/message?key=***************</span>
                  <button
                    onClick={(e) => handleCopyAndConnect('https://mcp.us.om.ai/mcp/message?key=***************', e)}
                    className="shrink-0 relative h-8 w-8 rounded-md flex items-center justify-center hover:bg-foreground/10 transition-colors group"
                    title="Copy URL"
                  >
                    {connectionPhase === 'copied' ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    )}
                  </button>
                  {connectionPhase === 'copied' && (
                    <span className="absolute -top-7 right-0 text-[11px] font-medium text-green-500 bg-card border border-border rounded-md px-2 py-0.5 shadow-sm animate-in fade-in duration-200">Copied!</span>
                  )}
                </div>
              </div>
            ) : selected.key === 'claude-code' ? (
              <div className="flex flex-col items-center gap-3 max-w-lg w-full">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Installation Command</p>
                <div className="w-full relative flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border font-mono text-xs text-muted-foreground">
                  <span className="truncate flex-1 select-all">claude mcp add --transport http om https://mcp.us.om.ai/mcp/message?key=***************</span>
                  <button
                    onClick={(e) => handleCopyAndConnect('claude mcp add --transport http om https://mcp.us.om.ai/mcp/message?key=***************', e)}
                    className="shrink-0 relative h-8 w-8 rounded-md flex items-center justify-center hover:bg-foreground/10 transition-colors group"
                    title="Copy command"
                  >
                    {connectionPhase === 'copied' ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    )}
                  </button>
                  {connectionPhase === 'copied' && (
                    <span className="absolute -top-7 right-0 text-[11px] font-medium text-green-500 bg-card border border-border rounded-md px-2 py-0.5 shadow-sm animate-in fade-in duration-200">Copied!</span>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={handleInstallClick}
                className="h-11 px-8 rounded-lg bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors shadow-sm"
              >
                Install Om on {selected.name}
              </button>
            )}
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              Make sure you login &amp; authorize Om upon install
            </p>
          </div>
        )}

        {/* Verify connection state */}
        {(connectionPhase === 'waiting' || connectionPhase === 'connected') && (
          <div className="flex flex-col items-center gap-5 animate-in fade-in duration-300 py-2">
            <div className="flex flex-col items-center gap-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Verify Connection</p>
              <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full border transition-all duration-500 ${
                connectionPhase === 'connected'
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-border bg-muted/30'
              }`}>
                {connectionPhase === 'waiting' ? (
                  <>
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-sm text-muted-foreground">Waiting for connection…</span>
                  </>
                ) : (
                  <>
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                    <span className="text-sm text-green-600 font-medium">Connected ✓</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SlateDashboard = () => {
  const [prompt, setPrompt] = useState("");
  const [_activeTab, setActiveTab] = useState("my");
  const [activeIntent, setActiveIntent] = useState<string | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mainTab, setMainTab] = useState<'build' | 'platform'>('build');
  const [layoutMode, setLayoutMode] = useState<'option1' | 'option2' | 'option3'>('option1');
  const [ideFlowActive, setIdeFlowActive] = useState(false);
  const [recentProjects, setRecentProjects] = useState(defaultRecentProjects);
  const navigate = useNavigate();

  const handleCreateUntitled = () => {
    setRecentProjects(prev => {
      const hasUntitled = prev.some(p => p.name === 'Untitled');
      if (hasUntitled) return prev;
      return [{ name: 'Untitled', source: 'platform' }, ...prev];
    });
  };

  const handleRenameProject = (newName: string) => {
    setRecentProjects(prev =>
      prev.map(p => p.name === 'Untitled' ? { ...p, name: newName } : p)
    );
  };

  const connectedConnectors = [
    { name: "Catalyst by Zoho", icon: "⚡" },
    { name: "Zoho CRM", icon: "📊" },
  ];

  const connectedMcpServers = [
    { name: "Zoho MCP Server", url: "https://mcp.zoho.com" },
    { name: "Custom Analytics MCP", url: "https://analytics.example.com/mcp" },
  ];

  const handleFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        setAttachedFiles(prev => [...prev, ...Array.from(files)]);
      }
    };
    input.click();
    setPlusMenuOpen(false);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleStarterClick = (starter: typeof quickStarters[number]) => {
    setPrompt(starter.prompt);
    setActiveIntent(starter.id);
  };

  const clearIntent = () => {
    setActiveIntent(null);
    setPrompt("");
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r border-border bg-card flex-shrink-0 transition-all duration-200 ${sidebarCollapsed ? 'w-[52px]' : 'w-[240px]'}`}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        {/* Toggle + Logo */}
        <div className="flex items-center justify-between px-3 py-4 relative min-h-[52px]">
          {/* Expanded: logo + text (always rendered, hidden when collapsed) */}
          <div className={`flex items-center gap-2 ml-1 ${sidebarCollapsed ? 'hidden' : ''}`}>
            <img src={slateLogo} alt="Slate" className="h-5 w-auto" />
            <span className="text-lg font-bold text-foreground" style={{ fontFamily: "'Lato', sans-serif" }}>Om</span>
          </div>

          {/* Collapsed: logo/expand toggle swap */}
          <div className={`relative h-7 w-7 flex items-center justify-center ${sidebarCollapsed ? 'mx-auto' : 'hidden'}`}>
            <img
              src={slateLogo}
              alt="Slate"
              className={`h-5 w-auto absolute inset-0 m-auto transition-opacity duration-150 ${sidebarHovered ? 'opacity-0' : 'opacity-100'}`}
            />
            <button
              onClick={() => setSidebarCollapsed(false)}
              className={`p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-opacity duration-150 absolute inset-0 m-auto flex items-center justify-center ${sidebarHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              title="Expand sidebar"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          </div>

          {/* Collapse button (expanded state) */}
          <button
            onClick={() => setSidebarCollapsed(true)}
            className={`p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${sidebarCollapsed ? 'hidden' : ''}`}
            title="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
          <SidebarLink icon={Home} label="Home" active collapsed={sidebarCollapsed} onClick={() => {
            setIdeFlowActive(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} />
          <SidebarLink icon={Grid3X3} label="Projects" collapsed={sidebarCollapsed} />
          <SidebarLink icon={Layers} label="Templates" collapsed={sidebarCollapsed} />
          <SidebarLink icon={Search} label="Search" collapsed={sidebarCollapsed} />
          <SidebarLink
            icon={Clock}
            label="Recent"
            collapsed={sidebarCollapsed}
            onClick={() => {
              if (sidebarCollapsed) setSidebarCollapsed(false);
            }}
          />
          {!sidebarCollapsed && (
            <div className="pl-8 space-y-0.5">
              {recentProjects.map((p) => (
                <button key={p.name} onClick={() => navigate(`/project?source=${p.source}&name=${encodeURIComponent(p.name)}`)} className="block w-full text-left px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors truncate">
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </nav>

      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Hero gradient area - fills available space */}
        <div className="relative flex-1 flex flex-col min-h-[75vh]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 via-indigo-50/40 to-blue-50/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />

          {/* Top bar with tabs + icons */}
          <div className="relative flex items-center justify-between px-6 py-3">
            {/* Spacer for top bar */}
            <div className="flex-1" />
            <div className="flex-1 flex items-center justify-end gap-3">
              <button className="p-2 rounded-md hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
                <Bell className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => setSettingsOpen(true)}
                className="p-2 rounded-md hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
              >
                <Settings className="h-4.5 w-4.5" />
              </button>
              <ProfilePopover variant="topbar" />
            </div>
          </div>

          <div className={`relative flex-1 flex flex-col items-center px-6 lg:px-16 pb-24 ${layoutMode !== 'option1' ? 'justify-center' : ''}`}>
            {/* Preload IDE logos so they're cached across all layout modes */}
            <div className="hidden">
              {ideOptions.map(ide => ide.logo && <img key={ide.key} src={ide.logo} alt="" />)}
            </div>
            {layoutMode === 'option1' ? (
              /* === OPTION 1: Original tabbed layout === */
              <div className="w-full flex flex-col items-center pt-[15vh]">
                {/* Tabs - fixed position regardless of content */}
                <div className="inline-flex items-center gap-1 rounded-full bg-background/90 backdrop-blur-md p-1.5 border border-border shadow-md mb-6">
                  {([
                    { key: 'build' as const, label: 'Prompt' },
                    { key: 'platform' as const, label: 'AI IDEs' },
                  ]).map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setMainTab(tab.key)}
                      className={`relative px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                        mainTab === tab.key
                          ? 'bg-foreground/10 text-foreground shadow-sm border border-border'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Content area - starts from same position regardless of tab */}
                <div className="w-full flex flex-col items-center">
                  {mainTab === 'build' ? (
                    <>
                      <h1 className="text-center text-2xl md:text-[2rem] lg:text-4xl font-semibold text-foreground mb-8 tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        What should we build, Srinath?
                      </h1>
                    </>
                  ) : (
                    <PlatformIDESelector onCreateUntitled={handleCreateUntitled} onRenameProject={handleRenameProject} />
                  )}
                </div>

                {mainTab === 'build' && (
                  <>
                    {/* Prompt box */}
                    <div className="max-w-4xl w-full mx-auto">
                      {activeIntent && (
                        <div className="mb-2 flex items-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                            Building: {quickStarters.find(s => s.id === activeIntent)?.pill}
                            <button onClick={clearIntent} className="ml-0.5 hover:bg-primary/20 rounded-full p-0.5 transition-colors">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        </div>
                      )}
                      <div className="rounded-xl border border-input bg-card shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all">
                        <textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Ask Om to create an app about... "
                          rows={4}
                          className="w-full resize-none rounded-t-xl bg-transparent px-5 pt-4 pb-2 text-sm md:text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                        />
                        {attachedFiles.length > 0 && (
                          <div className="flex flex-wrap gap-2 px-4 pb-2">
                            {attachedFiles.map((file, i) => (
                              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted border border-border text-xs text-foreground">
                                <FileText className="h-3 w-3 text-muted-foreground" />
                                <span className="max-w-[120px] truncate">{file.name}</span>
                                <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-foreground transition-colors">
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between px-4 pb-3">
                          <Popover open={plusMenuOpen} onOpenChange={setPlusMenuOpen}>
                            <PopoverTrigger asChild>
                              <button className="h-7 w-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                                <Plus className="h-4 w-4" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent align="start" side="top" className="w-72 p-1.5">
                              <button
                                onClick={handleFileUpload}
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                              >
                                <Paperclip className="h-4 w-4 text-muted-foreground" />
                                <div className="text-left">
                                  <p className="font-medium">Attach Files</p>
                                  <p className="text-xs text-muted-foreground">Upload files to include</p>
                                </div>
                              </button>
                              <div className="h-px bg-border my-1" />
                              <div className="px-3 py-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <Plug className="h-3.5 w-3.5 text-muted-foreground" />
                                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Connectors</p>
                                </div>
                                {connectedConnectors.map((c) => (
                                  <div key={c.name} className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer">
                                    <span className="text-sm">{c.icon}</span>
                                    <span className="text-sm text-foreground">{c.name}</span>
                                    <Check className="h-3 w-3 text-primary ml-auto" />
                                  </div>
                                ))}
                              </div>
                              <div className="h-px bg-border my-1" />
                              <div className="px-3 py-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <Server className="h-3.5 w-3.5 text-muted-foreground" />
                                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">MCP Servers</p>
                                </div>
                                {connectedMcpServers.map((s) => (
                                  <div key={s.name} className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer">
                                    <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
                                      <Server className="h-3 w-3 text-primary" />
                                    </div>
                                    <span className="text-sm text-foreground truncate flex-1">{s.name}</span>
                                    <Check className="h-3 w-3 text-primary shrink-0" />
                                  </div>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                          <div className="flex items-center gap-2">
                            <button className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded transition-colors">Plan</button>
                            <button
                              onClick={() => {
                                if (prompt.trim()) {
                                  navigate(`/project?source=build&prompt=${encodeURIComponent(prompt.trim())}`);
                                }
                              }}
                              className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40"
                              disabled={!prompt.trim()}
                            >
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : layoutMode === 'option2' ? (
              /* === OPTION 2: Unified layout — prompt centered, IDE below fold === */
              <div className="w-full flex flex-col">
                {/* First section: prompt centered in viewport — hidden when IDE flow is active */}
                {!ideFlowActive && (
                <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4">
                  <div className="w-full max-w-3xl flex flex-col items-center">
                    <h1 className="text-center text-2xl md:text-[2rem] lg:text-4xl font-semibold text-foreground mb-8 tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      What should we build, Srinath?
                    </h1>

                    {/* Prompt box */}
                    <div className="w-full">
                      {activeIntent && (
                        <div className="mb-2 flex items-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                            Building: {quickStarters.find(s => s.id === activeIntent)?.pill}
                            <button onClick={clearIntent} className="ml-0.5 hover:bg-primary/20 rounded-full p-0.5 transition-colors">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        </div>
                      )}
                      <div className="rounded-xl border border-input bg-card shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all">
                        <textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Ask Om to create an app about... "
                          rows={4}
                          className="w-full resize-none rounded-t-xl bg-transparent px-5 pt-4 pb-2 text-sm md:text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                        />
                        {attachedFiles.length > 0 && (
                          <div className="flex flex-wrap gap-2 px-4 pb-2">
                            {attachedFiles.map((file, i) => (
                              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted border border-border text-xs text-foreground">
                                <FileText className="h-3 w-3 text-muted-foreground" />
                                <span className="max-w-[120px] truncate">{file.name}</span>
                                <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-foreground transition-colors">
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between px-4 pb-3">
                          <Popover open={plusMenuOpen} onOpenChange={setPlusMenuOpen}>
                            <PopoverTrigger asChild>
                              <button className="h-7 w-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                                <Plus className="h-4 w-4" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent align="start" side="top" className="w-72 p-1.5">
                              <button
                                onClick={handleFileUpload}
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                              >
                                <Paperclip className="h-4 w-4 text-muted-foreground" />
                                <div className="text-left">
                                  <p className="font-medium">Attach Files</p>
                                  <p className="text-xs text-muted-foreground">Upload files to include</p>
                                </div>
                              </button>
                              <div className="h-px bg-border my-1" />
                              <div className="px-3 py-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <Plug className="h-3.5 w-3.5 text-muted-foreground" />
                                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Connectors</p>
                                </div>
                                {connectedConnectors.map((c) => (
                                  <div key={c.name} className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer">
                                    <span className="text-sm">{c.icon}</span>
                                    <span className="text-sm text-foreground">{c.name}</span>
                                    <Check className="h-3 w-3 text-primary ml-auto" />
                                  </div>
                                ))}
                              </div>
                              <div className="h-px bg-border my-1" />
                              <div className="px-3 py-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <Server className="h-3.5 w-3.5 text-muted-foreground" />
                                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">MCP Servers</p>
                                </div>
                                {connectedMcpServers.map((s) => (
                                  <div key={s.name} className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer">
                                    <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
                                      <Server className="h-3 w-3 text-primary" />
                                    </div>
                                    <span className="text-sm text-foreground truncate flex-1">{s.name}</span>
                                    <Check className="h-3 w-3 text-primary shrink-0" />
                                  </div>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                          <div className="flex items-center gap-2">
                            <button className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded transition-colors">Plan</button>
                            <button
                              onClick={() => {
                                if (prompt.trim()) {
                                  navigate(`/project?source=build&prompt=${encodeURIComponent(prompt.trim())}`);
                                }
                              }}
                              className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40"
                              disabled={!prompt.trim()}
                            >
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* IDE logos scroll hint */}
                    <button
                      onClick={() => document.getElementById('ide-section')?.scrollIntoView({ behavior: 'smooth' })}
                      className="mt-12 flex flex-col items-center gap-2 cursor-pointer group"
                    >
                      <span className="text-base font-medium text-muted-foreground">Prefer building from your AI IDE?</span>
                      <div className="flex items-center gap-4 px-5 py-2.5 rounded-full border border-border/50 group-hover:border-border group-hover:shadow-md bg-card/50 group-hover:bg-card transition-all">
                        <img src="/ide-logos/cursor.png" alt="Cursor" className="h-7 w-7 rounded" />
                        <img src="/ide-logos/claude-code.png" alt="Claude Code" className="h-7 w-7 rounded" />
                        <img src="/ide-logos/vscode.png" alt="VS Code" className="h-7 w-7 rounded" />
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  </div>
                </div>
                )}

                {/* Second section: IDE selector — fullscreen centered when flow is active */}
                <div id="ide-section" className={`w-full max-w-3xl mx-auto px-4 ${ideFlowActive ? 'min-h-[calc(100vh-64px)] flex flex-col items-center justify-center' : 'py-20'}`}>
                  <PlatformIDESelector onPhaseChange={(phase) => setIdeFlowActive(FULLSCREEN_PHASES.has(phase))} onCreateUntitled={handleCreateUntitled} onRenameProject={handleRenameProject} />
                </div>
              </div>
            ) : (
              /* === OPTION 3: Unified with visual divider === */
              <div className="w-full flex flex-col">
                {!ideFlowActive && (
                <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4">
                  <div className="w-full max-w-3xl flex flex-col items-center">
                    <h1 className="text-center text-2xl md:text-[2rem] lg:text-4xl font-semibold text-foreground mb-8 tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      What should we build, Srinath?
                    </h1>

                    {/* Prompt box */}
                    <div className="w-full">
                      {activeIntent && (
                        <div className="mb-2 flex items-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                            Building: {quickStarters.find(s => s.id === activeIntent)?.pill}
                            <button onClick={clearIntent} className="ml-0.5 hover:bg-primary/20 rounded-full p-0.5 transition-colors">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        </div>
                      )}
                      <div className="rounded-xl border border-input bg-card shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all">
                        <textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Ask Om to create an app about... "
                          rows={4}
                          className="w-full resize-none rounded-t-xl bg-transparent px-5 pt-4 pb-2 text-sm md:text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                        />
                        {attachedFiles.length > 0 && (
                          <div className="flex flex-wrap gap-2 px-4 pb-2">
                            {attachedFiles.map((file, i) => (
                              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted border border-border text-xs text-foreground">
                                <FileText className="h-3 w-3 text-muted-foreground" />
                                <span className="max-w-[120px] truncate">{file.name}</span>
                                <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-foreground transition-colors">
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between px-4 pb-3">
                          <Popover open={plusMenuOpen} onOpenChange={setPlusMenuOpen}>
                            <PopoverTrigger asChild>
                              <button className="h-7 w-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                                <Plus className="h-4 w-4" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent align="start" side="top" className="w-72 p-1.5">
                              <button
                                onClick={handleFileUpload}
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                              >
                                <Paperclip className="h-4 w-4 text-muted-foreground" />
                                <div className="text-left">
                                  <p className="font-medium">Attach Files</p>
                                  <p className="text-xs text-muted-foreground">Upload files to include</p>
                                </div>
                              </button>
                            </PopoverContent>
                          </Popover>
                          <div className="flex items-center gap-2">
                            <button className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded transition-colors">Plan</button>
                            <button
                              onClick={() => {
                                if (prompt.trim()) {
                                  navigate(`/project?source=build&prompt=${encodeURIComponent(prompt.trim())}`);
                                }
                              }}
                              className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40"
                              disabled={!prompt.trim()}
                            >
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Visual divider with OR */}
                    <div className="w-full flex items-center gap-4 my-10">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">or</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>

                    {/* IDE alternative path with background container */}
                    <div className="w-full rounded-2xl border border-border bg-muted/50 backdrop-blur-sm p-8 flex flex-col items-center">
                      <p className="text-lg md:text-xl font-semibold text-foreground mb-1.5 tracking-tight">Use your AI IDE to build on Om</p>
                      <p className="text-sm md:text-base text-muted-foreground mb-6">Connect your IDE to develop directly on the Om platform</p>
                      <button
                        onClick={() => document.getElementById('ide-section-opt3')?.scrollIntoView({ behavior: 'smooth' })}
                        className="flex items-center gap-5 px-7 py-4 rounded-xl border border-border/60 hover:border-border hover:shadow-lg bg-card hover:bg-card/90 transition-all cursor-pointer group"
                      >
                        <img src="/ide-logos/cursor.png" alt="Cursor" className="h-9 w-9 rounded-lg" />
                        <img src="/ide-logos/claude-code.png" alt="Claude Code" className="h-9 w-9 rounded-lg" />
                        <img src="/ide-logos/vscode.png" alt="VS Code" className="h-9 w-9 rounded-lg" />
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
                )}

                {/* IDE selector section */}
                <div id="ide-section-opt3" className={`w-full max-w-3xl mx-auto px-4 ${ideFlowActive ? 'min-h-[calc(100vh-64px)] flex flex-col items-center justify-center' : 'py-20'}`}>
                  <PlatformIDESelector onPhaseChange={(phase) => setIdeFlowActive(FULLSCREEN_PHASES.has(phase))} onCreateUntitled={handleCreateUntitled} onRenameProject={handleRenameProject} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom-right layout mode dropdown */}
        <div className="fixed bottom-5 right-5 z-50">
          <Select value={layoutMode} onValueChange={(v: 'option1' | 'option2' | 'option3') => setLayoutMode(v)}>
            <SelectTrigger className="w-[130px] h-9 text-xs bg-card border-border shadow-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
      </main>

      {/* Settings overlay */}
      <SettingsOverlay open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

const ProfilePopover = ({ variant = "sidebar" }: { variant?: "sidebar" | "topbar" }) => (
  <Popover>
    <PopoverTrigger asChild>
      {variant === "sidebar" ? (
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">S</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground truncate">Srinath</span>
        </button>
      ) : (
        <button className="p-1 rounded-full hover:bg-muted transition-colors">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">S</AvatarFallback>
          </Avatar>
        </button>
      )}
    </PopoverTrigger>
    <PopoverContent side={variant === "sidebar" ? "top" : "bottom"} align={variant === "sidebar" ? "start" : "end"} className="w-72 p-0">
      {/* Workspace info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">S</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-foreground">Srinath's Org</p>
            <p className="text-xs text-muted-foreground">Pro Plan · 1 member</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted text-xs font-medium text-foreground hover:bg-muted/80 transition-colors">
            <UserPlus className="h-3.5 w-3.5" /> Invite members
          </button>
        </div>
      </div>

      {/* Tokens */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-foreground">Tokens</span>
          <span className="text-xs text-muted-foreground">7.6M left →</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full w-1/4 rounded-full bg-primary" />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" /> Using topup tokens
        </p>
      </div>

      {/* Workspaces */}
      <div className="p-4 border-b border-border">
        <p className="text-xs text-muted-foreground mb-2">All orgs</p>
        <div className="flex items-center gap-3 px-1 py-1.5">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">S</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground flex-1">Srinath's Org</span>
          <span className="text-[10px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded">PRO</span>
          <Check className="h-4 w-4 text-foreground" />
        </div>
      </div>

      {/* Actions */}
      <div className="p-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Plus className="h-4 w-4" /> Create new org
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Globe className="h-4 w-4" /> Manage Orgs
        </button>
      </div>
    </PopoverContent>
  </Popover>
);

const SidebarLink = ({ icon: Icon, label, active, onClick, collapsed }: { icon: any; label: string; active?: boolean; onClick?: () => void; collapsed?: boolean }) => (
  <div className="relative group">
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); if (onClick) onClick(); }}
      className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-md text-sm transition-colors ${
        active
          ? "bg-muted text-foreground font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && label}
    </a>
    {collapsed && (
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 rounded-md bg-foreground text-background text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-lg">
        {label}
      </div>
    )}
  </div>
);

export default SlateDashboard;
