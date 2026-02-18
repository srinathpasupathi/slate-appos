import { ChevronRight } from "lucide-react";

const footerColumns = [
  {
    title: "Apps and Extensions",
    links: [
      "Mobile Apps", "Desktop Apps", "Developer Center",
      "Google Workspace Integration", "Microsoft 365 Integration",
      "Apps for Apple Watch", "Product Integrations",
      "Browser Extensions", "Compare Alternatives",
    ],
  },
  {
    title: "Learn",
    links: [
      "Training and Certification", "Academy", "Blog",
      "Knowledge Base", "Zia", "The Long Game", "Newsletter",
    ],
  },
  {
    title: "Community",
    links: [
      "User Community", "Customer Stories", "Work With a Partner",
      "Zoho for Nonprofits", "Zoho for Startups",
      "Affiliate Program", "Humans of Zoho",
    ],
  },
  {
    title: "Company",
    links: [
      "About Us", "Our Story", "Press", "Events",
      "Branding Assets", "Zoho Schools", "Service Status", "Careers",
    ],
  },
];

const legalLinks = [
  "Contact Us", "Security", "Compliance", "IPR Complaints",
  "Anti-spam Policy", "Terms of Service", "Privacy Policy",
  "Trademark Policy", "Cookie Policy", "GDPR Compliance", "Abuse Policy",
];

const Footer = () => {
  return (
    <footer className="w-full bg-background border-t border-border mt-16">
      {/* CTA Banner */}
      <div className="bg-secondary/50 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-3">
          Ready to do your best work?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 font-sans">
          Let's get you started.
        </p>
        <a
          href="#"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 text-sm font-semibold tracking-wider uppercase hover:opacity-90 transition-opacity"
        >
          SIGN UP NOW
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>

      {/* Footer Links */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="text-base font-semibold text-foreground mb-4 font-sans">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Sales */}
          <div>
            <h3 className="text-base font-semibold text-foreground mb-4 font-sans">
              Contact Sales
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-foreground">Phone</p>
                <a href="#" className="text-primary hover:underline block">1800 103 1123</a>
                <a href="#" className="text-primary hover:underline block">1800 572 3535</a>
              </div>
              <div>
                <p className="font-semibold text-foreground">Email</p>
                <a href="#" className="text-primary hover:underline">sales@zohocorp.com</a>
              </div>
              <div className="border-t border-border pt-3 mt-3 space-y-2">
                <a href="#" className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium">
                  Support <ChevronRight className="h-3.5 w-3.5" />
                </a>
                <br />
                <a href="#" className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium">
                  Talk to Concierge <ChevronRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social + Legal */}
      <div className="border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8 text-center">
          {/* Social icons */}
          <div className="flex justify-center gap-5 mb-6">
            {["X", "Facebook", "YouTube", "LinkedIn", "Instagram"].map((name) => (
              <a
                key={name}
                href="#"
                className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                aria-label={name}
              >
                <span className="text-xs font-bold">{name[0]}</span>
              </a>
            ))}
          </div>

          {/* Legal links */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            {legalLinks.map((link, i) => (
              <span key={link} className="flex items-center gap-4">
                <a href="#" className="hover:text-foreground transition-colors">{link}</a>
                {i < legalLinks.length - 1 && <span className="text-border">|</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
