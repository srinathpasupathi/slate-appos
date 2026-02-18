import { ChevronRight } from "lucide-react";

const SPRITE_URL = "https://www.zohowebstatic.com/sites/zweb/images/commonroot/product-icons.svg";

const apps = [
  {
    name: "CRM",
    description: "Comprehensive CRM platform for customer-facing teams.",
    sprite: { x: -241, y: -6, w: 28, h: 18 },
  },
  {
    name: "Mail",
    description: "Secure email service for teams of all sizes.",
    sprite: { x: -271, y: -31, w: 28, h: 28 },
  },
  {
    name: "Books",
    description: "Powerful accounting platform for growing businesses.",
    sprite: { x: -1, y: -31, w: 28, h: 28 },
  },
  {
    name: "People",
    description: "Organize, automate, and simplify your HR processes.",
    sprite: { x: -211, y: -31, w: 28, h: 28 },
  },
  {
    name: "Projects",
    description: "Plan, track, and collaborate on every project.",
    sprite: { x: -391, y: -34, w: 28, h: 22 },
  },
];

const FeaturedApps = () => {
  return (
    <div className="border border-border rounded-sm bg-card">
      <div className="px-6 pt-6 pb-4">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Featured Apps
        </p>
      </div>

      <div className="divide-y divide-border">
        {apps.map((app) => (
          <a
            key={app.name}
            href="#"
            className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors group"
          >
            <span
              className="flex-shrink-0"
              style={{
                display: "inline-block",
                width: app.sprite.w * 1.4,
                height: app.sprite.h * 1.4,
                background: `url('${SPRITE_URL}') no-repeat ${app.sprite.x * 1.4}px ${app.sprite.y * 1.4}px`,
                backgroundSize: "auto",
                transform: "scale(1.4)",
                transformOrigin: "center",
              }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-foreground font-sans">
                {app.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-snug">
                {app.description}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground flex-shrink-0" />
          </a>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-border">
        <a
          href="#"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline tracking-wide uppercase"
        >
          Explore All Products
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default FeaturedApps;
