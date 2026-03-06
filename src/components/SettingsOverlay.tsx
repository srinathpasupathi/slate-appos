import { useState, useEffect } from "react";
import {
  X, Settings, Globe, BookOpen, Plug, GitBranch,
  Users, CreditCard, ShieldCheck, ChevronRight, Code2, Brain, Database, Cloud, ChevronDown, Zap, Boxes, DatabaseZap, Check,
} from "lucide-react";
import GeneralSettings from "@/components/settings/GeneralSettings";
import DomainsSettings from "@/components/settings/DomainsSettings";
import KnowledgeSettings from "@/components/settings/KnowledgeSettings";
import ConnectorsSettings from "@/components/settings/ConnectorsSettings";
import OmDeveloperSettings from "@/components/settings/OmDeveloperSettings";

import DeveloperSettings from "@/components/settings/DeveloperSettings";
import TeamSettings from "@/components/settings/TeamSettings";
import BillingSettings from "@/components/settings/BillingSettings";
import PrivacySettings from "@/components/settings/PrivacySettings";
import AIProvidersSettings from "@/components/settings/AIProvidersSettings";
import AppOSSettings from "@/components/settings/AppOSSettings";
import CloudSettings from "@/components/settings/CloudSettings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const projectMenuItems = [
  { id: "general", label: "General", icon: Settings },
  { id: "domains", label: "Domains", icon: Globe },
  { id: "knowledge", label: "Knowledge", icon: BookOpen },
  { id: "connectors", label: "Connectors", icon: Plug },
  { id: "developer", label: "Developer Settings", icon: Code2 },
  { id: "appos", label: "AppOS", icon: Database },
  { id: "cloud", label: "Cloud", icon: Cloud },
];

const omPromptMenuItems = [
  { id: "general", label: "General", icon: Settings },
  { id: "domains", label: "Domains", icon: Globe },
  { id: "knowledge", label: "Knowledge", icon: BookOpen },
  { id: "connectors", label: "Connectors", icon: Plug },
  { id: "developer", label: "Compute & Hosting", icon: Code2 },
];

const omServiceMenuItems = [
  { id: "general", label: "General", icon: Settings },
  { id: "developer", label: "Compute & Hosting", icon: Code2 },
];

const orgMenuItems = [
  { id: "team", label: "My Team", icon: Users },
  { id: "billing", label: "Plans & Billing", icon: CreditCard },
  { id: "privacy", label: "Privacy & Security", icon: ShieldCheck },
  { id: "ai-providers", label: "AI Providers (BYOK)", icon: Brain },
];

type OmContext = 'prompt' | 'appos' | 'cloud';

interface SettingsOverlayProps {
  open: boolean;
  onClose: () => void;
  initialTab?: string;
  initialOmContext?: OmContext;
  appOsEnabled?: boolean;
  onAppOsToggle?: (enabled: boolean) => void;
  cloudEnabled?: boolean;
  onCloudToggle?: (enabled: boolean) => void;
  appName?: string;
  variant?: 'default' | 'om' | 'om-project' | 'slate';
}

const SettingsOverlay = ({ open, onClose, initialTab, initialOmContext, appOsEnabled = false, onAppOsToggle, cloudEnabled = false, onCloudToggle, appName, variant = 'default' }: SettingsOverlayProps) => {
  const [activeSection, setActiveSection] = useState(initialTab || "general");
  const [omContext, setOmContext] = useState<OmContext>(initialOmContext || 'prompt');
  const [selectedProject, setSelectedProject] = useState('franchise-sales-mgmt');

  useEffect(() => {
    if (initialOmContext) setOmContext(initialOmContext);
  }, [initialOmContext]);

  const getMenuItemsForContext = () => {
    if (variant === 'slate') return projectMenuItems.filter(item => item.id !== 'appos' && item.id !== 'cloud');
    if (variant === 'om-project') return [
      ...omPromptMenuItems,
      { id: "appos", label: "AppOS", icon: Database },
      { id: "cloud", label: "Cloud", icon: Cloud },
    ];
    if (variant !== 'om') return projectMenuItems;
    switch (omContext) {
      case 'prompt': return omPromptMenuItems;
      case 'appos': return omServiceMenuItems;
      case 'cloud': return omServiceMenuItems;
    }
  };

  const currentProjectMenuItems = getMenuItemsForContext();

  const handleOmContextChange = (ctx: OmContext) => {
    setOmContext(ctx);
    setActiveSection('general');
    setSelectedProject(ctx === 'appos' || ctx === 'cloud' ? 'Default Project' : 'franchise-sales-mgmt');
  };

  const omContextOptions: { key: OmContext; label: string; icon: typeof Zap; description: string }[] = [
    { key: 'prompt', label: 'Om Builder', icon: Zap, description: 'App generation & prompts' },
    { key: 'appos', label: 'AppOS', icon: Boxes, description: 'Backend modules & workflows' },
    { key: 'cloud', label: 'Cloud', icon: DatabaseZap, description: 'Infrastructure & services' },
  ];

  useEffect(() => {
    if (initialTab) setActiveSection(initialTab);
  }, [initialTab]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-200"
        onClick={onClose}
      />

      <div className="relative w-[calc(100%-64px)] h-[calc(100%-64px)] max-w-[1200px] max-h-[800px] bg-card border border-border rounded-2xl shadow-2xl flex overflow-hidden animate-in zoom-in-95 fade-in-0 duration-200">
        {/* Close button - top right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left sidebar */}
        <div className="w-[260px] border-r border-border bg-muted/30 flex flex-col">
          <div className="px-6 py-5 flex items-center gap-3">
            <h2 className="text-lg font-semibold text-foreground">Settings</h2>
            {variant === 'om' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted/80 transition-all shadow-sm whitespace-nowrap">
                    {(() => {
                      const active = omContextOptions.find(o => o.key === omContext);
                      return active ? (
                        <>
                          <active.icon className="h-3.5 w-3.5 text-primary" />
                          {active.label}
                        </>
                      ) : null;
                    })()}
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 p-1.5">
                  {omContextOptions.map(opt => (
                    <DropdownMenuItem
                      key={opt.key}
                      onClick={() => handleOmContextChange(opt.key)}
                      className={`cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                        omContext === opt.key
                          ? 'bg-primary/10 text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className={`h-6 w-6 rounded-md flex items-center justify-center shrink-0 ${
                        omContext === opt.key
                          ? 'bg-primary/15 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <opt.icon className="h-3.5 w-3.5" />
                      </div>
                      <span className={`text-sm flex-1 ${omContext === opt.key ? 'font-semibold' : 'font-medium'}`}>{opt.label}</span>
                      {omContext === opt.key && (
                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <nav className="flex-1 px-3 pb-6 overflow-y-auto">
            <p className="px-3 mb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Project Settings
            </p>
            <div className="space-y-0.5 mb-6">
              {currentProjectMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === item.id
                      ? "bg-muted text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {activeSection === item.id && (
                    <ChevronRight className="h-3.5 w-3.5 ml-auto" />
                  )}
                </button>
              ))}
            </div>

            <p className="px-3 mb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Org Settings
            </p>
            <div className="space-y-0.5">
              {orgMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === item.id
                      ? "bg-muted text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {activeSection === item.id && (
                    <ChevronRight className="h-3.5 w-3.5 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Right content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {variant === 'om' && !['team', 'billing', 'privacy', 'ai-providers'].includes(activeSection) && (
            <div className="px-8 py-3 border-b border-border bg-muted/20 flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Project</span>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="h-8 px-3 rounded-lg border border-border bg-card text-sm font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors cursor-pointer"
              >
                {omContext === 'appos' || omContext === 'cloud' ? (
                  <>
                    <option value="Default Project">Default Project</option>
                    <option value="HR Management Backend">HR Management Backend</option>
                    <option value="Sales Pipeline API">Sales Pipeline API</option>
                  </>
                ) : (
                  <>
                    <option value="franchise-sales-mgmt">franchise-sales-mgmt</option>
                    <option value="CRM Analytics Dashboard">CRM Analytics Dashboard</option>
                    <option value="Invoice Manager Pro">Invoice Manager Pro</option>
                    <option value="E-commerce Platform">E-commerce Platform</option>
                  </>
                )}
              </select>
            </div>
          )}
          <div className="px-8 py-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground capitalize">
                  {[...currentProjectMenuItems, ...orgMenuItems].find((i) => i.id === activeSection)?.label}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {getDescription(activeSection, variant)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 px-8 py-6">
            {renderContent(activeSection, { appOsEnabled, onAppOsToggle, cloudEnabled, onCloudToggle, appName, variant, selectedProject })}
          </div>
        </div>
      </div>
    </div>
  );
};

function renderContent(section: string, opts: { appOsEnabled: boolean; onAppOsToggle?: (v: boolean) => void; cloudEnabled: boolean; onCloudToggle?: (v: boolean) => void; appName?: string; variant: string; selectedProject?: string }) {
  switch (section) {
    case "general":
      return <GeneralSettings selectedProject={opts.variant === 'om' ? opts.selectedProject : undefined} />;
    case "domains":
      return <DomainsSettings />;
    case "knowledge":
      return <KnowledgeSettings />;
    case "connectors":
      return <ConnectorsSettings />;
    case "appos":
      return <AppOSSettings enabled={opts.appOsEnabled} onToggle={opts.onAppOsToggle || (() => {})} appName={opts.appName} />;
    case "cloud":
      return <CloudSettings enabled={opts.cloudEnabled} onToggle={opts.onCloudToggle || (() => {})} appName={opts.appName} />;
    case "developer":
      return (opts.variant === 'om' || opts.variant === 'om-project') ? <OmDeveloperSettings /> : <DeveloperSettings />;
    case "team":
      return <TeamSettings />;
    case "billing":
      return <BillingSettings />;
    case "privacy":
      return <PrivacySettings />;
    case "ai-providers":
      return <AIProvidersSettings />;
    default:
      return (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 h-60 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            {section.charAt(0).toUpperCase() + section.slice(1)} settings coming soon
          </p>
        </div>
      );
  }
}

function getDescription(section: string, variant: string = 'default'): string {
  const descriptions: Record<string, string> = {
    general: "Manage your project's basic configuration and preferences.",
    appos: "Manage AppOS backend services for your application.",
    cloud: "Manage Cloud backend services for your application.",
    domains: "Configure custom domains and hosting for your application.",
    knowledge: "Add custom knowledge and guidelines to improve your app.",
    connectors: "Connect external services and data sources.",
    developer: variant === 'om'
      ? "Manage hosted apps and web services for your project."
      : "Backend configuration, deployments, and Catalyst project details.",
    
    team: "Invite and manage team members in your organization.",
    billing: "View and manage your subscription, plans, and payment methods.",
    privacy: "Configure security policies and privacy settings.",
    "ai-providers": "Configure AI provider API keys and manage available models.",
  };
  return descriptions[section] || "";
}

export default SettingsOverlay;
