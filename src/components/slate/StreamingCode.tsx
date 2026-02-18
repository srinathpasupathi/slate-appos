import { useState, useEffect, useRef } from "react";

const GENERATED_CODE = `import React from "react";

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-3xl">✨</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Your App
            </h1>
            <p className="text-gray-500 mt-2">
              Built with Zoho Slate
            </p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setCount(c => c - 1)}
              className="h-10 w-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary transition-colors"
            >
              −
            </button>
            <span className="text-4xl font-bold text-gray-900 tabular-nums w-20 text-center">
              {count}
            </span>
            <button
              onClick={() => setCount(c => c + 1)}
              className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              +
            </button>
          </div>
          <p className="text-sm text-gray-400">
            Click the buttons to change the counter
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;`;

const StreamingCode = ({ isGenerating }: { isGenerating: boolean }) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lines = GENERATED_CODE.split("\n");

  useEffect(() => {
    if (!isGenerating) {
      setVisibleLines(lines.length);
      return;
    }

    setVisibleLines(0);
    let line = 0;
    const interval = setInterval(() => {
      line++;
      setVisibleLines(line);
      if (line >= lines.length) clearInterval(interval);
    }, 180);

    return () => clearInterval(interval);
  }, [isGenerating, lines.length]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleLines]);

  return (
    <div ref={containerRef} className="p-4 font-mono text-xs leading-6 text-muted-foreground overflow-auto h-full">
      {lines.slice(0, visibleLines).map((text, i) => (
        <div key={i} className="flex">
          <span className="w-8 text-right mr-4 text-muted-foreground/40 select-none">{i + 1}</span>
          <span className="text-foreground/80 whitespace-pre">{text}</span>
        </div>
      ))}
      {isGenerating && visibleLines < lines.length && (
        <div className="flex">
          <span className="w-8 text-right mr-4 text-muted-foreground/40 select-none">{visibleLines + 1}</span>
          <span className="inline-block w-2 h-4 bg-primary animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default StreamingCode;
