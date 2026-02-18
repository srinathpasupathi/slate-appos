import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, Search, Clock, Grid3X3, Star, Users, Compass, LayoutTemplate,
  ChevronDown, Plus, ArrowRight, Sparkles, Share2, Zap,
} from "lucide-react";
import zohoLogo from "@/assets/zoho-logo.svg";

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

const SlateDashboard = () => {
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState("recent");
  const navigate = useNavigate();

  const tabs = [
    { id: "recent", label: "Recently viewed" },
    { id: "my", label: "My projects" },
    { id: "templates", label: "Templates" },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-[240px] border-r border-border bg-card flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4">
          <img src={zohoLogo} alt="Zoho" className="h-6 w-auto" />
        </div>

        {/* Workspace selector */}
        <div className="px-3 mb-2">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-muted text-sm font-medium text-foreground">
            <span className="h-5 w-5 rounded bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">S</span>
            My Slate
            <ChevronDown className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          <SidebarLink icon={Home} label="Home" active />
          <SidebarLink icon={Search} label="Search" />

          <div className="pt-4 pb-1">
            <p className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Projects</p>
          </div>
          <SidebarLink icon={Clock} label="Recent" />
          <div className="pl-8 space-y-0.5">
            {recentProjects.map((p) => (
              <a key={p.name} href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors truncate">
                {p.name}
              </a>
            ))}
          </div>
          <SidebarLink icon={Grid3X3} label="All projects" />
          <SidebarLink icon={Star} label="Starred" />
          <SidebarLink icon={Users} label="Shared with me" />

          <div className="pt-4 pb-1">
            <p className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Resources</p>
          </div>
          <SidebarLink icon={Compass} label="Discover" />
          <SidebarLink icon={LayoutTemplate} label="Templates" />
        </nav>

        {/* Bottom section */}
        <div className="border-t border-border px-3 py-3 space-y-2">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm text-foreground">
            <Share2 className="h-4 w-4 text-muted-foreground" />
            <div className="text-left">
              <p className="font-medium">Share Slate</p>
              <p className="text-xs text-muted-foreground">Get 10 credits each</p>
            </div>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm text-foreground">
            <Zap className="h-4 w-4 text-primary" />
            <div className="text-left">
              <p className="font-medium">Upgrade to Business</p>
              <p className="text-xs text-muted-foreground">Unlock more benefits</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Hero gradient area */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/8 to-primary/5 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />

          <div className="relative px-6 lg:px-16 pt-16 pb-10">
            {/* Announcement */}
            <div className="flex justify-center mb-5">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                <span className="px-1.5 py-0.5 bg-primary text-primary-foreground rounded text-[10px] uppercase font-bold">New</span>
                Introducing a smarter Slate
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-8">
              Ready to build?
            </h1>

            {/* Prompt box */}
            <div className="max-w-2xl mx-auto">
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
                    <button className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity">
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
          <div className="flex items-center justify-between mb-6">
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
            <a href="#" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Browse all <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Project cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projectCards.map((card) => (
              <div
                key={card.title}
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
      </main>
    </div>
  );
};

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
