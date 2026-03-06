import { useState } from "react";
import { ArrowLeft, Copy, Check, Image, Upload, FolderPlus, Info, MoreHorizontal, HelpCircle, ExternalLink, ChevronDown, ChevronUp, Shield, Plus } from "lucide-react";

interface Bucket {
  name: string;
  url: string;
  region: string;
  createdOn: string;
  objectCount: number;
  size: string;
}

const BUCKETS: Bucket[] = [
  { name: "test12346", url: "https://test12346-development.zohostratus.in", region: "US", createdOn: "Mar 5, 2026", objectCount: 0, size: "0 bytes" },
  { name: "media-assets", url: "https://media-assets-development.zohostratus.in", region: "US", createdOn: "Mar 3, 2026", objectCount: 24, size: "156 MB" },
  { name: "user-uploads", url: "https://user-uploads-development.zohostratus.in", region: "EU", createdOn: "Feb 28, 2026", objectCount: 142, size: "1.2 GB" },
];

const PERMISSION_JSON = `{
    "rules": [{
        "rule_id": "AuthenticatedBucket_Rule1",
        "condition": {
            "user": {
                "auth_type": "authenticated",
                "zuid": "*"
            }
        },
        "allowed_actions": ["GetObject"],
        "paths": ["test12346::/*"],
        "effect": "allow"
    }],
    "version": "v1"
}`;

type SubTab = "objects" | "permissions" | "configurations";

interface ObjectStorageViewProps {
  showCreate?: boolean;
}

const ObjectStorageView = ({ showCreate = false }: ObjectStorageViewProps) => {
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("objects");
  const [copied, setCopied] = useState(false);
  const [generalOpen, setGeneralOpen] = useState(true);
  const [corsOpen, setCorsOpen] = useState(false);

  const bucket = BUCKETS.find(b => b.name === selectedBucket);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── Bucket List (landing) ───
  if (!selectedBucket) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Object Storage</h2>
              <p className="text-sm text-muted-foreground mt-1">Manage your storage buckets and objects.</p>
            </div>
            {showCreate && (
              <button className="h-8 px-3 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors inline-flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Create Bucket
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Bucket Name", "Region", "Created On", "Objects", "Size"].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-primary">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BUCKETS.map(b => (
                <tr
                  key={b.name}
                  onClick={() => { setSelectedBucket(b.name); setActiveSubTab("objects"); }}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 text-primary font-medium hover:underline">{b.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.region}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.createdOn}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.objectCount}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ─── Bucket Detail View ───
  return (
    <div className="flex flex-col h-full min-h-[500px]">
      {/* Header */}
      <div className="px-6 pt-4 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedBucket(null)}
              className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h2 className="text-lg font-semibold text-foreground">{bucket?.name}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleCopy(bucket?.url || "")}
              className="flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              Bucket URL
            </button>
            <button className="h-8 w-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <HelpCircle className="h-4 w-4" />
              Help
            </button>
          </div>
        </div>

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
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ─── Objects Tab ─── */}
        {activeSubTab === "objects" && (
          <div className="flex h-full">
            {/* Left: Upload area */}
            <div className="flex-1 flex flex-col items-center justify-center border-r border-border p-8">
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
                <span className="text-sm text-muted-foreground truncate flex-1">{bucket?.url}</span>
                <button onClick={() => handleCopy(bucket?.url || "")} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                  {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Bucket Permissions Tab ─── */}
        {activeSubTab === "permissions" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Configured Permission</h3>
              <div className="flex items-center gap-3">
                <button className="text-sm text-primary hover:underline">Learn more</button>
                <button className="h-9 px-4 rounded-md border border-border bg-background text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Edit Permission
                </button>
              </div>
            </div>

            {/* JSON code block */}
            <div className="relative rounded-lg border border-border bg-muted/20 overflow-hidden">
              <div className="overflow-x-auto p-5 font-mono text-sm leading-7">
                {PERMISSION_JSON.split("\n").map((line, i) => (
                  <div key={i} className="flex">
                    <span className="w-8 shrink-0 text-right text-muted-foreground/50 select-none pr-4">{i + 1}</span>
                    <span className="text-foreground whitespace-pre">{line}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleCopy(PERMISSION_JSON)}
                className="absolute bottom-3 right-3 h-8 w-8 rounded-md border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}

        {/* ─── Configurations Tab ─── */}
        {activeSubTab === "configurations" && (
          <div className="p-6 space-y-4">
            {/* General Settings accordion */}
            <div className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setGeneralOpen(!generalOpen)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 rounded-full bg-primary" />
                  <div className="text-left">
                    <h4 className="text-sm font-semibold text-foreground">General Settings</h4>
                    <p className="text-xs text-muted-foreground">Versioning, Data Encryption, PII/ePHI</p>
                  </div>
                </div>
                {generalOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>

              {generalOpen && (
                <div className="px-5 pb-5">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { title: "Versioning", desc: "Create and store multiple versions of the objects in your bucket", status: "Disabled" },
                      { title: "Data Encryption", desc: "Encrypt the bucket to store sensitive data in it", status: "Disabled" },
                      { title: "PII/ePHI", desc: "Store personally identifiable information (PII/ePHI) that can uncover an individual's identity in a compliant manner", status: "Disabled" },
                    ].map(item => (
                      <div key={item.title} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="text-sm font-semibold text-foreground">{item.title}</h5>
                          <button className="text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{item.desc}</p>
                        <span className="text-xs font-medium text-destructive">{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bucket CORS accordion */}
            <div className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setCorsOpen(!corsOpen)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition-colors"
              >
                <div className="text-left">
                  <h4 className="text-sm font-semibold text-foreground">Bucket CORS</h4>
                  <p className="text-xs text-muted-foreground">Configure CORS (Cross-Origin Resource Sharing) for your bucket to allow access from different domains.</p>
                </div>
                {corsOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>

              {corsOpen && (
                <div className="px-5 pb-5">
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-sm text-muted-foreground">No CORS rules configured yet.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ObjectStorageView;
