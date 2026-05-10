import Sun from "./ui/Sun";
import Moon from "./ui/Moon";
import Clock from "./ui/Clock";

import DarkMode from "./DarkMode";

const NavBar = () => {
  const { isDarkMode, toggleTheme } = DarkMode();

  const today = new Date();
  const formatted = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-5 py-4 bg-(--lf-card) border-b border-(--lf-border)">
      <div className="flex gap-2 items-center font-medium text-xl">
        <span className="bg-(--lf-accent) text-white p-2 rounded-lg">
          <Clock />
        </span>
        <span className="text-(--lf-primary)">LofiFocus</span>
      </div>
      <div className="flex gap-3 items-center">
        <p className="text-(--lf-accent) text-sm truncate">{formatted}</p>
        <button
          onClick={toggleTheme}
          className="px-3 py-1 bg-(--lf-bg) text-(--lf-accent) text-sm rounded-lg"
        >
          <span className="flex gap-2 items-center">
            {isDarkMode ? <Moon /> : <Sun />}
            <span>{isDarkMode ? "Dark" : "Light"}</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default NavBar;
