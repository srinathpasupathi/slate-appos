import { Boxes, Server } from "lucide-react";

interface PromoViewProps {
  type: "appos" | "cloud";
  enabling: boolean;
  onEnable: () => void;
}

const APPOS_HIGHLIGHTS = ["User Management", "Workflows", "Permissions"];
const CLOUD_HIGHLIGHTS = ["Database", "Auth", "Storage", "Functions"];

const ServicePromoView = ({ type, enabling, onEnable }: PromoViewProps) => {
  const isAppOS = type === "appos";
  const highlights = isAppOS ? APPOS_HIGHLIGHTS : CLOUD_HIGHLIGHTS;

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="max-w-md w-full px-8 text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/8 mb-5">
          {isAppOS
            ? <Boxes className="h-6 w-6 text-primary/70" />
            : <Server className="h-6 w-6 text-primary/70" />
          }
        </div>

        <h2 className="text-xl font-semibold text-foreground mb-2">
          {isAppOS ? "AppOS" : "Cloud"}
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-sm mx-auto">
          {isAppOS
            ? "A business-grade backend with built-in user management, workflow automation, and role-based access control."
            : "Managed infrastructure with databases, authentication, file storage, and serverless functions."
          }
        </p>

        <div className="flex items-center justify-center gap-2 mb-8">
          {highlights.map((h, i) => (
            <span
              key={h}
              className="text-xs text-muted-foreground/80 font-medium"
            >
              {h}{i < highlights.length - 1 && <span className="ml-2 text-border">·</span>}
            </span>
          ))}
        </div>

        <button
          onClick={onEnable}
          disabled={enabling}
          className="h-10 px-7 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
        >
          {enabling ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Enabling...
            </>
          ) : (
            `Enable ${isAppOS ? "AppOS" : "Cloud"}`
          )}
        </button>
      </div>
    </div>
  );
};

export default ServicePromoView;
