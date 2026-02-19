import { Zap, ArrowUpRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const BillingSettings = () => {
  const currentPlan = "Pro Plan";
  const creditsUsed = 70.1;
  const creditsTotal = 100;
  const resetDate = "09 Mar";
  const percentage = (creditsUsed / creditsTotal) * 100;

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
              <p className="text-xs text-muted-foreground mt-1">Using monthly credits</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5">
            Upgrade Plan
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Credits Usage */}
      <div className="rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-semibold text-foreground">Credits Remaining</h4>
            <p className="text-xs text-muted-foreground mt-0.5">This billing cycle</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
            <Info className="h-3 w-3" />
            {creditsTotal} credits reset on {resetDate}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-bold text-foreground">{creditsUsed}</span>
              <span className="text-lg text-muted-foreground ml-1">/ {creditsTotal}</span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">{(creditsTotal - creditsUsed).toFixed(1)} remaining</span>
          </div>

          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Using monthly credits · Resets every billing cycle
          </p>
        </div>
      </div>

      {/* Plan Tiers Info */}
      <div className="rounded-xl border border-dashed border-border bg-muted/20 p-5">
        <p className="text-sm font-medium text-foreground mb-2">Available Plans</p>
        <div className="grid grid-cols-4 gap-3">
          {["Free Plan", "Pro Plan", "Professional", "Enterprise"].map((plan) => (
            <div
              key={plan}
              className={`rounded-lg border p-3 text-center text-sm transition-colors ${
                plan === currentPlan
                  ? "border-primary bg-primary/5 text-primary font-semibold"
                  : "border-border text-muted-foreground"
              }`}
            >
              {plan}
              {plan === currentPlan && (
                <p className="text-[10px] mt-0.5 font-normal">Current</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillingSettings;
