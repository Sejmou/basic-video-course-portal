import { useEffect, useMemo, useRef } from "react";
import VimeoPlayer from "react-player/vimeo";
import ReactPlayer from "react-player/vimeo";
import IconButton from "../IconButton";
import { Pause, Play } from "./icons";
import { createPlayerStore, PlayerContext, usePlayerStore } from "./store";

const videoBaseUrl = "https://vimeo.com/";

type Props = { videoId: string };
const VideoPlayer = ({ videoId }: Props) => {
  const store = useMemo(() => createPlayerStore(), []); // store should not be recreated on every rerender of this component

  return (
    <PlayerContext.Provider value={store}>
      <div className="relative max-w-screen-lg justify-center">
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-25 focus-within:opacity-100 hover:opacity-100">
          <Timeline />
          <Controls />
        </div>
        <Player url={`${videoBaseUrl}${videoId}`} />
      </div>
    </PlayerContext.Provider>
  );
};
export default VideoPlayer;

const Player = ({ url }: { url: string }) => {
  const ref = useRef<VimeoPlayer>(null);
  const setPlayer = usePlayerStore((state) => state.setPlayer);
  useEffect(() => {
    if (ref.current) {
      setPlayer(ref.current);
    }
  }, [ref, setPlayer]);
  const playing = usePlayerStore((state) => state.playing);

  return <ReactPlayer playing={playing} ref={ref} url={url}></ReactPlayer>;
};

const Controls = () => {
  // TODO
  return (
    <div className="relative h-full w-full">
      <PlayPauseButton className="absolute bottom-0 left-0" />
    </div>
  );
};

const PlayPauseButton = ({ className }: { className?: string }) => {
  const playing = usePlayerStore((state) => state.playing);
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);

  return (
    <IconButton className={className} onClick={togglePlayPause}>
      {playing ? <Pause /> : <Play />}
    </IconButton>
  );
};

const Timeline = () => {
  return <div></div>; // TODO
};
