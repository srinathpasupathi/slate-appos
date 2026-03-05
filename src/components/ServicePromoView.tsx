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
          {/* Illustration cluster */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-primary/[0.07] flex items-center justify-center">
              <LayoutGrid className="h-5 w-5 text-primary/60" />
            </div>
            <div className="h-14 w-14 rounded-2xl bg-primary/[0.10] flex items-center justify-center ring-1 ring-primary/[0.08]">
              <Boxes className="h-7 w-7 text-primary/80" />
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/[0.07] flex items-center justify-center">
              <Workflow className="h-5 w-5 text-primary/60" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-2">
            AppOS <span className="text-muted-foreground font-normal">— Business Backend</span>
          </h2>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-7">
            Backend for business apps with built-in modules, users, workflows, and permissions.
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
