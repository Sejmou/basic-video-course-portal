import { useKeyboardShortcuts } from "~/hooks/use-keyboard-shortcuts";
import { usePlayerStore } from "./store";

export function useKeyboardControls() {
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);

  const seekForward = usePlayerStore((state) => state.seekForward);
  const seekBackward = usePlayerStore((state) => state.seekBackward);

  const enterFullscreen = usePlayerStore((state) => state.enterFullscreen);
  const exitFullscreen = usePlayerStore((state) => state.exitFullscreen);

  const increasePlaybackRate = usePlayerStore(
    (state) => state.increasePlaybackRate
  );
  const decreasePlaybackRate = usePlayerStore(
    (state) => state.decreasePlaybackRate
  );
  const resetPlaybackRate = usePlayerStore((state) => state.resetPlaybackRate);

  const jumpToLoopStart = usePlayerStore((state) => state.jumpToLoopStart);
  const setLoopStart = usePlayerStore((state) => state.setLoopStart);
  const setLoopEnd = usePlayerStore((state) => state.setLoopEnd);
  const resetLoopEnd = usePlayerStore((state) => state.resetLoopEnd);
  const resetLoopStart = usePlayerStore((state) => state.resetLoopStart);
  const toggleLoop = usePlayerStore((state) => state.toggleLoop);
  const resetLoop = usePlayerStore((state) => state.resetLoop);

  const playerDomElement = usePlayerStore((state) => state.playerDomElement);

  useKeyboardShortcuts(
    [
      [{ key: "f" }, enterFullscreen],
      [{ key: " " }, togglePlayPause],
      [{ key: "esc" }, exitFullscreen],
      [{ key: "ArrowRight" }, () => seekForward(5)],
      [{ key: "ArrowLeft" }, () => seekBackward(5)],
      [{ key: "ArrowRight", ctrlKey: true }, () => seekForward(0.5)],
      [{ key: "ArrowLeft", ctrlKey: true }, () => seekBackward(0.5)],
      [{ key: "ArrowLeft", shiftKey: true }, () => jumpToLoopStart()],
      [{ key: "j" }, () => setLoopStart()],
      [{ key: "j", shiftKey: true }, () => resetLoopStart()],
      [{ key: "k" }, () => setLoopEnd()],
      [{ key: "k", shiftKey: true }, () => resetLoopEnd()],
      [{ key: "+" }, () => increasePlaybackRate(0.1)],
      [{ key: "-" }, () => decreasePlaybackRate(0.1)],
      [{ key: "d" }, resetPlaybackRate],
      [{ key: "l" }, toggleLoop],
      [{ key: "r" }, resetLoop],
    ],
    playerDomElement
  );
}
