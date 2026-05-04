import { useState, useRef, useEffect } from "react";
import Music from "./ui/Music";
import Pause from "./ui/Pause";
import Play from "./ui/Play";
import SkipBack from "./ui/SkipBack";
import SkipForward from "./ui/SkipForward";

// Lofi/chill YouTube live streams 24/7
const STATIONS = [
  { id: "jfKfPfyJRdk", title: "Lofi Girl", genre: "lofi hip hop" },
  { id: "4xDzrJKXOOY", title: "Chillhop Radio", genre: "chillhop" },
  { id: "5yx6BWlEVcY", title: "Lofi Hip Hop Radio", genre: "beats to study" },
  { id: "Na0w3Mz46GA", title: "College Music", genre: "chill beats" },
];

const BAR_HEIGHTS = [
  10, 14, 20, 28, 22, 32, 18, 24, 30, 16, 22, 34, 20, 28, 36, 24, 18, 30, 22,
  16, 28, 20, 32, 18, 24, 14, 20, 12,
];

const LofiRadio = () => {
  const playerRef = useRef<any>(null);
  const [current, setCurrent] = useState(
    STATIONS[Math.floor(Math.random() * STATIONS.length)],
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Load YouTube IFrame API
  useEffect(() => {
    if ((window as any).YT) {
      setIsReady(true);
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    (window as any).onYouTubeIframeAPIReady = () => setIsReady(true);
  }, []);

  // Init player setelah API ready
  useEffect(() => {
    if (!isReady) return;

    playerRef.current = new (window as any).YT.Player("yt-player", {
      height: "0",
      width: "0",
      videoId: current.id,
      playerVars: { autoplay: 0, controls: 0 },
      events: {
        onReady: (e: any) => {
          e.target.setVolume(100); // pastiin volume 100
        },
        onStateChange: (e: any) => {
          setIsPlaying(e.data === 1); // 1 = playing
        },
      },
    });
  }, [isReady]);

  const togglePlay = () => {
    const player = playerRef.current;
    if (!player) return;

    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const skipRandom = () => {
    const player = playerRef.current;
    const others = STATIONS.filter((s) => s.id !== current.id);
    const next = others[Math.floor(Math.random() * others.length)];
    setCurrent(next);

    if (player) {
      if (isPlaying) {
        player.loadVideoById(next.id); // load + autoplay
      } else {
        player.cueVideoById(next.id); // load tapi jangan play
      }
    }
  };

  return (
    <div className="bg-(--lf-card) p-6 rounded-2xl flex flex-col justify-center gap-3 w-full">
      {/* hidden YT player */}
      <div id="yt-player" style={{ display: "none" }} />

      {/* header */}
      <div className="flex gap-2 items-center">
        <span className="text-(--lf-accent)">
          <Music size={20} />
        </span>
        <span className="text-(--lf-primary)">Lo-fi Radio</span>
      </div>

      {/* now playing */}
      <div className="bg-(--lf-bg) border border-(--lf-border) px-4 py-3 rounded-xl text-sm">
        <p className="text-(--lf-accent) font-medium">NOW PLAYING</p>
        <p className="text-(--lf-primary) font-medium">{current.title}</p>
        <p className="text-(--lf-accent) text-xs mt-1">{current.genre}</p>
      </div>

      {/* waveform CSS */}
      <div className="flex items-center justify-center gap-[3px] h-10">
        {BAR_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className="w-[3px] rounded-sm bg-(--lf-accent)"
            style={{
              height: `${h}px`,
              animation: isPlaying
                ? `lf-wave ${(0.6 + (i % 5) * 0.15).toFixed(2)}s ease-in-out ${(i % 7) * 0.1}s infinite`
                : "none",
              transform: isPlaying ? undefined : "scaleY(0.25)",
              transition: "transform 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={skipRandom}
          className="text-(--lf-accent) transition-colors cursor-pointer border border-(--lf-border) bg-(--lf-bg) p-3 rounded-xl"
        >
          <SkipBack size={14} />
        </button>

        <button
          onClick={togglePlay}
          className="bg-(--lf-accent) text-white rounded-xl w-12 h-12 flex items-center justify-center cursor-pointer"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <button
          onClick={skipRandom}
          className="text-(--lf-accent) transition-colors cursor-pointer border border-(--lf-border) bg-(--lf-bg) p-3 rounded-xl"
        >
          <SkipForward size={14} />
        </button>
      </div>
    </div>
  );
};

export default LofiRadio;
