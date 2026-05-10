import NavBar from "./components/NavBar";
import Timer from "./components/Timer";
import Tasks from "./components/Tasks";
import LofiRadio from "./components/LofiRadio";
import TodaysFocus from "./components/TodaysFocus";
import { useFocusState } from "./hooks/useFocusState";
import "./App.css";

const App = () => {
  const { stats, recordSession } = useFocusState();

  return (
    <div className="font-poppins bg-(--lf-bg) min-h-screen">
      <NavBar />
      <main className="grid md:grid-cols-[3fr_2fr] gap-4 p-4 max-w-5xl mx-auto overflow-x-hidden">
        {/* Timer — di desktop col 1, di mobile urutan 1 */}
        <div className="order-1 md:row-span-2 min-w-0">
          <Timer onSessionComplete={recordSession} />
        </div>

        {/* Tasks — di desktop col 2, di mobile urutan 3 */}
        <div className="order-3 md:order-2 md:row-span-3 min-w-0">
          <Tasks />
        </div>

        {/* Radio + TodaysFocus — di desktop col 1 bawah, di mobile urutan 2 */}
        <div className="order-2 md:order-3 flex gap-4 min-w-0">
          <div className="flex-1">
            <LofiRadio />
          </div>
          <div className="w-40">
            <TodaysFocus stats={stats} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
