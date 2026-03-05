import { useState } from "react";
import {
  Globe, Plus, ExternalLink, ChevronDown, Search, AlertCircle,
  Copy, Check, ArrowLeft, Trash2, RotateCcw, Zap, MoreHorizontal, X, Shield,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// ─── Types ───

export interface AppUser {
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

export const APP_USERS: AppUser[] = [
  { userId: "usr_01HQ3X8k", firstName: "Alice", lastName: "Johnson", email: "alice@acme.com", phone: "+1-555-0101", username: "alicej", userRole: "Admin", roleId: "role_001", department: "Engineering", jobTitle: "CTO", orgId: "org_001", orgName: "Acme Corp", status: "Active", emailVerified: true, phoneVerified: true, signupDate: "Jan 12, 2026" },
  { userId: "usr_01HR7Y3m", firstName: "Bob", lastName: "Smith", email: "bob@globex.com", phone: "+1-555-0102", username: "bsmith", userRole: "Editor", roleId: "role_002", department: "Marketing", jobTitle: "Marketing Lead", orgId: "org_002", orgName: "Globex Inc", status: "Active", emailVerified: true, phoneVerified: false, signupDate: "Feb 03, 2026" },
  { userId: "usr_01HS2Z9p", firstName: "Carol", lastName: "Williams", email: "carol@initech.com", phone: "+1-555-0103", username: "cwilliams", userRole: "Viewer", roleId: "role_003", department: "Sales", jobTitle: "Sales Manager", orgId: "org_003", orgName: "Initech", status: "Inactive", emailVerified: false, phoneVerified: false, signupDate: "Feb 18, 2026" },
  { userId: "usr_01HT4A1r", firstName: "David", lastName: "Brown", email: "david@umbrella.com", phone: "+1-555-0104", username: "dbrown", userRole: "Admin", roleId: "role_001", department: "Operations", jobTitle: "COO", orgId: "org_004", orgName: "Umbrella Ltd", status: "Active", emailVerified: true, phoneVerified: true, signupDate: "Mar 01, 2026" },
];

export const DEPLOYMENTS = [
  { version: "v1.4.2", status: "Live", branch: "main", commit: "a83f1d2", time: "Mar 03, 2026 · 2:14 PM" },
  { version: "v1.4.1", status: "Superseded", branch: "main", commit: "e7c09b4", time: "Feb 28, 2026 · 10:30 AM" },
  { version: "v1.4.0", status: "Superseded", branch: "main", commit: "3bf72e1", time: "Feb 20, 2026 · 4:45 PM" },
  { version: "v1.3.0", status: "Rolled back", branch: "release/1.3", commit: "d12ea98", time: "Feb 10, 2026 · 9:00 AM" },
];

// ─── Data ───

const API_CALLS_7D = [
  { day: "Mon", calls: 1240 },
  { day: "Tue", calls: 1580 },
  { day: "Wed", calls: 2100 },
  { day: "Thu", calls: 1890 },
  { day: "Fri", calls: 2340 },
  { day: "Sat", calls: 980 },
  { day: "Sun", calls: 760 },
];

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

interface LocalhostEntry {
  url: string;
  emails: string[];
}

// ─── Tab Components ───

export const OverviewTab = ({ projectName, appUrl, copied, onCopy }: { projectName: string; appUrl: string; copied: boolean; onCopy: (t: string) => void }) => {
  const maxCalls = Math.max(...API_CALLS_7D.map(d => d.calls));
  const totalCalls = API_CALLS_7D.reduce((s, d) => s + d.calls, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Overview</h2>
        <p className="text-sm text-muted-foreground mt-1">Project overview and quick details.</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">App Name</p>
        <span className="text-base font-normal text-foreground">{projectName}</span>
      </div>
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
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">API Calls · Last 7 Days</p>
        <div className="h-44">
          <svg viewBox="0 0 600 180" className="w-full h-full" preserveAspectRatio="none">
            {[0, 1, 2, 3, 4].map(i => (
              <line key={i} x1="0" y1={i * 35 + 10} x2="600" y2={i * 35 + 10} stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="4 4" />
            ))}
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <path
              d={(() => {
                const pts = API_CALLS_7D.map((d, i) => ({ x: i * (600 / 6), y: 150 - (d.calls / maxCalls) * 130 }));
                const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
                return `${line} L${pts[pts.length - 1].x},160 L${pts[0].x},160 Z`;
              })()}
              fill="url(#areaGradient)"
            />
            <path
              d={API_CALLS_7D.map((d, i) => {
                const x = i * (600 / 6);
                const y = 150 - (d.calls / maxCalls) * 130;
                return `${i === 0 ? "M" : "L"}${x},${y}`;
              }).join(" ")}
              fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"
            />
            {API_CALLS_7D.map((d, i) => {
              const x = i * (600 / 6);
              const y = 150 - (d.calls / maxCalls) * 130;
              return <circle key={i} cx={x} cy={y} r="3.5" fill="hsl(var(--primary))" opacity="0.5" />;
            })}
            {API_CALLS_7D.map((d, i) => (
              <text key={i} x={i * (600 / 6)} y="175" textAnchor="middle" className="fill-muted-foreground text-[11px]">{d.day}</text>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

export const UsersTab = ({ users }: { users: AppUser[] }) => {
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
                  <button onClick={() => setDetailUser(u)} className="p-1 rounded hover:bg-muted transition-colors" title="View more details">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={!!detailUser} onOpenChange={(open) => !open && setDetailUser(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Full profile information for this user.</DialogDescription>
          </DialogHeader>
          {detailUser && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm mt-2">
              {([
                ["User ID", detailUser.userId], ["First Name", detailUser.firstName], ["Last Name", detailUser.lastName],
                ["Email", detailUser.email], ["Phone Number", detailUser.phone], ["Username", detailUser.username],
                ["User Role", detailUser.userRole], ["Role ID", detailUser.roleId], ["Department", detailUser.department],
                ["Job Title", detailUser.jobTitle], ["Org ID", detailUser.orgId], ["Org Name", detailUser.orgName],
                ["Status", detailUser.status], ["Email Verified", detailUser.emailVerified ? "Yes" : "No"],
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

export const QueryConsoleTab = () => {
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
      <div className="rounded-lg border border-border bg-card overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
          <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Editor</span>
          <button
            onClick={handleRun}
            disabled={isRunning || !query.trim()}
            className="h-7 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            {isRunning ? <RotateCcw className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
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
            {executionTime && <span className="text-[11px] text-muted-foreground">{executionTime}ms</span>}
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

export const ResourcesTab = () => {
  const [subNav, setSubNav] = useState<ResourceSubNav>("module");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredModules = RESOURCE_MODULES.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex gap-0 h-full">
      <div className="w-48 shrink-0 border-r border-border pr-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Data Entity</h3>
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input type="text" placeholder="Search Here" className="w-full h-8 pl-8 pr-3 rounded-md border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
        <nav className="space-y-0.5">
          {RESOURCE_SUB_NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setSubNav(item.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                subNav === item.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
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
                type="text" placeholder="Search Here" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
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
              <tr key={w.name} onClick={() => setSelectedWorkflow(w)} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer">
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
                <div><p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Type</p><p className="text-sm font-medium">{selectedWorkflow.type}</p></div>
                <div><p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Module</p><p className="text-sm font-medium">{selectedWorkflow.moduleName}</p></div>
                <div><p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Created On</p><p className="text-sm font-medium">{selectedWorkflow.createdOn}</p></div>
              </div>
              <div className="border-t border-border pt-4 space-y-3">
                <div><p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Trigger</p><p className="text-sm bg-muted/50 rounded-md px-3 py-2">{selectedWorkflow.trigger}</p></div>
                <div><p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Target</p><p className="text-sm bg-muted/50 rounded-md px-3 py-2">{selectedWorkflow.target}</p></div>
                <div><p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Configuration</p><p className="text-sm bg-muted/50 rounded-md px-3 py-2">{selectedWorkflow.configuration}</p></div>
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
              <tr key={r.name} onClick={() => setSelectedRole(r)} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer">
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

export const DeploymentsTab = () => (
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

export const ConfigurationTab = () => {
  const [openSection, setOpenSection] = useState<string | null>("localhost");
  const [localhostEntries, setLocalhostEntries] = useState<LocalhostEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUrl, setNewUrl] = useState("https://localhost:3000");
  const [newEmailInput, setNewEmailInput] = useState("");
  const [newEmails, setNewEmails] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editEmailInput, setEditEmailInput] = useState("");
  const [trustedDomainInput, setTrustedDomainInput] = useState("");
  const [trustedDomains, setTrustedDomains] = useState<string[]>([]);
  const [trustedDomainError, setTrustedDomainError] = useState<string | null>(null);

  const toggleSection = (id: string) => setOpenSection(openSection === id ? null : id);

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
        i === index && !entry.emails.includes(trimmed) ? { ...entry, emails: [...entry.emails, trimmed] } : entry
      ));
      setEditEmailInput("");
    }
  };

  const handleRemoveEntryEmail = (entryIndex: number, email: string) => {
    setLocalhostEntries((prev) => prev.map((entry, i) =>
      i === entryIndex ? { ...entry, emails: entry.emails.filter((e) => e !== email) } : entry
    ));
  };

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
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <button onClick={() => toggleSection("localhost")} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors">
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
            {localhostEntries.map((entry, idx) => (
              <div key={idx} className="rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-[11px] text-primary font-medium uppercase tracking-wider">Domain URL</label>
                    <p className="text-sm font-mono mt-0.5">{entry.url}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setEditingIndex(editingIndex === idx ? null : idx); setEditEmailInput(""); }} className="text-xs text-primary font-medium hover:text-primary/80 transition-colors px-2 py-1 rounded hover:bg-muted/50">
                      {editingIndex === idx ? "Done" : "Edit"}
                    </button>
                    <button onClick={() => handleDeleteEntry(idx)} className="p-1.5 hover:bg-muted rounded transition-colors">
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
                        <input value={editEmailInput} onChange={(e) => setEditEmailInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleAddEditEmail(idx); }} placeholder="Add email address" className="flex-1 h-9 px-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                        <button onClick={() => setEditEmailInput("")} className="h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"><X className="h-3.5 w-3.5 text-destructive" /></button>
                        <button onClick={() => handleAddEditEmail(idx)} className="h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"><Check className="h-3.5 w-3.5 text-green-600" /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {showAddForm ? (
              <div className="rounded-lg border border-dashed border-primary/40 p-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] text-primary font-medium uppercase tracking-wider">Domain URL</label>
                  <p className="text-xs text-muted-foreground">Enter your localhost domain for development access.</p>
                  <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="https://localhost:3000" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Whitelisted Email Addresses</label>
                  <p className="text-xs text-muted-foreground">Only these email addresses can sign up or log in from this localhost domain.</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <input value={newEmailInput} onChange={(e) => setNewEmailInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleAddNewEmail(); }} placeholder="Enter email" className="flex-1 h-9 px-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                      <button onClick={() => setNewEmailInput("")} className="h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"><X className="h-3.5 w-3.5 text-destructive" /></button>
                      <button onClick={handleAddNewEmail} className="h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"><Check className="h-3.5 w-3.5 text-green-600" /></button>
                    </div>
                    {newEmails.map((email) => (
                      <div key={email} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                        <span className="text-sm">{email}</span>
                        <button onClick={() => setNewEmails((prev) => prev.filter((e) => e !== email))} className="p-1 hover:bg-muted rounded transition-colors"><Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" /></button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <button onClick={() => { setShowAddForm(false); setNewUrl("https://localhost:3000"); setNewEmails([]); setNewEmailInput(""); }} className="h-8 px-4 rounded-md border border-border text-sm font-medium hover:bg-muted/50 transition-colors">Cancel</button>
                  <button onClick={handleSaveNewEntry} disabled={!newUrl.trim() || newEmails.length === 0} className="h-8 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">Save</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAddForm(true)} className="w-full h-10 rounded-lg border border-dashed border-border text-sm text-muted-foreground font-medium hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add Localhost Domain
              </button>
            )}
          </div>
        )}
      </div>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <button onClick={() => toggleSection("trusted-domains")} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors">
          <div>
            <h3 className="text-sm font-semibold">Trusted Domains</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Add domains that are allowed to make authenticated requests to your backend.</p>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openSection === "trusted-domains" ? "rotate-180" : ""}`} />
        </button>
        {openSection === "trusted-domains" && (
          <div className="px-5 pb-5 border-t border-border pt-4 space-y-3">
            <div className="flex items-center gap-2">
              <input value={trustedDomainInput} onChange={(e) => { setTrustedDomainInput(e.target.value); setTrustedDomainError(null); }} onKeyDown={(e) => { if (e.key === "Enter") handleAddTrustedDomain(); }} placeholder="app.yourdomain.com" className="flex-1 h-9 px-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              <button onClick={handleAddTrustedDomain} className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Add Domain</button>
            </div>
            {trustedDomainError && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {trustedDomainError}</p>}
            {trustedDomains.length > 0 && (
              <div className="rounded-lg border border-border overflow-hidden">
                {trustedDomains.map((domain, i) => (
                  <div key={domain} className={`flex items-center justify-between px-4 py-3 ${i < trustedDomains.length - 1 ? "border-b border-border" : ""}`}>
                    <span className="text-sm font-mono">{domain}</span>
                    <button onClick={() => handleRemoveTrustedDomain(domain)} className="p-1 hover:bg-muted rounded transition-colors"><Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" /></button>
                  </div>
                ))}
              </div>
            )}
            {trustedDomains.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No trusted domains added yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
};
