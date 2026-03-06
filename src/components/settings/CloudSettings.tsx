import { Cloud, ExternalLink } from "lucide-react";

interface CloudSettingsProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  appName?: string;
}

const CloudSettings = ({ enabled, onToggle, appName = "My App" }: CloudSettingsProps) => {
  const projectSlug = appName.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-6">
      {!enabled ? (
        <div className="rounded-xl border border-border bg-card p-6 text-center space-y-4">
          <div className="mx-auto h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
            <Cloud className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Enable Cloud</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Independent backend with database, authentication, storage, and serverless functions for apps with custom signup/login.
            </p>
          </div>
          <button
            onClick={() => onToggle(true)}
            className="h-9 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Enable Cloud
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Cloud className="h-4.5 w-4.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{appName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {projectSlug}.us.omcloud.ai
                  </p>
                </div>
              </div>
              <a
                href={`/om/project?source=cloud&name=${encodeURIComponent(appName)}&tab=cloud`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                Open Project
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Status</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <p className="text-sm text-foreground">Active</p>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Region</p>
                <p className="text-sm text-foreground mt-1">US</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">Cloud once enabled cannot be disabled.</p>
        </div>
      )}
    </div>
  );
};

export default CloudSettings;
