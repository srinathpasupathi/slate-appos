import { Zap, ArrowUpRight, Plus, Server, Sparkles, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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

  const aiAddOnOptions = [
    { amount: 5, label: "$5" },
    { amount: 10, label: "$10" },
    { amount: 25, label: "$25" },
    { amount: 50, label: "$50" },
  ];
  const cloudAddOnOptions = [
    { amount: 5, label: "$5" },
    { amount: 10, label: "$10" },
    { amount: 25, label: "$25" },
    { amount: 50, label: "$50" },
  ];

  const [selectedAiAddOn, setSelectedAiAddOn] = useState<number | null>(null);
  const [selectedCloudAddOn, setSelectedCloudAddOn] = useState<number | null>(null);

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
                <span className="text-xl font-bold text-foreground">${basePlan}</span>
                <span className="text-sm text-muted-foreground">/ mo</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Includes AI Credits and Cloud Usage Credits.
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
                <span className="text-sm text-muted-foreground ml-1">/ ${paidAiTotal}</span>
              </div>
              <span className="text-xs font-medium text-muted-foreground">${(paidAiTotal - paidAiUsed).toFixed(2)} remaining</span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(paidAiUsed / paidAiTotal) * 100}%`, backgroundColor: "hsl(210 80% 55%)" }} />
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
              <span className="text-sm text-muted-foreground ml-1">/ ${appTotal}</span>
            </div>
            <span className="text-xs font-medium text-muted-foreground">${(appTotal - appUsed).toFixed(2)} remaining</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(appUsed / appTotal) * 100}%`, backgroundColor: "hsl(172 50% 45%)" }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">Hosting, functions, storage, and app traffic.</p>
          <p className="text-[11px] text-muted-foreground/70">Resets on {appResetDate}</p>
        </div>
      </div>

      {/* Available Plans */}
      <PricingCards currentPlan={currentPlan} />

      {/* Add-on Credits */}
      <div className="rounded-xl border border-border p-5 space-y-5">
        <div>
          <h4 className="text-sm font-semibold text-foreground">Purchase Add-on Credits</h4>
          <p className="text-xs text-muted-foreground mt-0.5">Need more credits? Purchase add-ons anytime — applied instantly to your account.</p>
        </div>

        {/* AI Credits Add-on */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">AI Credits</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {aiAddOnOptions.map((opt) => (
              <button
                key={opt.amount}
                onClick={() => setSelectedAiAddOn(selectedAiAddOn === opt.amount ? null : opt.amount)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  selectedAiAddOn === opt.amount
                    ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
                    : "border-border bg-background text-foreground hover:bg-muted/60"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cloud Usage Credits Add-on */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4" style={{ color: "hsl(172 50% 45%)" }} />
            <span className="text-xs font-semibold text-foreground">Cloud Usage Credits</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {cloudAddOnOptions.map((opt) => (
              <button
                key={opt.amount}
                onClick={() => setSelectedCloudAddOn(selectedCloudAddOn === opt.amount ? null : opt.amount)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  selectedCloudAddOn === opt.amount
                    ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
                    : "border-border bg-background text-foreground hover:bg-muted/60"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary & Purchase */}
        {(selectedAiAddOn || selectedCloudAddOn) && (
          <div className="rounded-lg bg-muted/40 p-3 space-y-1.5">
            <p className="text-xs font-medium text-foreground">Order Summary</p>
            {selectedAiAddOn && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">AI Credits add-on</span>
                <span className="text-foreground font-medium">${selectedAiAddOn}</span>
              </div>
            )}
            {selectedCloudAddOn && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Cloud Usage Credits add-on</span>
                <span className="text-foreground font-medium">${selectedCloudAddOn}</span>
              </div>
            )}
            <div className="h-px bg-border my-1" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground font-semibold">Total</span>
              <span className="text-foreground font-bold">${(selectedAiAddOn || 0) + (selectedCloudAddOn || 0)}</span>
            </div>
          </div>
        )}

        <Button
          size="sm"
          className="w-full gap-1.5"
          disabled={!selectedAiAddOn && !selectedCloudAddOn}
        >
          <Plus className="h-3.5 w-3.5" />
          Purchase Add-on{(selectedAiAddOn && selectedCloudAddOn) ? "s" : ""}
        </Button>
      </div>
    </div>
  );
};

export default BillingSettings;
