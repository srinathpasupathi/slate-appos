import { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

const suggestions = [
  "A project management tool with Kanban boards",
  "An invoice generator for freelancers",
  "A customer feedback portal with analytics",
  "An employee onboarding checklist app",
];

const AiAppGenerator = () => {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="relative rounded-lg border border-border bg-card overflow-hidden">
      {/* Header accent */}
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

      <div className="p-6 lg:p-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground font-sans">
            Generate an App Using AI
          </h2>
        </div>

        <p className="text-sm text-muted-foreground mb-5 leading-relaxed max-w-lg">
          Describe the app you want to build and our AI will generate it for you
          in seconds — no coding required.
        </p>

        {/* Prompt box */}
        <div className="relative mb-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your app idea... e.g. A CRM dashboard that tracks leads and sales pipeline"
            rows={4}
            className="w-full resize-none rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
          />
        </div>

        {/* Generate button */}
        <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity mb-5">
          <Sparkles className="h-4 w-4" />
          Generate App
          <ArrowRight className="h-4 w-4" />
        </button>

        {/* Suggestion chips */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Try these ideas
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setPrompt(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAppGenerator;
