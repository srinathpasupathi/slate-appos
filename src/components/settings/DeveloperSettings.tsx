import { Server, ExternalLink, Link2 } from "lucide-react";

const DeveloperSettings = () => {
  return (
    <div className="space-y-8">
      {/* Connected Backend */}
      <section>
        <h4 className="text-sm font-semibold text-foreground mb-4">Connected Backend</h4>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
              C
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Catalyst by Zoho</p>
              <p className="text-xs text-muted-foreground">Serverless platform for full-stack apps</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Connected
            </span>
          </div>
        </div>
      </section>

      {/* Catalyst Project */}
      <section>
        <h4 className="text-sm font-semibold text-foreground mb-4">Catalyst Project</h4>
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Project Name</span>
            <span className="text-sm font-medium text-foreground">franchise-sales-prod</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Project ID</span>
            <span className="text-sm font-mono text-foreground">4839201748302</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Environment</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600">Production</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Region</span>
            <span className="text-sm font-medium text-foreground">US (Ohio)</span>
          </div>
          <div className="pt-2 border-t border-border">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              Open in Catalyst Console
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </section>

      {/* App URL to Deployment Mapping */}
      <section>
        <h4 className="text-sm font-semibold text-foreground mb-4">App URL → Slate App / Deployment Mapping</h4>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">App URL</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Slate App</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Deployment</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-mono text-xs text-foreground">franchise-sales.onslate.in</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-foreground font-medium">Franchise Sales</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">v2.4.1 — #a3f8c12</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Live
                  </span>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-mono text-xs text-foreground">staging.franchise-sales.onslate.in</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-foreground font-medium">Franchise Sales</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">v2.5.0-beta — #d91e4b7</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Staging
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DeveloperSettings;
