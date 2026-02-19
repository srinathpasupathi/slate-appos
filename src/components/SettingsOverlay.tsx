import { useState } from "react";
import {
  X, Settings, Globe, BookOpen, Plug, GitBranch,
  Users, CreditCard, ShieldCheck, ChevronRight, Code2, Brain,
} from "lucide-react";
import GeneralSettings from "@/components/settings/GeneralSettings";
import DomainsSettings from "@/components/settings/DomainsSettings";
import KnowledgeSettings from "@/components/settings/KnowledgeSettings";
import ConnectorsSettings from "@/components/settings/ConnectorsSettings";

import DeveloperSettings from "@/components/settings/DeveloperSettings";
import TeamSettings from "@/components/settings/TeamSettings";
import BillingSettings from "@/components/settings/BillingSettings";
import PrivacySettings from "@/components/settings/PrivacySettings";
import AIProvidersSettings from "@/components/settings/AIProvidersSettings";

const projectMenuItems = [
  { id: "general", label: "General", icon: Settings },
  { id: "domains", label: "Domains & Hosting", icon: Globe },
  { id: "knowledge", label: "Knowledge", icon: BookOpen },
  { id: "connectors", label: "Connectors", icon: Plug },
  { id: "developer", label: "Developer Settings", icon: Code2 },
];

const orgMenuItems = [
  { id: "team", label: "My Team", icon: Users },
  { id: "billing", label: "Plans & Billing", icon: CreditCard },
  { id: "privacy", label: "Privacy & Security", icon: ShieldCheck },
  { id: "ai-providers", label: "AI Providers", icon: Brain },
];

interface SettingsOverlayProps {
  open: boolean;
  onClose: () => void;
}

const SettingsOverlay = ({ open, onClose }: SettingsOverlayProps) => {
  const [activeSection, setActiveSection] = useState("general");

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
          <div className="px-6 py-5">
            <h2 className="text-lg font-semibold text-foreground">Settings</h2>
          </div>

          <nav className="flex-1 px-3 pb-6 overflow-y-auto">
            <p className="px-3 mb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              App Settings
            </p>
            <div className="space-y-0.5 mb-6">
              {projectMenuItems.map((item) => (
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
          <div className="px-8 py-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground capitalize">
                  {[...projectMenuItems, ...orgMenuItems].find((i) => i.id === activeSection)?.label}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {getDescription(activeSection)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 px-8 py-6">
            {renderContent(activeSection)}
          </div>
        </div>
      </div>
    </div>
  );
};

function renderContent(section: string) {
  switch (section) {
    case "general":
      return <GeneralSettings />;
    case "domains":
      return <DomainsSettings />;
    case "knowledge":
      return <KnowledgeSettings />;
    case "connectors":
      return <ConnectorsSettings />;
    case "developer":
      return <DeveloperSettings />;
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

function getDescription(section: string): string {
  const descriptions: Record<string, string> = {
    general: "Manage your project's basic configuration and preferences.",
    domains: "Configure custom domains and hosting for your application.",
    knowledge: "Add custom knowledge and guidelines to improve your app.",
    connectors: "Connect external services and data sources.",
    developer: "Backend configuration, deployments, and Catalyst project details.",
    
    team: "Invite and manage team members in your organization.",
    billing: "View and manage your subscription, plans, and payment methods.",
    privacy: "Configure security policies and privacy settings.",
    "ai-providers": "Configure AI provider API keys and manage available models.",
  };
  return descriptions[section] || "";
}

export default SettingsOverlay;
