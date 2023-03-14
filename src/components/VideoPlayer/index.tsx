import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { OnProgressProps } from "react-player/base";
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
        <ControlsContainer />
        <Player url={`${videoBaseUrl}${videoId}`} />
      </div>
    </PlayerContext.Provider>
  );
};
export default VideoPlayer;

const ControlsContainer = () => {
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);

  return (
    <div
      className="absolute top-0 left-0 right-0 bottom-0 select-none opacity-0 before:content-none focus-within:opacity-100 hover:opacity-100"
      onClick={togglePlayPause}
    >
      <div className="absolute bottom-0 left-0 h-1/4 w-full bg-gradient-to-t from-black to-transparent opacity-50"></div>
      <Timeline />
      <Controls />
    </div>
  );
};

const Player = ({ url }: { url: string }) => {
  const ref = useRef<VimeoPlayer>(null);
  const setPlayer = usePlayerStore((state) => state.setPlayer);
  useEffect(() => {
    if (ref.current) {
      setPlayer(ref.current);
    }
  }, [ref, setPlayer]);
  const playing = usePlayerStore((state) => state.playing);
  const setCurrentTime = usePlayerStore((state) => state.setCurrentTime);
  const timeUpdateHandler = useCallback(
    (ev: OnProgressProps) => {
      setCurrentTime(ev.playedSeconds);
    },
    [setCurrentTime]
  );

  return (
    <ReactPlayer
      playing={playing}
      ref={ref}
      url={url}
      onProgress={timeUpdateHandler}
    ></ReactPlayer>
  );
};

const Controls = () => {
  // TODO
  return (
    <div className="relative h-full w-full">
      <PlayPauseButton light className="absolute bottom-0 left-0" />
    </div>
  );
};

const PlayPauseButton = ({
  className,
  light,
}: {
  className?: string;
  light?: boolean;
}) => {
  const playing = usePlayerStore((state) => state.playing);
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);
  const clickHandler: MouseEventHandler = useCallback(
    (ev) => {
      togglePlayPause();
      ev.stopPropagation();
    },
    [togglePlayPause]
  );

  return (
    <IconButton light={light} className={className} onClick={clickHandler}>
      {playing ? <Pause /> : <Play />}
    </IconButton>
  );
};

const Timeline = () => {
  return <div></div>; // TODO
};
