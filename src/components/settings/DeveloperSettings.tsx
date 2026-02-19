import { ExternalLink, Link2, GitBranch, MoreVertical, RefreshCw, Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DeveloperSettings = () => {
  return (
    <div className="space-y-10">
      {/* ── Catalyst by Zoho ──────────────────────────── */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
            C
          </div>
          <h4 className="text-sm font-semibold text-foreground">Catalyst by Zoho</h4>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 ml-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Connected
          </span>
        </div>

        {/* Project Details */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Project Details</p>
          <div className="grid grid-cols-2 gap-y-3 gap-x-8">
            <div>
              <span className="text-xs text-muted-foreground">Project Name</span>
              <p className="text-sm font-medium text-foreground mt-0.5">franchise-sales-prod</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Project ID</span>
              <p className="text-sm font-mono text-foreground mt-0.5">4839201748302</p>
            </div>
          </div>
          <div className="pt-3 border-t border-border">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              Open in Catalyst Console
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Connected Slate Apps */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Catalyst Slate Apps Connected</p>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">App Name</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">App URL</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Deployment</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Environment</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-3">
                    <a href="#" className="text-sm font-medium text-primary hover:underline">
                      Franchise Sales
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-mono text-xs text-foreground">franchise-sales.onslate.in</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">v2.4.1 — #a3f8c12</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600">
                      Production
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Live
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-muted transition-colors">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <RefreshCw className="h-3.5 w-3.5" />
                          Change Deployment
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Settings2 className="h-3.5 w-3.5" />
                          Change Environment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* ── GitHub ────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center shrink-0">
            <GitBranch className="h-4 w-4 text-foreground" />
          </div>
          <h4 className="text-sm font-semibold text-foreground">GitHub</h4>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-muted text-muted-foreground ml-auto">
            Not Connected
          </span>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground font-medium mb-1">Connect a GitHub repository</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Link a repository to enable version control, automatic syncing, and collaborative development for your app.
            </p>
          </div>
          <button className="h-9 px-4 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0">
            <GitBranch className="h-4 w-4" />
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeveloperSettings;
