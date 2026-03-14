import {
  ArrowLeftRight,
  Loader2,
  NotebookTabsIcon,
  Swords,
} from "lucide-react";
import { useEffect, useState } from "react";

function CompetitionGuard() {
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    const handleCopy = (e) => {
      e.preventDefault();
    };

    const handlePaste = (e) => {
      e.preventDefault();
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleVisibility = () => {
      if (document.hidden) {
        console.log("Tab switch detected");
        setDetected(true);
      }
    };

    const handleBlur = () => {
      console.log("Window lost focus");
      setDetected(true);
      // Emit cheat event if socket is available
      if (window.socket) {
        window.socket.emit('cheat_event', {
          matchId: window.currentMatchId,
          playerId: window.currentUserId,
          type: 'WINDOW_BLUR',
        });
      }
    };

    const handleKeyDown = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
        (e.ctrlKey && ["c", "v", "x"].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("cut", handleCopy);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("cut", handleCopy);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        console.log("Fullscreen exited");
        setDetected(true);
        // Emit cheat event if socket is available
        if (window.socket) {
          window.socket.emit('cheat_event', {
            matchId: window.currentMatchId,
            playerId: window.currentUserId,
            type: 'FULLSCREEN_EXIT',
          });
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const startFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    startFullscreen();
  }, []);

  //return null;

  return (
    detected && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="animate-slide-up flex flex-col items-center gap-6 rounded-2xl border border-border bg-card p-10 glow-blue">
          <div className="relative">
            <ArrowLeftRight className="h-16 w-16 animate-pulse-glow text-primary" />
          </div>
          <div className="text-center">
            <h2 className="font-display text-xl font-bold tracking-wider text-foreground">
              TAB SWITCHING DETECTED
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Please retuen to the event
            </p>
            <button onClick={() => {startFullscreen(); setDetected(false)}} className="mt-5 px-10 py-3 bg-indigo-600 text-white font-bold uppercase tracking-widest rounded-md shadow-[0_4px_20px_rgba(79,70,229,0.4)]">
              Back to Event
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default CompetitionGuard;
