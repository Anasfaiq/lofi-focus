import { useState, useEffect, useRef } from "react";

const DURATIONS = {
  focus: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
};

const TOTAL_SESSIONS = 4;
const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Mode = "focus" | "break" | "longBreak";

const Timer = () => {
  const [mode, setMode] = useState<Mode>("focus");
  const [timeLeft, setTimeLeft] = useState(DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0); // focus sessions done
  const [cycleCount, setCycleCount] = useState(1); // current focus session (1–4)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-advance ke mode berikutnya
  const advance = () => {
    if (mode === "focus") {
      const newCompleted = completedSessions + 1;
      setCompletedSessions(newCompleted);

      if (newCompleted % TOTAL_SESSIONS === 0) {
        // Udah 4 sesi → long break
        setMode("longBreak");
        setTimeLeft(DURATIONS.longBreak);
        setCycleCount(1);
      } else {
        // Short break
        setMode("break");
        setTimeLeft(DURATIONS.break);
        setCycleCount((c) => c + 1);
      }
    } else {
      // Habis break → balik focus
      setMode("focus");
      setTimeLeft(DURATIONS.focus);
    }
    setIsRunning(false);
  };

  // Engine
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            // Trigger advance setelah render
            setTimeout(() => advance(), 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }
    return () => clearInterval(intervalRef.current!);
  }, [isRunning, mode, completedSessions]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Manual mode change (tab)
  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(DURATIONS[newMode]);
  };

  // Reset timer mode sekarang
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(DURATIONS[mode]);
  };

  // Skip ke session berikutnya
  const handleSkip = () => {
    setIsRunning(false);
    advance();
  };

  const totalTime = DURATIONS[mode];
  const offset = CIRCUMFERENCE * (1 - timeLeft / totalTime);

  // Dots: 4 titik = 4 focus session dalam satu cycle
  const currentDot = mode === "focus" ? cycleCount - 1 : cycleCount - 1;

  const modeLabel = {
    focus: "FOCUS TIME",
    break: "BREAK TIME",
    longBreak: "LONG BREAK",
  }[mode];

  return (
    <div className="bg-(--lf-card) p-6 rounded-2xl flex flex-col items-center gap-10 w-full">
      {/* Tab Mode */}
      <div className="bg-(--lf-bg) flex items-center gap-1 rounded-xl px-1 py-1">
        {(["focus", "break", "longBreak"] as const).map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all cursor-pointer ${
              mode === m
                ? "bg-(--lf-accent) text-white"
                : "text-(--lf-accent) opacity-80 hover:text-(--lf-primary)"
            }`}
          >
            {m === "focus" ? "Focus" : m === "break" ? "Break" : "Long"}
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
          <circle
            cx="90"
            cy="90"
            r={RADIUS}
            fill="none"
            stroke="var(--lf-border)"
            strokeWidth="8"
          />
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

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-(--lf-primary) tracking-tight">
            {formatTime(timeLeft)}
          </span>
          <span className="text-[10px] tracking-widest text-(--lf-accent) mt-1">
            {modeLabel}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Reset */}
        <button
          onClick={handleReset}
          title="Reset timer"
          className="w-10 h-10 rounded-xl border border-(--lf-border) bg-(--lf-bg) flex items-center justify-center text-(--lf-accent) hover:bg-(--lf-accent) hover:text-(--lf-bg) transition-all cursor-pointer"
        >
          ↺
        </button>

        {/* Play / Pause */}
        <button
          onClick={() => setIsRunning((r) => !r)}
          className="w-13 h-13 rounded-2xl flex items-center justify-center transition-all hover:opacity-90 active:scale-95 cursor-pointer shadow-xl"
          style={{ background: "var(--lf-accent)" }}
        >
          {isRunning ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          onClick={handleSkip}
          title="Skip ke sesi berikutnya"
          className="w-10 h-10 rounded-xl border border-(--lf-border) bg-(--lf-bg) flex items-center justify-center text-(--lf-accent) hover:bg-(--lf-accent) transition-all hover:text-(--lf-bg) cursor-pointer"
        >
          {/* Skip forward icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
          </svg>
        </button>
      </div>

      {/* Session dots */}
      <div className="flex items-center gap-2 text-xs text-(--lf-text-muted)">
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_SESSIONS }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-all"
              style={{
                background:
                  i < currentDot
                    ? "var(--lf-accent)" // sesi udah done
                    : i === currentDot
                      ? "var(--lf-primary)" // sesi sekarang
                      : "var(--lf-border)", // belum
              }}
            />
          ))}
        </div>
        <span className="text-(--lf-accent)">
          {mode === "longBreak"
            ? "Long break — great job! 🎉"
            : `Session ${cycleCount} of ${TOTAL_SESSIONS}`}
        </span>
      </div>
    </div>
  );
};

export default Timer;
