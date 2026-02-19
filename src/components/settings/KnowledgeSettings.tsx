import { useState } from "react";
import { BookOpen, Save } from "lucide-react";

const KnowledgeSettings = () => {
  const [knowledge, setKnowledge] = useState("");

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <section>
        <div className="flex items-start gap-3 mb-5">
          <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
            <BookOpen className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">Instructions &amp; Guidelines</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Provide guidelines and context to improve your project's edits. Use this space to:
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted/20 p-5 mb-5">
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              Set project-specific rules or best practices.
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              Set coding style preferences (e.g. indentation, naming conventions).
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              Include external documentation or style guides.
            </li>
          </ul>
        </div>
      </section>

      {/* Knowledge Input */}
      <section>
        <label className="text-sm font-medium text-foreground mb-2 block">Custom Knowledge</label>
        <textarea
          value={knowledge}
          onChange={(e) => setKnowledge(e.target.value)}
          placeholder="Add your custom knowledge, guidelines, documentation or context here..."
          rows={12}
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y min-h-[200px]"
        />
        <div className="flex justify-end mt-3">
          <button className="h-9 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Save className="h-3.5 w-3.5" />
            Save Knowledge
          </button>
        </div>
      </section>
    </div>
  );
};

export default KnowledgeSettings;
