import { useState } from "react";

const GeneratedPreview = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="h-full min-h-0 overflow-auto bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-3xl">✨</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your App</h1>
            <p className="text-gray-500 mt-2">Built with Zoho Slate</p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setCount((c) => c - 1)}
              className="h-10 w-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary transition-colors"
            >
              −
            </button>
            <span className="text-4xl font-bold text-gray-900 tabular-nums w-20 text-center">{count}</span>
            <button
              onClick={() => setCount((c) => c + 1)}
              className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              +
            </button>
          </div>
          <p className="text-sm text-gray-400">Click the buttons to change the counter</p>
        </div>
      </div>
    </div>
  );
};

export default GeneratedPreview;
