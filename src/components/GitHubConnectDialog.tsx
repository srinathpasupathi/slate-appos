import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Github, Loader2, ChevronRight, ArrowLeft, AlertTriangle, X } from "lucide-react";

interface Repo {
  id: string;
  name: string;
  language: string | null;
  description: string;
  updatedAt: string;
  isPrivate: boolean;
}

const MOCK_REPOS: Repo[] = [
  { id: "r1", name: "crm-dashboard", language: "TypeScript", description: "Customer relationship management UI", updatedAt: "2 days ago", isPrivate: false },
  { id: "r2", name: "sales-api", language: "Java", description: "Sales REST API backend", updatedAt: "1 week ago", isPrivate: true },
  { id: "r3", name: "marketing-site", language: "JavaScript", description: "Company marketing website", updatedAt: "3 days ago", isPrivate: false },
  { id: "r4", name: "data-pipeline", language: "Python", description: "ETL data processing pipeline", updatedAt: "5 days ago", isPrivate: true },
  { id: "r5", name: "mobile-app", language: "TypeScript", description: "React Native mobile application", updatedAt: "1 day ago", isPrivate: false },
  { id: "r6", name: "auth-service", language: "Go", description: "Authentication microservice", updatedAt: "1 week ago", isPrivate: true },
  { id: "r7", name: "admin-panel", language: "TypeScript", description: "Internal admin dashboard", updatedAt: "2 days ago", isPrivate: false },
];

const JS_LANGUAGES = ["JavaScript", "TypeScript"];
const isJSProject = (lang: string | null) => lang !== null && JS_LANGUAGES.includes(lang);

type Step = "orgs" | "repos" | "checking" | "error" | "connecting";

interface GitHubConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnected: (repoName: string) => void;
}

const GitHubConnectDialog = ({ open, onOpenChange, onConnected }: GitHubConnectDialogProps) => {
  const [step, setStep] = useState<Step>("orgs");
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);

  const handleSelectOrg = () => {
    setStep("repos");
  };

  const handleSelectRepo = (repo: Repo) => {
    setSelectedRepo(repo);
    setStep("checking");

    // Simulate compatibility check
    setTimeout(() => {
      if (!isJSProject(repo.language)) {
        setStep("error");
      } else {
        setStep("connecting");
        setTimeout(() => {
          onConnected(repo.name);
          resetState();
        }, 3000);
      }
    }, 1800);
  };

  const resetState = () => {
    setStep("orgs");
    setSelectedRepo(null);
  };

  const handleBack = () => {
    if (step === "error") {
      setStep("repos");
      setSelectedRepo(null);
    } else {
      setStep("orgs");
      setSelectedRepo(null);
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val && step !== "connecting" && step !== "checking") {
      onOpenChange(false);
      resetState();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 bg-card border-border overflow-hidden">
        {step === "checking" && (
          <div className="flex flex-col items-center justify-center py-16 px-8">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-5">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1.5">
              Checking compatibility…
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              Analyzing <span className="font-medium text-foreground">{selectedRepo?.name}</span> to verify it's a supported project.
            </p>
            <div className="mt-6 w-48 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary animate-pulse" style={{ width: "45%" }} />
            </div>
          </div>
        )}

        {step === "connecting" && (
          <div className="flex flex-col items-center justify-center py-16 px-8">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-5">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1.5">
              Pulling repository…
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              Fetching <span className="font-medium text-foreground">{selectedRepo?.name}</span> and setting up your workspace.
            </p>
            <div className="mt-6 w-48 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary animate-pulse" style={{ width: "60%" }} />
            </div>
          </div>
        )}

        {step === "error" && selectedRepo && (
          <div className="flex flex-col items-center justify-center py-12 px-8">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-5">
              <X className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1.5">
              Incompatible Repository
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              <span className="font-medium text-foreground">{selectedRepo.name}</span> is a <span className="font-medium text-foreground">{selectedRepo.language}</span> project.
            </p>
            <div className="w-full rounded-lg bg-destructive/5 border border-destructive/20 p-4 mb-6">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Only JavaScript & TypeScript projects are supported</p>
                  <p>This product console is designed for web applications built with JS/TS frameworks like React, Next.js, Vue, etc. <span className="font-medium text-foreground">{selectedRepo.language}</span> projects cannot be imported.</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={handleBack}
                className="flex-1 h-9 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Choose another repo
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Or continue using the AI IDE to build from scratch — no repo needed.
            </p>
          </div>
        )}

        {(step === "orgs" || step === "repos") && (
          <>
            <DialogHeader className="px-5 pt-5 pb-0">
              <div className="flex items-center gap-2">
                {step === "repos" && (
                  <button onClick={handleBack} className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors -ml-1">
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                )}
                <DialogTitle className="text-base font-semibold">
                  {step === "orgs" ? "Continue on Om Console" : "srinathpasupathi157"}
                </DialogTitle>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {step === "orgs"
                  ? "Continue your development on Om Console. Connect your repository to proceed."
                  : "Choose a repository to connect. We'll check compatibility after selection."}
              </p>
            </DialogHeader>

            <div className="px-5 py-4">
              {step === "orgs" && (
                <div className="space-y-1">
                  <button
                    onClick={handleSelectOrg}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center overflow-hidden group-hover:ring-2 group-hover:ring-primary/20 transition-all">
                      <Github className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="text-sm font-medium text-foreground block">srinathpasupathi157</span>
                      <span className="text-[11px] text-muted-foreground">GitHub Organization</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                  </button>
                </div>
              )}

              {step === "repos" && (
                <div className="space-y-1 max-h-[380px] overflow-y-auto">
                  {MOCK_REPOS.map((repo) => (
                    <button
                      key={repo.id}
                      onClick={() => handleSelectRepo(repo)}
                      className="w-full text-left px-3 py-3 rounded-lg hover:bg-muted transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-2">
                          <Github className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">{repo.name}</span>
                          {repo.isPrivate && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">Private</span>
                          )}
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {repo.language || "Unknown"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground ml-5.5 line-clamp-1">{repo.description}</p>
                      <span className="text-[10px] text-muted-foreground/60 ml-5.5 mt-1 block">Updated {repo.updatedAt}</span>
                    </button>
                  ))}
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
