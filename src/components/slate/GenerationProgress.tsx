import { useState, useEffect } from "react";
import { CheckCircle2, Loader2, Circle } from "lucide-react";

interface Task {
  label: string;
  duration: number; // ms to complete
}

const TASKS: Task[] = [
  { label: "Analyzing requirements", duration: 1500 },
  { label: "Setting up project structure", duration: 2000 },
  { label: "Generating components", duration: 2500 },
  { label: "Adding styles and layout", duration: 1500 },
  { label: "Wiring up interactions", duration: 1500 },
  { label: "Running final checks", duration: 1000 },
];

const GenerationProgress = ({ onComplete, onProgress }: { onComplete: () => void; onProgress?: (percent: number) => void }) => {
  const [currentTask, setCurrentTask] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  useEffect(() => {
    if (currentTask >= TASKS.length) {
      onProgress?.(100);
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCompletedTasks((prev) => [...prev, currentTask]);
      setCurrentTask((prev) => prev + 1);
    }, TASKS[currentTask].duration);

    return () => clearTimeout(timer);
  }, [currentTask, onComplete, onProgress]);

  const totalDone = completedTasks.length;
  const progress = Math.round(((totalDone + (currentTask < TASKS.length ? 0.5 : 0)) / TASKS.length) * 100);

  useEffect(() => {
    onProgress?.(progress);
  }, [progress, onProgress]);

  return (
    <div className="space-y-3 py-2">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[11px] text-muted-foreground font-medium tabular-nums">
          {totalDone}/{TASKS.length}
        </span>
      </div>

      {/* Task list */}
      <div className="space-y-1.5">
        {TASKS.map((task, i) => {
          const isDone = completedTasks.includes(i);
          const isActive = i === currentTask;

          return (
            <div key={i} className="flex items-center gap-2 text-xs">
              {isDone ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
              ) : isActive ? (
                <Loader2 className="h-3.5 w-3.5 text-primary animate-spin shrink-0" />
              ) : (
                <Circle className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
              )}
              <span
                className={
                  isDone
                    ? "text-muted-foreground line-through"
                    : isActive
                    ? "text-foreground font-medium"
                    : "text-muted-foreground/50"
                }
              >
                {task.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GenerationProgress;
