import { createStore, useStore } from "zustand";
import { createContext, useContext } from "react";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import VimeoPlayer from "react-player/vimeo";

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
  currentTime: number;
  togglePlayPause: () => void;
  setPlayer: (player: VimeoPlayer) => void;
};

export const createPlayerStore = () => {
  console.log("creating new video player store");
  return createStore<
    State,
    [["zustand/devtools", never], ["zustand/immer", never]]
  >(
    devtools(
      immer((set) => ({
        playing: false,
        currentTime: 0,
        togglePlayPause: () => set((state) => ({ playing: !state.playing })),
        setPlayer: (player) =>
          set((state) => {
            // player.seekTo()
            return { player };
          }),
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
