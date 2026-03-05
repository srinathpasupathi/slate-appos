import { useState } from "react";
import { Copy, Check, Image, Upload, FolderPlus, Info } from "lucide-react";

interface Bucket {
  name: string;
  url: string;
}

const BUCKETS: Bucket[] = [
  { name: "test12346-development", url: "https://test12346-development.zohostratus.in" },
];

type SubTab = "objects" | "permissions" | "configurations";

const ObjectStorageView = () => {
  const [selectedBucket] = useState(BUCKETS[0].name);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("objects");
  const [copied, setCopied] = useState(false);

  const bucket = BUCKETS.find(b => b.name === selectedBucket) || BUCKETS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(bucket.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      {/* Sub-tabs */}
      <div className="border-b border-border flex gap-0">
        {([
          { id: "objects" as SubTab, label: "Objects" },
          { id: "permissions" as SubTab, label: "Bucket Permissions" },
          { id: "configurations" as SubTab, label: "Configurations" },
        ]).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeSubTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ─── Objects Tab ─── */}
        {activeSubTab === "objects" && (
          <div className="flex h-full">
            {/* Left: Upload area */}
            <div className="flex-1 flex flex-col items-center justify-center border-r border-border p-8">
              {/* Illustration */}
              <div className="relative mb-6">
                <div className="w-32 h-28 rounded-lg bg-muted/50 border border-border flex items-center justify-center relative">
                  <div className="absolute -top-2 -left-4 w-10 h-1 rounded bg-muted-foreground/20" />
                  <div className="absolute -bottom-2 -left-4 w-8 h-1 rounded bg-muted-foreground/20" />
                  <div className="absolute -top-2 -right-4 w-6 h-1 rounded bg-muted-foreground/15" />
                  <div className="absolute -bottom-2 -right-4 w-10 h-1 rounded bg-muted-foreground/15" />
                  <div className="w-16 h-14 rounded bg-muted border border-border flex items-center justify-center">
                    <Image className="h-8 w-8 text-primary/60" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-7 w-7 rounded-full bg-primary flex items-center justify-center">
                    <Upload className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">Upload Objects or Create Path</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm mb-5">
                Upload an object to your bucket's root directory, or create a path in your bucket and add objects in it.
              </p>

              <div className="flex items-center gap-3">
                <button className="h-9 px-5 rounded-md border border-border bg-background text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-2">
                  <FolderPlus className="h-4 w-4" />
                  Create Path
                </button>
                <button className="h-9 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload
                </button>
              </div>
            </div>

            {/* Right: Bucket URL */}
            <div className="w-80 p-6 shrink-0">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-sm font-medium text-foreground">Bucket URL</span>
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2">
                <span className="text-sm text-muted-foreground truncate flex-1">{bucket.url}</span>
                <button onClick={handleCopy} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                  {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Bucket Permissions Tab ─── */}
        {activeSubTab === "permissions" && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Bucket Permissions</h3>
              <p className="text-sm text-muted-foreground">Manage access permissions for this storage bucket.</p>
            </div>

            <table className="w-full text-sm max-w-2xl">
              <thead>
                <tr className="border-b border-border">
                  {["Role Name", "Read", "Write", "Delete"].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-primary">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { role: "App Administrator", read: true, write: true, delete: true },
                  { role: "App User", read: true, write: false, delete: false },
                ].map(p => (
                  <tr key={p.role} className="border-b border-border/50">
                    <td className="px-4 py-3 text-foreground">{p.role}</td>
                    {(["read", "write", "delete"] as const).map(perm => (
                      <td key={perm} className="px-4 py-3">
                        <span className={`inline-flex items-center justify-center h-4 w-4 rounded ${
                          p[perm] ? "bg-primary text-primary-foreground" : "border border-border bg-background"
                        }`}>
                          {p[perm] && (
                            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          )}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── Configurations Tab ─── */}
        {activeSubTab === "configurations" && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Configurations</h3>
              <p className="text-sm text-muted-foreground">Bucket configuration and settings.</p>
            </div>

            <div className="grid gap-4 max-w-lg">
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Bucket Name</span>
                <span className="text-sm font-medium text-foreground">{bucket.name}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Public Access</span>
                <span className="text-sm font-medium text-foreground">Enabled</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Max File Size</span>
                <span className="text-sm font-medium text-foreground">50 MB</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Allowed MIME Types</span>
                <span className="text-sm font-medium text-foreground">All</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ObjectStorageView;
