import { useKeyboardShortcuts } from "~/hooks/use-keyboard-shortcuts";
import { usePlayerStore } from "./store";

export function useKeyboardControls() {
  const seekForward = usePlayerStore((state) => state.seekForward);
  const seekBackward = usePlayerStore((state) => state.seekBackward);
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);
  const enterFullscreen = usePlayerStore((state) => state.enterFullscreen);
  const exitFullscreen = usePlayerStore((state) => state.exitFullscreen);
  const playerDomElement = usePlayerStore((state) => state.playerDomElement);

  useKeyboardShortcuts(
    [
      [{ key: "f" }, enterFullscreen],
      [{ key: " " }, togglePlayPause],
      [{ key: "esc" }, exitFullscreen],
      [{ key: "ArrowRight" }, () => seekForward(5)],
      [{ key: "ArrowLeft" }, () => seekBackward(5)],
    ],
    playerDomElement
  );
}
