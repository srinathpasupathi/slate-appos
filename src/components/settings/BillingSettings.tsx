import { Zap, ArrowUpRight, Plus, Server, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";

const BillingSettings = () => {
  const currentPlan = "Pro Plan";
  const aiUsed = 14.2;
  const aiTotal = 20;
  const appUsed = 1.1;
  const appTotal = 5;
  const aiResetDate = "09 Mar";
  const appResetDate = "09 Mar";
  const aiPercentage = (aiUsed / aiTotal) * 100;
  const appPercentage = (appUsed / appTotal) * 100;

  const plans = [
    { name: "Free Plan", ai: 5, app: 1 },
    { name: "Pro Plan", ai: 20, app: 5 },
    { name: "Professional", ai: 50, app: 15 },
    { name: "Enterprise", ai: "Custom", app: "Custom" },
  ];

  const [selectedAiBoost, setSelectedAiBoost] = useState<number | null>(null);
  const [selectedAppBoost, setSelectedAppBoost] = useState<number | null>(null);
  const [capacityOpen, setCapacityOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const capacityOptions = [
    { ai: 10, app: 5, label: "+$10 AI / +$5 App" },
    { ai: 25, app: 10, label: "+$25 AI / +$10 App" },
    { ai: 50, app: 25, label: "+$50 AI / +$25 App" },
  ];
  const [selectedCapacity, setSelectedCapacity] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCapacityOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="rounded-xl border border-border p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Current Plan</p>
              <h4 className="text-xl font-semibold text-foreground mt-0.5">{currentPlan}</h4>
              <p className="text-xs text-muted-foreground mt-1">Includes AI Usage and App Usage.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5">
            Upgrade Plan
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Usage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* AI Usage */}
        <div className="rounded-xl border border-border p-5 space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-foreground">AI Usage</h4>
            <p className="text-xs text-muted-foreground mt-0.5">This billing cycle</p>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-2xl font-bold text-foreground">${aiUsed.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground ml-1">/ ${aiTotal}</span>
            </div>
            <span className="text-xs font-medium text-muted-foreground">${(aiTotal - aiUsed).toFixed(2)} remaining</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${aiPercentage}%`, backgroundColor: "hsl(210 80% 55%)" }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">Used for app generation, edits, and AI actions.</p>
          <p className="text-[11px] text-muted-foreground/70">Resets on {aiResetDate}</p>
        </div>

        {/* App Usage */}
        <div className="rounded-xl border border-border p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-semibold text-foreground">App Usage</h4>
              <p className="text-xs text-muted-foreground mt-0.5">This billing cycle</p>
            </div>
            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex items-center gap-1">
              <Server className="h-2.5 w-2.5" />
              Powered by Catalyst
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-2xl font-bold text-foreground">${appUsed.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground ml-1">/ ${appTotal}</span>
            </div>
            <span className="text-xs font-medium text-muted-foreground">${(appTotal - appUsed).toFixed(2)} remaining</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${appPercentage}%`, backgroundColor: "hsl(172 50% 45%)" }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">Hosting, functions, storage, and app traffic.</p>
          <p className="text-[11px] text-muted-foreground/70">Resets on {appResetDate}</p>
        </div>
      </div>

      {/* Available Plans */}
      <div className="rounded-xl border border-dashed border-border bg-muted/20 p-5">
        <p className="text-sm font-medium text-foreground mb-3">Available Plans</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg border p-3 text-center text-sm transition-colors ${
                plan.name === currentPlan
                  ? "border-primary bg-primary/5 text-primary font-semibold"
                  : "border-border text-muted-foreground"
              }`}
            >
              <span className="block">{plan.name}</span>
              {plan.name === currentPlan && (
                <p className="text-[10px] mt-0.5 font-normal">Current</p>
              )}
              <div className="mt-2 space-y-0.5 text-[10px] opacity-80">
                <p>${plan.ai} AI Usage / mo</p>
                <p>${plan.app} App Usage / mo</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expand Capacity */}
      <div className="rounded-xl border border-border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-foreground">Expand Capacity</h4>
            <p className="text-xs text-muted-foreground mt-0.5">Add more AI and App usage to your current plan.</p>
          </div>
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex items-center gap-1">
            <Server className="h-2.5 w-2.5" />
            App powered by Catalyst
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1" ref={dropdownRef}>
            <button
              onClick={() => setCapacityOpen(!capacityOpen)}
              className="w-full flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5 text-sm transition-colors hover:bg-muted/60"
            >
              <span className={selectedCapacity !== null ? "text-foreground" : "text-muted-foreground"}>
                {selectedCapacity !== null ? capacityOptions[selectedCapacity].label : "Select capacity"}
              </span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${capacityOpen ? "rotate-180" : ""}`} />
            </button>
            {capacityOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg border border-border bg-popover shadow-md overflow-hidden">
                {capacityOptions.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedCapacity(i); setCapacityOpen(false); }}
                    className={`w-full text-left px-3 py-2.5 text-sm transition-colors hover:bg-muted ${
                      selectedCapacity === i ? "bg-muted text-foreground font-medium" : "text-muted-foreground"
                    }`}
                  >
                    <span className="block">{opt.label}</span>
                    <span className="text-[10px] opacity-70">${opt.ai} AI Usage + ${opt.app} App Usage</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button size="sm" className="gap-1.5 shrink-0" disabled={selectedCapacity === null}>
            <Plus className="h-3.5 w-3.5" />
            Upgrade
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BillingSettings;
