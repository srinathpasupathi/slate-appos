import { useState, useMemo } from "react";
import { Globe, Trash2, User, Clock, Link2, Zap } from "lucide-react";

const projectData: Record<string, { creator: string; created: string; url: string; credits: string }> = {
  "franchise-sales-mgmt": { creator: "Srinath", created: "Feb 10, 2026 · 9:20 AM", url: "franchise-sales.onslate.in", credits: "24,350" },
  "CRM Analytics Dashboard": { creator: "Srinath", created: "Jan 25, 2026 · 3:15 PM", url: "crm-analytics.onslate.in", credits: "18,200" },
  "Invoice Manager Pro": { creator: "Arun", created: "Mar 01, 2026 · 11:00 AM", url: "invoice-mgr.onslate.in", credits: "9,870" },
  "E-commerce Platform": { creator: "Priya", created: "Dec 15, 2025 · 2:45 PM", url: "ecommerce-app.onslate.in", credits: "31,500" },
  "Default Project": { creator: "Srinath", created: "Feb 10, 2026 · 9:20 AM", url: "default-project.onslate.in", credits: "5,000" },
  "HR Management Backend": { creator: "Arun", created: "Jan 18, 2026 · 10:30 AM", url: "hr-mgmt.onslate.in", credits: "12,400" },
  "Sales Pipeline API": { creator: "Priya", created: "Feb 28, 2026 · 4:00 PM", url: "sales-pipeline.onslate.in", credits: "7,650" },
};

const defaultProject = { creator: "Srinath", created: "Feb 10, 2026 · 9:20 AM", url: "franchise-sales.onslate.in", credits: "24,350" };

interface GeneralSettingsProps {
  selectedProject?: string;
}

const GeneralSettings = ({ selectedProject }: GeneralSettingsProps) => {
  const [visibility, setVisibility] = useState<"published" | "not_published">("published");

  const project = useMemo(() => {
    if (!selectedProject) return { name: "franchise-sales-mgmt", ...defaultProject };
    const data = projectData[selectedProject] || defaultProject;
    return { name: selectedProject, ...data };
  }, [selectedProject]);

  return (
    <div className="space-y-8">
      {/* App Info Section */}
      <section>
        <h4 className="text-sm font-semibold text-foreground mb-4">App Information</h4>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="divide-y divide-border">
            <InfoRow icon={<Globe className="h-4 w-4" />} label="App Name" value={project.name} />
            <InfoRow icon={<User className="h-4 w-4" />} label="Created By" value={project.creator} />
            <InfoRow icon={<Clock className="h-4 w-4" />} label="Created Time" value={project.created} />
            <InfoRow
              icon={<Link2 className="h-4 w-4" />}
              label="Hosted URL"
              value={
                <a href={`https://${project.url}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  {project.url}
                </a>
              }
            />
            <InfoRow icon={<Zap className="h-4 w-4" />} label="Credits Used" value={project.credits} />
          </div>
        </div>
      </section>

      {/* Configuration Section */}
      <section>
        <h4 className="text-sm font-semibold text-foreground mb-4">Configuration</h4>
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-5">
            <label className="text-sm font-medium text-foreground mb-3 block">App Visibility</label>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  visibility === "published"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-amber-500/10 text-amber-600"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${visibility === "published" ? "bg-emerald-500" : "bg-amber-500"}`} />
                  {visibility === "published" ? "Published" : "Not Yet Published"}
                </span>
              </div>
              <button
                onClick={() => setVisibility(visibility === "published" ? "not_published" : "published")}
                className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                {visibility === "published" ? "Unpublish" : "Publish"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Delete App</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Permanently delete this app and all associated data. This action cannot be undone.
                </p>
              </div>
              <button className="h-9 px-4 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors flex items-center gap-2">
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <div className="flex items-center gap-4 px-5 py-3.5">
    <span className="text-muted-foreground">{icon}</span>
    <span className="text-sm text-muted-foreground w-32 shrink-0">{label}</span>
    <span className="text-sm font-medium text-foreground">{value}</span>
  </div>
);

export default GeneralSettings;
