import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, ExternalLink, Copy, Check, Globe, Users, Rocket,
  Settings, Trash2, Plus, RotateCcw, ChevronRight, LayoutDashboard,
  ChevronDown, Home, Sun, Moon, HelpCircle, Zap, CreditCard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import slateLogo from "@/assets/slate-logo.svg";
import SettingsOverlay from "@/components/SettingsOverlay";

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

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "tenants", label: "Tenants", icon: Users },
  { id: "deployments", label: "Deployments", icon: Rocket },
  { id: "settings", label: "Configuration", icon: Settings },
];

const ProjectConsole = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get("name") || "CRM Analytics Dashboard";

  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<typeof TENANTS[number] | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [appMenuOpen, setAppMenuOpen] = useState(false);

  const appUrl = `${projectName.toLowerCase().replace(/\s+/g, "-")}.onslate.com`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Top header — matches SlateWorkspace */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card shrink-0">
        <img src={slateLogo} alt="Slate" className="h-5 w-auto" />

        <DropdownMenu open={appMenuOpen} onOpenChange={setAppMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 text-base font-bold text-foreground hover:text-foreground/80 transition-colors" style={{ fontFamily: "'Lato', sans-serif" }}>
              {projectName}
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[280px] p-0 bg-card border-border">
            <button
              onClick={() => navigate("/slate")}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <Home className="h-4 w-4 text-muted-foreground" />
              Go back to Home
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
                  Free tier: $0.65 / $1.00 used today
                </p>
              </div>
            </div>

            <DropdownMenuSeparator className="bg-border" />

            <div className="py-1">
              <button
                onClick={() => { setAppMenuOpen(false); setSettingsOpen(true); }}
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

      {/* Body: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar nav */}
        <aside className="w-52 border-r border-border bg-card flex flex-col shrink-0">
          <div className="p-3 border-b border-border">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to workspace
            </button>
          </div>

          <nav className="flex-1 p-2 space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSelectedTenant(null); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                  activeTab === item.id
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
            {activeTab === "overview" && <OverviewTab projectName={projectName} appUrl={appUrl} copied={copied} onCopy={handleCopy} />}
            {activeTab === "tenants" && (
              selectedTenant
                ? <TenantDetail tenant={selectedTenant} onBack={() => setSelectedTenant(null)} />
                : <TenantsTab tenants={TENANTS} onSelect={setSelectedTenant} />
            )}
            {activeTab === "deployments" && <DeploymentsTab />}
            {activeTab === "settings" && <SettingsTab projectName={projectName} appUrl={appUrl} />}
          </div>
        </main>
      </div>

      {/* Settings overlay — same as workspace */}
      <SettingsOverlay open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

/* ─── Overview ─── */
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

const InfoCard = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="rounded-lg border border-border bg-card p-4">
    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium mb-1.5">{label}</p>
    {children}
  </div>
);

/* ─── Tenants ─── */
const TenantsTab = ({ tenants, onSelect }: { tenants: typeof TENANTS; onSelect: (t: typeof TENANTS[number]) => void }) => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>Tenants</h2>
        <p className="text-sm text-muted-foreground mt-1">Organizations using this application.</p>
      </div>
      <button className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5">
        <Plus className="h-3.5 w-3.5" />
        Add Tenant
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
            <tr
              key={t.id}
              onClick={() => onSelect(t)}
              className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors group"
            >
              <td className="px-4 py-3 font-medium text-primary hover:underline">{t.name}</td>
              <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">{t.id}</td>
              <td className="px-4 py-3">
                <Badge variant="secondary" className="text-[11px]">{t.plan}</Badge>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{t.users}</td>
              <td className="px-4 py-3 text-muted-foreground">{t.created}</td>
              <td className="px-4 py-3">
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/* ─── Tenant Detail ─── */
const TenantDetail = ({ tenant, onBack }: { tenant: typeof TENANTS[number]; onBack: () => void }) => (
  <div className="space-y-5">
    <button onClick={onBack} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
      <ArrowLeft className="h-3.5 w-3.5" />
      Back to tenants
    </button>

    <div>
      <h2 className="text-xl font-semibold tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>{tenant.name}</h2>
      <p className="text-[11px] text-muted-foreground font-mono mt-1">{tenant.id}</p>
    </div>

    <div className="grid gap-4">
      <InfoCard label="Plan">
        <Badge variant="secondary" className="text-[11px]">{tenant.plan}</Badge>
      </InfoCard>
      <InfoCard label="Active Users">
        <span className="text-sm text-foreground">{tenant.users} users</span>
      </InfoCard>
      <InfoCard label="Created">
        <span className="text-sm text-foreground">{tenant.created}</span>
      </InfoCard>
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

/* ─── Deployments ─── */
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
                    <RotateCcw className="h-3 w-3" />
                    Rollback
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

/* ─── Settings ─── */
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
            <input
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="app.yourdomain.com"
              className="flex-1 h-8 px-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              Connect
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Environment Variables</h3>
          <button className="text-[11px] text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-1">
            <Plus className="h-3 w-3" />
            Add Variable
          </button>
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
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProjectConsole;
