import { useState, useEffect, useRef } from "react";

const DURATIONS = { focus: 25 * 60, break: 5 * 60 };
const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const Timer = () => {
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [timeLeft, setTimeLeft] = useState(DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [session, setSession] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Engine timer
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            if (mode === "focus") setSession((s) => Math.min(s + 1, 4));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }

    return () => clearInterval(intervalRef.current!);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleModeChange = (newMode: "focus" | "break") => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(DURATIONS[newMode]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(DURATIONS[mode]);
  };

  const totalTime = DURATIONS[mode];
  const offset = CIRCUMFERENCE * (1 - timeLeft / totalTime);

  return (
    <div className="bg-(--lf-card) p-6 rounded-2xl flex flex-col items-center gap-10 w-full">
      {/* Tab Mode */}
      <div className="bg-(--lf-bg) flex items-center gap-1 rounded-xl px-1 py-1">
        {(["focus", "break"] as const).map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all cursor-pointer ${
              mode === m
                ? "bg-(--lf-accent) text-white"
                : "text-(--lf-accent) opacity-80 hover:text-(--lf-primary)"
            }`}
          >
            {m === "focus" ? "Focus" : "Break"}
          </button>
        ))}
      </div>

      {/* SVG Ring */}
      <div className="relative w-[180px] h-[180px]">
        <svg
          width="180"
          height="180"
          viewBox="0 0 180 180"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Background ring */}
          <circle
            cx="90"
            cy="90"
            r={RADIUS}
            fill="none"
            stroke="var(--lf-border)"
            strokeWidth="8"
          />
          {/* Progress ring */}
          <circle
            cx="90"
            cy="90"
            r={RADIUS}
            fill="none"
            stroke="var(--lf-accent)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>

        {/* Label tengah */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-(--lf-primary) tracking-tight">
            {formatTime(timeLeft)}
          </span>
          <span className="text-[10px] tracking-widest text-(--lf-accent) mt-1">
            {mode === "focus" ? "FOCUS TIME" : "BREAK TIME"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Reset */}
        <button
          onClick={handleReset}
          className="w-10 h-10 rounded-xl border border-(--lf-border) bg-(--lf-bg) flex items-center justify-center text-(--lf-accent) hover:bg-(--lf-accent) hover:text-(--lf-bg) transition-all cursor-pointer"
        >
          ↺
        </button>

        {/* Play / Pause */}
        <button
          onClick={() => setIsRunning((r) => !r)}
          className="w-13 h-13 rounded-2xl flex items-center justify-center transition-all hover:opacity-90 active:scale-95 cursor-pointer
                    shadow-xl"
          style={{ background: "var(--lf-accent)" }}
        >
          {isRunning ? (
            // Pause icon
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            // Play icon
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Session indicator (placeholder 4x) */}
        <div className="w-10 h-10 rounded-xl border border-(--lf-border) bg-(--lf-bg) flex items-center justify-center text-xs text-(--lf-accent) hover:bg-(--lf-accent) transition-all hover:text-(--lf-bg)">
          4×
        </div>
      </div>

      {/* Session dots */}
      <div className="flex items-center gap-2 text-xs text-(--lf-text-muted)">
        <div className="flex gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-all"
              style={{
                background:
                  i < session ? "var(--lf-accent)" : "var(--lf-border)",
              }}
            />
          ))}
        </div>
        <span>Session {session} of 4</span>
      </div>
    </div>
  );
};

export default Timer;
