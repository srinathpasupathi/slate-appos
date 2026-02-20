import { Zap, ArrowUpRight, Plus, Server, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import PricingCards from "./PricingCards";

const BillingSettings = () => {
  const currentPlan = "Builder";
  const basePlan = 15; // Builder base price

  // AI free usage
  const dailyFree = 1;
  const monthlyFree = 5;
  const freeUsedToday = 0.65; // of $1 daily
  const freeUsedMonth = 3.20; // of $5 monthly total so far

  // Paid AI usage (only kicks in after free is exhausted)
  const paidAiUsed = 6.8;
  const paidAiTotal = 10;

  const appUsed = 1.1;
  const appTotal = 5;
  const aiResetDate = "09 Mar";
  const appResetDate = "09 Mar";
  const paidAiPercentage = (paidAiUsed / paidAiTotal) * 100;
  const appPercentage = (appUsed / appTotal) * 100;

  const plans = [
    { name: "Free", ai: 5, app: 1 },
    { name: "Standard", ai: 20, app: 5 },
    { name: "Professional", ai: 50, app: 15 },
    { name: "Enterprise", ai: "Custom", app: "Custom" },
  ];

  const [aiDropdownOpen, setAiDropdownOpen] = useState(false);
  const [appDropdownOpen, setAppDropdownOpen] = useState(false);
  const [selectedAiBoost, setSelectedAiBoost] = useState<number>(paidAiTotal);
  const [selectedAppBoost, setSelectedAppBoost] = useState<number>(appTotal);
  const aiRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);

  const aiOptions = [10, 25, 50, 100];
  const appOptions = [5, 15, 50, 100];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (aiRef.current && !aiRef.current.contains(e.target as Node)) setAiDropdownOpen(false);
      if (appRef.current && !appRef.current.contains(e.target as Node)) setAppDropdownOpen(false);
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
              <div className="flex items-baseline gap-3 mt-0.5">
                <h4 className="text-xl font-semibold text-foreground">{currentPlan}</h4>
                <span className="text-muted-foreground">·</span>
                <span className="text-xl font-bold text-foreground">${basePlan + (selectedAiBoost - paidAiTotal) + (selectedAppBoost - appTotal)}</span>
                <span className="text-sm text-muted-foreground">/ mo</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Base ${basePlan}
                {((selectedAiBoost - paidAiTotal) + (selectedAppBoost - appTotal)) > 0 && (
                  <> + Expanded ${(selectedAiBoost - paidAiTotal) + (selectedAppBoost - appTotal)}</>
                )}
                {" · "}Includes AI Credits and Cloud Usage Credits.
              </p>
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
        <div className="rounded-xl border border-border p-5 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-foreground">AI Credits</h4>
            <p className="text-xs text-muted-foreground mt-0.5">This billing cycle</p>
          </div>

          {/* Free Usage Section */}
          <div className="rounded-lg bg-muted/40 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">Free Usage</span>
              <span className="text-[10px] text-muted-foreground bg-background px-2 py-0.5 rounded-full">Applied first</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Daily free</span>
                <span className="text-foreground font-medium">${freeUsedToday.toFixed(2)} / ${dailyFree} today</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(freeUsedToday / dailyFree) * 100}%`, backgroundColor: "hsl(142 50% 45%)" }} />
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Monthly free</span>
                <span className="text-foreground font-medium">${freeUsedMonth.toFixed(2)} / ${monthlyFree} this month</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(freeUsedMonth / monthlyFree) * 100}%`, backgroundColor: "hsl(142 50% 45%)" }} />
              </div>
            </div>
          </div>

          {/* Paid Usage Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">Paid Usage</span>
              <span className="text-[10px] text-muted-foreground">After free usage is exhausted</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-2xl font-bold text-foreground">${paidAiUsed.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground ml-1">/ ${selectedAiBoost}</span>
              </div>
              <span className="text-xs font-medium text-muted-foreground">${(selectedAiBoost - paidAiUsed).toFixed(2)} remaining</span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(paidAiUsed / selectedAiBoost) * 100}%`, backgroundColor: "hsl(210 80% 55%)" }} />
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground">Used for app generation, edits, and AI actions.</p>
          <p className="text-[11px] text-muted-foreground/70">Resets on {aiResetDate}</p>
        </div>

        {/* App Usage */}
        <div className="rounded-xl border border-border p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-semibold text-foreground">Cloud Usage Credits</h4>
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
              <span className="text-sm text-muted-foreground ml-1">/ ${selectedAppBoost}</span>
            </div>
            <span className="text-xs font-medium text-muted-foreground">${(selectedAppBoost - appUsed).toFixed(2)} remaining</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(appUsed / selectedAppBoost) * 100}%`, backgroundColor: "hsl(172 50% 45%)" }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">Hosting, functions, storage, and app traffic.</p>
          <p className="text-[11px] text-muted-foreground/70">Resets on {appResetDate}</p>
        </div>
      </div>

      {/* Available Plans */}
      <PricingCards currentPlan={currentPlan} />

      {/* Expand Capacity */}
      <div className="rounded-xl border border-border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-foreground">Expand Capacity</h4>
            <p className="text-xs text-muted-foreground mt-0.5">Add more AI Credits and Cloud Usage Credits to your current plan.</p>
          </div>
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex items-center gap-1">
            <Server className="h-2.5 w-2.5" />
            App powered by Catalyst
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* AI Usage dropdown */}
          <div className="relative" ref={aiRef}>
            <label className="text-xs text-muted-foreground mb-1 block">AI Credits</label>
            <button
              onClick={() => { setAiDropdownOpen(!aiDropdownOpen); setAppDropdownOpen(false); }}
              className="w-full flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5 text-sm transition-colors hover:bg-muted/60"
            >
              <span className="text-foreground">
                ${selectedAiBoost}{selectedAiBoost === paidAiTotal ? " (Current)" : ""}
              </span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${aiDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {aiDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg border border-border bg-popover shadow-md overflow-hidden">
                {aiOptions.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => { setSelectedAiBoost(amt); setAiDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2.5 text-sm transition-colors hover:bg-muted ${
                      selectedAiBoost === amt ? "bg-muted text-foreground font-medium" : "text-muted-foreground"
                    }`}
                  >
                    ${amt} AI Credits{amt === paidAiTotal ? " (Current)" : ""}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* App Usage dropdown */}
          <div className="relative" ref={appRef}>
            <label className="text-xs text-muted-foreground mb-1 block">Cloud Usage Credits</label>
            <button
              onClick={() => { setAppDropdownOpen(!appDropdownOpen); setAiDropdownOpen(false); }}
              className="w-full flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5 text-sm transition-colors hover:bg-muted/60"
            >
              <span className="text-foreground">
                ${selectedAppBoost}{selectedAppBoost === appTotal ? " (Current)" : ""}
              </span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${appDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {appDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg border border-border bg-popover shadow-md overflow-hidden">
                {appOptions.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => { setSelectedAppBoost(amt); setAppDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2.5 text-sm transition-colors hover:bg-muted ${
                      selectedAppBoost === amt ? "bg-muted text-foreground font-medium" : "text-muted-foreground"
                    }`}
                  >
                    ${amt} Cloud Usage Credits{amt === appTotal ? " (Current)" : ""}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <Button size="sm" className="w-full gap-1.5" disabled={selectedAiBoost === paidAiTotal && selectedAppBoost === appTotal}>
          <Plus className="h-3.5 w-3.5" />
          Upgrade
        </Button>
      </div>
    </div>
  );
};

export default BillingSettings;
