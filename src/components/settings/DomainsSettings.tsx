import { useState } from "react";
import { Globe, Plus, ExternalLink, ShoppingCart, Link2, Check, Copy } from "lucide-react";

const DomainsSettings = () => {
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [domainInput, setDomainInput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Current Domain */}
      <section>
        <h4 className="text-sm font-semibold text-foreground mb-4">Current Domain</h4>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">franchise-sales.onslate.in</p>
                <p className="text-xs text-muted-foreground">Default hosted URL</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
              <button
                onClick={() => handleCopy("franchise-sales.onslate.in")}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              <a href="https://franchise-sales.onslate.in" target="_blank" rel="noreferrer" className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Add Domain Options */}
      <section>
        <h4 className="text-sm font-semibold text-foreground mb-4">Connect a Domain</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Add existing domain */}
          <button
            onClick={() => setShowAddDomain(true)}
            className="rounded-xl border border-border bg-card p-5 text-left hover:border-primary/30 hover:shadow-sm transition-all group"
          >
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
              <Link2 className="h-5 w-5 text-accent" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">Add Existing Domain</p>
            <p className="text-xs text-muted-foreground">Connect a domain you already own by updating DNS records.</p>
          </button>

          {/* Purchase domain */}
          <button className="rounded-xl border border-border bg-card p-5 text-left hover:border-primary/30 hover:shadow-sm transition-all group">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">Purchase New Domain</p>
            <p className="text-xs text-muted-foreground">Search and register a new domain directly from Slate.</p>
          </button>
        </div>
      </section>

      {/* Add existing domain flow */}
      {showAddDomain && (
        <section>
          <h4 className="text-sm font-semibold text-foreground mb-4">Connect Your Domain</h4>
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Domain Name</label>
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="e.g. myapp.com"
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <p className="text-xs font-semibold text-foreground">DNS Configuration Required</p>
              <p className="text-xs text-muted-foreground">Add the following records at your domain registrar:</p>
              <div className="space-y-1.5 mt-2">
                <DnsRecord type="A" name="@" value="185.158.133.1" />
                <DnsRecord type="A" name="www" value="185.158.133.1" />
                <DnsRecord type="TXT" name="_slate" value="slate_verify=abc123xyz" />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                Verify & Connect
              </button>
              <button
                onClick={() => setShowAddDomain(false)}
                className="h-9 px-4 rounded-lg border border-input text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const DnsRecord = ({ type, name, value }: { type: string; name: string; value: string }) => (
  <div className="flex items-center gap-3 text-xs">
    <span className="font-mono font-bold text-foreground bg-muted px-2 py-0.5 rounded">{type}</span>
    <span className="text-muted-foreground w-12">{name}</span>
    <span className="font-mono text-foreground">{value}</span>
  </div>
);

export default DomainsSettings;
