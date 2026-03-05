import { Boxes, Server, Users, Workflow, ShieldCheck, LayoutGrid, Database, Lock, HardDrive, Code } from "lucide-react";

interface PromoViewProps {
  type: "appos" | "cloud";
  enabling: boolean;
  onEnable: () => void;
}

const ServicePromoView = ({ type, enabling, onEnable }: PromoViewProps) => {
  const isAppOS = type === "appos";

  if (isAppOS) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-lg w-full text-center">
          {/* Architecture diagram illustration */}
          <div className="mb-10 flex justify-center">
            <svg width="320" height="200" viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
              {/* Top layer - Users / Apps */}
              <rect x="95" y="8" width="130" height="32" rx="8" className="fill-muted/50 stroke-border" strokeWidth="1" />
              <text x="160" y="28" textAnchor="middle" className="fill-muted-foreground" fontSize="11" fontWeight="500" fontFamily="inherit">Users / Apps</text>

              {/* Connector lines from top to middle */}
              <line x1="130" y1="40" x2="110" y2="64" className="stroke-border" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="160" y1="40" x2="160" y2="64" className="stroke-border" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="190" y1="40" x2="210" y2="64" className="stroke-border" strokeWidth="1" strokeDasharray="3 3" />

              {/* Middle layer - AppOS (highlighted) */}
              <rect x="32" y="64" width="256" height="80" rx="12" className="fill-primary/[0.04]" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2" />
              {/* AppOS label */}
              <text x="160" y="82" textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="600" fontFamily="inherit" opacity="0.7">APPOS</text>

              {/* Inner nodes */}
              <rect x="44" y="94" width="56" height="38" rx="6" className="fill-background stroke-border" strokeWidth="1" />
              <text x="72" y="117" textAnchor="middle" className="fill-muted-foreground" fontSize="8.5" fontWeight="500" fontFamily="inherit">Modules</text>

              <rect x="108" y="94" width="56" height="38" rx="6" className="fill-background stroke-border" strokeWidth="1" />
              <text x="136" y="117" textAnchor="middle" className="fill-muted-foreground" fontSize="8.5" fontWeight="500" fontFamily="inherit">Workflows</text>

              <rect x="172" y="94" width="64" height="38" rx="6" className="fill-background stroke-border" strokeWidth="1" />
              <text x="204" y="117" textAnchor="middle" className="fill-muted-foreground" fontSize="8.5" fontWeight="500" fontFamily="inherit">Permissions</text>

              <rect x="244" y="94" width="36" height="38" rx="6" className="fill-background stroke-border" strokeWidth="1" />
              <text x="262" y="117" textAnchor="middle" className="fill-muted-foreground" fontSize="8.5" fontWeight="500" fontFamily="inherit">Users</text>

              {/* Small accent dots on nodes */}
              <circle cx="56" cy="100" r="2" fill="currentColor" opacity="0.3" />
              <circle cx="120" cy="100" r="2" fill="currentColor" opacity="0.3" />
              <circle cx="184" cy="100" r="2" fill="currentColor" opacity="0.3" />
              <circle cx="256" cy="100" r="2" fill="currentColor" opacity="0.3" />

              {/* Connector lines from middle to bottom */}
              <line x1="110" y1="144" x2="100" y2="164" className="stroke-border" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="210" y1="144" x2="220" y2="164" className="stroke-border" strokeWidth="1" strokeDasharray="3 3" />

              {/* Bottom layer - Infrastructure */}
              <rect x="60" y="164" width="90" height="28" rx="7" className="fill-muted/40 stroke-border" strokeWidth="1" />
              <text x="105" y="182" textAnchor="middle" className="fill-muted-foreground/60" fontSize="9.5" fontWeight="500" fontFamily="inherit">Modules</text>

              <rect x="170" y="164" width="90" height="28" rx="7" className="fill-muted/40 stroke-border" strokeWidth="1" />
              <text x="215" y="182" textAnchor="middle" className="fill-muted-foreground/60" fontSize="9.5" fontWeight="500" fontFamily="inherit">Workflows</text>
            </svg>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-2">
            AppOS <span className="text-muted-foreground font-normal">— Business Backend</span>
          </h2>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-7">
            A ready-to-use backend for building business applications with built-in modules, user management, workflows, and permissions.
          </p>

          {/* Feature chips */}
          <div className="flex items-center justify-center flex-wrap gap-2 mb-9">
            {[
              { icon: LayoutGrid, label: "Modules" },
              { icon: Users, label: "Users" },
              { icon: Workflow, label: "Workflows" },
              { icon: ShieldCheck, label: "Permissions" },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 border border-border/50 text-xs font-medium text-muted-foreground"
              >
                <Icon className="h-3 w-3" />
                {label}
              </span>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={onEnable}
            disabled={enabling}
            className="h-10 px-8 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2 shadow-sm"
          >
            {enabling ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Enabling…
              </>
            ) : (
              "Enable AppOS"
            )}
          </button>
        </div>
      </div>
    );
  }

  // Cloud promo
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-lg w-full text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-primary/[0.07] flex items-center justify-center">
            <Database className="h-5 w-5 text-primary/60" />
          </div>
          <div className="h-14 w-14 rounded-2xl bg-primary/[0.10] flex items-center justify-center ring-1 ring-primary/[0.08]">
            <Server className="h-7 w-7 text-primary/80" />
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary/[0.07] flex items-center justify-center">
            <Lock className="h-5 w-5 text-primary/60" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-2">
          Cloud <span className="text-muted-foreground font-normal">— Managed Infrastructure</span>
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-7">
          Managed infrastructure with databases, authentication, file storage, and serverless functions — ready to scale.
        </p>

        <div className="flex items-center justify-center flex-wrap gap-2 mb-9">
          {[
            { icon: Database, label: "Database" },
            { icon: Lock, label: "Auth" },
            { icon: HardDrive, label: "Storage" },
            { icon: Code, label: "Functions" },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 border border-border/50 text-xs font-medium text-muted-foreground"
            >
              <Icon className="h-3 w-3" />
              {label}
            </span>
          ))}
        </div>

        <button
          onClick={onEnable}
          disabled={enabling}
          className="h-10 px-8 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2 shadow-sm"
        >
          {enabling ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Enabling…
            </>
          ) : (
            "Enable Cloud"
          )}
        </button>
      </div>
    </div>
  );
};

export default ServicePromoView;
