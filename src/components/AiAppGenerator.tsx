import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Zap, Layers, Globe } from "lucide-react";

const suggestions = [
  "A project management tool with Kanban boards",
  "An invoice generator for freelancers",
  "A customer feedback portal with analytics",
  "An employee onboarding checklist app",
];

const AiAppGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const handleGenerate = () => {
    navigate("/slate");
  };

  return (
    <section className="w-full">
      {/* Hero prompt area */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-card to-secondary/30">
        {/* Decorative glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[300px] h-24 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative px-6 pt-10 pb-8 lg:px-12 lg:pt-14 lg:pb-10">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="h-3 w-3" />
              AI-Powered
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-3 leading-tight">
            Generate your own app using AI
          </h2>
          <p className="text-center text-muted-foreground text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Describe your idea and watch it come to life — no coding required.
          </p>

          {/* Prompt box */}
          <div className="max-w-2xl mx-auto">
            <div className="relative rounded-xl border border-input bg-background shadow-lg shadow-primary/5 focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Build me a CRM dashboard that tracks leads and sales pipeline with real-time analytics..."
                rows={4}
                className="w-full resize-none rounded-xl bg-transparent px-5 pt-4 pb-14 text-sm md:text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
              {/* Bottom bar inside textarea */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground/50">
                    {prompt.length > 0 ? `${prompt.length} chars` : ""}
                  </span>
                </div>
                <button onClick={handleGenerate} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all hover:shadow-md hover:shadow-primary/20 active:scale-[0.98]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Generate App
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Suggestion chips */}
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setPrompt(s)}
                  className="text-xs px-3.5 py-2 rounded-lg border border-border bg-card/80 text-muted-foreground hover:bg-card hover:text-foreground hover:border-foreground/20 transition-all hover:shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Feature pills */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-accent" />
              Instant generation
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-accent" />
              Full-stack apps
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-accent" />
              Deploy in one click
            </span>
          </div>
        </div>
      </div>

    </section>
  );
};

export default AiAppGenerator;
