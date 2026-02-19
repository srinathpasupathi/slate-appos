import { Check, Star } from "lucide-react";

const plans = [
  {
    name: "Free",
    tagline: "Get started and build your first AI apps",
    color: "hsl(142 50% 45%)",
    popular: false,
    price: null,
    breakdown: null,
    header: null,
    features: [
      "AI app generation",
      "$5 monthly AI usage (up to $1/day)",
      "Up to 3 apps per org",
      "Default Slate hosting",
      "Basic knowledge base (small)",
      "Basic connectors (Catalyst)",
      "GitHub integration",
      "1 team member",
      "App runtime on Catalyst free tier",
    ],
  },
  {
    name: "Builder",
    tagline: "Build and launch real apps",
    color: "hsl(45 90% 50%)",
    popular: true,
    price: 15,
    breakdown: "$10 AI + $5 App Runtime",
    header: "Everything in Free, plus:",
    features: [
      "Higher monthly AI usage",
      "Up to 25 apps per org",
      "Custom domain (1)",
      "Medium knowledge base",
      "External SaaS connectors",
      "BYOK (AI Providers)",
      "Up to 5 team members",
      "Role-based access",
      "Included app usage capacity",
    ],
  },
  {
    name: "Pro",
    tagline: "Run production apps at scale",
    color: "hsl(210 80% 55%)",
    popular: false,
    price: 30,
    breakdown: "$25 AI + $5 App Runtime",
    header: "Everything in Builder, plus:",
    features: [
      "High monthly AI usage",
      "Up to 50 apps per org",
      "Multiple custom domains",
      "Large knowledge base",
      "Remote MCP servers",
      "Restrict app public access",
      "Default credit limit controls",
      "Higher app usage capacity",
      "Priority support",
    ],
  },
];

const PricingCards = ({ currentPlan }: { currentPlan: string }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const isCurrent = plan.name === currentPlan;
          const isPopular = plan.popular;

          return (
            <div
              key={plan.name}
              className={`relative rounded-xl border p-5 flex flex-col transition-all ${
                isPopular
                  ? "border-primary shadow-md ring-1 ring-primary/20"
                  : "border-border"
              } ${isCurrent ? "bg-primary/[0.03]" : "bg-background"}`}
            >
              {/* Popular badge */}
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap">
                  <Star className="h-3 w-3 fill-current" />
                  Most Popular
                </div>
              )}

              {/* Plan header */}
              <div className={`${isPopular ? "mt-2" : ""}`}>
                <div className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: plan.color }}
                  />
                  <h3 className="text-base font-semibold text-foreground">
                    {plan.name}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {plan.tagline}
                </p>

                {/* Price */}
                <div className="mt-3">
                  {plan.price != null ? (
                    <>
                      <span className="text-2xl font-bold text-foreground">${plan.price}</span>
                      <span className="text-sm text-muted-foreground ml-1">/ mo</span>
                      <p className="text-[10px] text-muted-foreground/70 mt-0.5">{plan.breakdown}</p>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-foreground">$0</span>
                  )}
                </div>
              </div>

              {/* Current badge */}
              {isCurrent && (
                <span className="mt-3 inline-flex self-start text-[10px] font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                  Current Plan
                </span>
              )}

              {/* Divider */}
              <div className="h-px bg-border my-4" />

              {/* Inheritance header */}
              {plan.header && (
                <p className="text-[11px] font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  {plan.header}
                </p>
              )}

              {/* Features */}
              <ul className="space-y-2.5 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check
                      className="h-3.5 w-3.5 mt-0.5 shrink-0"
                      style={{ color: plan.color }}
                    />
                    <span className="text-xs text-foreground/80 leading-snug">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className={`mt-5 w-full rounded-lg py-2.5 text-sm font-medium transition-colors ${
                  isCurrent
                    ? "bg-muted text-muted-foreground cursor-default"
                    : isPopular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted/60 text-foreground hover:bg-muted"
                }`}
                disabled={isCurrent}
              >
                {isCurrent
                  ? "Current Plan"
                  : plan.name === "Enterprise"
                  ? "Contact Sales"
                  : `Upgrade to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <p className="text-center text-[11px] text-muted-foreground/60 pt-1">
        AI generation powered by Slate. Runtime powered by Catalyst.
      </p>
    </div>
  );
};

export default PricingCards;
