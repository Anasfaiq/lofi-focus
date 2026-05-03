import NavBar from "./components/NavBar";
import Timer from "./components/Timer";
import Tasks from "./components/Tasks";
// import LofiRadio from "./components/LofiRadio";
// import TodaysFocus from "./components/TodaysFocus";
import "./App.css";

const App = () => {
  return (
    <div className="font-poppins bg-(--lf-bg) min-h-screen">
      <NavBar />
      <main className="grid grid-cols-[3fr_2fr] grid-rows-[auto_auto_auto] gap-4 p-4 max-w-5xl mx-auto">

        {/* Timer — col 1, row 1-2 */}
        <div className="row-span-2">
          <Timer />
        </div>

        {/* Tasks — col 2, row 1-3 */}
        <div className="row-span-3">
          <Tasks />
        </div>

        {/* Bottom row col 1 — Lo-fi Radio + Today's Focus */}
        <div className="flex gap-4">
          <div className="flex-1">
            {/* <LofiRadio /> */}
          </div>
          <div className="w-40">
            {/* <TodaysFocus /> */}
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;