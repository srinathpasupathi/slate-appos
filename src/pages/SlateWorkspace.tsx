import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Send, Paperclip, Code, Eye, FolderTree, Terminal } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import zohoLogo from "@/assets/zoho-logo.svg";
import GenerationProgress from "@/components/slate/GenerationProgress";
import StreamingCode from "@/components/slate/StreamingCode";
import PreviewLoading from "@/components/slate/PreviewLoading";
import GeneratedPreview from "@/components/slate/GeneratedPreview";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const DEFAULT_PROMPT = "Create a Franchise Sales Management app to manage all the franchises across the globe with a rich UI and UX";

const ASSISTANT_STEPS: { delay: number; content: string }[] = [
  { delay: 2000, content: "I'll start by setting up the **project structure** with a modern React + TypeScript stack, Tailwind CSS for styling, and a clean component architecture." },
  { delay: 5000, content: "Now I'm building the **core components**:\n\n• `FranchiseTable` – sortable data grid with search & filters\n• `SalesOverview` – KPI cards for total revenue, active franchises, growth rate\n• `GlobalMap` – interactive map showing franchise locations\n• `FranchiseDetail` – detail drawer with sales history chart" },
  { delay: 8000, content: "Adding the **dashboard layout** with a sidebar navigation, top metrics bar, and responsive grid. Wiring up mock data for 24 franchise locations across 12 countries." },
  { delay: 10500, content: "✅ **Your Franchise Sales Management app is ready!**\n\nHere's what I built:\n• Dashboard with real-time KPI cards\n• Searchable franchise directory with status badges\n• Sales analytics with interactive charts\n• Responsive layout that works on all devices\n\nYou can check the **Preview** tab to see it live." },
];

const SlateWorkspace = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || DEFAULT_PROMPT;

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [previewTab, setPreviewTab] = useState<"preview" | "code">("code");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationDone, setGenerationDone] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerationComplete = useCallback(() => {
    setIsGenerating(false);
    setGenerationDone(true);
    setPreviewTab("preview");
  }, []);

  // Seed initial prompt and schedule assistant messages
  useEffect(() => {
    const userMsg: Message = {
      id: "1",
      role: "user",
      content: initialPrompt,
      timestamp: new Date(),
    };
    const firstAssistant: Message = {
      id: "2",
      role: "assistant",
      content: `Great choice! I'll build a **Franchise Sales Management** app for you. Let me analyze the requirements and start generating the code...`,
      timestamp: new Date(),
    };
    setMessages([userMsg, firstAssistant]);
    setIsGenerating(true);
    setPreviewTab("code");

    // Schedule follow-up assistant messages
    const timers = ASSISTANT_STEPS.map((step, i) =>
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `step-${i}`,
            role: "assistant" as const,
            content: step.content,
            timestamp: new Date(),
          },
        ]);
      }, step.delay)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  // Progress ticker during generation
  useEffect(() => {
    if (!isGenerating) return;
    setGenerationProgress(0);
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 95) { clearInterval(interval); return prev; }
        return prev + Math.random() * 12;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [isGenerating]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // Simulate assistant reply
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Got it! I'm working on that change now. You'll see the preview update shortly.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, reply]);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <ResizablePanelGroup direction="horizontal">
        {/* Left: Conversation Panel */}
        <ResizablePanel defaultSize={35} minSize={25} maxSize={55}>
          <div className="flex flex-col h-full border-r border-border">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0">
              <button
                onClick={() => navigate("/slate")}
                className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <img src={zohoLogo} alt="Zoho" className="h-5 w-auto" />
              <div className="ml-auto flex items-center gap-1">
                <span className="text-[10px] font-semibold bg-primary/15 text-primary px-2 py-0.5 rounded-full">
                  Slate
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {msg.content.split("\n").map((line, i) => (
                        <p key={i} className={i > 0 ? "mt-2" : ""}>
                          {line.split("**").map((part, j) =>
                            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-xl px-4 py-2.5 bg-muted text-foreground">
                      <GenerationProgress onComplete={handleGenerationComplete} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input area */}
            <div className="shrink-0 border-t border-border bg-card p-3">
              <div className="rounded-xl border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your application idea..."
                  rows={1}
                  className="w-full resize-none bg-transparent px-4 pt-3 pb-1 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
                <div className="flex items-center justify-between px-3 pb-2">
                  <button className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">
                      Press <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">Shift+Enter</kbd> for new line
                    </span>
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right: Preview Panel */}
        <ResizablePanel defaultSize={65} minSize={40}>
          <div className="flex flex-col h-full">
            {/* Preview header with tabs */}
            <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-card shrink-0">
              <button
                onClick={() => setPreviewTab("code")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  previewTab === "code"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Code className="h-3.5 w-3.5" />
                Code
              </button>
              <button
                onClick={() => setPreviewTab("preview")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  previewTab === "preview"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Preview
              </button>
            </div>

            {/* Preview / Code content */}
            <div className="flex-1 overflow-hidden">
              {previewTab === "preview" ? (
                generationDone ? (
                  <GeneratedPreview />
                ) : isGenerating ? (
                  <PreviewLoading progress={Math.min(Math.round(generationProgress), 95)} />
                ) : (
                  <div className="h-full bg-background flex items-center justify-center">
                    <div className="text-center space-y-4 px-8">
                      <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Eye className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">Live Preview</h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                          Your app preview will appear here as Slate generates and updates the code.
                        </p>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="h-full flex">
                  {/* File tree */}
                  <div className="w-56 border-r border-border bg-card overflow-y-auto shrink-0">
                    <div className="px-3 py-2 border-b border-border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project Files</p>
                    </div>
                    <div className="px-2 py-2 space-y-0.5">
                      <FileTreeItem name="public" isFolder />
                      <FileTreeItem name="src" isFolder defaultOpen>
                        <FileTreeItem name="components" isFolder>
                          <FileTreeItem name="ui" isFolder />
                        </FileTreeItem>
                        <FileTreeItem name="pages" isFolder>
                          <FileTreeItem name="Index.tsx" />
                        </FileTreeItem>
                        <FileTreeItem name="App.tsx" />
                        <FileTreeItem name="index.css" />
                        <FileTreeItem name="main.tsx" />
                      </FileTreeItem>
                      <FileTreeItem name="package.json" />
                      <FileTreeItem name="tailwind.config.ts" />
                    </div>
                  </div>

                  {/* Code editor - streaming */}
                  <div className="flex-1 bg-[hsl(var(--card))] overflow-hidden flex flex-col">
                    <div className="px-4 py-3 border-b border-border">
                      <span className="text-xs text-muted-foreground font-mono">src / pages / Index.tsx</span>
                    </div>
                    <StreamingCode isGenerating={isGenerating} />
                  </div>
                </div>
              )}
            </div>

            {/* Console bar */}
            <div className="shrink-0 border-t border-border bg-card">
              <button className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full">
                <Terminal className="h-3.5 w-3.5" />
                <span className="font-medium">Console</span>
              </button>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

/* ---------- Helper Components ---------- */

const FileTreeItem = ({
  name,
  isFolder,
  defaultOpen,
  children,
}: {
  name: string;
  isFolder?: boolean;
  defaultOpen?: boolean;
  children?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div>
      <button
        onClick={() => isFolder && setOpen(!open)}
        className="flex items-center gap-1.5 w-full px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
      >
        {isFolder ? (
          <FolderTree className="h-3.5 w-3.5 text-primary/70" />
        ) : (
          <Code className="h-3.5 w-3.5" />
        )}
        <span className={isFolder ? "font-medium" : ""}>{name}</span>
      </button>
      {isFolder && open && children && (
        <div className="pl-4">{children}</div>
      )}
    </div>
  );
};

const CodeLine = ({ num, text }: { num: number; text: string }) => (
  <div className="flex">
    <span className="w-8 text-right mr-4 text-muted-foreground/40 select-none">{num}</span>
    <span className="text-foreground/80">{text}</span>
  </div>
);

export default SlateWorkspace;
