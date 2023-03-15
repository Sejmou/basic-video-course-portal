import { createStore, useStore } from "zustand";
import { createContext, useContext } from "react";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import VimeoPlayer from "react-player/vimeo";
import screenfull from "screenfull";
import { WritableDraft } from "immer/dist/types/types-external";

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
  togglePlayPause: () => void;
  setPlayer: (player: VimeoPlayer) => void;
  setPlayerDomElement: (playerDomElement: HTMLDivElement) => void;
  setCurrentTime: (seconds: number) => void;
  setDuration: (seconds: number) => void;

  enterFullscreen: () => void;
  exitFullscreen: () => void;

  seekForward: (seconds: number) => void;
  seekBackward: (seconds: number) => void;
  seekTo: (seconds: number) => void;

  increasePlaybackRate: (amount: number) => void;
  decreasePlaybackRate: (amount: number) => void;
  resetPlaybackRate: () => void;
};

// Vimeo's internal player API is not typed by react-player, so we type what we need ourselves
type VimeoInternalPlayer = {
  setPlaybackRate: (playbackRate: number) => Promise<void>;
  getPlaybackRate: () => Promise<number>;
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
        setCurrentTime: (seconds) =>
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
          }),
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
        seekTo: (seconds) => {
          set((state) => {
            state.player?.seekTo(seconds, "seconds");
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
        },
        decreasePlaybackRate: async (amount) => {
          const player = get().player;
          if (!player) return;
          const internalPlayer = getInternalPlayer(player);
          const currentPlaybackRate = await internalPlayer.getPlaybackRate();
          await internalPlayer.setPlaybackRate(
            Math.max(currentPlaybackRate - amount, 0.1)
          );
        },
        resetPlaybackRate: async () => {
          const player = get().player;
          if (!player) return;
          const internalPlayer = getInternalPlayer(player);
          await internalPlayer.setPlaybackRate(1);
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

function getInternalPlayer(player: VimeoPlayer): VimeoInternalPlayer {
  return player.getInternalPlayer() as VimeoInternalPlayer;
}
