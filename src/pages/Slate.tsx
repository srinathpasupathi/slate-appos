import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, Search, Clock, Grid3X3, Users, Plus, ArrowRight, Settings, UserPlus, Globe, Check, LogOut, User, Code2, Briefcase, GitBranch, ChevronUp, ChevronDown, Copy, Rocket, Bell,
} from "lucide-react";
import zohoLogo from "@/assets/zoho-logo.svg";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

const SlateDashboard = () => {
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState("my");
  const [mode, setMode] = useState<"business" | "developer">("business");
  const navigate = useNavigate();

  const tabs = [
    { id: "my", label: "My apps" },
    { id: "templates", label: "Templates" },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-[240px] border-r border-border bg-card flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center px-4 py-4">
          <img src={zohoLogo} alt="Zoho" className="h-6 w-auto" />
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          <SidebarLink icon={Home} label="Home" active />
          <SidebarLink icon={Search} label="Search" />

          <div className="pt-4 pb-1">
            <p className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Apps</p>
          </div>
          <SidebarLink icon={Clock} label="Recent" />
          <div className="pl-8 space-y-0.5">
            {recentProjects.map((p) => (
              <a key={p.name} href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors truncate">
                {p.name}
              </a>
            ))}
          </div>
  <SidebarLink icon={Grid3X3} label="All apps" />
          <SidebarLink icon={Users} label="Shared with me" />
        </nav>

        {/* Profile popover at bottom */}
        <div className="border-t border-border px-3 py-3">
          <ProfilePopover />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top bar with mode toggle */}
        <div className="flex items-center justify-between px-6 py-3">
          <div />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-muted rounded-full p-1">
            <button
              onClick={() => setMode("business")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                mode === "business"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              Business
            </button>
            <button
              onClick={() => setMode("developer")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                mode === "developer"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              Developer
            </button>
            </div>
            {/* Org popover */}
            <ProfilePopover variant="topbar" />
            {/* Settings */}
            <button className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <Settings className="h-4.5 w-4.5" />
            </button>
            {/* Notifications */}
            <button className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <Bell className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {mode === "business" ? (
        <>
        {/* Hero gradient area - fills available space */}
        <div className="relative flex-1 flex flex-col min-h-[60vh]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/8 to-primary/5 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />

          <div className="relative flex-1 flex flex-col items-center justify-center px-6 lg:px-16">
            {/* Heading */}
            <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-8">
              Let's start building, Srinath
            </h1>

            {/* Prompt box */}
            <div className="max-w-2xl w-full mx-auto">
              <div className="rounded-xl border border-input bg-card shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask Slate to create an app about.."
                  rows={2}
                  className="w-full resize-none rounded-t-xl bg-transparent px-5 pt-4 pb-2 text-sm md:text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
                <div className="flex items-center justify-between px-4 pb-3">
                  <button className="h-7 w-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
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
          </div>
        </div>

        {/* Tabs + Projects */}
        <div className="px-6 lg:px-16 py-8">
          <div className="flex items-center mb-6">
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Project cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projectCards.map((card) => (
              <div
                key={card.title}
                onClick={() => navigate(`/slate/workspace?prompt=${encodeURIComponent(card.title)}`)}
                className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className={`h-40 bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <div className="w-3/4 h-24 rounded-lg bg-background/60 border border-border/50 shadow-sm" />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-1 font-sans">{card.title}</h3>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </>
        ) : (
        /* Developer Mode */
        <div className="flex-1 flex flex-col px-6 lg:px-16 py-6 overflow-y-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search app"
                className="h-9 w-60 rounded-lg border border-input bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button className="h-9 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              Deploy App
            </button>
          </div>

          {/* App list */}
          <div className="space-y-4">
            {devApps.map((app, i) => (
              <DevAppCard key={app.name} app={app} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
        )}
      </main>
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

const SidebarLink = ({ icon: Icon, label, active }: { icon: any; label: string; active?: boolean }) => (
  <a
    href="#"
    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
      active
        ? "bg-muted text-foreground font-medium"
        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
    }`}
  >
    <Icon className="h-4 w-4" />
    {label}
  </a>
);

export default SlateDashboard;
