import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Github, Check, X, AlertTriangle, Loader2, ChevronRight, Building2, ArrowLeft } from "lucide-react";

interface Org {
  id: string;
  name: string;
  avatar: string;
}

interface Repo {
  id: string;
  name: string;
  language: string | null;
  description: string;
  updatedAt: string;
  isPrivate: boolean;
}

const MOCK_ORGS: Org[] = [
  { id: "1", name: "acme-corp", avatar: "A" },
  { id: "2", name: "globex-inc", avatar: "G" },
  { id: "3", name: "initech", avatar: "I" },
];

const MOCK_REPOS: Record<string, Repo[]> = {
  "1": [
    { id: "r1", name: "crm-dashboard", language: "TypeScript", description: "Customer relationship management UI", updatedAt: "2 days ago", isPrivate: false },
    { id: "r2", name: "sales-api", language: "Java", description: "Sales REST API backend", updatedAt: "1 week ago", isPrivate: true },
    { id: "r3", name: "marketing-site", language: "JavaScript", description: "Company marketing website", updatedAt: "3 days ago", isPrivate: false },
    { id: "r4", name: "data-pipeline", language: "Python", description: "ETL data processing pipeline", updatedAt: "5 days ago", isPrivate: true },
    { id: "r5", name: "mobile-app", language: "TypeScript", description: "React Native mobile application", updatedAt: "1 day ago", isPrivate: false },
  ],
  "2": [
    { id: "r6", name: "inventory-app", language: "JavaScript", description: "Inventory management system", updatedAt: "4 days ago", isPrivate: false },
    { id: "r7", name: "auth-service", language: "Go", description: "Authentication microservice", updatedAt: "1 week ago", isPrivate: true },
    { id: "r8", name: "admin-panel", language: "TypeScript", description: "Internal admin dashboard", updatedAt: "2 days ago", isPrivate: false },
  ],
  "3": [
    { id: "r9", name: "reporting-tool", language: "Python", description: "Business intelligence reports", updatedAt: "6 days ago", isPrivate: false },
    { id: "r10", name: "widget-library", language: "TypeScript", description: "Shared UI component library", updatedAt: "3 days ago", isPrivate: false },
    { id: "r11", name: "backend-services", language: "Java", description: "Monolithic backend services", updatedAt: "2 weeks ago", isPrivate: true },
  ],
};

const JS_LANGUAGES = ["JavaScript", "TypeScript"];

const isJSProject = (lang: string | null) => lang !== null && JS_LANGUAGES.includes(lang);

type Step = "orgs" | "repos" | "connecting";

interface GitHubConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnected: (repoName: string) => void;
}

const GitHubConnectDialog = ({ open, onOpenChange, onConnected }: GitHubConnectDialogProps) => {
  const [step, setStep] = useState<Step>("orgs");
  const [selectedOrg, setSelectedOrg] = useState<Org | null>(null);
  const [connectingRepo, setConnectingRepo] = useState<string | null>(null);

  const handleSelectOrg = (org: Org) => {
    setSelectedOrg(org);
    setStep("repos");
  };

  const handleSelectRepo = (repo: Repo) => {
    if (!isJSProject(repo.language)) return;
    setConnectingRepo(repo.name);
    setStep("connecting");

    // Simulate pulling
    setTimeout(() => {
      onConnected(repo.name);
      // Reset state for next open
      setStep("orgs");
      setSelectedOrg(null);
      setConnectingRepo(null);
    }, 3000);
  };

  const handleBack = () => {
    setStep("orgs");
    setSelectedOrg(null);
  };

  const handleOpenChange = (val: boolean) => {
    if (!val && step !== "connecting") {
      onOpenChange(false);
      setStep("orgs");
      setSelectedOrg(null);
    }
  };

  const repos = selectedOrg ? MOCK_REPOS[selectedOrg.id] || [] : [];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 bg-card border-border overflow-hidden">
        {step === "connecting" ? (
          <div className="flex flex-col items-center justify-center py-16 px-8">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-5">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1.5">
              Pulling repository…
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              Fetching <span className="font-medium text-foreground">{connectingRepo}</span> and setting up your workspace.
            </p>
            <div className="mt-6 w-48 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary animate-pulse" style={{ width: "60%" }} />
            </div>
          </div>
        ) : (
          <>
            <DialogHeader className="px-5 pt-5 pb-0">
              <div className="flex items-center gap-2">
                {step === "repos" && (
                  <button onClick={handleBack} className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors -ml-1">
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                )}
                <DialogTitle className="text-base font-semibold">
                  {step === "orgs" ? "Connect GitHub" : `${selectedOrg?.name}`}
                </DialogTitle>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {step === "orgs"
                  ? "Select a GitHub organization to browse repositories."
                  : "Choose a JavaScript or TypeScript repository to connect."}
              </p>
            </DialogHeader>

            <div className="px-5 py-4">
              {step === "orgs" && (
                <div className="space-y-1">
                  {MOCK_ORGS.map((org) => (
                    <button
                      key={org.id}
                      onClick={() => handleSelectOrg(org)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {org.avatar}
                      </div>
                      <span className="text-sm font-medium text-foreground flex-1 text-left">{org.name}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                    </button>
                  ))}
                </div>
              )}

              {step === "repos" && (
                <div className="space-y-1 max-h-[340px] overflow-y-auto">
                  {repos.map((repo) => {
                    const compatible = isJSProject(repo.language);
                    return (
                      <button
                        key={repo.id}
                        onClick={() => handleSelectRepo(repo)}
                        disabled={!compatible}
                        className={`w-full text-left px-3 py-3 rounded-lg transition-colors group ${
                          compatible
                            ? "hover:bg-muted cursor-pointer"
                            : "opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <div className="flex items-center gap-2">
                            <Github className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">{repo.name}</span>
                            {repo.isPrivate && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">Private</span>
                            )}
                          </div>
                          {compatible ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              <Check className="h-2.5 w-2.5" />
                              Compatible
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-destructive bg-destructive/10 px-1.5 py-0.5 rounded">
                              <X className="h-2.5 w-2.5" />
                              Unsupported
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground ml-5.5 line-clamp-1">{repo.description}</p>
                        <div className="flex items-center gap-3 ml-5.5 mt-1">
                          <span className={`text-[10px] font-medium ${compatible ? "text-muted-foreground" : "text-destructive/70"}`}>
                            {repo.language || "Unknown"}
                          </span>
                          <span className="text-[10px] text-muted-foreground/60">Updated {repo.updatedAt}</span>
                        </div>
                        {!compatible && (
                          <div className="flex items-center gap-1.5 ml-5.5 mt-1.5">
                            <AlertTriangle className="h-3 w-3 text-amber-500" />
                            <span className="text-[10px] text-amber-600">Only JavaScript / TypeScript projects are supported</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GitHubConnectDialog;
