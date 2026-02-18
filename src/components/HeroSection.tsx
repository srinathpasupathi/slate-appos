import { ChevronRight } from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.png";
import FeaturedApps from "./FeaturedApps";
import AiAppGenerator from "./AiAppGenerator";

const HeroSection = () => {
  return (
    <section className="w-full max-w-[1400px] mx-auto px-6 lg:px-10 pt-16 pb-8">
      {/* Top: headline + tagline */}
      <div className="flex flex-col lg:flex-row gap-10 mb-12">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] leading-tight font-medium text-foreground mb-6">
            Your life's work,<br />
            powered by our life's work
          </h1>

          <div className="w-8 h-0.5 bg-primary mb-6" />

          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
            A unique and powerful software suite to transform the way
            you work. Designed for businesses of all sizes, built by a
            company that <span className="underline cursor-pointer text-foreground">values your privacy.</span>
          </p>

          <a
            href="#"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 text-sm font-semibold tracking-wider uppercase hover:opacity-90 transition-opacity"
          >
            GET STARTED FOR FREE
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        {/* Right Sidebar — Featured Apps */}
        <div className="w-full lg:w-[380px] flex-shrink-0">
          <FeaturedApps />
        </div>
      </div>

      {/* AI App Generator — full-width prominent section */}
      <AiAppGenerator />

      {/* Hero Illustration */}
      <div className="mt-12">
        <img
          src={heroIllustration}
          alt="Team collaboration illustration"
          className="w-full max-w-2xl mx-auto"
        />
      </div>
    </section>
  );
};

export default HeroSection;
