type Props = {
  progress: number; // 0–100
};

const TaskProgressBar = ({ progress }: Props) => {
  const clipped = Math.min(100, Math.max(0, progress));

  return (
    <svg width="100%" height="6" viewBox="0 0 680 6">
      <defs>
        <clipPath id="task-bar-clip">
          <rect x="0" y="0" width="680" height="6" rx="3" />
        </clipPath>
      </defs>

      {/* Track */}
      <rect x="0" y="0" width="680" height="6" rx="3" fill="var(--lf-border)" />

      {/* Fill */}
      <g clipPath="url(#task-bar-clip)">
        <rect
          x="0"
          y="0"
          width={(clipped / 100) * 680}
          height="6"
          fill="var(--lf-accent)"
          style={{ transition: "width 0.5s ease" }}
        />
      </g>
    </svg>
  );
};

export default TaskProgressBar;
