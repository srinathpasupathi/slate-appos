import { CheckCircle2, AlertCircle, Cloud } from "lucide-react";

interface CloudSettingsProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const CloudSettings = ({ enabled, onToggle }: CloudSettingsProps) => {
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
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Cloud is enabled</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Cloud backend services are active for this app.</p>
                </div>
              </div>
              <button
                onClick={() => onToggle(false)}
                className="h-8 px-3 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Disable
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-5">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No Cloud Project is associated.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CloudSettings;
