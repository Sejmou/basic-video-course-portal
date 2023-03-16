import { createStore, useStore } from "zustand";
import { createContext, useContext } from "react";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import VimeoPlayer from "react-player/vimeo";
import screenfull from "screenfull";

// note: we want to use a separate store for every video player instance
// so that we can have multiple video players with different configs on the same page
// to achieve this, we need to use a context provider for the store and wrap it around each created video player
// therefore we don't just use zustand's create() function here, but instead do other stuff
// too lazy to explain in detail, but the following GitHub discussion talks about a similar problem and the solution:
// see also: https://github.com/pmndrs/zustand/blob/main/docs/previous-versions/zustand-v3-create-context.md#migration
// and a live demo of using separate store instances per component (which is exactly what I needed here as well): https://codesandbox.io/s/polished-pond-4jn1e2?file=/src/App.tsx:499-572

type State = {
  playing: boolean;
  player?: VimeoPlayer;
  playerDomElement?: HTMLDivElement;
  currentTime: number;
  duration?: number;
  firstTimePlaying: boolean;
  fullscreen: boolean;
  reachedEndOfPlayback: boolean;
  playbackRate: number;
  togglePlayPause: () => void;
  setPlayer: (player: VimeoPlayer) => void;
  setPlayerDomElement: (playerDomElement: HTMLDivElement) => void;
  setCurrentTime: (seconds: number) => void;
  setDuration: (seconds: number) => void;

  enterFullscreen: () => void;
  exitFullscreen: () => void;

  seekForward: (seconds: number) => void;
  seekBackward: (seconds: number) => void;
  seekToSeconds: (seconds: number) => void;
  seekToFraction: (fraction: number) => void;

  increasePlaybackRate: (amount: number) => void;
  decreasePlaybackRate: (amount: number) => void;
  resetPlaybackRate: () => void;

  looping: boolean;
  enableLoop: () => void;
  disableLoop: () => void;
  toggleLoop: () => void;
  loopInterval?: [number, number];
  setLoopStart: (seconds?: number) => void;
  setLoopEnd: (seconds?: number) => void;
  resetLoop: () => void;
  resetLoopStart: () => void;
  resetLoopEnd: () => void;
  jumpToLoopStart: () => void;
};

// Vimeo's internal player API is not typed by react-player, so we type what we need ourselves
type VimeoInternalPlayer = {
  setPlaybackRate: (playbackRate: number) => Promise<void>;
  getPlaybackRate: () => Promise<number>;
  getCurrentTime: () => Promise<number>;
};

export const createPlayerStore = () => {
  console.log("creating new video player store");
  return createStore<
    State,
    [["zustand/devtools", never], ["zustand/immer", never]]
  >(
    devtools(
      immer((set, get) => ({
        playing: false,
        firstTimePlaying: true,
        currentTime: 0,
        fullscreen: false,
        reachedEndOfPlayback: false,
        looping: false,
        playbackRate: 1,
        togglePlayPause: () =>
          set((state) => {
            let reachedEndOfPlayback = state.reachedEndOfPlayback;
            if (state.firstTimePlaying || reachedEndOfPlayback) {
              state.player?.seekTo(0, "seconds");
              reachedEndOfPlayback = false;
            }
            return {
              playing: !state.playing,
              firstTimePlaying: false,
              reachedEndOfPlayback,
            };
          }),
        setPlayer: (player) => set({ player }),
        setPlayerDomElement: (playerDomElement) => set({ playerDomElement }),
        setCurrentTime: (seconds) => {
          set((state) => {
            const duration = state.duration;
            if (!duration) return;
            if (seconds > 0 && seconds >= duration) {
              state.player?.seekTo(duration, "seconds");
              return {
                currentTime: duration,
                playing: false,
                reachedEndOfPlayback: true,
              };
            }
            return { currentTime: seconds };
          });
          const looping = get().looping;
          const loopInterval = get().loopInterval;
          if (looping && loopInterval) {
            const [loopStart, loopEnd] = loopInterval;
            if (seconds >= loopEnd) {
              get().player?.seekTo(loopStart, "seconds");
            }
          }
        },
        setDuration: (seconds) => set({ duration: seconds }),
        enterFullscreen: () => {
          set((state) => {
            if (!state.fullscreen) {
              const domElement = state.playerDomElement;
              if (domElement) screenfull.request(domElement as HTMLDivElement);
            }
            return { fullscreen: true };
          });
        },
        exitFullscreen: () => {
          set((state) => {
            if (state.fullscreen) {
              screenfull.exit();
            }
            return { fullscreen: false };
          });
        },
        seekForward: (seconds) => {
          set((state) => {
            state.player?.seekTo(
              Math.min(
                state.currentTime + seconds,
                state.duration ?? state.currentTime
              ),
              "seconds"
            );
          });
        },
        seekBackward: (seconds) => {
          set((state) => {
            state.player?.seekTo(
              Math.max(state.currentTime - seconds, 0),
              "seconds"
            );
          });
        },
        seekToSeconds: (seconds) => {
          set((state) => {
            state.player?.seekTo(seconds, "seconds");
          });
        },
        seekToFraction: (fraction) => {
          set((state) => {
            state.player?.seekTo(clamp(fraction, 0, 1), "fraction");
          });
        },
        increasePlaybackRate: async (amount) => {
          const player = get().player;
          if (!player) return;
          const internalPlayer = getInternalPlayer(player);
          const currentPlaybackRate = await internalPlayer.getPlaybackRate();
          await internalPlayer.setPlaybackRate(
            Math.min(currentPlaybackRate + amount, 2)
          );
          const playbackRate = await internalPlayer.getPlaybackRate();
          set({ playbackRate });
        },
        decreasePlaybackRate: async (amount) => {
          const player = get().player;
          if (!player) return;
          const internalPlayer = getInternalPlayer(player);
          const currentPlaybackRate = await internalPlayer.getPlaybackRate();
          await internalPlayer.setPlaybackRate(
            Math.max(currentPlaybackRate - amount, 0.1)
          );
          const playbackRate = await internalPlayer.getPlaybackRate();
          set({ playbackRate });
        },
        resetPlaybackRate: async () => {
          const player = get().player;
          if (!player) return;
          const internalPlayer = getInternalPlayer(player);
          await internalPlayer.setPlaybackRate(1);
          set({ playbackRate: 1 });
        },
        enableLoop: () => set({ looping: true }),
        disableLoop: () => set({ looping: false }),
        toggleLoop: () => set((state) => ({ looping: !state.looping })),
        setLoopStart: (seconds) => {
          const loopStart = seconds ?? get().currentTime;
          const duration = get().duration;
          if (!duration) return;
          const loopEnd = get().loopInterval?.[1] ?? duration;
          set({
            loopInterval: [loopStart, loopEnd],
          });
        },
        setLoopEnd: (seconds) => {
          const loopStart = get().loopInterval?.[0] ?? 0;
          const loopEnd = seconds ?? get().currentTime;
          const duration = get().duration;
          if (!duration) return;
          set({
            loopInterval: [loopStart, loopEnd],
          });
          get().player?.seekTo(loopStart, "seconds");
        },
        resetLoop: () => {
          set({
            loopInterval: undefined,
          });
        },
        jumpToLoopStart: () => {
          const loopActive = get().looping;
          const loopStart = get().loopInterval?.[0];
          if (!loopActive || !loopStart) return;
          get().player?.seekTo(loopStart, "seconds");
        },
        resetLoopStart: () => {
          const loopInterval = get().loopInterval;
          if (!loopInterval) return;
          set({ loopInterval: [0, loopInterval[1]] });
        },
        resetLoopEnd: () => {
          const loopInterval = get().loopInterval;
          if (!loopInterval) return;
          const duration = get().duration;
          if (!duration) return;
          set({ loopInterval: [loopInterval[0], duration] });
        },
      }))
    )
  );
};

export const PlayerContext = createContext<ReturnType<
  typeof createPlayerStore
> | null>(null);

export const usePlayerStore = <T,>(selector: (state: State) => T) => {
  const store = useContext(PlayerContext);
  if (store === null) {
    throw new Error("no provider");
  }
  return useStore(store, selector);
};

export function getInternalPlayer(player: VimeoPlayer): VimeoInternalPlayer {
  return player.getInternalPlayer() as VimeoInternalPlayer;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
