type Stats = {
  totalSessions: number;
  focusMinutes: number;
  streak: number;
};

type Props = {
  stats: Stats;
};

const TodaysFocus = ({ stats }: Props) => {
  const focusHrs = (stats.focusMinutes / 60).toFixed(1);

  return (
    <div className="bg-(--lf-card) p-6 rounded-2xl flex flex-col justify-center gap-3 w-full">
      <div>
        <p className="text-(--lf-primary)">Today's Focus</p>
      </div>
      <div className="bg-(--lf-bg) border border-(--lf-border) px-4 py-3 rounded-xl text-sm flex items-center justify-between gap-2">
        <p className="text-(--lf-accent) font-medium">Focus hrs</p>
        <p className="text-(--lf-accent) text-lg font-medium whitespace-nowrap">
          {focusHrs} <span className="text-xs font-medium">h</span>
        </p>
      </div>
      <div className="bg-(--lf-bg) border border-(--lf-border) px-4 py-3 rounded-xl text-sm flex items-center justify-between gap-2">
        <p className="text-(--lf-accent) font-medium">Streak</p>
        <p className="text-(--lf-accent) text-lg font-medium whitespace-nowrap">
          {stats.streak} <span className="text-xs font-medium">d</span>
        </p>
      </div>
      <div className="bg-(--lf-bg) border border-(--lf-border) px-4 py-3 rounded-xl text-sm flex items-center justify-between gap-2">
        <p className="text-(--lf-accent) font-medium">Sessions</p>
        <p className="text-(--lf-accent) text-lg font-medium whitespace-nowrap">
          {stats.totalSessions}
        </p>
      </div>
    </div>
  );
};

export default TodaysFocus;
