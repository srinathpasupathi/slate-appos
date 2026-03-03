import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, Search, Clock, Grid3X3, Users, Plus, ArrowRight, Settings, UserPlus, Globe, Check, LogOut, User, Code2, GitBranch, ChevronUp, ChevronDown, Copy, Rocket, Bell, AppWindow, Layers, X, Database, Paperclip, Plug, Server, FileText, Trash2, PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import slateLogo from "@/assets/slate-logo.svg";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import SettingsOverlay from "@/components/SettingsOverlay";

const recentProjects = [
  { name: "CRM Analytics Dashboard" },
  { name: "Invoice Manager Pro" },
  { name: "Employee Portal" },
  { name: "Feedback Tracker" },
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
  const navigate = useNavigate();

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

const ideOptions = [
  { key: 'cursor', name: 'Cursor', logo: '/ide-logos/cursor.png' },
  { key: 'antigravity', name: 'Antigravity', logo: '/ide-logos/antigravity.png' },
  { key: 'vscode', name: 'VS Code', logo: '/ide-logos/vscode.png' },
  { key: 'windsurf', name: 'Windsurf', logo: '/ide-logos/windsurf.png' },
  { key: 'claude-code', name: 'Claude Code', logo: '/ide-logos/claude-code.png' },
  { key: 'mcp-server', name: 'MCP Server', logo: null },
];

const PlatformIDESelector = () => {
  const [selectedIDE, setSelectedIDE] = useState<string | null>(null);

  const selected = ideOptions.find(ide => ide.key === selectedIDE);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-3xl">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Choose your AI IDE
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Connect Om to your preferred development environment
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
        {ideOptions.map(ide => (
          <button
            key={ide.key}
            onClick={() => setSelectedIDE(ide.key === selectedIDE ? null : ide.key)}
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

      {selected && (
        <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {selected.key === 'mcp-server' ? (
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card max-w-md w-full">
              <Server className="h-6 w-6 text-muted-foreground mb-1" />
              <p className="text-sm font-medium text-foreground">Custom MCP Server</p>
              <p className="text-xs text-muted-foreground text-center">
                Enter your MCP server details in Settings → Connectors to connect Om with your custom setup.
              </p>
              <button className="mt-2 h-10 px-6 rounded-lg bg-foreground/10 text-foreground text-sm font-semibold hover:bg-foreground/15 transition-colors">
                Open Connector Settings
              </button>
            </div>
          ) : (
            <button className="h-11 px-8 rounded-lg bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors shadow-sm">
              Install Om on {selected.name}
            </button>
          )}
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            Login &amp; authorize your MCP server upon install
          </p>
        </div>
      )}
    </div>
  );
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
          <SidebarLink icon={Home} label="Home" active collapsed={sidebarCollapsed} />
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
                <a key={p.name} href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors truncate">
                  {p.name}
                </a>
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
            {/* Centered tabs */}
            <div className="flex-1" />
            <div className="inline-flex items-center gap-1 rounded-full bg-background/90 backdrop-blur-md p-1.5 border border-border shadow-md">
              {([
                { key: 'build' as const, label: 'Build' },
                { key: 'platform' as const, label: 'Platform' },
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

          <div className="relative flex-1 flex flex-col items-center justify-center px-6 lg:px-16 pb-24">
            {mainTab === 'build' ? (
              <>
                {/* Heading */}
                <h1 className="text-center text-2xl md:text-[2rem] lg:text-4xl font-semibold text-foreground mb-8 tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  What should we build, Srinath?
                </h1>
              </>
            ) : (
              <PlatformIDESelector />
            )}

            {mainTab === 'build' && (
            <>
            {/* Prompt box */}
            <div className="max-w-4xl w-full mx-auto">
              {/* Intent pill */}
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

                {/* Attached files */}
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
                          navigate(`/slate/workspace?prompt=${encodeURIComponent(prompt.trim())}`);
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
  <a
    href="#"
    onClick={(e) => { if (onClick) { e.preventDefault(); onClick(); } }}
    className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-md text-sm transition-colors ${
      active
        ? "bg-muted text-foreground font-medium"
        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
    }`}
    title={collapsed ? label : undefined}
  >
    <Icon className="h-4 w-4 shrink-0" />
    {!collapsed && label}
  </a>
);

export default SlateDashboard;
