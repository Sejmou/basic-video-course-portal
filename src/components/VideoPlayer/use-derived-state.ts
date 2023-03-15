import { usePlayerStore } from "./store";

export function useProgressPercentage() {
  const duration = usePlayerStore((state) => state.duration);
  const currentTime = usePlayerStore((state) => state.currentTime);
  return duration ? (currentTime / duration) * 100 : 0;
}
