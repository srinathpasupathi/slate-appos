import { Database, ExternalLink } from "lucide-react";

interface AppOSSettingsProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  appName?: string;
}

const AppOSSettings = ({ enabled, onToggle, appName = "My App" }: AppOSSettingsProps) => {
  return (
    <div className="space-y-6">
      {!enabled ? (
        <div className="rounded-xl border border-border bg-card p-6 text-center space-y-4">
          <div className="mx-auto h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
            <Database className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Enable AppOS</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Backend for apps that use Zoho SSO — ideal for internal business tools with built-in modules, users, workflows, and permissions.
            </p>
          </div>
          <button
            onClick={() => onToggle(true)}
            className="h-9 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Enable AppOS
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Database className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{appName}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Created just now · by You
                  </p>
                </div>
              </div>
              <a
                href={`/om/project?source=platform&name=${encodeURIComponent(appName)}&tab=appos`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                Open Project
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">AppOS once enabled cannot be disabled.</p>
        </div>
      )}
    </div>
  );
};

export default AppOSSettings;
