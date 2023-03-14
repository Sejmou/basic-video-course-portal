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
  firstTimePlaying: boolean;
  fullscreen: boolean;
  togglePlayPause: () => void;
  setPlayer: (player: VimeoPlayer) => void;
  setPlayerDomElement: (playerDomElement: HTMLDivElement) => void;
  setCurrentTime: (seconds: number) => void;
  toggleFullscreen: () => void;
  exitFullscreen: () => void;
};

const secondsToSkip = 6; // all videos have annoying 6 second intro animation - skip it when playing for first time

export const createPlayerStore = () => {
  console.log("creating new video player store");
  return createStore<
    State,
    [["zustand/devtools", never], ["zustand/immer", never]]
  >(
    devtools(
      immer((set) => ({
        playing: false,
        firstTimePlaying: true,
        currentTime: 0,
        fullscreen: false,
        togglePlayPause: () =>
          set((state) => {
            if (state.firstTimePlaying) {
              state.player?.seekTo(secondsToSkip, "seconds");
            }
            return { playing: !state.playing, firstTimePlaying: false };
          }),
        setPlayer: (player) => set({ player }),
        setPlayerDomElement: (playerDomElement) => set({ playerDomElement }),
        setCurrentTime: (seconds) => set({ currentTime: seconds }),
        toggleFullscreen: () => {
          set((state) => {
            if (state.fullscreen) {
              screenfull.exit();
            } else {
              const domElement = state.playerDomElement;
              if (domElement) screenfull.request(domElement as HTMLDivElement);
            }
            return { fullscreen: !state.fullscreen };
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
