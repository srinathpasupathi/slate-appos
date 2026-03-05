import { Users, Zap, Shield, Server, Lock, FolderTree, LayoutDashboard, Send, Terminal, RotateCcw, Boxes, Rocket } from "lucide-react";

interface PromoViewProps {
  type: "appos" | "cloud";
  enabling: boolean;
  onEnable: () => void;
}

const APPOS_FEATURES = [
  { icon: Users, title: "Users & Profiles", desc: "Built-in user management with profile attributes, org mapping, and signup flows." },
  { icon: Zap, title: "Workflows & Automation", desc: "Trigger-based workflows on record actions or schedules to automate business logic." },
  { icon: Shield, title: "Roles & Permissions", desc: "Fine-grained access control with configurable roles and module-level permissions." },
  { icon: Boxes, title: "Modules & Fields", desc: "Define your data models with custom modules, fields, and relationships." },
  { icon: LayoutDashboard, title: "Query Console", desc: "Run data queries and explore your application data in real time." },
  { icon: Rocket, title: "Deployments", desc: "Manage versioned releases with rollback support and deployment history." },
];

const CLOUD_FEATURES = [
  { icon: Lock, title: "Authentication", desc: "Email, password, and social login with hosted sign-in pages and user management." },
  { icon: Server, title: "Relational Database", desc: "Fully managed PostgreSQL with schema design, scopes, and permissions." },
  { icon: FolderTree, title: "Object Storage", desc: "Upload and manage files with configurable buckets, permissions, and CORS." },
  { icon: LayoutDashboard, title: "NoSQL Database", desc: "Document-based storage with partition keys, indexes, and flexible schemas." },
  { icon: Zap, title: "Functions", desc: "Serverless backend functions that deploy and scale automatically." },
  { icon: RotateCcw, title: "Schedulers", desc: "Cron-based job scheduling for background tasks and periodic operations." },
  { icon: Send, title: "Mail", desc: "Transactional and authentication emails with custom templates and domain support." },
  { icon: Terminal, title: "Logs", desc: "Real-time log streaming and historical log analysis for debugging." },
];

const ServicePromoView = ({ type, enabling, onEnable }: PromoViewProps) => {
  const isAppOS = type === "appos";
  const features = isAppOS ? APPOS_FEATURES : CLOUD_FEATURES;

  return (
    <div className="flex-1 flex items-center justify-center overflow-y-auto">
      <div className="max-w-2xl w-full px-8 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className={`inline-flex items-center justify-center h-14 w-14 rounded-2xl mb-4 ${
            isAppOS ? "bg-primary/10" : "bg-primary/10"
          }`}>
            {isAppOS
              ? <Boxes className="h-7 w-7 text-primary" />
              : <Server className="h-7 w-7 text-primary" />
            }
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {isAppOS ? "AppOS" : "Cloud"}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            {isAppOS
              ? "A business-grade backend with integrated user management, workflow automation, and role-based access control — purpose-built for applications that need structured data and business logic."
              : "A traditional cloud backend with managed databases, object storage, authentication, serverless functions, and more — everything you need to power your application infrastructure."
            }
          </p>
        </div>

        {/* Features grid */}
        <div className={`grid gap-3 mb-10 ${isAppOS ? "grid-cols-2" : "grid-cols-2"}`}>
          {features.map((f) => (
            <div
              key={f.title}
              className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors"
            >
              <div className="h-9 w-9 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 mt-0.5">
                <f.icon className="h-4.5 w-4.5 text-primary/70" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-0.5">{f.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Enable button */}
        <div className="text-center">
          <button
            onClick={onEnable}
            disabled={enabling}
            className="h-11 px-8 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {enabling ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Enabling {isAppOS ? "AppOS" : "Cloud"}...
              </>
            ) : (
              <>
                Enable {isAppOS ? "AppOS" : "Cloud"}
              </>
            )}
          </button>
          <p className="text-xs text-muted-foreground mt-3">
            {isAppOS
              ? "This will set up user management, workflows, and permissions for your project."
              : "This will provision databases, storage, and serverless infrastructure for your project."
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServicePromoView;
