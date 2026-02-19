import { useState } from "react";
import { Plug, Plus, X, ExternalLink, Server, Check, Trash2 } from "lucide-react";

const nativeConnectors = [
  { name: "Catalyst by Zoho", description: "Serverless platform for full-stack apps", connected: true, icon: "C" },
  { name: "Zoho CRM", description: "Customer relationship management", connected: false, icon: "Z" },
  { name: "Vertical Studio", description: "Low-code app development platform", connected: false, icon: "V" },
  { name: "Shopify", description: "E-commerce storefront integration", connected: false, icon: "S" },
];

const zohoMcpServers = [
  { id: "crm-mcp", name: "Zoho CRM MCP", description: "Access CRM data, contacts, and deals", url: "https://mcp.zoho.com/crm" },
  { id: "desk-mcp", name: "Zoho Desk MCP", description: "Support tickets and customer service", url: "https://mcp.zoho.com/desk" },
  { id: "analytics-mcp", name: "Zoho Analytics MCP", description: "Dashboards, reports, and data insights", url: "https://mcp.zoho.com/analytics" },
];

interface ConnectedMcp {
  id: string;
  name: string;
  url: string;
  source: "zoho" | "custom";
  auth: string;
}

const ConnectorsSettings = () => {
  const [mcpStep, setMcpStep] = useState<"chooser" | "zoho" | "custom" | null>(null);
  const [mcpName, setMcpName] = useState("");
  const [mcpUrl, setMcpUrl] = useState("");
  const [mcpAuth, setMcpAuth] = useState("oauth");
  const [selectedZohoMcp, setSelectedZohoMcp] = useState<string | null>(null);
  const [connectedMcps, setConnectedMcps] = useState<ConnectedMcp[]>([]);

  const handleAddZohoMcp = () => {
    if (!selectedZohoMcp) return;
    const server = zohoMcpServers.find((s) => s.id === selectedZohoMcp);
    if (!server) return;
    if (connectedMcps.some((m) => m.id === server.id)) return;
    setConnectedMcps((prev) => [...prev, { id: server.id, name: server.name, url: server.url, source: "zoho", auth: "oauth" }]);
    setSelectedZohoMcp(null);
    setMcpStep(null);
  };

  const handleAddCustomMcp = () => {
    if (!mcpName.trim() || !mcpUrl.trim()) return;
    const id = `custom-${Date.now()}`;
    setConnectedMcps((prev) => [...prev, { id, name: mcpName, url: mcpUrl, source: "custom", auth: mcpAuth }]);
    setMcpName("");
    setMcpUrl("");
    setMcpAuth("oauth");
    setMcpStep(null);
  };

  const handleRemoveMcp = (id: string) => {
    setConnectedMcps((prev) => prev.filter((m) => m.id !== id));
  };

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
            onClick={() => setMcpStep("chooser")}
            className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Add MCP Server
          </button>
        </div>

        {connectedMcps.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 flex flex-col items-center justify-center text-center">
            <Server className="h-8 w-8 text-muted-foreground/50 mb-3" />
            <p className="text-sm font-medium text-muted-foreground mb-1">No remote MCP servers connected</p>
            <p className="text-xs text-muted-foreground">Add your own MCP server to extend Slate's capabilities.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {connectedMcps.map((mcp) => (
              <div key={mcp.id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                  mcp.source === "zoho" ? "bg-primary/10 text-primary" : "bg-muted text-foreground"
                }`}>
                  {mcp.source === "zoho" ? "Z" : <Server className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{mcp.name}</p>
                  <p className="text-xs text-muted-foreground font-mono truncate">{mcp.url}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground capitalize shrink-0">
                  {mcp.auth}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Connected
                </span>
                <button
                  onClick={() => handleRemoveMcp(mcp.id)}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add MCP Server Popup */}
      {mcpStep !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMcpStep(null)} />
          <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 fade-in-0 duration-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-foreground">
                {mcpStep === "chooser" ? "Add MCP Server" : mcpStep === "zoho" ? "Configure with Zoho MCP" : "Add Custom MCP Server"}
              </h3>
              <button
                onClick={() => setMcpStep(null)}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {mcpStep === "chooser" ? (
              <div className="space-y-3">
                <button
                  onClick={() => setMcpStep("zoho")}
                  className="w-full rounded-xl border border-border bg-card hover:bg-muted/50 p-4 flex items-center gap-4 transition-colors text-left"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    Z
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">Configure with Zoho MCP</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Choose from your existing Zoho MCP servers or create a new one.</p>
                  </div>
                </button>

                <button
                  onClick={() => setMcpStep("custom")}
                  className="w-full rounded-xl border border-border bg-card hover:bg-muted/50 p-4 flex items-center gap-4 transition-colors text-left"
                >
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Server className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">Add Custom MCP Server</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Connect your own remote MCP server with a URL and credentials.</p>
                  </div>
                </button>
              </div>
            ) : mcpStep === "zoho" ? (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">Select an MCP server from your Zoho account to connect.</p>
                <div className="space-y-2">
                  {zohoMcpServers.map((server) => {
                    const alreadyAdded = connectedMcps.some((m) => m.id === server.id);
                    return (
                      <button
                        key={server.id}
                        onClick={() => !alreadyAdded && setSelectedZohoMcp(server.id)}
                        disabled={alreadyAdded}
                        className={`w-full text-left rounded-xl px-4 py-3 border transition-colors ${
                          alreadyAdded
                            ? "border-border bg-muted/30 opacity-60 cursor-not-allowed"
                            : selectedZohoMcp === server.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            alreadyAdded ? "border-emerald-500" : selectedZohoMcp === server.id ? "border-primary" : "border-muted-foreground/40"
                          }`}>
                            {alreadyAdded ? (
                              <Check className="h-2.5 w-2.5 text-emerald-500" />
                            ) : selectedZohoMcp === server.id ? (
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            ) : null}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-foreground">{server.name}</p>
                              {alreadyAdded && (
                                <span className="text-[10px] font-medium text-emerald-600">Added</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{server.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <a
                  href="https://mcp.zoho.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  <Plus className="h-3 w-3" />
                  Create a new MCP server on Zoho MCP
                  <ExternalLink className="h-3 w-3" />
                </a>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
                  <button
                    onClick={() => { setMcpStep("chooser"); setSelectedZohoMcp(null); }}
                    className="h-10 px-5 rounded-lg border border-input text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    Back
                  </button>
                  <button
                    disabled={!selectedZohoMcp}
                    onClick={handleAddZohoMcp}
                    className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add server
                  </button>
                </div>
              </div>
            ) : (

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
                  onClick={() => setMcpStep("chooser")}
                  className="h-10 px-5 rounded-lg border border-input text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleAddCustomMcp}
                  className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Add &amp; authorize
                </button>
              </div>
            </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectorsSettings;
