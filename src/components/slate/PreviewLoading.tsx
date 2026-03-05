import { Loader2 } from "lucide-react";

const PreviewLoading = ({ progress, phase = "generating" }: { progress: number; phase?: "generating" | "loading" }) => {
  const isLoading = phase === "loading";
  return (
    <div className="h-full bg-background flex items-center justify-center">
      <div className="text-center space-y-6 px-8">
        <div className="relative mx-auto w-20 h-20">
          {/* Outer ring */}
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="35" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
            <circle
              cx="40" cy="40" r="35" fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 35}`}
              strokeDashoffset={`${2 * Math.PI * 35 * (1 - progress / 100)}`}
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold text-foreground tabular-nums">{progress}%</span>
          </div>
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground mb-1">
            {isLoading ? "Loading your app..." : "Generating your app..."}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {isLoading
              ? "Almost there! Your preview is loading now."
              : "Om is building your application. The preview will appear here once ready."}
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>{isLoading ? "Just a moment..." : "This usually takes about 10 seconds"}</span>
        </div>
      </div>
    </div>
  );
};

export default PreviewLoading;
