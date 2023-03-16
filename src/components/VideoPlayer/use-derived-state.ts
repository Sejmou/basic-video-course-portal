import { usePlayerStore } from "./store";

export function useProgressPercentage() {
  const duration = usePlayerStore((state) => state.duration);
  const currentTime = usePlayerStore((state) => state.currentTime);
  return duration ? (currentTime / duration) * 100 : 0;
}

export function useLoopIntervalPercentage() {
  const duration = usePlayerStore((state) => state.duration);
  const [loopStart, loopEnd] =
    usePlayerStore((state) => state.loopInterval) ?? [];
  if (!duration || !loopStart || !loopEnd) return [undefined, undefined];

  const startPercentage = (loopStart / duration) * 100;
  const endPercentage = (loopEnd / duration) * 100;
  return [startPercentage, endPercentage];
}
