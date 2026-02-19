import { useState } from "react";
import { Plug, Plus, X, ExternalLink, Server } from "lucide-react";

const nativeConnectors = [
  { name: "Catalyst by Zoho", description: "Serverless platform for full-stack apps", connected: true, icon: "C" },
  { name: "Zoho CRM", description: "Customer relationship management", connected: false, icon: "Z" },
  { name: "Vertical Studio", description: "Low-code app development platform", connected: false, icon: "V" },
  { name: "Shopify", description: "E-commerce storefront integration", connected: false, icon: "S" },
];

const ConnectorsSettings = () => {
  const [showMcpForm, setShowMcpForm] = useState(false);
  const [mcpName, setMcpName] = useState("");
  const [mcpUrl, setMcpUrl] = useState("");
  const [mcpAuth, setMcpAuth] = useState("oauth");

  return (
    <div className="space-y-8">
      {/* Shared Connectors */}
      <section>
        <h4 className="text-sm font-semibold text-foreground mb-4">Shared Connectors</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {nativeConnectors.map((c) => (
            <div key={c.name} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground truncate">{c.description}</p>
              </div>
              {c.connected ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Connected
                </span>
              ) : (
                <button className="h-8 px-3 rounded-lg border border-input text-xs font-medium text-foreground hover:bg-muted transition-colors shrink-0">
                  Connect
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Remote MCP */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-foreground">Remote MCP Servers</h4>
          <button
            onClick={() => setShowMcpForm(true)}
            className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Add MCP Server
          </button>
        </div>

        {/* Empty state */}
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 flex flex-col items-center justify-center text-center">
          <Server className="h-8 w-8 text-muted-foreground/50 mb-3" />
          <p className="text-sm font-medium text-muted-foreground mb-1">No remote MCP servers connected</p>
          <p className="text-xs text-muted-foreground">Add your own MCP server to extend Slate's capabilities.</p>
        </div>
      </section>

      {/* Add MCP Server Popup */}
      {showMcpForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMcpForm(false)} />
          <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 fade-in-0 duration-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-foreground">Add MCP Server</h3>
              <button
                onClick={() => setShowMcpForm(false)}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Server Name</label>
                <input
                  type="text"
                  value={mcpName}
                  onChange={(e) => setMcpName(e.target.value)}
                  placeholder="e.g. My Custom MCP"
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Server URL</label>
                <input
                  type="url"
                  value={mcpUrl}
                  onChange={(e) => setMcpUrl(e.target.value)}
                  placeholder="https://mcp.example.com/api"
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">Authentication</label>
                <div className="space-y-1">
                  {[
                    { id: "oauth", label: "OAuth (default)", description: "Authorize in the next step." },
                    { id: "bearer", label: "Bearer token or API key", description: "Use a bearer token or API key if the MCP server doesn't support OAuth." },
                    { id: "none", label: "No authentication", description: "Connect without credentials if the server doesn't require authentication." },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setMcpAuth(opt.id)}
                      className={`w-full text-left rounded-xl px-4 py-3 border transition-colors ${
                        mcpAuth === opt.id
                          ? "border-primary bg-primary/5"
                          : "border-transparent hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          mcpAuth === opt.id ? "border-primary" : "border-muted-foreground/40"
                        }`}>
                          {mcpAuth === opt.id && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{opt.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{opt.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {mcpAuth === "bearer" && (
                  <div className="mt-3 pl-7">
                    <input
                      type="password"
                      placeholder="Enter API key or bearer token"
                      className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  onClick={() => setShowMcpForm(false)}
                  className="h-10 px-5 rounded-lg border border-input text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Add &amp; authorize
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectorsSettings;
