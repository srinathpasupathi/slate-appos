import { GitBranch, ExternalLink, Plus } from "lucide-react";

const GitHubSettings = () => {
  return (
    <div className="space-y-8">
      {/* Connect GitHub */}
      <section>
        <h4 className="text-sm font-semibold text-foreground mb-4">GitHub Integration</h4>
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center text-center">
          <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <GitBranch className="h-7 w-7 text-foreground" />
          </div>
          <h5 className="text-sm font-semibold text-foreground mb-1">Connect your GitHub account</h5>
          <p className="text-xs text-muted-foreground max-w-sm mb-5">
            Link a GitHub repository to enable version control, automatic syncing, and collaborative development for your app.
          </p>
          <button className="h-10 px-5 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Connect GitHub
          </button>
        </div>
      </section>

      {/* Connected Accounts (placeholder) */}
      <section>
        <h4 className="text-sm font-semibold text-foreground mb-4">Connected Accounts</h4>
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-muted-foreground">No GitHub accounts connected yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Connect your account above to get started.</p>
        </div>
      </section>
    </div>
  );
};

export default GitHubSettings;
