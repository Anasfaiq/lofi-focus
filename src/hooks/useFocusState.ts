import { useState, useEffect } from "react";

type Stats = {
  totalSessions: number;
  focusMinutes: number;
  streak: number;
};

const today = new Date().toDateString();

const defaultStats = (): Stats => ({
  totalSessions: 0,
  focusMinutes: 0,
  streak: 0,
});

export const useFocusState = () => {
  const [stats, setStats] = useState<Stats>(() => {
    const raw = localStorage.getItem("focusStats");
    if (!raw) return defaultStats();

    const parsed = JSON.parse(raw);

    if (parsed.date !== today) {
      // reset daily stats
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const streakValid = parsed.date === yesterday.toDateString();

      return {
        totalSessions: 0,
        focusMinutes: 0,
        streak: streakValid ? parsed.streak : 0,
      };
    }

    return {
      totalSessions: parsed.totalSessions || 0,
      focusMinutes: parsed.focusMinutes || 0,
      streak: parsed.streak || 0,
    };
  });

  useEffect(() => {
    localStorage.setItem(
      "focusStats",
      JSON.stringify({ ...stats, date: today }),
    );
  }, [stats]);

  const recordSession = (durationMinutes: number) => {
    setStats((prev) => {
      const isFirstToday = prev.totalSessions === 0;
      return {
        totalSessions: prev.totalSessions + 1,
        focusMinutes: prev.focusMinutes + durationMinutes,
        streak: isFirstToday ? prev.streak + 1 : prev.streak,
      };
    });
  };
  return { stats, recordSession };
};
