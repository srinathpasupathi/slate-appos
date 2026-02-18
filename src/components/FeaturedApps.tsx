import { ChevronRight } from "lucide-react";
import crmIcon from "@/assets/crm.svg";
import mailIcon from "@/assets/mail.svg";
import booksIcon from "@/assets/books.svg";
import peopleIcon from "@/assets/people.svg";
import projectsIcon from "@/assets/projects.svg";

const apps = [
  {
    name: "CRM",
    description: "Comprehensive CRM platform for customer-facing teams.",
    icon: crmIcon,
  },
  {
    name: "Mail",
    description: "Secure email service for teams of all sizes.",
    icon: mailIcon,
  },
  {
    name: "Books",
    description: "Powerful accounting platform for growing businesses.",
    icon: booksIcon,
  },
  {
    name: "People",
    description: "Organize, automate, and simplify your HR processes.",
    icon: peopleIcon,
  },
  {
    name: "Projects",
    description: "Plan, track, and collaborate on every project.",
    icon: projectsIcon,
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
            <img src={app.icon} alt={app.name} className="h-7 w-7 flex-shrink-0" />
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
